export interface Professional {
  id: string
  name: string
  email?: string
  phone?: string
  professional_type?: string
  bio?: string
  specialties?: string[]
  service_neighborhoods?: string[]
  whatsapp?: string
  instagram?: string
  rating?: number
  average_rating?: number
  review_count?: number
  years_experience?: number
  registration_number?: string
  cref?: string
  crn?: string
  service_type?: string
  offers_fixed_personal?: boolean
  offers_single_class?: boolean
  fixed_personal_price?: number | string
  single_class_price?: number | string
  lesson_price?: number
  consultation_price?: number
}

export interface ProfessionalPlan {
  plan_type: string
}

export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  date_of_birth?: string
  city?: string
  neighborhood?: string
  bio?: string
}

export interface BookingItem {
  id: string
  professional_id?: string
  student_id?: string
  student_name?: string
  student_email?: string
  booking_date?: string
  booking_time?: string
  scheduled_date?: string
  scheduled_time?: string
  status?: string
  notes?: string | null
  created_at?: string
  professionals?: Professional
}

export interface PaymentRecord {
  id: string
  amount?: number
  status?: string
  payment_method?: string
  booking_id?: string
  created_at: string
}

export interface FavoriteRecord {
  id: string
  professional_id: string
  professionals: Professional
}
