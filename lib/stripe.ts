
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51O7...PLACEHOLDER';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
