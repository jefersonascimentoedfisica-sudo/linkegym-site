-- ============================================
-- LINKE GYM - DATABASE SCHEMA
-- ============================================

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('student', 'professional', 'admin')) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  city TEXT DEFAULT 'Guarulhos',
  state TEXT DEFAULT 'SP'
);

-- Professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  professional_type TEXT CHECK (professional_type IN ('personal_trainer', 'nutritionist')) NOT NULL,
  bio TEXT,
  years_of_experience INT,
  registration_number TEXT NOT NULL,
  registration_state TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  whatsapp TEXT,
  instagram TEXT,
  price_per_session DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Service areas (neighborhoods where professional works)
CREATE TABLE IF NOT EXISTS service_areas (
  id SERIAL PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  neighborhood_id INT NOT NULL REFERENCES neighborhoods(id),
  priority INT CHECK (priority IN (1, 2, 3, 4)),
  service_type TEXT CHECK (service_type IN ('presencial', 'online', 'both')) DEFAULT 'both',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(professional_id, neighborhood_id)
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT,
  price DECIMAL(10,2) NOT NULL,
  service_type TEXT CHECK (service_type IN ('presencial', 'online')) DEFAULT 'presencial',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_id INT REFERENCES services(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  price DECIMAL(10,2) NOT NULL,
  commission_percentage DECIMAL(5,2) DEFAULT 20.00,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_professionals_user_id ON professionals(user_id);
CREATE INDEX idx_professionals_professional_type ON professionals(professional_type);
CREATE INDEX idx_service_areas_professional_id ON service_areas(professional_id);
CREATE INDEX idx_service_areas_neighborhood_id ON service_areas(neighborhood_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_professional_id ON bookings(professional_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_professional_id ON reviews(professional_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Professionals can read their own data
CREATE POLICY "Professionals can read own data" ON professionals
  FOR SELECT USING (auth.uid() = user_id);

-- Professionals can update their own data
CREATE POLICY "Professionals can update own data" ON professionals
  FOR UPDATE USING (auth.uid() = user_id);

-- Verified professionals are public
CREATE POLICY "Verified professionals are public" ON professionals
  FOR SELECT USING (is_verified = TRUE);

-- ============================================
-- INSERT NEIGHBORHOODS
-- ============================================

INSERT INTO neighborhoods (name) VALUES
  ('Centro'),
  ('Vila Galvão'),
  ('Maia'),
  ('Picanço'),
  ('Bonsucesso'),
  ('Cumbica'),
  ('Taboão'),
  ('Cocaia'),
  ('Pimentas'),
  ('São João'),
  ('Jardim Adriana'),
  ('Gopoúva'),
  ('Vila Augusta'),
  ('Vila Rio'),
  ('Jardim Tranquilidade'),
  ('Parque Cecap'),
  ('Jardim São Paulo'),
  ('Vila Endres'),
  ('Jardim Santa Mena'),
  ('Parque Continental')
ON CONFLICT (name) DO NOTHING;
