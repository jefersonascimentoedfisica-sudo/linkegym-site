import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { canAccessUser, requireApiUser } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const email = searchParams.get('email')

    if (!canAccessUser(user, id, email)) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    if (id) {
      const rows = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1)
      return NextResponse.json({ data: rows?.[0] || null, error: null })
    }

    if (email) {
      const rows = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1)
      return NextResponse.json({ data: rows?.[0] || null, error: null })
    }

    return NextResponse.json({ data: null, error: 'Missing id or email' }, { status: 400 })
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
    if (body.id !== user.id || body.email?.toLowerCase() !== user.email?.toLowerCase()) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    const inserted = await db
      .insert(schema.users)
      .values({
        id: body.id,
        email: body.email,
        name: body.name,
        phone: body.phone,
        userType: body.user_type || 'student',
      })
      .returning()
    return NextResponse.json({ data: inserted?.[0], error: null })
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
    if (!canAccessUser(user, id)) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updates: Record<string, unknown> = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.phone !== undefined) updates.phone = body.phone
    if (body.image !== undefined) updates.image = body.image

    await db
      .update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, id))

    return NextResponse.json({ data: null, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
