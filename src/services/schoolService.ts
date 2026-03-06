import { supabase } from '../lib/supabase';

export interface School {
  id: string;
  name: string;
  location: string;
  students: string;
  status: 'Active' | 'Pending' | 'Suspended';
  date: string;
  principalEmail: string;
  principalPass: string;
  teacherEmail: string;
  teacherPass: string;
}

export const schoolService = {
  async getSchools() {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async addSchool(school: Omit<School, 'id'>) {
    const { data, error } = await supabase
      .from('schools')
      .insert([school])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSchoolStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('schools')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
