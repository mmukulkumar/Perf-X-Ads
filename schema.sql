-- =============================================
-- PERF X ADS DATABASE SCHEMA
-- =============================================

-- 1. Create Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  avatar text,
  role text default 'user',
  "joinedDate" text,
  "stripeCustomerId" text, -- Stripe Customer ID for payment tracking
  subscription jsonb default '{"tier": "free", "status": "active"}'::jsonb,
  usage jsonb default '{"searchesThisMonth": 0, "generationsThisMonth": 0}'::jsonb,
  credits jsonb default '{"current": 100, "limit": 100, "lastReset": ""}'::jsonb,
  preferences jsonb default '{"marketingEmails": true, "securityAlerts": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- 3. Create Policy to allow users to read/update their own data
create policy "Users can see their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.users for insert with check (auth.uid() = id);

-- 4. Create index on stripeCustomerId for faster lookups
create index idx_users_stripe_customer_id on public.users("stripeCustomerId");

-- 5. Create index on email for faster lookups
create index idx_users_email on public.users(email);

-- 6. Create Tools Table (Optional: for Admin Tool Management)
create table public.tools (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  description text,
  category text,
  features text[], -- Array of strings
  website_url text,
  icon_name text,
  color text
);

-- 7. Create Payments/Transactions Table for tracking payment history
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  stripe_payment_id text unique, -- Stripe Payment Intent ID or Checkout Session ID
  stripe_customer_id text,
  amount integer, -- Amount in cents
  currency text default 'usd',
  status text, -- 'succeeded', 'pending', 'failed', 'refunded'
  plan_type text, -- 'monthly', 'annual', 'lifetime', 'lifetime_team'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb
);

-- 8. Enable RLS on payments table
alter table public.payments enable row level security;

-- 9. Users can only see their own payments
create policy "Users can see their own payments" on public.payments for select using (auth.uid() = user_id);

-- 10. Create index on payments for faster lookups
create index idx_payments_user_id on public.payments(user_id);
create index idx_payments_stripe_payment_id on public.payments(stripe_payment_id);

-- 11. Create Subscriptions Table for tracking active subscriptions
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade unique, -- One subscription per user
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan_type text, -- 'monthly', 'annual', 'lifetime'
  status text default 'active', -- 'active', 'canceled', 'past_due', 'expired'
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Enable RLS on subscriptions table
alter table public.subscriptions enable row level security;

-- 13. Users can only see their own subscription
create policy "Users can see their own subscription" on public.subscriptions for select using (auth.uid() = user_id);

-- 14. Create index on subscriptions
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_subscription_id on public.subscriptions(stripe_subscription_id);

-- =============================================
-- MIGRATION SCRIPT (Run if table already exists)
-- =============================================
-- If you already have the users table, run these ALTER statements:

-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "stripeCustomerId" text;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now());
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone('utc'::text, now());
-- CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users("stripeCustomerId");
-- CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- =============================================
-- FUNCTION: Update user subscription after payment
-- =============================================
create or replace function public.update_user_subscription(
  p_user_id uuid,
  p_stripe_customer_id text,
  p_plan_type text,
  p_status text default 'active',
  p_expiry_date timestamp with time zone default null
)
returns void as $$
declare
  v_credits_limit integer;
begin
  -- Set credits based on plan type
  if p_plan_type in ('monthly', 'annual', 'lifetime', 'lifetime_team') then
    v_credits_limit := 999999;
  else
    v_credits_limit := 100;
  end if;

  -- Update user record
  update public.users
  set 
    "stripeCustomerId" = p_stripe_customer_id,
    subscription = jsonb_build_object(
      'tier', p_plan_type,
      'status', p_status,
      'expiryDate', p_expiry_date
    ),
    credits = jsonb_build_object(
      'current', v_credits_limit,
      'limit', v_credits_limit,
      'lastReset', now()
    ),
    updated_at = now()
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- =============================================
-- FUNCTION: Handle successful payment (called by webhook)
-- =============================================
create or replace function public.handle_successful_payment(
  p_user_id uuid,
  p_stripe_customer_id text,
  p_stripe_payment_id text,
  p_amount integer,
  p_plan_type text
)
returns void as $$
declare
  v_expiry_date timestamp with time zone;
begin
  -- Calculate expiry date based on plan type
  if p_plan_type = 'monthly' then
    v_expiry_date := now() + interval '1 month';
  elsif p_plan_type = 'annual' then
    v_expiry_date := now() + interval '1 year';
  else
    v_expiry_date := null; -- Lifetime has no expiry
  end if;

  -- Insert payment record
  insert into public.payments (user_id, stripe_payment_id, stripe_customer_id, amount, status, plan_type)
  values (p_user_id, p_stripe_payment_id, p_stripe_customer_id, p_amount, 'succeeded', p_plan_type)
  on conflict (stripe_payment_id) do nothing;

  -- Update user subscription
  perform public.update_user_subscription(
    p_user_id,
    p_stripe_customer_id,
    p_plan_type,
    'active',
    v_expiry_date
  );
end;
$$ language plpgsql security definer;

-- =============================================
-- FUNCTION: Cancel subscription
-- =============================================
create or replace function public.cancel_user_subscription(p_user_id uuid)
returns void as $$
begin
  update public.users
  set 
    subscription = jsonb_set(subscription, '{status}', '"canceled"'),
    updated_at = now()
  where id = p_user_id;

  update public.subscriptions
  set 
    status = 'canceled',
    updated_at = now()
  where user_id = p_user_id;
end;
$$ language plpgsql security definer;

-- =============================================
-- TRIGGER: Auto-update updated_at timestamp
-- =============================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
  before update on public.users
  for each row
  execute function public.update_updated_at_column();

create trigger update_subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function public.update_updated_at_column();
