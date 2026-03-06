import { supabase } from '../lib/supabase';

export interface Exam {
  id: string;
  school_id: string;
  title: string;
  term: string;
  year: number;
  classes: string[];
  subjects: string[];
  status: 'Active' | 'Completed';
}

export interface Mark {
  id: string;
  exam_id: string;
  student_id: string;
  subject: string;
  score: number;
  teacher_id?: string;
}

export const academicService = {
  // Exams
  async getExams() {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Exam[];
  },

  async createExam(exam: Omit<Exam, 'id'>) {
    const { data, error } = await supabase
      .from('exams')
      .insert([exam])
      .select()
      .single();
    
    if (error) throw error;
    return data as Exam;
  },

  // Marks
  async getMarksForExam(examId: string) {
    const { data, error } = await supabase
      .from('marks')
      .select(`
        *,
        students (
          name,
          adm_no
        )
      `)
      .eq('exam_id', examId);
    
    if (error) throw error;
    return data;
  },

  async saveMarks(marks: Omit<Mark, 'id'>[]) {
    const { data, error } = await supabase
      .from('marks')
      .upsert(marks, { onConflict: 'exam_id,student_id,subject' })
      .select();
    
    if (error) throw error;
    return data;
  }
};
