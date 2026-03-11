-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nutritionist_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  notes TEXT,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'paid', -- paid, scheduled, completed, cancelled
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_consultations_nutritionist_id ON consultations(nutritionist_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_payment_id ON consultations(payment_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read consultations
CREATE POLICY "Allow public read consultations" ON consultations
  FOR SELECT USING (true);

-- Allow anyone to create consultations
CREATE POLICY "Allow public create consultations" ON consultations
  FOR INSERT WITH CHECK (true);

-- Allow update of consultations
CREATE POLICY "Allow update consultations" ON consultations
  FOR UPDATE USING (true);

-- Add columns to professionals table if they don't exist
ALTER TABLE professionals 
ADD COLUMN IF NOT EXISTS consultation_price DECIMAL(10, 2) DEFAULT 150.00;

ALTER TABLE professionals 
ADD COLUMN IF NOT EXISTS service_type VARCHAR(50) DEFAULT 'presencial'; -- presencial, online, ambos

ALTER TABLE professionals 
ADD COLUMN IF NOT EXISTS service_regions TEXT; -- JSON array of regions/neighborhoods
