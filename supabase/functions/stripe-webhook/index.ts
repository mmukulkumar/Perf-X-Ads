// Supabase Edge Function: stripe-webhook
// Deploy with: supabase functions deploy stripe-webhook
// Set webhook endpoint in Stripe Dashboard to: https://your-project.supabase.co/functions/v1/stripe-webhook

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

// Price ID to plan type mapping
const PRICE_TO_PLAN: Record<string, string> = {
  // Add your actual price IDs here
  'price_1SaMthK12hmLPpaYMCTzzlPB': 'monthly',
  'price_1SaMuMK12hmLPpaYNt3jOIT3': 'annual',
  'price_1SaMusK12hmLPpaYVpdgy4Ks': 'lifetime',
  'price_1SaN4iK12hmLPpaYk8iSS7Yo': 'lifetime_team',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received Stripe event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoiceFailed(invoice);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const customerId = session.customer as string;
  const customerEmail = session.customer_email || session.customer_details?.email;

  console.log('Checkout completed:', { userId, customerId, customerEmail, mode: session.mode });

  // If no userId in metadata, try to find user by email
  let targetUserId = userId;
  if (!targetUserId && customerEmail) {
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('email', customerEmail)
      .limit(1);
    
    if (users && users.length > 0) {
      targetUserId = users[0].id;
    }
  }

  if (!targetUserId) {
    console.error('No userId found for checkout session');
    return;
  }

  // Determine subscription tier based on the session
  let planType = 'monthly';
  let expiryDate: string | null = null;
  let amount = session.amount_total || 0;

  if (session.mode === 'subscription') {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const priceId = subscription.items.data[0]?.price.id;
    
    planType = PRICE_TO_PLAN[priceId] || 'monthly';
    expiryDate = new Date(subscription.current_period_end * 1000).toISOString();

    // Insert/update subscription record
    await supabase.from('subscriptions').upsert({
      user_id: targetUserId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      plan_type: planType,
      status: 'active',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: expiryDate,
      cancel_at_period_end: subscription.cancel_at_period_end,
    }, { onConflict: 'user_id' });

  } else {
    // One-time payment (lifetime)
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    if (lineItems.data.length > 0) {
      const priceId = lineItems.data[0].price?.id;
      planType = PRICE_TO_PLAN[priceId || ''] || 'lifetime';
    }
    expiryDate = null; // Lifetime has no expiry
  }

  // Insert payment record
  const { error: paymentError } = await supabase.from('payments').insert({
    user_id: targetUserId,
    stripe_payment_id: session.payment_intent as string || session.id,
    stripe_customer_id: customerId,
    amount: amount,
    currency: session.currency || 'usd',
    status: 'succeeded',
    plan_type: planType,
    metadata: {
      checkout_session_id: session.id,
      customer_email: customerEmail,
    }
  });

  if (paymentError) {
    console.error('Error inserting payment record:', paymentError);
  }

  // Update user in database
  const { error: userError } = await supabase
    .from('users')
    .update({
      stripeCustomerId: customerId,
      subscription: {
        tier: planType,
        status: 'active',
        expiryDate: expiryDate,
      },
      credits: {
        current: 999999,
        limit: 999999,
        lastReset: new Date().toISOString(),
      },
    })
    .eq('id', targetUserId);

  if (userError) {
    console.error('Error updating user subscription:', userError);
  } else {
    console.log(`User ${targetUserId} upgraded to ${planType}`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Find user by Stripe customer ID
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('stripeCustomerId', customerId)
    .limit(1);
  
  if (!users || users.length === 0) {
    console.error('No user found for customer:', customerId);
    return;
  }

  const userId = users[0].id;
  const priceId = subscription.items.data[0]?.price.id;
  const planType = PRICE_TO_PLAN[priceId || ''] || 'monthly';
  
  const status = subscription.status === 'active' ? 'active' : 
                 subscription.status === 'canceled' ? 'canceled' : 
                 subscription.status === 'past_due' ? 'expired' : 'active';
  
  const expiryDate = new Date(subscription.current_period_end * 1000).toISOString();

  // Update subscription record
  await supabase.from('subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    plan_type: planType,
    status: status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: expiryDate,
    cancel_at_period_end: subscription.cancel_at_period_end,
  }, { onConflict: 'user_id' });

  // Update user record
  const { error } = await supabase
    .from('users')
    .update({
      subscription: {
        tier: planType,
        status: status,
        expiryDate: expiryDate,
      },
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating subscription:', error);
  } else {
    console.log(`Subscription updated for user ${userId}: ${planType} (${status})`);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('stripeCustomerId', customerId)
    .limit(1);
  
  if (!users || users.length === 0) {
    console.error('No user found for customer:', customerId);
    return;
  }

  const userId = users[0].id;
  const expiryDate = new Date(subscription.current_period_end * 1000).toISOString();

  // Update subscription record
  await supabase.from('subscriptions').update({
    status: 'canceled',
    cancel_at_period_end: true,
  }).eq('user_id', userId);

  // Update user - keep access until period end, then downgrade
  const { error } = await supabase
    .from('users')
    .update({
      subscription: {
        tier: 'free', // Will be downgraded
        status: 'canceled',
        expiryDate: expiryDate, // Access until this date
      },
      credits: {
        current: 100,
        limit: 100,
        lastReset: new Date().toISOString(),
      },
    })
    .eq('id', userId);

  if (error) {
    console.error('Error canceling subscription:', error);
  } else {
    console.log(`Subscription canceled for user ${userId}`);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;
  
  console.log('Invoice paid:', invoice.id, 'for customer:', customerId);

  if (!subscriptionId) return;

  // Find user by Stripe customer ID
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('stripeCustomerId', customerId)
    .limit(1);
  
  if (!users || users.length === 0) {
    return;
  }

  const userId = users[0].id;

  // Insert payment record
  await supabase.from('payments').insert({
    user_id: userId,
    stripe_payment_id: invoice.payment_intent as string || invoice.id,
    stripe_customer_id: customerId,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    plan_type: 'subscription_renewal',
    metadata: {
      invoice_id: invoice.id,
      subscription_id: subscriptionId,
    }
  });

  // Ensure subscription is active
  await supabase
    .from('users')
    .update({
      'subscription': {
        tier: (await supabase.from('users').select('subscription').eq('id', userId).single()).data?.subscription?.tier || 'monthly',
        status: 'active',
        expiryDate: invoice.lines.data[0]?.period?.end 
          ? new Date(invoice.lines.data[0].period.end * 1000).toISOString() 
          : null,
      },
    })
    .eq('id', userId);
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  console.log('Invoice payment failed:', invoice.id);

  // Find user by Stripe customer ID
  const { data: users } = await supabase
    .from('users')
    .select('id, subscription')
    .eq('stripeCustomerId', customerId)
    .limit(1);
  
  if (!users || users.length === 0) {
    return;
  }

  const userId = users[0].id;
  const currentSubscription = users[0].subscription;

  // Update user status to reflect payment issue
  const { error } = await supabase
    .from('users')
    .update({
      subscription: {
        ...currentSubscription,
        status: 'expired',
      },
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user after failed payment:', error);
  }

  // Insert failed payment record
  await supabase.from('payments').insert({
    user_id: userId,
    stripe_payment_id: invoice.payment_intent as string || invoice.id,
    stripe_customer_id: customerId,
    amount: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    plan_type: 'subscription_renewal',
    metadata: {
      invoice_id: invoice.id,
      failure_reason: 'payment_failed',
    }
  });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // This is mainly for one-time payments not through checkout sessions
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  const customerId = paymentIntent.customer as string;
  const userId = paymentIntent.metadata?.userId;

  if (!userId && !customerId) {
    console.log('No user identifier in payment intent');
    return;
  }

  // If we have userId in metadata, use it directly
  if (userId) {
    // Check if this payment was already processed via checkout.session.completed
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('stripe_payment_id', paymentIntent.id)
      .limit(1);

    if (existingPayment && existingPayment.length > 0) {
      console.log('Payment already processed');
      return;
    }

    // Insert payment record
    await supabase.from('payments').insert({
      user_id: userId,
      stripe_payment_id: paymentIntent.id,
      stripe_customer_id: customerId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'succeeded',
      plan_type: paymentIntent.metadata?.plan_type || 'unknown',
    });
  }
}
