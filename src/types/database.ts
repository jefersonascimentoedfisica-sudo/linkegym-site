// ============================================
// DATABASE TYPES - LinkeGym
// ============================================

export interface Neighborhood {
  id: number;
  name: string;
  city: string;
  state: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  neighborhood_id?: number;
  profile_image_url?: string;
  bio?: string;
  user_type: 'student' | 'professional' | 'admin';
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Professional {
  id: string;
  user_id: string;
  professional_type: 'personal_trainer' | 'nutritionist';
  bio?: string;
  years_of_experience?: number;
  profile_image_url?: string;
  
  // Registro Profissional
  registration_number: string;
  registration_state: string;
  is_verified: boolean;
  
  // Contato
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  
  // Localização
  primary_neighborhood_id?: number;
  
  // Serviços
  services_offered?: string[];
  specialties?: string[];
  
  // Preços
  price_per_session?: number;
  
  // Status
  is_active: boolean;
  is_premium: boolean;
  premium_until?: string;
  
  // Estatísticas
  total_bookings: number;
  average_rating: number;
  total_reviews: number;
  
  created_at: string;
  updated_at: string;
}

export interface ServiceArea {
  id: number;
  professional_id: string;
  neighborhood_id: number;
  priority: 1 | 2 | 3 | 4;
  service_type: 'presencial' | 'online' | 'both';
  created_at: string;
}

export interface Service {
  id: number;
  professional_id: string;
  name: string;
  description?: string;
  duration_minutes?: number;
  price: number;
  service_type: 'presencial' | 'online';
  is_active: boolean;
  created_at: string;
}

export interface Availability {
  id: number;
  professional_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  professional_id: string;
  service_id?: number;
  
  // Agendamento
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes?: number;
  
  // Status
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  
  // Pagamento
  price: number;
  commission_percentage: number;
  platform_commission?: number;
  professional_earnings?: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_method?: 'credit_card' | 'pix' | 'bank_transfer';
  
  // Notas
  notes?: string;
  cancellation_reason?: string;
  
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Review {
  id: string;
  booking_id?: string;
  user_id: string;
  professional_id: string;
  
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  professional_id: string;
  booking_id?: string;
  
  amount: number;
  transaction_type: 'earning' | 'withdrawal' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  
  description?: string;
  
  created_at: string;
  completed_at?: string;
}

export interface Earnings {
  id: number;
  professional_id: string;
  total_earned: number;
  total_withdrawn: number;
  available_balance: number;
  updated_at: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ProfessionalWithDetails extends Professional {
  user?: User;
  service_areas?: ServiceArea[];
  services?: Service[];
  reviews?: Review[];
  earnings?: Earnings;
}

export interface BookingWithDetails extends Booking {
  user?: User;
  professional?: Professional;
  service?: Service;
  review?: Review;
}

// ============================================
// FORM TYPES
// ============================================

export interface ProfessionalRegistrationForm {
  // Step 1
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  neighborhood_id: number;
  professional_type: 'personal_trainer' | 'nutritionist';
  
  // Step 2
  registration_number: string;
  registration_state: string;
  bio: string;
  years_of_experience: number;
  specialties: string[];
  
  // Step 3
  price_per_session: number;
  service_areas: {
    neighborhood_id: number;
    priority: 1 | 2 | 3 | 4;
    service_type: 'presencial' | 'online' | 'both';
  }[];
  services_offered: string[];
}

export interface StudentRegistrationForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  neighborhood_id?: number;
}

export interface BookingForm {
  professional_id: string;
  service_id?: number;
  scheduled_date: string;
  scheduled_time: string;
  notes?: string;
}
