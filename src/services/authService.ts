import { supabase } from '../lib/supabase';

export type UserRole = 'student' | 'teacher' | 'principal' | 'super_admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  school_id: string | null;
  created_at: string;
}

export const authService = {
  async getCurrentProfile(retries = 3): Promise<UserProfile | null> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return null;
    }

    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        return data as UserProfile;
      }

      // If it's a real error (not just "not found yet"), log it
      if (error && error.code !== 'PGRST116') {
        console.error(`Profile fetch attempt ${i + 1} failed:`, error);
      }

      if (i < retries - 1) {
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return null;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getDashboardRoute(role: UserRole): Promise<string> {
    switch (role) {
      case 'super_admin':
        return '/super-admin';
      case 'principal':
        return '/principal';
      case 'teacher':
        return '/teacher';
      case 'student':
        return '/student';
      default:
        return '/';
    }
  }
};
