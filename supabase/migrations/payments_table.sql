-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  student_email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, completed, cancelled
  payment_method VARCHAR(50), -- stripe, mercado_pago, etc
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  mercado_pago_payment_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_professional_id ON payments(professional_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_intent ON payments(stripe_payment_intent_id);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read payments
CREATE POLICY "Allow public read payments" ON payments
  FOR SELECT USING (true);

-- Allow anyone to create payments
CREATE POLICY "Allow public create payments" ON payments
  FOR INSERT WITH CHECK (true);

-- Allow update of payments
CREATE POLICY "Allow update payments" ON payments
  FOR UPDATE USING (true);

-- Add payment_price column to professionals table if it doesn't exist
ALTER TABLE professionals 
ADD COLUMN IF NOT EXISTS lesson_price DECIMAL(10, 2) DEFAULT 100.00;

-- Add payment_status column to bookings table if it doesn't exist
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
