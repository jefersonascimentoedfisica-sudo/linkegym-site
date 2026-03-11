import { supabase } from './supabase-client';

export async function getBookingsByProfessional(professionalId: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('professional_id', professionalId)
      .order('booking_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return [];
  }
}

export async function getBookingsByDate(professionalId: string, date: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('booking_time')
      .eq('professional_id', professionalId)
      .eq('booking_date', date)
      .eq('status', 'confirmed');

    if (error) throw error;
    return data?.map(b => b.booking_time) || [];
  } catch (err) {
    console.error('Error fetching bookings by date:', err);
    return [];
  }
}

export async function createBooking(bookingData: {
  professional_id: string;
  student_name: string;
  student_email: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          ...bookingData,
          status: 'pending',
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    console.error('Error creating booking:', err);
    return { success: false, error: err.message };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    console.error('Error updating booking:', err);
    return { success: false, error: err.message };
  }
}

export function formatBookingDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatBookingTime(time: string): string {
  return time;
}
