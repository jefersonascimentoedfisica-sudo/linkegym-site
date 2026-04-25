import { NextRequest, NextResponse } from 'next/server'
import {
  getPersonalRequestsByProfessional,
  getPersonalRequestById,
  updatePersonalRequestStatus,
  createPersonalRequest,
} from '@/lib/personal-requests-helper'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { isAdmin, requireApiUser } from '@/lib/api-auth'

async function canAccessProfessional(user: Awaited<ReturnType<typeof requireApiUser>>, professionalId: string) {
  if (user instanceof NextResponse) return false
  if (isAdmin(user)) return true
  const rows = await db
    .select({ userId: schema.professionals.userId })
    .from(schema.professionals)
    .where(eq(schema.professionals.id, professionalId))
    .limit(1)
  return rows[0]?.userId === user.id
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professional_id')

    if (!professionalId) {
      return NextResponse.json({ data: [], error: null })
    }
    if (!(await canAccessProfessional(user, professionalId))) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
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
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    const existing = await getPersonalRequestById(id)
    if (!existing.success || !existing.data?.professionalId) {
      return NextResponse.json({ data: null, error: 'Not found' }, { status: 404 })
    }
    if (!(await canAccessProfessional(user, existing.data.professionalId))) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
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
