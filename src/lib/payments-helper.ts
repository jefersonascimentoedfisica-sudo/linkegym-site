import { db } from './db'
import * as schema from './schema'
import { eq, desc } from 'drizzle-orm'

export interface Payment {
  id: string
  booking_id: string
  professional_id: string
  student_email: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  payment_method: string
  stripe_payment_intent_id?: string
  stripe_charge_id?: string
  mercado_pago_payment_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export async function createPayment(
  bookingId: string,
  professionalId: string,
  studentEmail: string,
  amount: number,
  paymentMethod: string = 'stripe'
): Promise<Payment | null> {
  try {
    const inserted = await db
      .insert(schema.payments)
      .values({
        bookingId,
        professionalId,
        studentEmail,
        amount: String(amount),
        currency: 'BRL',
        paymentMethod,
        status: 'pending',
      })
      .returning()
    return inserted?.[0] ? mapPayment(inserted[0]) : null
  } catch (err) {
    console.error('Error creating payment:', err)
    return null
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: 'pending' | 'paid' | 'completed' | 'cancelled',
  stripePaymentIntentId?: string,
  stripeChargeId?: string
): Promise<Payment | null> {
  try {
    const updateData: Partial<typeof schema.payments.$inferInsert> = {
      status,
      updatedAt: new Date(),
    }

    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId
    }

    if (stripeChargeId) {
      updateData.stripeChargeId = stripeChargeId
    }

    const updated = await db
      .update(schema.payments)
      .set(updateData)
      .where(eq(schema.payments.id, paymentId))
      .returning()
    return updated?.[0] ? mapPayment(updated[0]) : null
  } catch (err) {
    console.error('Error updating payment status:', err)
    return null
  }
}

export async function getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
  try {
    const rows = await db
      .select()
      .from(schema.payments)
      .where(eq(schema.payments.bookingId, bookingId))
      .limit(1)
    return rows?.[0] ? mapPayment(rows[0]) : null
  } catch (err) {
    console.error('Error fetching payment:', err)
    return null
  }
}

export async function getPaymentsByProfessionalId(professionalId: string): Promise<Payment[]> {
  try {
    const rows = await db
      .select()
      .from(schema.payments)
      .where(eq(schema.payments.professionalId, professionalId))
      .orderBy(desc(schema.payments.createdAt))
    return (rows || []).map(mapPayment)
  } catch (err) {
    console.error('Error fetching payments:', err)
    return []
  }
}

export async function getProfessionalLessonPrice(professionalId: string): Promise<number> {
  try {
    const rows = await db
      .select({ lessonPrice: schema.professionals.lessonPrice })
      .from(schema.professionals)
      .where(eq(schema.professionals.id, professionalId))
      .limit(1)
    return Number(rows?.[0]?.lessonPrice) || 100.0
  } catch (err) {
    console.error('Error fetching lesson price:', err)
    return 100.0
  }
}

export async function updateProfessionalLessonPrice(
  professionalId: string,
  price: number
): Promise<boolean> {
  try {
    await db
      .update(schema.professionals)
      .set({ lessonPrice: String(price) })
      .where(eq(schema.professionals.id, professionalId))
    return true
  } catch (err) {
    console.error('Error updating lesson price:', err)
    return false
  }
}

function mapPayment(row: typeof schema.payments.$inferSelect): Payment {
  return {
    id: row.id,
    booking_id: row.bookingId || '',
    professional_id: row.professionalId || '',
    student_email: row.studentEmail || '',
    amount: Number(row.amount) || 0,
    currency: row.currency || 'BRL',
    status: (row.status as Payment['status']) || 'pending',
    payment_method: row.paymentMethod || 'stripe',
    stripe_payment_intent_id: row.stripePaymentIntentId || undefined,
    stripe_charge_id: row.stripeChargeId || undefined,
    mercado_pago_payment_id: row.mercadoPagoPaymentId || undefined,
    notes: row.notes || undefined,
    created_at: row.createdAt?.toISOString() || new Date().toISOString(),
    updated_at: row.updatedAt?.toISOString() || new Date().toISOString(),
  }
}

export function formatCurrency(amount: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function calculatePlatformFee(amount: number, feePercentage: number = 10): number {
  return (amount * feePercentage) / 100
}

export function calculateProfessionalEarnings(amount: number, feePercentage: number = 10): number {
  const fee = calculatePlatformFee(amount, feePercentage)
  return amount - fee
}
