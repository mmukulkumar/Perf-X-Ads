
import { createClient } from '@supabase/supabase-js';

// Project Credentials
const supabaseUrl = 'https://gjruwddvafulkpmlzbjm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcnV3ZGR2YWZ1bGtwbWx6YmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzA5NTAsImV4cCI6MjA4MDI0Njk1MH0.BM4Wcf56tR-8qlqsMyI5cYfXr0AnUHhkUEhKooVPFm4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
