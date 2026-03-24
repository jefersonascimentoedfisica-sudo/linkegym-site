import { NextRequest, NextResponse } from 'next/server'
import { getProfessionalPlan } from '@/lib/professional-plans-helper'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professional_id')

    if (!professionalId) {
      return NextResponse.json({ data: null, error: 'Missing professional_id' }, { status: 400 })
    }

    const result = await getProfessionalPlan(professionalId)
    if (!result.success) {
      return NextResponse.json({ data: null, error: result.error }, { status: 500 })
    }
    return NextResponse.json({ data: result.data, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
