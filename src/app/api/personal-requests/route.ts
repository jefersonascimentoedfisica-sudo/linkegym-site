import { NextRequest, NextResponse } from 'next/server'
import {
  getPersonalRequestsByProfessional,
  updatePersonalRequestStatus,
  createPersonalRequest,
} from '@/lib/personal-requests-helper'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professional_id')

    if (!professionalId) {
      return NextResponse.json({ data: [], error: null })
    }

    const result = await getPersonalRequestsByProfessional(professionalId)
    if (!result.success) {
      return NextResponse.json({ data: [], error: result.error }, { status: 500 })
    }
    return NextResponse.json({ data: result.data, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: [], error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createPersonalRequest(body)
    if (!result.success) {
      return NextResponse.json({ data: null, error: result.error }, { status: 500 })
    }
    return NextResponse.json({ data: result.data, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    const body = await request.json()
    const result = await updatePersonalRequestStatus(id, body.status)
    if (!result.success) {
      return NextResponse.json({ data: null, error: result.error }, { status: 500 })
    }
    return NextResponse.json({ data: result.data, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
