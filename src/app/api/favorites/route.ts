import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')

    if (!studentId) {
      return NextResponse.json({ data: [], error: null })
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
    const body = await request.json()
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
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')
    const professionalId = searchParams.get('professional_id')

    if (!studentId || !professionalId) {
      return NextResponse.json({ error: 'Missing student_id or professional_id' }, { status: 400 })
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
