import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq, and, asc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professional_id')
    const studentId = searchParams.get('student_id')

    if (professionalId) {
      const data = await db
        .select()
        .from(schema.bookings)
        .where(eq(schema.bookings.professionalId, professionalId))
        .orderBy(asc(schema.bookings.bookingDate))
      return NextResponse.json({ data: data || [], error: null })
    }

    if (studentId) {
      const data = await db
        .select()
        .from(schema.bookings)
        .where(eq(schema.bookings.studentId, studentId))
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
    const body = await request.json()
    const inserted = await db
      .insert(schema.bookings)
      .values({
        professionalId: body.professional_id,
        studentName: body.student_name,
        studentEmail: body.student_email,
        bookingDate: body.booking_date,
        bookingTime: body.booking_time,
        notes: body.notes,
        status: body.status || 'pending',
      })
      .returning()
    const row = inserted?.[0]
    return NextResponse.json({ data: [row], error: null })
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
    const updates: Record<string, unknown> = {}
    if (body.status !== undefined) updates.status = body.status
    if (body.booking_date !== undefined) updates.bookingDate = body.booking_date
    if (body.booking_time !== undefined) updates.bookingTime = body.booking_time

    await db
      .update(schema.bookings)
      .set(updates)
      .where(eq(schema.bookings.id, id))

    return NextResponse.json({ data: null, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
