import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
  console.error('Supabase credentials missing or invalid. Please check your environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).');
}

export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: { 'x-application-name': 'bora-school-ke' },
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder');

// Add a helper to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection check failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase connection check threw an error:', err);
    return false;
  }
};
