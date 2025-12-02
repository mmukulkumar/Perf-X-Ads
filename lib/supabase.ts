
import { createClient } from '@supabase/supabase-js';

// Helper to get env vars safely from either Vite or Create React App environments
const getEnvVar = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_${key}`]) {
    // @ts-ignore
    return import.meta.env[`VITE_${key}`];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[`REACT_APP_${key}`]) {
    // @ts-ignore
    return process.env[`REACT_APP_${key}`];
  }
  return '';
};

// Supabase Configuration
// Using provided credentials as defaults if env vars are missing
const supabaseUrl = getEnvVar('SUPABASE_URL') || 'https://gjruwddvafulkpmlzbjm.supabase.co';
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcnV3ZGR2YWZ1bGtwbWx6YmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzA5NTAsImV4cCI6MjA4MDI0Njk1MH0.BM4Wcf56tR-8qlqsMyI5cYfXr0AnUHhkUEhKooVPFm4';

// Only initialize if keys are present to avoid crashing
const isConfigValid = supabaseUrl && supabaseAnonKey;

let supabase: ReturnType<typeof createClient> | null = null;

if (isConfigValid) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Supabase initialization failed:", error);
  }
} else {
  console.warn("Supabase configuration is missing. App running in Demo/Offline mode.");
}

export { supabase };
export default supabase;
