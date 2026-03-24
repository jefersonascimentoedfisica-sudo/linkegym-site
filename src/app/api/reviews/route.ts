import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professional_id')

    if (!professionalId) {
      return NextResponse.json({ data: [], error: null })
    }

    const data = await db
      .select()
      .from(schema.reviews)
      .where(eq(schema.reviews.professionalId, professionalId))
      .orderBy(desc(schema.reviews.createdAt))

    return NextResponse.json({ data: data || [], error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await db
      .insert(schema.reviews)
      .values({
        professionalId: body.professional_id,
        rating: body.rating,
        comment: body.comment,
      })
    return NextResponse.json({ data: null, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
