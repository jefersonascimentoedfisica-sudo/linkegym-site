import { supabase } from './supabase-client';

export interface Student {
  id: string;
  email: string;
  name: string;
  phone?: string;
  date_of_birth?: string;
  city?: string;
  neighborhood?: string;
  bio?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  student_id: string;
  professional_id: string;
  created_at: string;
}

/**
 * Get or create student by email
 */
export async function getOrCreateStudent(email: string, name: string): Promise<Student | null> {
  try {
    // Try to get existing student
    const { data: existing } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) return existing;

    // Create new student
    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          email,
          name,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error getting/creating student:', err);
    return null;
  }
}

/**
 * Get student by email
 */
export async function getStudentByEmail(email: string): Promise<Student | null> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (err) {
    console.error('Error fetching student:', err);
    return null;
  }
}

/**
 * Update student profile
 */
export async function updateStudentProfile(
  studentId: string,
  updates: Partial<Student>
): Promise<Student | null> {
  try {
    const { data, error } = await supabase
      .from('students')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', studentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating student profile:', err);
    return null;
  }
}

/**
 * Add favorite professional
 */
export async function addFavorite(
  studentId: string,
  professionalId: string
): Promise<Favorite | null> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert([
        {
          student_id: studentId,
          professional_id: professionalId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error adding favorite:', err);
    return null;
  }
}

/**
 * Remove favorite professional
 */
export async function removeFavorite(
  studentId: string,
  professionalId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('student_id', studentId)
      .eq('professional_id', professionalId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error removing favorite:', err);
    return false;
  }
}

/**
 * Check if professional is favorite
 */
export async function isFavorite(
  studentId: string,
  professionalId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('student_id', studentId)
      .eq('professional_id', professionalId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (err) {
    console.error('Error checking favorite:', err);
    return false;
  }
}

/**
 * Get student favorites
 */
export async function getStudentFavorites(studentId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('professional_id, professionals(*)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return [];
  }
}

/**
 * Get student bookings with professional info
 */
export async function getStudentBookings(studentId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, professionals(*)')
      .eq('student_id', studentId)
      .order('booking_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return [];
  }
}

/**
 * Get student consultations with professional info
 */
export async function getStudentConsultations(studentId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*, professionals(*)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching consultations:', err);
    return [];
  }
}

/**
 * Get student payments
 */
export async function getStudentPayments(studentId: string): Promise<any[]> {
  try {
    // Get payments by student email
    const student = await supabase
      .from('students')
      .select('email')
      .eq('id', studentId)
      .single();

    if (!student.data) return [];

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('student_email', student.data.email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching payments:', err);
    return [];
  }
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error cancelling booking:', err);
    return false;
  }
}

/**
 * Cancel consultation
 */
export async function cancelConsultation(consultationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('consultations')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', consultationId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error cancelling consultation:', err);
    return false;
  }
}

/**
 * Reschedule booking
 */
export async function rescheduleBooking(
  bookingId: string,
  newDate: string,
  newTime: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        booking_date: newDate,
        booking_time: newTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error rescheduling booking:', err);
    return false;
  }
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return '⏳ Pendente';
    case 'confirmed':
      return '✅ Confirmado';
    case 'completed':
      return '✓ Concluído';
    case 'cancelled':
      return '✕ Cancelado';
    case 'paid':
      return '✅ Pago';
    case 'scheduled':
      return '📅 Agendado';
    default:
      return status;
  }
}
