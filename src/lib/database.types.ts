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
          password: string | null
          avatar_url: string | null
          school_id: string | null
          assignments: Json | null
          student_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          role?: string
          name: string
          email: string
          password?: string | null
          avatar_url?: string | null
          school_id?: string | null
          assignments?: Json | null
          student_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          name?: string
          email?: string
          password?: string | null
          avatar_url?: string | null
          school_id?: string | null
          assignments?: Json | null
          student_id?: string | null
          created_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          county: string | null
          subcounty: string | null
          type: string | null
          principal_name: string | null
          principal_email: string | null
          principal_phone: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          county?: string | null
          subcounty?: string | null
          type?: string | null
          principal_name?: string | null
          principal_email?: string | null
          principal_phone?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          county?: string | null
          subcounty?: string | null
          type?: string | null
          principal_name?: string | null
          principal_email?: string | null
          principal_phone?: string | null
          status?: string
          created_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          school_id: string
          title: string
          term: string | null
          year: string | null
          classes: Json | null
          subjects: Json | null
          status: string | null
          published: boolean | null
          weighting: number | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          title: string
          term?: string | null
          year?: string | null
          classes?: Json | null
          subjects?: Json | null
          status?: string | null
          published?: boolean | null
          weighting?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          title?: string
          term?: string | null
          year?: string | null
          classes?: Json | null
          subjects?: Json | null
          status?: string | null
          published?: boolean | null
          weighting?: number | null
          created_at?: string
        }
      }
      marks: {
        Row: {
          id: string
          exam_id: string
          student_id: string
          subject: string
          score: number | null
          max_score: number | null
          grade: string | null
          teacher_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          student_id: string
          subject: string
          score?: number | null
          max_score?: number | null
          grade?: string | null
          teacher_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          student_id?: string
          subject?: string
          score?: number | null
          max_score?: number | null
          grade?: string | null
          teacher_id?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          school_id: string | null
          user_id: string | null
          action: string
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id?: string | null
          user_id?: string | null
          action: string
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string | null
          user_id?: string | null
          action?: string
          details?: Json | null
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          school_id: string | null
          admission_number: string | null
          name: string
          email: string | null
          class: string | null
          stream: string | null
          parent_name: string | null
          parent_phone: string | null
          password: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id?: string | null
          admission_number?: string | null
          name: string
          email?: string | null
          class?: string | null
          stream?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          password?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string | null
          admission_number?: string | null
          name?: string
          email?: string | null
          class?: string | null
          stream?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          password?: string | null
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
          logo_url: string | null
          motto: string | null
          theme_color: string | null
          grading_system: Json | null
          address: string | null
          website: string | null
          phone: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          logo_url?: string | null
          motto?: string | null
          theme_color?: string | null
          grading_system?: Json | null
          address?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          logo_url?: string | null
          motto?: string | null
          theme_color?: string | null
          grading_system?: Json | null
          address?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
      }
    }
  }
}
