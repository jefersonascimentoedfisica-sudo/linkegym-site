import { NextRequest, NextResponse } from 'next/server'
import { getStudentByEmail, updateStudentProfile } from '@/lib/students-helper'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ data: null, error: 'Missing email' }, { status: 400 })
    }

    const student = await getStudentByEmail(email)
    return NextResponse.json({ data: student, error: null })
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
    const updated = await updateStudentProfile(id, body)
    return NextResponse.json({ data: updated, error: null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
