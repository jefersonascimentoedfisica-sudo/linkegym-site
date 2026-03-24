import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
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

      const data = await db
        .select()
        .from(schema.payments)
        .where(eq(schema.payments.studentEmail, studentRows[0].email))
        .orderBy(desc(schema.payments.createdAt))
      return NextResponse.json({ data: data || [], error: null })
    }

    if (professionalId) {
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
