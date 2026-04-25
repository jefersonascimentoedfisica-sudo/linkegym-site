import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { requireApiUser } from '@/lib/api-auth'

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
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const body = await request.json()
    const rating = Number(body.rating)
    if (!body.professional_id || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ data: null, error: 'Invalid review payload' }, { status: 400 })
    }

    await db
      .insert(schema.reviews)
      .values({
        professionalId: body.professional_id,
        userId: user.id,
        rating,
        comment: body.comment,
      })
    return NextResponse.json({ data: null, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
