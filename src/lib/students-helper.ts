import { db } from './db'
import * as schema from './schema'
import { eq, and, desc } from 'drizzle-orm'

export interface Student {
  id: string
  email: string
  name: string
  phone?: string
  date_of_birth?: string
  city?: string
  neighborhood?: string
  bio?: string
  profile_image_url?: string
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  student_id: string
  professional_id: string
  created_at: string
}

export async function getOrCreateStudent(email: string, name: string): Promise<Student | null> {
  try {
    const existing = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.email, email))
      .limit(1)

    if (existing?.[0]) return mapStudent(existing[0])

    const inserted = await db
      .insert(schema.students)
      .values({ email, name })
      .returning()

    return inserted?.[0] ? mapStudent(inserted[0]) : null
  } catch (err) {
    console.error('Error getting/creating student:', err)
    return null
  }
}

export async function getStudentByEmail(email: string): Promise<Student | null> {
  try {
    const rows = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.email, email))
      .limit(1)
    return rows?.[0] ? mapStudent(rows[0]) : null
  } catch (err) {
    console.error('Error fetching student:', err)
    return null
  }
}

export async function updateStudentProfile(
  studentId: string,
  updates: Partial<Student>
): Promise<Student | null> {
  try {
    const updated = await db
      .update(schema.students)
      .set({
        name: updates.name,
        phone: updates.phone,
        dateOfBirth: updates.date_of_birth,
        city: updates.city,
        neighborhood: updates.neighborhood,
        bio: updates.bio,
        profileImageUrl: updates.profile_image_url,
        updatedAt: new Date(),
      })
      .where(eq(schema.students.id, studentId))
      .returning()
    return updated?.[0] ? mapStudent(updated[0]) : null
  } catch (err) {
    console.error('Error updating student profile:', err)
    return null
  }
}

export async function addFavorite(
  studentId: string,
  professionalId: string
): Promise<Favorite | null> {
  try {
    const inserted = await db
      .insert(schema.favorites)
      .values({ studentId, professionalId })
      .returning()
    const row = inserted?.[0]
    if (!row) return null
    return {
      id: row.id,
      student_id: row.studentId || '',
      professional_id: row.professionalId || '',
      created_at: row.createdAt?.toISOString() || new Date().toISOString(),
    }
  } catch (err) {
    console.error('Error adding favorite:', err)
    return null
  }
}

export async function removeFavorite(
  studentId: string,
  professionalId: string
): Promise<boolean> {
  try {
    await db
      .delete(schema.favorites)
      .where(
        and(
          eq(schema.favorites.studentId, studentId),
          eq(schema.favorites.professionalId, professionalId)
        )
      )
    return true
  } catch (err) {
    console.error('Error removing favorite:', err)
    return false
  }
}

export async function isFavorite(studentId: string, professionalId: string): Promise<boolean> {
  try {
    const rows = await db
      .select({ id: schema.favorites.id })
      .from(schema.favorites)
      .where(
        and(
          eq(schema.favorites.studentId, studentId),
          eq(schema.favorites.professionalId, professionalId)
        )
      )
      .limit(1)
    return !!rows?.[0]
  } catch (err) {
    console.error('Error checking favorite:', err)
    return false
  }
}

export async function getStudentFavorites(studentId: string): Promise<unknown[]> {
  try {
    const rows = await db
      .select()
      .from(schema.favorites)
      .where(eq(schema.favorites.studentId, studentId))
      .orderBy(desc(schema.favorites.createdAt))
    return rows || []
  } catch (err) {
    console.error('Error fetching favorites:', err)
    return []
  }
}

export async function getStudentBookings(studentId: string): Promise<unknown[]> {
  try {
    const rows = await db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.studentId, studentId))
      .orderBy(desc(schema.bookings.bookingDate))
    return rows || []
  } catch (err) {
    console.error('Error fetching bookings:', err)
    return []
  }
}

export async function getStudentConsultations(studentId: string): Promise<unknown[]> {
  try {
    const rows = await db
      .select()
      .from(schema.consultations)
      .where(eq(schema.consultations.studentId, studentId))
      .orderBy(desc(schema.consultations.createdAt))
    return rows || []
  } catch (err) {
    console.error('Error fetching consultations:', err)
    return []
  }
}

export async function getStudentPayments(studentId: string): Promise<unknown[]> {
  try {
    const studentRows = await db
      .select({ email: schema.students.email })
      .from(schema.students)
      .where(eq(schema.students.id, studentId))
      .limit(1)

    if (!studentRows?.[0]) return []

    const rows = await db
      .select()
      .from(schema.payments)
      .where(eq(schema.payments.studentEmail, studentRows[0].email))
      .orderBy(desc(schema.payments.createdAt))
    return rows || []
  } catch (err) {
    console.error('Error fetching payments:', err)
    return []
  }
}

export async function cancelBooking(bookingId: string): Promise<boolean> {
  try {
    await db
      .update(schema.bookings)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(schema.bookings.id, bookingId))
    return true
  } catch (err) {
    console.error('Error cancelling booking:', err)
    return false
  }
}

export async function cancelConsultation(consultationId: string): Promise<boolean> {
  try {
    await db
      .update(schema.consultations)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(schema.consultations.id, consultationId))
    return true
  } catch (err) {
    console.error('Error cancelling consultation:', err)
    return false
  }
}

export async function rescheduleBooking(
  bookingId: string,
  newDate: string,
  newTime: string
): Promise<boolean> {
  try {
    await db
      .update(schema.bookings)
      .set({ bookingDate: newDate, bookingTime: newTime, updatedAt: new Date() })
      .where(eq(schema.bookings.id, bookingId))
    return true
  } catch (err) {
    console.error('Error rescheduling booking:', err)
    return false
  }
}

function mapStudent(row: typeof schema.students.$inferSelect): Student {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone || undefined,
    date_of_birth: row.dateOfBirth || undefined,
    city: row.city || undefined,
    neighborhood: row.neighborhood || undefined,
    bio: row.bio || undefined,
    profile_image_url: row.profileImageUrl || undefined,
    created_at: row.createdAt?.toISOString() || new Date().toISOString(),
    updated_at: row.updatedAt?.toISOString() || new Date().toISOString(),
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pendente'
    case 'confirmed':
      return 'Confirmado'
    case 'completed':
      return 'Concluído'
    case 'cancelled':
      return 'Cancelado'
    case 'paid':
      return 'Pago'
    case 'scheduled':
      return 'Agendado'
    default:
      return status
  }
}
