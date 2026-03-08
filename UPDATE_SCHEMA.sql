-- Bora School Management System Database Update Schema
-- Safe to run on existing databases

-- 1. Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  type TEXT,
  principal_name TEXT,
  principal_email TEXT UNIQUE,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super-admin', 'principal', 'teacher', 'student')),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT, -- Optional: for legacy/mock fallback
  avatar_url TEXT,
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Exams Table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  term TEXT NOT NULL,
  year TEXT NOT NULL,
  class_id UUID,
  subject_id UUID,
  locked BOOLEAN DEFAULT FALSE,
  weighting INTEGER DEFAULT 100,
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Marks Table
CREATE TABLE IF NOT EXISTS marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  exam_id UUID REFERENCES exams(id),
  score DECIMAL NOT NULL,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  adm TEXT NOT NULL,
  class TEXT NOT NULL,
  gender TEXT,
  status TEXT DEFAULT 'Active',
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  teacher_id UUID,
  capacity INTEGER DEFAULT 40,
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. School Settings Table
CREATE TABLE IF NOT EXISTS school_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) UNIQUE,
  name TEXT NOT NULL,
  motto TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  logo_url TEXT,
  letterhead_template TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Success Stories Table
CREATE TABLE IF NOT EXISTS success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Exam Materials Table
CREATE TABLE IF NOT EXISTS exam_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  school_name TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  visibility TEXT DEFAULT 'Public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Safety checks for existing tables (Add missing columns)
DO $$ 
BEGIN 
    -- Profiles columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='password') THEN
        ALTER TABLE profiles ADD COLUMN password TEXT;
    END IF;
    
    -- Schools columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='principal_name') THEN
        ALTER TABLE schools ADD COLUMN principal_name TEXT;
    END IF;
END $$;

-- 14. Enable RLS and add policies
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read" ON schools;
DROP POLICY IF EXISTS "Public read" ON success_stories;
DROP POLICY IF EXISTS "Public read" ON exam_materials;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

-- Re-create policies
CREATE POLICY "Public read" ON schools FOR SELECT USING (true);
CREATE POLICY "Public read" ON success_stories FOR SELECT USING (true);
CREATE POLICY "Public read" ON exam_materials FOR SELECT USING (visibility = 'Public' OR status = 'Approved');
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id OR role = 'super-admin');

-- 15. AUTOMATIC PROFILE CREATION TRIGGER
-- This ensures that every Auth user has a corresponding profile record
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'New User'), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 16. CLEANUP ORPHANED PROFILES
-- If you have profiles that were created without an Auth user, you can run this:
-- DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);
-- This will remove any profile records that don't have a matching user in Supabase Auth.
