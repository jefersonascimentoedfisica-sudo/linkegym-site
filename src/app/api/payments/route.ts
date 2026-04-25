import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { canAccessUser, isAdmin, requireApiUser } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')
    const professionalId = searchParams.get('professional_id')

    if (studentId) {
      // Get student email first
      const studentRows = await db
        .select({ email: schema.students.email })
        .from(schema.students)
        .where(eq(schema.students.id, studentId))
        .limit(1)

      if (!studentRows?.[0]) {
        return NextResponse.json({ data: [], error: null })
      }
      if (!canAccessUser(user, null, studentRows[0].email)) {
        return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
      }

      const data = await db
        .select()
        .from(schema.payments)
        .where(eq(schema.payments.studentEmail, studentRows[0].email))
        .orderBy(desc(schema.payments.createdAt))
      return NextResponse.json({ data: data || [], error: null })
    }

    if (professionalId) {
      if (!isAdmin(user)) {
        const professional = await db
          .select({ userId: schema.professionals.userId })
          .from(schema.professionals)
          .where(eq(schema.professionals.id, professionalId))
          .limit(1)
        if (!professional[0] || professional[0].userId !== user.id) {
          return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
        }
      }

      const data = await db
        .select()
        .from(schema.payments)
        .where(eq(schema.payments.professionalId, professionalId))
        .orderBy(desc(schema.payments.createdAt))
      return NextResponse.json({ data: data || [], error: null })
    }

    return NextResponse.json({ data: [], error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
