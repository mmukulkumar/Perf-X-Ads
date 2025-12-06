// Supabase Edge Function: create-checkout-session
// Deploy with: supabase functions deploy create-checkout-session

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { priceId, userId, email, quantity = 1, successUrl, cancelUrl } = await req.json();

    if (!priceId) {
      throw new Error('Price ID is required');
    }

    if (!userId || !email) {
      throw new Error('User ID and email are required');
    }

    console.log('Creating checkout session for:', { userId, email, priceId });

    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    let customerId: string;

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
      console.log('Found existing customer:', customerId);
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;
      console.log('Created new customer:', customerId);
    }

    // Determine if this is a subscription or one-time payment
    const price = await stripe.prices.retrieve(priceId);
    const isSubscription = price.type === 'recurring';

    console.log('Price type:', price.type, 'isSubscription:', isSubscription);

    // Build success URL with session ID placeholder
    const finalSuccessUrl = successUrl || `${req.headers.get('origin')}?payment=success`;
    const finalCancelUrl = cancelUrl || `${req.headers.get('origin')}?payment=cancelled`;

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      client_reference_id: userId, // This helps identify the user
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: finalSuccessUrl.includes('{CHECKOUT_SESSION_ID}') 
        ? finalSuccessUrl 
        : `${finalSuccessUrl}${finalSuccessUrl.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: finalCancelUrl,
      metadata: {
        userId: userId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    };

    // Add subscription-specific options
    if (isSubscription) {
      sessionParams.subscription_data = {
        metadata: {
          userId: userId,
        },
      };
    } else {
      // For one-time payments (lifetime)
      sessionParams.payment_intent_data = {
        metadata: {
          userId: userId,
          plan_type: 'lifetime',
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url, 
        sessionId: session.id,
        customerId: customerId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
