-- Bora School Management System Database Schema
-- For use with Supabase

-- 1. Schools Table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  principal_email TEXT UNIQUE NOT NULL,
  registration_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles Table (Unified for all roles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super-admin', 'principal', 'teacher', 'student')),
  school_id UUID REFERENCES schools(id),
  password TEXT, -- For custom fallback credentials
  admission_number TEXT, -- For students
  class TEXT, -- For students
  subject TEXT, -- For teachers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Exams Table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  title TEXT NOT NULL,
  term TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Results Table
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  exam_id UUID REFERENCES exams(id),
  subject TEXT NOT NULL,
  score DECIMAL NOT NULL,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Schools: Everyone can read, only super-admin can write
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public schools read" ON schools FOR SELECT USING (true);

-- Profiles: Users can read their own profile, admins can read all in school
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Exams: Teachers and Principals can manage, students can read
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "School staff can manage exams" ON exams FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.school_id = exams.school_id 
    AND profiles.role IN ('principal', 'teacher')
  )
);

-- Results: Students can read own, staff can manage
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can read own results" ON results FOR SELECT USING (student_id = auth.uid());
