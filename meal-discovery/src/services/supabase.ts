import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isAdmin = (email: string): boolean => {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email);
};
