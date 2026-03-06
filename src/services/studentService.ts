import { supabase } from '../lib/supabase';

export interface Student {
  id: string;
  school_id: string;
  name: string;
  adm_no: string;
  class: string;
  stream?: string;
  status: string;
  created_at?: string;
}

export const studentService = {
  async getAllStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Student[];
  },

  async getStudentsByClass(className: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class', className)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Student[];
  },

  async addStudent(student: Omit<Student, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();
    
    if (error) throw error;
    return data as Student;
  },

  async updateStudent(id: string, updates: Partial<Student>) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Student;
  },

  async deleteStudent(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
