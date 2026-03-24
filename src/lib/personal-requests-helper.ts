import { db } from './db'
import * as schema from './schema'
import { eq, desc } from 'drizzle-orm'

export interface PersonalRequest {
  id: string
  professional_id: string
  student_name: string
  student_email: string
  student_phone: string
  student_neighborhood: string
  objective: string
  availability: string
  notes: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  created_at: string
  updated_at: string
}

export interface ProfessionalPlan {
  id: string
  professional_id: string
  plan_type: 'basic' | 'ouro' | 'plus'
  max_photos: number
  max_regions: number
  has_verified_badge: boolean
  unlimited_leads: boolean
  has_statistics: boolean
  priority_search: boolean
  created_at: string
  updated_at: string
}

export async function createPersonalRequest(data: Omit<PersonalRequest, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const inserted = await db
      .insert(schema.personalRequests)
      .values({
        professionalId: data.professional_id,
        studentName: data.student_name,
        studentEmail: data.student_email,
        studentPhone: data.student_phone,
        studentNeighborhood: data.student_neighborhood,
        objective: data.objective,
        availability: data.availability,
        notes: data.notes,
        status: data.status,
      })
      .returning()
    return { success: true, data: inserted?.[0] }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
}

export async function getPersonalRequestsByProfessional(professionalId: string) {
  try {
    const data = await db
      .select()
      .from(schema.personalRequests)
      .where(eq(schema.personalRequests.professionalId, professionalId))
      .orderBy(desc(schema.personalRequests.createdAt))
    return { success: true, data: data || [] }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message, data: [] }
  }
}

export async function updatePersonalRequestStatus(
  requestId: string,
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
) {
  try {
    const updated = await db
      .update(schema.personalRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.personalRequests.id, requestId))
      .returning()
    return { success: true, data: updated?.[0] }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
}

export async function getPersonalRequestById(requestId: string) {
  try {
    const rows = await db
      .select()
      .from(schema.personalRequests)
      .where(eq(schema.personalRequests.id, requestId))
      .limit(1)
    return { success: true, data: rows?.[0] }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
}

export async function getProfessionalPlan(professionalId: string) {
  try {
    const rows = await db
      .select()
      .from(schema.professionalPlans)
      .where(eq(schema.professionalPlans.professionalId, professionalId))
      .limit(1)

    if (!rows?.[0]) {
      return {
        success: true,
        data: {
          plan_type: 'basic',
          max_photos: 3,
          max_regions: 5,
          has_verified_badge: false,
          unlimited_leads: false,
          has_statistics: false,
          priority_search: false,
        },
      }
    }

    return { success: true, data: rows[0] }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
}

export async function createOrUpdateProfessionalPlan(
  professionalId: string,
  planType: 'basic' | 'ouro' | 'plus'
) {
  try {
    const planConfig = getPlanConfig(planType)

    const existing = await db
      .select()
      .from(schema.professionalPlans)
      .where(eq(schema.professionalPlans.professionalId, professionalId))
      .limit(1)

    let result
    if (existing?.[0]) {
      result = await db
        .update(schema.professionalPlans)
        .set({ planType, ...planConfig, updatedAt: new Date() })
        .where(eq(schema.professionalPlans.professionalId, professionalId))
        .returning()
    } else {
      result = await db
        .insert(schema.professionalPlans)
        .values({ professionalId, planType, ...planConfig })
        .returning()
    }

    await db
      .update(schema.professionals)
      .set({ planType })
      .where(eq(schema.professionals.id, professionalId))

    return { success: true, data: result?.[0] }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
}

export function getPlanConfig(planType: 'basic' | 'ouro' | 'plus') {
  const configs = {
    basic: {
      maxPhotos: 3,
      maxRegions: 5,
      hasVerifiedBadge: false,
      unlimitedLeads: false,
      hasStatistics: false,
      prioritySearch: false,
    },
    ouro: {
      maxPhotos: 10,
      maxRegions: 15,
      hasVerifiedBadge: false,
      unlimitedLeads: false,
      hasStatistics: true,
      prioritySearch: true,
    },
    plus: {
      maxPhotos: 50,
      maxRegions: 999,
      hasVerifiedBadge: true,
      unlimitedLeads: true,
      hasStatistics: true,
      prioritySearch: true,
    },
  }

  return configs[planType]
}

export function getPlanLabel(planType: string): string {
  const labels: Record<string, string> = {
    basic: 'Plano Básico',
    ouro: 'Plano Ouro',
    plus: 'Plano Plus',
  }
  return labels[planType] || 'Plano Básico'
}

export function getPlanColor(planType: string): string {
  const colors: Record<string, string> = {
    basic: 'gray',
    ouro: 'yellow',
    plus: 'purple',
  }
  return colors[planType] || 'gray'
}

export function getPlanDescription(planType: string): string {
  const descriptions: Record<string, string> = {
    basic: 'Perfil simples com recursos básicos',
    ouro: 'Mais visibilidade e recursos avançados',
    plus: 'Máxima visibilidade e todos os recursos',
  }
  return descriptions[planType] || ''
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    accepted: 'Aceita',
    rejected: 'Rejeitada',
    completed: 'Concluída',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'yellow',
    accepted: 'green',
    rejected: 'red',
    completed: 'blue',
  }
  return colors[status] || 'gray'
}
