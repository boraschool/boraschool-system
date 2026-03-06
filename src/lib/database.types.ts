export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: string
          name: string
          email: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          role?: string
          name: string
          email: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          title: string
          term: string
          year: string
          class_id: string | null
          subject_id: string | null
          locked: boolean
          weighting: number
          created_at: string
          school_id: string
        }
        Insert: {
          id?: string
          title: string
          term: string
          year: string
          class_id?: string | null
          subject_id?: string | null
          locked?: boolean
          weighting?: number
          created_at?: string
          school_id: string
        }
        Update: {
          id?: string
          title?: string
          term?: string
          year?: string
          class_id?: string | null
          subject_id?: string | null
          locked?: boolean
          weighting?: number
          created_at?: string
          school_id?: string
        }
      }
      marks: {
        Row: {
          id: string
          student_id: string
          subject_id: string
          exam_id: string
          score: number
          grade: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          subject_id: string
          exam_id: string
          score: number
          grade?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          subject_id?: string
          exam_id?: string
          score?: number
          grade?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          details: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          details?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: string | null
          timestamp?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          adm: string
          class: string
          gender: string | null
          status: string
          school_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          adm: string
          class: string
          gender?: string | null
          status?: string
          school_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          adm?: string
          class?: string
          gender?: string | null
          status?: string
          school_id?: string
          created_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          teacher_id: string | null
          capacity: number
          school_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          teacher_id?: string | null
          capacity?: number
          school_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          teacher_id?: string | null
          capacity?: number
          school_id?: string
          created_at?: string
        }
      }
      school_settings: {
        Row: {
          id: string
          school_id: string
          name: string
          motto: string | null
          email: string | null
          phone: string | null
          website: string | null
          address: string | null
          logo_url: string | null
          letterhead_template: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          motto?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          address?: string | null
          logo_url?: string | null
          letterhead_template?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          motto?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          address?: string | null
          logo_url?: string | null
          letterhead_template?: string | null
          updated_at?: string
        }
      }
    }
  }
}
