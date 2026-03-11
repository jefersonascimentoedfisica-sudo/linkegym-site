import { supabase } from './supabase-client';

export interface Payment {
  id: string;
  booking_id: string;
  professional_id: string;
  student_email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  payment_method: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  mercado_pago_payment_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new payment record
 */
export async function createPayment(
  bookingId: string,
  professionalId: string,
  studentEmail: string,
  amount: number,
  paymentMethod: string = 'stripe'
): Promise<Payment | null> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          booking_id: bookingId,
          professional_id: professionalId,
          student_email: studentEmail,
          amount,
          currency: 'BRL',
          payment_method: paymentMethod,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error creating payment:', err);
    return null;
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: 'pending' | 'paid' | 'completed' | 'cancelled',
  stripePaymentIntentId?: string,
  stripeChargeId?: string
): Promise<Payment | null> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (stripePaymentIntentId) {
      updateData.stripe_payment_intent_id = stripePaymentIntentId;
    }

    if (stripeChargeId) {
      updateData.stripe_charge_id = stripeChargeId;
    }

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating payment status:', err);
    return null;
  }
}

/**
 * Get payment by booking ID
 */
export async function getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return data || null;
  } catch (err) {
    console.error('Error fetching payment:', err);
    return null;
  }
}

/**
 * Get payments by professional ID
 */
export async function getPaymentsByProfessionalId(professionalId: string): Promise<Payment[]> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching payments:', err);
    return [];
  }
}

/**
 * Get professional lesson price
 */
export async function getProfessionalLessonPrice(professionalId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('lesson_price')
      .eq('id', professionalId)
      .single();

    if (error) throw error;
    return data?.lesson_price || 100.00;
  } catch (err) {
    console.error('Error fetching lesson price:', err);
    return 100.00;
  }
}

/**
 * Update professional lesson price
 */
export async function updateProfessionalLessonPrice(
  professionalId: string,
  price: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('professionals')
      .update({ lesson_price: price })
      .eq('id', professionalId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating lesson price:', err);
    return false;
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Calculate platform fee (10% default)
 */
export function calculatePlatformFee(amount: number, feePercentage: number = 10): number {
  return (amount * feePercentage) / 100;
}

/**
 * Calculate professional earnings (after platform fee)
 */
export function calculateProfessionalEarnings(amount: number, feePercentage: number = 10): number {
  const fee = calculatePlatformFee(amount, feePercentage);
  return amount - fee;
}
