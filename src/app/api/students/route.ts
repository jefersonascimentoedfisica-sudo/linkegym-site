import { NextRequest, NextResponse } from 'next/server'
import { getStudentByEmail, updateStudentProfile } from '@/lib/students-helper'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { canAccessUser, isAdmin, requireApiUser } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ data: null, error: 'Missing email' }, { status: 400 })
    }
    if (!canAccessUser(user, null, email)) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    const student = await getStudentByEmail(email)
    return NextResponse.json({ data: student, error: null })
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
    if (!isAdmin(user)) {
      const rows = await db
        .select({ email: schema.students.email })
        .from(schema.students)
        .where(eq(schema.students.id, id))
        .limit(1)

      if (!rows[0]) return NextResponse.json({ data: null, error: 'Not found' }, { status: 404 })
      if (!canAccessUser(user, null, rows[0].email)) {
        return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
      }
    }

    const body = await request.json()
    const updated = await updateStudentProfile(id, body)
    return NextResponse.json({ data: updated, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
