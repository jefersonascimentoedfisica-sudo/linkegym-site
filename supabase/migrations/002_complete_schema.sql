-- ============================================
-- LINKEGYM - COMPLETE DATABASE SCHEMA
-- ============================================

-- 1. NEIGHBORHOODS (Bairros de Guarulhos)
CREATE TABLE IF NOT EXISTS neighborhoods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  city VARCHAR(255) NOT NULL DEFAULT 'Guarulhos',
  state VARCHAR(2) NOT NULL DEFAULT 'SP',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Guarulhos neighborhoods
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

-- 2. USERS (Alunos/Clientes)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  neighborhood_id INTEGER REFERENCES neighborhoods(id),
  profile_image_url TEXT,
  bio TEXT,
  user_type VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- 3. PROFESSIONALS (Personal Trainers e Nutricionistas)
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_type VARCHAR(50) NOT NULL, -- 'personal_trainer' or 'nutritionist'
  bio TEXT,
  years_of_experience INTEGER,
  profile_image_url TEXT,
  
  -- Registro Profissional
  registration_number VARCHAR(50) NOT NULL, -- CREF or CRN
  registration_state VARCHAR(2) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  
  -- Contato
  whatsapp VARCHAR(20),
  instagram VARCHAR(100),
  facebook VARCHAR(100),
  website TEXT,
  
  -- Localização
  primary_neighborhood_id INTEGER REFERENCES neighborhoods(id),
  
  -- Serviços
  services_offered TEXT[], -- Array of service types
  specialties TEXT[], -- Array of specialties
  
  -- Preços
  price_per_session DECIMAL(10, 2),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMP,
  
  -- Estatísticas
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. SERVICE AREAS (Bairros de atendimento com prioridade)
CREATE TABLE IF NOT EXISTS service_areas (
  id SERIAL PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  neighborhood_id INTEGER NOT NULL REFERENCES neighborhoods(id),
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 4), -- 1 = highest, 4 = lowest
  service_type VARCHAR(50), -- 'presencial', 'online', 'both'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(professional_id, neighborhood_id)
);

-- 5. SERVICES (Serviços oferecidos)
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  price DECIMAL(10, 2) NOT NULL,
  service_type VARCHAR(50), -- 'presencial', 'online'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. AVAILABILITY (Horários disponíveis)
CREATE TABLE IF NOT EXISTS availability (
  id SERIAL PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. BOOKINGS (Agendamentos)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id),
  
  -- Agendamento
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  
  -- Pagamento
  price DECIMAL(10, 2) NOT NULL,
  commission_percentage DECIMAL(5, 2) DEFAULT 20, -- 20% comissão da plataforma
  platform_commission DECIMAL(10, 2),
  professional_earnings DECIMAL(10, 2),
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  payment_method VARCHAR(50), -- 'credit_card', 'pix', 'bank_transfer'
  
  -- Notas
  notes TEXT,
  cancellation_reason TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- 8. REVIEWS (Avaliações)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. TRANSACTIONS (Transações e ganhos)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type VARCHAR(50), -- 'earning', 'withdrawal', 'refund'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  
  description TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- 10. EARNINGS (Ganhos acumulados)
