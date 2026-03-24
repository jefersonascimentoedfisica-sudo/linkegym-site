import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq, desc, asc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const orderBy = searchParams.get('orderBy') || 'createdAt'
    const orderDir = searchParams.get('orderDir') || 'desc'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const professionalType = searchParams.get('professional_type')

    if (id) {
      const rows = await db
        .select()
        .from(schema.professionals)
        .where(eq(schema.professionals.id, id))
        .limit(1)
      const row = rows?.[0]
      if (!row) {
        return NextResponse.json({ data: null, error: 'Not found' }, { status: 404 })
      }
      return NextResponse.json({ data: row, error: null })
    }

    let query = db.select().from(schema.professionals).$dynamic()

    if (professionalType) {
      query = query.where(eq(schema.professionals.professionalType, professionalType))
    }

    if (orderBy === 'rating') {
      query = query.orderBy(orderDir === 'asc' ? asc(schema.professionals.rating) : desc(schema.professionals.rating))
    } else {
      query = query.orderBy(desc(schema.professionals.createdAt))
    }

    if (limit) {
      query = query.limit(limit)
    }

    const data = await query
    return NextResponse.json({ data: data || [], error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any = {
      professionalType: body.professional_type,
      name: body.name,
      email: body.email,
      phone: body.phone,
      whatsapp: body.whatsapp,
      bio: body.bio,
      specialties: body.specialties,
      yearsExperience: body.years_experience,
      registrationNumber: body.cref || body.crn,
      registrationState: body.registration_state,
      residenceNeighborhood: body.residence_neighborhood,
      serviceType: body.service_type,
      serviceNeighborhoods: body.service_neighborhoods,
      lessonPrice: body.lesson_price?.toString(),
      consultationPrice: body.consultation_price?.toString(),
      instagram: body.instagram,
      rating: body.rating?.toString() || '0',
      totalReviews: body.review_count || 0,
      isActive: true,
    }
    if (body.user_id) {
      values.userId = body.user_id
    }
    const inserted = await db
      .insert(schema.professionals)
      .values(values)
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
    if (body.whatsapp !== undefined) updates.whatsapp = body.whatsapp
    if (body.instagram !== undefined) updates.instagram = body.instagram
    if (body.bio !== undefined) updates.bio = body.bio

    await db
      .update(schema.professionals)
      .set(updates)
      .where(eq(schema.professionals.id, id))

    return NextResponse.json({ data: null, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
