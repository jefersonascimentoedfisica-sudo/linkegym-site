-- Personal Requests Table
CREATE TABLE IF NOT EXISTS personal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  student_phone VARCHAR(20) NOT NULL,
  student_neighborhood VARCHAR(255) NOT NULL,
  objective VARCHAR(255) NOT NULL,
  availability TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professional Plans Table
CREATE TABLE IF NOT EXISTS professional_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL UNIQUE REFERENCES professionals(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) DEFAULT 'basic',
  max_photos INTEGER DEFAULT 3,
  max_regions INTEGER DEFAULT 5,
  has_verified_badge BOOLEAN DEFAULT false,
  unlimited_leads BOOLEAN DEFAULT false,
  has_statistics BOOLEAN DEFAULT false,
  priority_search BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add plan column to professionals table
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50) DEFAULT 'basic';
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP;

-- Create indexes
CREATE INDEX idx_personal_requests_professional ON personal_requests(professional_id);
CREATE INDEX idx_personal_requests_status ON personal_requests(status);
CREATE INDEX idx_personal_requests_created ON personal_requests(created_at DESC);
CREATE INDEX idx_professional_plans_professional ON professional_plans(professional_id);

-- Enable RLS
ALTER TABLE personal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for personal_requests
CREATE POLICY "Allow public create personal requests" ON personal_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow professionals view their requests" ON personal_requests
  FOR SELECT USING (true);

CREATE POLICY "Allow professionals update their requests" ON personal_requests
  FOR UPDATE USING (true);

-- RLS Policies for professional_plans
CREATE POLICY "Allow public read professional plans" ON professional_plans
  FOR SELECT USING (true);

CREATE POLICY "Allow professionals manage their plan" ON professional_plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow professionals update their plan" ON professional_plans
  FOR UPDATE USING (true);
