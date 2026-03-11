import { supabase } from './supabase-client'

export type PlanType = 'basic' | 'ouro' | 'plus'

export interface ProfessionalPlan {
  id: string
  professional_id: string
  plan_type: PlanType
  is_active: boolean
  started_at: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export const PLAN_FEATURES = {
  basic: {
    name: 'Plano Básico',
    price: 0,
    description: 'Perfeito para começar',
    features: [
      'Perfil simples',
      'Até 3 fotos',
      'Até 2 regiões',
      'Visibilidade padrão',
      'Sem badge verificado',
      'Até 10 leads/mês'
    ],
    color: 'gray',
    badge: '🆓 Básico'
  },
  ouro: {
    name: 'Plano Ouro',
    price: 99.90,
    description: 'Para crescer seu negócio',
    features: [
      'Perfil destacado',
      'Até 10 fotos',
      'Até 5 regiões',
      'Melhor posicionamento',
      'Redes sociais integradas',
      'Leads ilimitados',
      'Estatísticas básicas'
    ],
    color: 'yellow',
    badge: '⭐ Ouro'
  },
  plus: {
    name: 'Plano Plus',
    price: 199.90,
    description: 'Máximo destaque e recursos',
    features: [
      'Destaque máximo',
      'Fotos ilimitadas',
      'Todas as regiões',
      'Prioridade na busca',
      'Badge verificado ✓',
      'Leads ilimitados',
      'Estatísticas completas',
      'Suporte prioritário',
      'Análise de conversão'
    ],
    color: 'purple',
    badge: '👑 Plus'
  }
}

export const getPlanLabel = (planType: PlanType): string => {
  return PLAN_FEATURES[planType].badge
}

export const getPlanColor = (planType: PlanType): string => {
  const colors: Record<PlanType, string> = {
    basic: 'bg-gray-100 text-gray-800',
    ouro: 'bg-yellow-100 text-yellow-800',
    plus: 'bg-purple-100 text-purple-800'
  }
  return colors[planType]
}

export const getPlanBorderColor = (planType: PlanType): string => {
  const colors: Record<PlanType, string> = {
    basic: 'border-gray-300',
    ouro: 'border-yellow-400',
    plus: 'border-purple-400'
  }
  return colors[planType]
}

export async function getProfessionalPlan(professionalId: string): Promise<{ success: boolean; data?: ProfessionalPlan; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('professional_plans')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    // If no active plan, return basic
    if (!data) {
      return {
        success: true,
        data: {
          id: 'default',
          professional_id: professionalId,
          plan_type: 'basic',
          is_active: true,
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    }

    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function createProfessionalPlan(
  professionalId: string,
  planType: PlanType,
  expiresAt?: string
): Promise<{ success: boolean; data?: ProfessionalPlan; error?: string }> {
  try {
    // Deactivate any existing plans
    await supabase
      .from('professional_plans')
      .update({ is_active: false })
      .eq('professional_id', professionalId)

    // Create new plan
    const { data, error } = await supabase
      .from('professional_plans')
      .insert({
        professional_id: professionalId,
        plan_type: planType,
        is_active: true,
        started_at: new Date().toISOString(),
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function upgradePlan(
  professionalId: string,
  newPlanType: PlanType
): Promise<{ success: boolean; data?: ProfessionalPlan; error?: string }> {
  return createProfessionalPlan(professionalId, newPlanType)
}

export async function cancelPlan(professionalId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('professional_plans')
      .update({ is_active: false })
      .eq('professional_id', professionalId)

    if (error) throw error

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export function canAccessFeature(planType: PlanType, feature: string): boolean {
  const features = PLAN_FEATURES[planType].features
  return features.includes(feature)
}

export function getMaxPhotos(planType: PlanType): number {
  const maxPhotos: Record<PlanType, number> = {
    basic: 3,
    ouro: 10,
    plus: Infinity
  }
  return maxPhotos[planType]
}

export function getMaxRegions(planType: PlanType): number {
  const maxRegions: Record<PlanType, number> = {
    basic: 2,
    ouro: 5,
    plus: Infinity
  }
  return maxRegions[planType]
}

export function getMaxLeadsPerMonth(planType: PlanType): number {
  const maxLeads: Record<PlanType, number> = {
    basic: 10,
    ouro: Infinity,
    plus: Infinity
  }
  return maxLeads[planType]
}

export function hasVerifiedBadge(planType: PlanType): boolean {
  return planType === 'plus'
}

export function isPriority(planType: PlanType): boolean {
  return planType === 'plus'
}
