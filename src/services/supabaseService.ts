import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

export const supabaseService = {
  // Profiles
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getClasses(schoolId: string) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('school_id', schoolId);
    if (error) throw error;
    return data;
  },

  async getMarksByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('marks')
      .select('*, exams(*)')
      .eq('student_id', studentId);
    if (error) throw error;
    return data;
  },

  async updateProfile(id: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Exams
  async getExams(schoolId: string) {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('school_id', schoolId);
    if (error) throw error;
    return data;
  },

  async createExam(exam: Database['public']['Tables']['exams']['Insert']) {
    const { data, error } = await supabase
      .from('exams')
      .insert(exam)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateExam(id: string, updates: Database['public']['Tables']['exams']['Update']) {
    const { data, error } = await supabase
      .from('exams')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  // Marks
  async getMarks(examId: string) {
    const { data, error } = await supabase
      .from('marks')
      .select('*')
      .eq('exam_id', examId);
    if (error) throw error;
    return data;
  },

  async upsertMarks(marks: Database['public']['Tables']['marks']['Insert'][]) {
    const { data, error } = await supabase
      .from('marks')
      .upsert(marks);
    if (error) throw error;
    return data;
  },

  // Students
  async getStudents(schoolId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', schoolId);
    if (error) throw error;
    return data;
  },

  async createStudent(student: Database['public']['Tables']['students']['Insert']) {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStudent(id: string, updates: Database['public']['Tables']['students']['Update']) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteStudent(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getStudentsByClass(schoolId: string, className: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', schoolId)
      .eq('class', className);
    if (error) throw error;
    return data;
  },

  // School Settings
  async getSchoolSettings(schoolId: string) {
    const { data, error } = await supabase
      .from('school_settings')
      .select('*')
      .eq('school_id', schoolId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateSchoolSettings(schoolId: string, updates: Database['public']['Tables']['school_settings']['Update']) {
    const { data, error } = await supabase
      .from('school_settings')
      .update(updates)
      .eq('school_id', schoolId);
    if (error) throw error;
    return data;
  },

  // Audit Logs
  async addAuditLog(log: Database['public']['Tables']['audit_logs']['Insert']) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert(log);
    if (error) throw error;
    return data;
  },

  // Storage
  async uploadAvatar(id: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadLogo(schoolId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${schoolId}-${Math.random()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async getPublicResources() {
    const { data, error } = await supabase.storage
      .from('public-resources')
      .list();
    if (error) throw error;
    return data;
  },

  async getResourceUrl(fileName: string) {
    const { data: { publicUrl } } = supabase.storage
      .from('public-resources')
      .getPublicUrl(fileName);
    return publicUrl;
  },

  async uploadResource(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('public-resources')
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    return { data, fileName };
  },

  // Success Stories
  async getSuccessStories() {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createSuccessStory(story: Database['public']['Tables']['success_stories']['Insert']) {
    const { data, error } = await supabase
      .from('success_stories')
      .insert(story)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSuccessStory(id: string) {
    const { error } = await supabase
      .from('success_stories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Exam Materials
  async getExamMaterials(status?: string) {
    let query = supabase.from('exam_materials').select('*');
    if (status) query = query.eq('status', status);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createExamMaterial(material: Database['public']['Tables']['exam_materials']['Insert']) {
    const { data, error } = await supabase
      .from('exam_materials')
      .insert(material)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateExamMaterial(id: string, updates: Database['public']['Tables']['exam_materials']['Update']) {
    const { data, error } = await supabase
      .from('exam_materials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteExamMaterial(id: string) {
    const { error } = await supabase
      .from('exam_materials')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Staff
  async getStaff(schoolId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('school_id', schoolId)
      .eq('role', 'teacher');
    if (error) throw error;
    return data;
  },

  async deleteStaff(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Super Admin
  async getAllSchools() {
    const { data, error } = await supabase
      .from('schools')
      .select('*');
    if (error) throw error;
    return data;
  },

  async createSchool(school: Database['public']['Tables']['schools']['Insert']) {
    const { data, error } = await supabase
      .from('schools')
      .insert(school)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createProfile(profile: Database['public']['Tables']['profiles']['Insert']) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getSystemStats() {
    const [
      { count: schoolsCount },
      { count: examsCount },
      { count: studentsCount },
      { count: sessionsCount }
    ] = await Promise.all([
      supabase.from('schools').select('*', { count: 'exact', head: true }),
      supabase.from('exams').select('*', { count: 'exact', head: true }),
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }) // Using profiles as proxy for sessions
    ]);

    return {
      schools: schoolsCount || 0,
      exams: examsCount || 0,
      students: studentsCount || 0,
      sessions: sessionsCount || 0
    };
  },

  async getDatabaseSize() {
    const { data, error } = await supabase.rpc('get_database_size');
    if (error) {
      console.error('Error fetching DB size:', error);
      return '0 MB';
    }
    return data;
  }
};
