import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

type ApiUser = {
  id: string
  email?: string | null
  role?: string | null
  userType?: string | null
}

export async function getApiUser(request: NextRequest): Promise<ApiUser | null> {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const user = session?.user as ApiUser | undefined
  return user?.id ? user : null
}

export async function requireApiUser(request: NextRequest): Promise<ApiUser | NextResponse> {
  const user = await getApiUser(request)
  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }
  return user
}

export function isAdmin(user: ApiUser) {
  return user.role === 'admin' || user.userType === 'admin'
}

export function canAccessUser(user: ApiUser, targetUserId?: string | null, targetEmail?: string | null) {
  if (isAdmin(user)) return true
  if (targetUserId && targetUserId === user.id) return true
  if (targetEmail && user.email && targetEmail.toLowerCase() === user.email.toLowerCase()) return true
  return false
}

