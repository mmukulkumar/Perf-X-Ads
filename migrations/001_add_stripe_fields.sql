-- =============================================
-- MIGRATION: Add Stripe fields to users table
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Add stripeCustomerId column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS "stripeCustomerId" text;

-- 2. Add timestamps if not exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now());

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone('utc'::text, now());

-- 3. Create index on stripeCustomerId for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users("stripeCustomerId");

-- 4. Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 5. Create Payments table for tracking payment history
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  stripe_payment_id text unique,
  stripe_customer_id text,
  amount integer,
  currency text default 'usd',
  status text,
  plan_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb
);

-- 6. Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 7. Create policy for payments - users can only see their own payments
DROP POLICY IF EXISTS "Users can see their own payments" ON public.payments;
CREATE POLICY "Users can see their own payments" ON public.payments 
  FOR SELECT USING (auth.uid() = user_id);

-- 8. Create indexes on payments table
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_id ON public.payments(stripe_payment_id);

-- 9. Create Subscriptions table for tracking active subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade unique,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan_type text,
  status text default 'active',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Enable RLS on subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 11. Create policy for subscriptions
DROP POLICY IF EXISTS "Users can see their own subscription" ON public.subscriptions;
CREATE POLICY "Users can see their own subscription" ON public.subscriptions 
  FOR SELECT USING (auth.uid() = user_id);

-- 12. Create indexes on subscriptions table
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);

-- 13. Create trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Create trigger on users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 15. Create trigger on subscriptions table
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- VERIFICATION: Check if migration was successful
-- =============================================
-- Run this to verify:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';
