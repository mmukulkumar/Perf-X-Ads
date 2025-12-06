import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project Credentials from environment variables
// Support both VITE_SUPABASE_URL and VITE_SUPABASE_API_URL for backward compatibility
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_API_URL) as string || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || '';

// Create a mock client if credentials are not available (for development)
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock/placeholder client for development without credentials
  console.warn('Supabase credentials not found. Running in demo mode without backend.');
  
  // Create a minimal mock that won't crash the app
  const mockClient = {
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
  
  supabase = mockClient;
}

export { supabase };
export default supabase;
