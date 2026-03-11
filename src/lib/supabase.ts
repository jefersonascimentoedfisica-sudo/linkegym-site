import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string
          avatar_url: string | null
          role: 'client' | 'professional' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone: string
          avatar_url?: string | null
          role: 'client' | 'professional' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string
          avatar_url?: string | null
          role?: 'client' | 'professional' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      professionals: {
        Row: {
          id: string
          user_id: string
          professional_type: 'personal_trainer' | 'nutritionist'
          bio: string
          specialties: string[]
          years_of_experience: number
          service_modality: 'presencial' | 'online' | 'both'
          instagram: string | null
          whatsapp: string | null
          cref_number: string | null
          cref_state: string | null
          crn_number: string | null
          crn_state: string | null
          registration_status: 'pending' | 'approved' | 'rejected'
          rating: number
          total_reviews: number
          residence_neighborhood: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          professional_type: 'personal_trainer' | 'nutritionist'
          bio: string
          specialties: string[]
          years_of_experience: number
          service_modality: 'presencial' | 'online' | 'both'
          instagram?: string | null
          whatsapp?: string | null
          cref_number?: string | null
          cref_state?: string | null
          crn_number?: string | null
          crn_state?: string | null
          registration_status?: 'pending' | 'approved' | 'rejected'
          rating?: number
          total_reviews?: number
          residence_neighborhood: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          professional_type?: 'personal_trainer' | 'nutritionist'
          bio?: string
          specialties?: string[]
          years_of_experience?: number
          service_modality?: 'presencial' | 'online' | 'both'
          instagram?: string | null
          whatsapp?: string | null
          cref_number?: string | null
          cref_state?: string | null
          crn_number?: string | null
          crn_state?: string | null
          registration_status?: 'pending' | 'approved' | 'rejected'
          rating?: number
          total_reviews?: number
          residence_neighborhood?: string
          created_at?: string
          updated_at?: string
        }
      }
      service_areas: {
        Row: {
          id: string
          professional_id: string
          neighborhood: string
          priority: 1 | 2 | 3 | 4
          created_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          neighborhood: string
          priority: 1 | 2 | 3 | 4
          created_at?: string
        }
        Update: {
          id?: string
          professional_id?: string
          neighborhood?: string
          priority?: 1 | 2 | 3 | 4
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          professional_id: string
          name: string
          description: string
          duration_minutes: number
          price: number
          service_type: string
          created_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          name: string
          description: string
          duration_minutes: number
          price: number
          service_type: string
          created_at?: string
        }
        Update: {
          id?: string
          professional_id?: string
          name?: string
          description?: string
          duration_minutes?: number
          price?: number
          service_type?: string
          created_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          professional_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          professional_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          client_id: string
          professional_id: string
          service_id: string
          booking_date: string
          booking_time: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price: number
          platform_commission: number
          professional_earnings: number
          payment_status: 'pending' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          professional_id: string
          service_id: string
          booking_date: string
          booking_time: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price: number
          platform_commission?: number
          professional_earnings?: number
          payment_status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          professional_id?: string
          service_id?: string
          booking_date?: string
          booking_time?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price?: number
          platform_commission?: number
          professional_earnings?: number
          payment_status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          client_id: string
          professional_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          client_id: string
          professional_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          client_id?: string
          professional_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
}
