import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe Publishable Key from environment variables
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

// Stripe Price IDs from environment variables
export const STRIPE_PRICES = {
  monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY as string,
  annual: import.meta.env.VITE_STRIPE_PRICE_ANNUAL as string,
  lifetime: import.meta.env.VITE_STRIPE_PRICE_LIFETIME as string,
  lifetimeTeam: import.meta.env.VITE_STRIPE_PRICE_LIFETIME_TEAM as string,
};

// Initialize Stripe
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise || Promise.resolve(null);
};

// Legacy export for backward compatibility
export { stripePromise };

// Check if Stripe is configured
export const isStripeConfigured = (): boolean => {
  return !!(
    STRIPE_PUBLISHABLE_KEY &&
    STRIPE_PRICES.monthly &&
    STRIPE_PRICES.annual &&
    STRIPE_PRICES.lifetime
  );
};

// Redirect to Stripe Checkout using Payment Links or Checkout Sessions
// This method uses Stripe's client-side redirect
export const redirectToCheckout = async (params: {
  priceId: string;
  userId: string;
  email: string;
  quantity?: number;
  successUrl?: string;
  cancelUrl?: string;
}): Promise<{ error?: string }> => {
  const { priceId, userId, email, quantity = 1, successUrl, cancelUrl } = params;

  try {
    const stripe = await getStripe();
    
    if (!stripe) {
      return { error: 'Stripe not initialized. Check your publishable key.' };
    }

    // First, try to use Supabase Edge Function
    try {
      const { supabase } = await import('./supabase');
      
      if (supabase) {
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            priceId,
            userId,
            email,
            quantity,
            successUrl: successUrl || `${window.location.origin}?payment=success`,
            cancelUrl: cancelUrl || `${window.location.origin}?payment=cancelled`,
          },
        });

        if (!error && data?.url) {
          window.location.href = data.url;
          return {};
        }
        
        // Log the error but continue to fallback
        console.warn('Edge function failed, using fallback:', error);
      }
    } catch (edgeFnError) {
      console.warn('Edge function not available:', edgeFnError);
    }

    // Fallback: Use Stripe Payment Links if configured
    // You can create Payment Links in Stripe Dashboard and use them here
    const paymentLinks: Record<string, string> = {
      [STRIPE_PRICES.monthly]: import.meta.env.VITE_STRIPE_PAYMENT_LINK_MONTHLY as string,
      [STRIPE_PRICES.annual]: import.meta.env.VITE_STRIPE_PAYMENT_LINK_ANNUAL as string,
      [STRIPE_PRICES.lifetime]: import.meta.env.VITE_STRIPE_PAYMENT_LINK_LIFETIME as string,
      [STRIPE_PRICES.lifetimeTeam]: import.meta.env.VITE_STRIPE_PAYMENT_LINK_LIFETIME_TEAM as string,
    };

    const paymentLink = paymentLinks[priceId];
    
    if (paymentLink) {
      // Redirect to Stripe Payment Link with prefilled email
      const url = new URL(paymentLink);
      url.searchParams.set('prefilled_email', email);
      url.searchParams.set('client_reference_id', userId);
      window.location.href = url.toString();
      return {};
    }

    // If no payment link, return error with instructions
    return { 
      error: 'Payment system not fully configured. Please set up Stripe Payment Links or deploy Edge Functions.' 
    };

  } catch (err: any) {
    console.error('Checkout error:', err);
    return { error: err.message || 'Failed to initiate checkout' };
  }
};

// Create checkout session via Supabase Edge Function
export const createCheckoutSession = async (params: {
  priceId: string;
  userId: string;
  email: string;
  quantity?: number;
  successUrl?: string;
  cancelUrl?: string;
}): Promise<{ url: string } | { error: string }> => {
  const { priceId, userId, email, quantity = 1, successUrl, cancelUrl } = params;

  try {
    // Import supabase dynamically to avoid circular dependencies
    const { supabase } = await import('./supabase');
    
    if (!supabase) {
      return { error: 'Supabase not configured' };
    }

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        userId,
        email,
        quantity,
        successUrl: successUrl || `${window.location.origin}?payment=success`,
        cancelUrl: cancelUrl || `${window.location.origin}?payment=cancelled`,
      },
    });

    if (error) {
      console.error('Checkout session error:', error);
      return { error: error.message || 'Failed to create checkout session' };
    }

    if (data?.url) {
      return { url: data.url };
    }

    return { error: 'No checkout URL returned' };
  } catch (err: any) {
    console.error('Checkout error:', err);
    return { error: err.message || 'Failed to create checkout session' };
  }
};

// Create customer portal session for managing subscriptions
export const createPortalSession = async (params: {
  customerId: string;
  returnUrl?: string;
}): Promise<{ url: string } | { error: string }> => {
  const { customerId, returnUrl } = params;

  try {
    const { supabase } = await import('./supabase');
    
    if (!supabase) {
      return { error: 'Supabase not configured' };
    }

    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        customerId,
        returnUrl: returnUrl || `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error('Portal session error:', error);
      return { error: error.message || 'Failed to create portal session' };
    }

    if (data?.url) {
      return { url: data.url };
    }

    return { error: 'No portal URL returned' };
  } catch (err: any) {
    console.error('Portal error:', err);
    return { error: err.message || 'Failed to create portal session' };
  }
};

// Get price ID based on plan selection
export const getPriceId = (plan: 'monthly' | 'annual' | 'lifetime' | 'lifetimeTeam'): string | null => {
  return STRIPE_PRICES[plan] || null;
};
