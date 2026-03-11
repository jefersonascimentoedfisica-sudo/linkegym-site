-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, professional_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_favorites_student_id ON favorites(student_id);
CREATE INDEX IF NOT EXISTS idx_favorites_professional_id ON favorites(professional_id);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read students
CREATE POLICY "Allow public read students" ON students
  FOR SELECT USING (true);

-- Allow anyone to create students
CREATE POLICY "Allow public create students" ON students
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Allow update own student profile" ON students
  FOR UPDATE USING (true);

-- Allow anyone to read favorites
CREATE POLICY "Allow public read favorites" ON favorites
  FOR SELECT USING (true);

-- Allow anyone to create favorites
CREATE POLICY "Allow public create favorites" ON favorites
  FOR INSERT WITH CHECK (true);

-- Allow anyone to delete favorites
CREATE POLICY "Allow delete favorites" ON favorites
  FOR DELETE USING (true);

-- Add student_id to bookings and consultations
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES students(id) ON DELETE SET NULL;

ALTER TABLE consultations
ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES students(id) ON DELETE SET NULL;

-- Create indexes for student_id
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_consultations_student_id ON consultations(student_id);
