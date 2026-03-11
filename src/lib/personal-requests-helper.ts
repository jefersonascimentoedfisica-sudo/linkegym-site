import { supabase } from './supabase-client'

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

// Personal Requests Functions
export async function createPersonalRequest(data: Omit<PersonalRequest, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: request, error } = await supabase
      .from('personal_requests')
      .insert([data])
      .select()

    if (error) throw error
    return { success: true, data: request?.[0] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getPersonalRequestsByProfessional(professionalId: string) {
  try {
    const { data, error } = await supabase
      .from('personal_requests')
      .select('*')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function updatePersonalRequestStatus(
  requestId: string,
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
) {
  try {
    const { data, error } = await supabase
      .from('personal_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()

    if (error) throw error
    return { success: true, data: data?.[0] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getPersonalRequestById(requestId: string) {
  try {
    const { data, error } = await supabase
      .from('personal_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Professional Plans Functions
export async function getProfessionalPlan(professionalId: string) {
  try {
    const { data, error } = await supabase
      .from('professional_plans')
      .select('*')
      .eq('professional_id', professionalId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    
    // If no plan exists, return default basic plan
    if (!data) {
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
        }
      }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createOrUpdateProfessionalPlan(
  professionalId: string,
  planType: 'basic' | 'ouro' | 'plus'
) {
  try {
    const planConfig = getPlanConfig(planType)

    const { data, error } = await supabase
      .from('professional_plans')
      .upsert([
        {
          professional_id: professionalId,
          plan_type: planType,
          ...planConfig,
          updated_at: new Date().toISOString(),
        }
      ], { onConflict: 'professional_id' })
      .select()

    if (error) throw error

    // Also update the professionals table
    await supabase
      .from('professionals')
      .update({ plan_type: planType })
      .eq('id', professionalId)

    return { success: true, data: data?.[0] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export function getPlanConfig(planType: 'basic' | 'ouro' | 'plus') {
  const configs = {
    basic: {
      max_photos: 3,
      max_regions: 5,
      has_verified_badge: false,
      unlimited_leads: false,
      has_statistics: false,
      priority_search: false,
    },
    ouro: {
      max_photos: 10,
      max_regions: 15,
      has_verified_badge: false,
      unlimited_leads: false,
      has_statistics: true,
      priority_search: true,
    },
    plus: {
      max_photos: 50,
      max_regions: 999,
      has_verified_badge: true,
      unlimited_leads: true,
      has_statistics: true,
      priority_search: true,
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
