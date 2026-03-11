-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  professional_type VARCHAR(50) NOT NULL, -- 'personal_trainer' or 'nutritionist'
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  cref VARCHAR(50), -- For personal trainers
  crn VARCHAR(50), -- For nutritionists
  bio TEXT,
  years_experience INTEGER,
  specialties TEXT[], -- Array of specialties
  service_neighborhoods TEXT[], -- Array of neighborhoods
  lesson_price DECIMAL(10, 2), -- For personal trainers
  consultation_price DECIMAL(10, 2), -- For nutritionists
  service_type VARCHAR(50), -- 'presencial', 'online', 'ambos'
  service_regions TEXT[], -- Array of regions
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  profile_image_url TEXT,
  instagram VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_professionals_type ON professionals(professional_type);
CREATE INDEX IF NOT EXISTS idx_professionals_email ON professionals(email);
CREATE INDEX IF NOT EXISTS idx_professionals_rating ON professionals(rating DESC);

-- Enable RLS
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read professionals
CREATE POLICY "Allow public read professionals" ON professionals
  FOR SELECT USING (true);

-- Allow anyone to create professionals
CREATE POLICY "Allow public create professionals" ON professionals
  FOR INSERT WITH CHECK (true);

-- Allow update of own professional profile
CREATE POLICY "Allow update own professional" ON professionals
  FOR UPDATE USING (true);
