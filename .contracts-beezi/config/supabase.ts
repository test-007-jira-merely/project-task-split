export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface SupabaseEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_ADMIN_EMAILS?: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return { url, anonKey };
};

export const getAdminEmails = (): string[] => {
  const adminEmailsStr = import.meta.env.VITE_ADMIN_EMAILS || '';
  return adminEmailsStr
    .split(',')
    .map(email => email.trim())
    .filter(Boolean);
};

export const isAdmin = (email: string): boolean => {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
};
