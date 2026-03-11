-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'professional', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  professional_type VARCHAR(50) NOT NULL CHECK (professional_type IN ('personal_trainer', 'nutritionist')),
  bio TEXT NOT NULL,
  specialties TEXT[] NOT NULL,
  years_of_experience INTEGER NOT NULL,
  service_modality VARCHAR(50) NOT NULL CHECK (service_modality IN ('presencial', 'online', 'both')),
  instagram VARCHAR(255),
  whatsapp VARCHAR(20),
  cref_number VARCHAR(50),
  cref_state VARCHAR(2),
  crn_number VARCHAR(50),
  crn_state VARCHAR(2),
  registration_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'approved', 'rejected')),
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  residence_neighborhood VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create service_areas table (bairros de atendimento)
CREATE TABLE IF NOT EXISTS service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  neighborhood VARCHAR(255) NOT NULL,
  priority INTEGER NOT NULL CHECK (priority IN (1, 2, 3, 4)),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(professional_id, neighborhood)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create availability table (horários disponíveis)
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table (agendamentos)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price DECIMAL(10, 2) NOT NULL,
  platform_commission DECIMAL(10, 2) DEFAULT 0,
  professional_earnings DECIMAL(10, 2) DEFAULT 0,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table (avaliações)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_professionals_user_id ON professionals(user_id);
CREATE INDEX idx_professionals_type ON professionals(professional_type);
CREATE INDEX idx_professionals_status ON professionals(registration_status);
CREATE INDEX idx_service_areas_professional_id ON service_areas(professional_id);
CREATE INDEX idx_service_areas_neighborhood ON service_areas(neighborhood);
CREATE INDEX idx_services_professional_id ON services(professional_id);
CREATE INDEX idx_availability_professional_id ON availability(professional_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_professional_id ON bookings(professional_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_professional_id ON reviews(professional_id);

-- Create Guarulhos neighborhoods constant
CREATE TABLE IF NOT EXISTS guarulhos_neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Guarulhos neighborhoods
INSERT INTO guarulhos_neighborhoods (name) VALUES
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
ON CONFLICT DO NOTHING;
