import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { canAccessUser, isAdmin, requireApiUser } from '@/lib/api-auth'

async function canAccessStudent(user: Awaited<ReturnType<typeof requireApiUser>>, studentId: string) {
  if (user instanceof NextResponse) return false
  if (isAdmin(user)) return true
  const rows = await db
    .select({ email: schema.students.email })
    .from(schema.students)
    .where(eq(schema.students.id, studentId))
    .limit(1)
  return Boolean(rows[0] && canAccessUser(user, null, rows[0].email))
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')

    if (!studentId) {
      return NextResponse.json({ data: [], error: null })
    }
    if (!(await canAccessStudent(user, studentId))) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    const data = await db
      .select()
      .from(schema.favorites)
      .where(eq(schema.favorites.studentId, studentId))
    return NextResponse.json({ data: data || [], error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const body = await request.json()
    if (!body.student_id || !(await canAccessStudent(user, body.student_id))) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    const inserted = await db
      .insert(schema.favorites)
      .values({
        studentId: body.student_id,
        professionalId: body.professional_id,
      })
      .returning()
    return NextResponse.json({ data: inserted?.[0], error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')
    const professionalId = searchParams.get('professional_id')

    if (!studentId || !professionalId) {
      return NextResponse.json({ error: 'Missing student_id or professional_id' }, { status: 400 })
    }
    if (!(await canAccessStudent(user, studentId))) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    await db
      .delete(schema.favorites)
      .where(
        and(
          eq(schema.favorites.studentId, studentId),
          eq(schema.favorites.professionalId, professionalId)
        )
      )
    return NextResponse.json({ data: null, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
