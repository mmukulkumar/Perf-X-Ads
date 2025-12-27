import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project Credentials from environment variables
// Support both VITE_SUPABASE_URL and VITE_SUPABASE_API_URL for backward compatibility
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_API_URL) as string || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || '';

// Create a mock client if credentials are not available (for development)
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Fall back to mock client
    supabase = createMockSupabaseClient();
  }
} else {
  // Create a mock/placeholder client for development without credentials
  console.warn('Supabase credentials not found. Running in demo mode without backend.');
  supabase = createMockSupabaseClient();
}

function createMockSupabaseClient(): SupabaseClient {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - Supabase not configured' } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: async () => ({ data: { url: null, provider: null }, error: { message: 'Demo mode - Supabase not configured' } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null, single: async () => ({ data: null, error: null }) }),
      insert: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      update: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      delete: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      upsert: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
        download: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    functions: {
      invoke: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
    },
  } as unknown as SupabaseClient;
}

export { supabase };
export default supabase;
