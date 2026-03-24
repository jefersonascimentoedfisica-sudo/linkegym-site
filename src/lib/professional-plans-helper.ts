import { db } from './db'
import * as schema from './schema'
import { eq } from 'drizzle-orm'

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
      'Até 10 leads/mês',
    ],
    color: 'gray',
    badge: 'Básico',
  },
  ouro: {
    name: 'Plano Ouro',
    price: 99.9,
    description: 'Para crescer seu negócio',
    features: [
      'Perfil destacado',
      'Até 10 fotos',
      'Até 5 regiões',
      'Melhor posicionamento',
      'Redes sociais integradas',
      'Leads ilimitados',
      'Estatísticas básicas',
    ],
    color: 'yellow',
    badge: 'Ouro',
  },
  plus: {
    name: 'Plano Plus',
    price: 199.9,
    description: 'Máximo destaque e recursos',
    features: [
      'Destaque máximo',
      'Fotos ilimitadas',
      'Todas as regiões',
      'Prioridade na busca',
      'Badge verificado',
      'Leads ilimitados',
      'Estatísticas completas',
      'Suporte prioritário',
      'Análise de conversão',
    ],
    color: 'purple',
    badge: 'Plus',
  },
}

export const getPlanLabel = (planType: PlanType): string => {
  return PLAN_FEATURES[planType].badge
}

export const getPlanColor = (planType: PlanType): string => {
  const colors: Record<PlanType, string> = {
    basic: 'bg-gray-100 text-gray-800',
    ouro: 'bg-yellow-100 text-yellow-800',
    plus: 'bg-purple-100 text-purple-800',
  }
  return colors[planType]
}

export const getPlanBorderColor = (planType: PlanType): string => {
  const colors: Record<PlanType, string> = {
    basic: 'border-gray-300',
    ouro: 'border-yellow-400',
    plus: 'border-purple-400',
  }
  return colors[planType]
}

export async function getProfessionalPlan(
  professionalId: string
): Promise<{ success: boolean; data?: ProfessionalPlan; error?: string }> {
  try {
    const rows = await db
      .select()
      .from(schema.professionalPlans)
      .where(eq(schema.professionalPlans.professionalId, professionalId))
      .limit(1)

    const row = rows?.find((r) => r.isActive) || rows?.[0]

    if (!row) {
      return {
        success: true,
        data: {
          id: 'default',
          professional_id: professionalId,
          plan_type: 'basic',
          is_active: true,
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }
    }

    return {
      success: true,
      data: {
        id: row.id,
        professional_id: row.professionalId,
        plan_type: (row.planType as PlanType) || 'basic',
        is_active: row.isActive ?? true,
        started_at: row.startedAt?.toISOString() || new Date().toISOString(),
        expires_at: row.expiresAt?.toISOString() || undefined,
        created_at: row.createdAt?.toISOString() || new Date().toISOString(),
        updated_at: row.updatedAt?.toISOString() || new Date().toISOString(),
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}

export async function createProfessionalPlan(
  professionalId: string,
  planType: PlanType,
  expiresAt?: string
): Promise<{ success: boolean; data?: ProfessionalPlan; error?: string }> {
  try {
    await db
      .update(schema.professionalPlans)
      .set({ isActive: false })
      .where(eq(schema.professionalPlans.professionalId, professionalId))

    const inserted = await db
      .insert(schema.professionalPlans)
      .values({
        professionalId,
        planType,
        isActive: true,
        startedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      })
      .returning()

    const row = inserted?.[0]
    if (!row) return { success: false, error: 'Failed to create plan' }

    return {
      success: true,
      data: {
        id: row.id,
        professional_id: row.professionalId,
        plan_type: (row.planType as PlanType) || planType,
        is_active: row.isActive ?? true,
        started_at: row.startedAt?.toISOString() || new Date().toISOString(),
        expires_at: row.expiresAt?.toISOString() || undefined,
        created_at: row.createdAt?.toISOString() || new Date().toISOString(),
        updated_at: row.updatedAt?.toISOString() || new Date().toISOString(),
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}

export async function upgradePlan(
  professionalId: string,
  newPlanType: PlanType
): Promise<{ success: boolean; data?: ProfessionalPlan; error?: string }> {
  return createProfessionalPlan(professionalId, newPlanType)
}

export async function cancelPlan(
  professionalId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(schema.professionalPlans)
      .set({ isActive: false })
      .where(eq(schema.professionalPlans.professionalId, professionalId))
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
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
    plus: Infinity,
  }
  return maxPhotos[planType]
}

export function getMaxRegions(planType: PlanType): number {
  const maxRegions: Record<PlanType, number> = {
    basic: 2,
    ouro: 5,
    plus: Infinity,
  }
  return maxRegions[planType]
}

export function getMaxLeadsPerMonth(planType: PlanType): number {
  const maxLeads: Record<PlanType, number> = {
    basic: 10,
    ouro: Infinity,
    plus: Infinity,
  }
  return maxLeads[planType]
}

export function hasVerifiedBadge(planType: PlanType): boolean {
  return planType === 'plus'
}

export function isPriority(planType: PlanType): boolean {
  return planType === 'plus'
}
