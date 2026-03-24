import { db } from './db'
import * as schema from './schema'
import { eq, and } from 'drizzle-orm'

export async function getBookingsByProfessional(professionalId: string) {
  try {
    const data = await db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.professionalId, professionalId))
      .orderBy(schema.bookings.bookingDate)
    return data || []
  } catch (err) {
    console.error('Error fetching bookings:', err)
    return []
  }
}

export async function getBookingsByDate(professionalId: string, date: string) {
  try {
    const data = await db
      .select({ bookingTime: schema.bookings.bookingTime })
      .from(schema.bookings)
      .where(
        and(
          eq(schema.bookings.professionalId, professionalId),
          eq(schema.bookings.bookingDate, date),
          eq(schema.bookings.status, 'confirmed')
        )
      )
    return data?.map((b) => b.bookingTime) || []
  } catch (err) {
    console.error('Error fetching bookings by date:', err)
    return []
  }
}

export async function createBooking(bookingData: {
  professional_id: string
  student_name: string
  student_email: string
  booking_date: string
  booking_time: string
  notes?: string
}) {
  try {
    const inserted = await db
      .insert(schema.bookings)
      .values({
        professionalId: bookingData.professional_id,
        studentName: bookingData.student_name,
        studentEmail: bookingData.student_email,
        bookingDate: bookingData.booking_date,
        bookingTime: bookingData.booking_time,
        notes: bookingData.notes,
        status: 'pending',
      })
      .returning()
    return { success: true, data: inserted?.[0] }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Error creating booking:', err)
    return { success: false, error: message }
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) {
  try {
    const updated = await db
      .update(schema.bookings)
      .set({ status })
      .where(eq(schema.bookings.id, bookingId))
      .returning()
    return { success: true, data: updated?.[0] }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Error updating booking:', err)
    return { success: false, error: message }
  }
}

export function formatBookingDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatBookingTime(time: string): string {
  return time
}
