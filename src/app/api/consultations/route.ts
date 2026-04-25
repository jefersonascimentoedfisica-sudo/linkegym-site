import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { isAdmin, requireApiUser } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')
    const nutritionistId = searchParams.get('nutritionist_id')

    if (studentId) {
      if (!isAdmin(user) && studentId !== user.id) {
        return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
      }

      const data = await db
        .select()
        .from(schema.consultations)
        .where(eq(schema.consultations.studentId, studentId))
        .orderBy(desc(schema.consultations.createdAt))
      return NextResponse.json({ data: data || [], error: null })
    }

    if (nutritionistId) {
      if (!isAdmin(user)) {
        const professional = await db
          .select({ userId: schema.professionals.userId })
          .from(schema.professionals)
          .where(eq(schema.professionals.id, nutritionistId))
          .limit(1)
        if (!professional[0] || professional[0].userId !== user.id) {
          return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
        }
      }

      const data = await db
        .select()
        .from(schema.consultations)
        .where(eq(schema.consultations.nutritionistId, nutritionistId))
        .orderBy(desc(schema.consultations.createdAt))
      return NextResponse.json({ data: data || [], error: null })
    }

    return NextResponse.json({ data: [], error: null })
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
    const inserted = await db
      .insert(schema.consultations)
      .values({
        nutritionistId: body.nutritionist_id,
        studentId: user.id,
        clientName: body.client_name,
        clientEmail: user.email || body.client_email,
        price: body.price?.toString(),
        notes: body.notes,
        paymentId: body.payment_id,
        status: 'pending',
      })
      .returning()
    return NextResponse.json({ data: inserted?.[0], error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
