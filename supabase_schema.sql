-- BORASCHOOL - SUPABASE DATABASE SCHEMA
-- This schema enforces multi-role authentication, role-based access control, and super admin management.

-- 1. SCHOOLS TABLE
-- Added 'locked' field to prevent deletion or modification.
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  motto TEXT,
  address TEXT,
  phone TEXT,
  email TEXT UNIQUE,
  website TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Suspended')),
  locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES TABLE
-- Links to auth.users.id.
-- Role constraint: student, teacher, principal, super_admin.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'principal', 'super_admin')),
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRIGGER FOR AUTOMATIC PROFILE CREATION
-- This ensures every user in auth.users has a record in public.profiles.
-- It's idempotent to prevent duplicate data issues.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, school_id)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    (new.raw_user_meta_data->>'school_id')::UUID
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. HELPER FUNCTIONS FOR RLS (To avoid recursion)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_my_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. POLICIES FOR PROFILES
-- Users can view their own profile.
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Super admins can view all profiles.
CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_my_role() = 'super_admin');

-- Principals can view profiles in their school.
CREATE POLICY "Principals can view school profiles" ON public.profiles
  FOR SELECT USING (
    public.get_my_role() = 'principal' AND school_id = public.get_my_school_id()
  );

-- 7. POLICIES FOR SCHOOLS
-- All authenticated users can view schools (for selection/info).
CREATE POLICY "Authenticated users can view schools" ON public.schools
  FOR SELECT USING (auth.role() = 'authenticated');

-- Super admins have full control over schools, unless locked.
CREATE POLICY "Super admins can manage schools" ON public.schools
  FOR ALL USING (public.get_my_role() = 'super_admin');

-- Prevent deletion if locked.
CREATE OR REPLACE FUNCTION public.check_school_lock()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.locked = TRUE AND (TG_OP = 'DELETE' OR TG_OP = 'UPDATE') THEN
    RAISE EXCEPTION 'School is locked and cannot be modified or deleted.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_check_school_lock
  BEFORE UPDATE OR DELETE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.check_school_lock();

-- 7. OTHER TABLES (Maintaining backward compatibility)
-- Students table (if needed for additional student-specific data)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  adm_no TEXT NOT NULL,
  class TEXT NOT NULL,
  stream TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, adm_no)
);

-- Exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  term TEXT NOT NULL,
  year INTEGER NOT NULL,
  classes TEXT[] NOT NULL,
  subjects TEXT[] NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marks table
CREATE TABLE IF NOT EXISTS public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  score NUMERIC(5,2) CHECK (score >= 0 AND score <= 100),
  teacher_id UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id, subject)
);

-- Success stories
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  story_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for other tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Policies for students
CREATE POLICY "Students can view own data" ON public.students
  FOR SELECT USING (profile_id = auth.uid());

-- Policies for exams
CREATE POLICY "Users can view their school's exams" ON public.exams
  FOR SELECT USING (
    school_id = public.get_my_school_id()
    OR public.get_my_role() = 'super_admin'
  );

-- Policies for marks
CREATE POLICY "Users can view their school's marks" ON public.marks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = public.marks.exam_id AND e.school_id = public.get_my_school_id()
    )
    OR public.get_my_role() = 'super_admin'
  );
