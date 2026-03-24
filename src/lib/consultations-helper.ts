import { db } from './db'
import * as schema from './schema'
import { eq, and, desc } from 'drizzle-orm'

export interface Consultation {
  id: string
  nutritionist_id: string
  client_name: string
  client_email: string
  notes?: string
  price: number
  status: 'paid' | 'scheduled' | 'completed' | 'cancelled'
  payment_id?: string
  scheduled_date?: string
  scheduled_time?: string
  created_at: string
  updated_at: string
}

export interface NutritionistProfile {
  id: string
  name: string
  consultation_price: number
  service_type: 'presencial' | 'online' | 'ambos'
  service_regions?: string[]
  whatsapp?: string
  email?: string
}

export async function createConsultation(
  nutritionistId: string,
  clientName: string,
  clientEmail: string,
  price: number,
  notes?: string,
  paymentId?: string
): Promise<Consultation | null> {
  try {
    const inserted = await db
      .insert(schema.consultations)
      .values({
        nutritionistId,
        clientName,
        clientEmail,
        price: String(price),
        notes: notes || null,
        paymentId: paymentId || null,
        status: 'paid',
      })
      .returning()
    const row = inserted?.[0]
    if (!row) return null
    return mapConsultation(row)
  } catch (err) {
    console.error('Error creating consultation:', err)
    return null
  }
}

export async function getConsultationById(consultationId: string): Promise<Consultation | null> {
  try {
    const rows = await db
      .select()
      .from(schema.consultations)
      .where(eq(schema.consultations.id, consultationId))
      .limit(1)
    return rows?.[0] ? mapConsultation(rows[0]) : null
  } catch (err) {
    console.error('Error fetching consultation:', err)
    return null
  }
}

export async function getConsultationsByNutritionistId(
  nutritionistId: string
): Promise<Consultation[]> {
  try {
    const rows = await db
      .select()
      .from(schema.consultations)
      .where(eq(schema.consultations.nutritionistId, nutritionistId))
      .orderBy(desc(schema.consultations.createdAt))
    return (rows || []).map(mapConsultation)
  } catch (err) {
    console.error('Error fetching consultations:', err)
    return []
  }
}

export async function updateConsultationStatus(
  consultationId: string,
  status: 'paid' | 'scheduled' | 'completed' | 'cancelled'
): Promise<Consultation | null> {
  try {
    const updated = await db
      .update(schema.consultations)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.consultations.id, consultationId))
      .returning()
    return updated?.[0] ? mapConsultation(updated[0]) : null
  } catch (err) {
    console.error('Error updating consultation status:', err)
    return null
  }
}

export async function scheduleConsultation(
  consultationId: string,
  date: string,
  time: string
): Promise<Consultation | null> {
  try {
    const updated = await db
      .update(schema.consultations)
      .set({
        scheduledDate: date,
        scheduledTime: time,
        status: 'scheduled',
        updatedAt: new Date(),
      })
      .where(eq(schema.consultations.id, consultationId))
      .returning()
    return updated?.[0] ? mapConsultation(updated[0]) : null
  } catch (err) {
    console.error('Error scheduling consultation:', err)
    return null
  }
}

export async function getNutritionistProfile(
  nutritionistId: string
): Promise<NutritionistProfile | null> {
  try {
    const rows = await db
      .select()
      .from(schema.professionals)
      .where(
        and(
          eq(schema.professionals.id, nutritionistId),
          eq(schema.professionals.professionalType, 'nutritionist')
        )
      )
      .limit(1)

    const row = rows?.[0]
    if (!row) return null

    const serviceRegions = row.serviceRegions ? JSON.parse(row.serviceRegions) : undefined

    return {
      id: row.id,
      name: row.name || '',
      consultation_price: Number(row.consultationPrice) || 0,
      service_type: (row.serviceType as 'presencial' | 'online' | 'ambos') || 'presencial',
      service_regions: serviceRegions,
      whatsapp: row.whatsapp || undefined,
      email: row.email || undefined,
    }
  } catch (err) {
    console.error('Error fetching nutritionist profile:', err)
    return null
  }
}

export async function updateNutritionistSettings(
  nutritionistId: string,
  consultationPrice: number,
  serviceType: 'presencial' | 'online' | 'ambos',
  serviceRegions?: string[]
): Promise<boolean> {
  try {
    await db
      .update(schema.professionals)
      .set({
        consultationPrice: String(consultationPrice),
        serviceType,
        serviceRegions: serviceRegions ? JSON.stringify(serviceRegions) : null,
      })
      .where(eq(schema.professionals.id, nutritionistId))
    return true
  } catch (err) {
    console.error('Error updating nutritionist settings:', err)
    return false
  }
}

function mapConsultation(row: typeof schema.consultations.$inferSelect): Consultation {
  return {
    id: row.id,
    nutritionist_id: row.nutritionistId || '',
    client_name: row.clientName || '',
    client_email: row.clientEmail || '',
    notes: row.notes || undefined,
    price: Number(row.price) || 0,
    status: (row.status as Consultation['status']) || 'paid',
    payment_id: row.paymentId || undefined,
    scheduled_date: row.scheduledDate || undefined,
    scheduled_time: row.scheduledTime || undefined,
    created_at: row.createdAt?.toISOString() || new Date().toISOString(),
    updated_at: row.updatedAt?.toISOString() || new Date().toISOString(),
  }
}

export function formatConsultationPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export function getServiceTypeLabel(serviceType: string): string {
  switch (serviceType) {
    case 'presencial':
      return 'Presencial'
    case 'online':
      return 'Online'
    case 'ambos':
      return 'Presencial + Online'
    default:
      return serviceType
  }
}