CREATE TABLE IF NOT EXISTS earnings (
  id SERIAL PRIMARY KEY,
  professional_id UUID NOT NULL UNIQUE REFERENCES professionals(id) ON DELETE CASCADE,
  total_earned DECIMAL(15, 2) DEFAULT 0,
  total_withdrawn DECIMAL(15, 2) DEFAULT 0,
  available_balance DECIMAL(15, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_neighborhood ON users(neighborhood_id);
CREATE INDEX idx_professionals_user ON professionals(user_id);
CREATE INDEX idx_professionals_type ON professionals(professional_type);
CREATE INDEX idx_professionals_verified ON professionals(is_verified);
CREATE INDEX idx_professionals_active ON professionals(is_active);
CREATE INDEX idx_service_areas_professional ON service_areas(professional_id);
CREATE INDEX idx_service_areas_neighborhood ON service_areas(neighborhood_id);
CREATE INDEX idx_services_professional ON services(professional_id);
CREATE INDEX idx_availability_professional ON availability(professional_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_professional ON bookings(professional_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_reviews_professional ON reviews(professional_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_transactions_professional ON transactions(professional_id);
CREATE INDEX idx_earnings_professional ON earnings(professional_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Professionals can view their own profile
CREATE POLICY "Professionals can view own profile" ON professionals
  FOR SELECT USING (auth.uid() = user_id);

-- Professionals can update their own profile
CREATE POLICY "Professionals can update own profile" ON professionals
  FOR UPDATE USING (auth.uid() = user_id);

-- Public can view verified professionals
CREATE POLICY "Public can view verified professionals" ON professionals
  FOR SELECT USING (is_verified = true AND is_active = true);

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Professionals can view their bookings
CREATE POLICY "Professionals can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = professional_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate professional rating
CREATE OR REPLACE FUNCTION calculate_professional_rating(prof_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT AVG(rating) INTO avg_rating FROM reviews WHERE professional_id = prof_id;
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate booking commission
CREATE OR REPLACE FUNCTION calculate_booking_commission(booking_price DECIMAL, commission_pct DECIMAL)
RETURNS TABLE(commission DECIMAL, professional_earnings DECIMAL) AS $$
BEGIN
  RETURN QUERY SELECT 
    (booking_price * commission_pct / 100),
    (booking_price - (booking_price * commission_pct / 100));
END;
$$ LANGUAGE plpgsql;

-- Function to update professional earnings
CREATE OR REPLACE FUNCTION update_professional_earnings(prof_id UUID)
RETURNS void AS $$
DECLARE
  total_earned DECIMAL;
  total_withdrawn DECIMAL;
BEGIN
  SELECT COALESCE(SUM(professional_earnings), 0) INTO total_earned
  FROM bookings 
  WHERE professional_id = prof_id AND status = 'completed';
  
  SELECT COALESCE(SUM(amount), 0) INTO total_withdrawn
  FROM transactions
  WHERE professional_id = prof_id AND transaction_type = 'withdrawal' AND status = 'completed';
  
  INSERT INTO earnings (professional_id, total_earned, total_withdrawn, available_balance)
  VALUES (prof_id, total_earned, total_withdrawn, total_earned - total_withdrawn)
  ON CONFLICT (professional_id) DO UPDATE SET
    total_earned = total_earned,
    total_withdrawn = total_withdrawn,
    available_balance = total_earned - total_withdrawn,
    updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update professional rating after review
CREATE OR REPLACE FUNCTION update_professional_rating_after_review()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE professionals SET
    average_rating = calculate_professional_rating(NEW.professional_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE professional_id = NEW.professional_id),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.professional_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rating_after_review
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_professional_rating_after_review();

-- Trigger to calculate commission on booking creation
CREATE OR REPLACE FUNCTION calculate_commission_on_booking()
RETURNS TRIGGER AS $$
DECLARE
  commission DECIMAL;
  prof_earnings DECIMAL;
BEGIN
  SELECT * INTO commission, prof_earnings 
  FROM calculate_booking_commission(NEW.price, NEW.commission_percentage);
  
  NEW.platform_commission := commission;
  NEW.professional_earnings := prof_earnings;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_commission
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION calculate_commission_on_booking();

-- Trigger to update professional earnings after booking completion
CREATE OR REPLACE FUNCTION update_earnings_on_booking_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    PERFORM update_professional_earnings(NEW.professional_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_earnings_on_completion
AFTER UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_earnings_on_booking_completion();

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Create sample users (alunos)
INSERT INTO users (email, name, phone, neighborhood_id, user_type, is_active)
SELECT 
  'aluno' || i || '@linkegym.com',
  'Aluno ' || i,
  '(11) 9999' || LPAD(i::text, 4, '0'),
  (SELECT id FROM neighborhoods ORDER BY RANDOM() LIMIT 1),
  'student',
  true
FROM generate_series(1, 5) AS i
ON CONFLICT (email) DO NOTHING;

-- Create sample professionals
INSERT INTO professionals (user_id, professional_type, bio, years_of_experience, registration_number, registration_state, is_verified, whatsapp, instagram, is_active, price_per_session, specialties)
SELECT 
  u.id,
  CASE WHEN random() > 0.5 THEN 'personal_trainer' ELSE 'nutritionist' END,
  'Profissional experiente em saúde e fitness',
  FLOOR(random() * 20 + 1)::INTEGER,
  LPAD(FLOOR(random() * 999999)::text, 6, '0'),
  'SP',
  true,
  '(11) 99999-' || LPAD(FLOOR(random() * 9999)::text, 4, '0'),
  '@profissional' || FLOOR(random() * 1000),
  true,
  FLOOR(random() * 200 + 50)::DECIMAL,
  ARRAY['Musculação', 'Emagrecimento', 'Funcional']
FROM users u
WHERE u.user_type = 'student'
LIMIT 10
ON CONFLICT DO NOTHING;

-- Create sample service areas
INSERT INTO service_areas (professional_id, neighborhood_id, priority, service_type)
SELECT 
  p.id,
  n.id,
  FLOOR(random() * 4 + 1)::INTEGER,
  CASE WHEN random() > 0.5 THEN 'presencial' ELSE 'online' END
FROM professionals p, neighborhoods n
WHERE random() < 0.3
ON CONFLICT (professional_id, neighborhood_id) DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================
