'use client'

import React, { createContext, useContext } from 'react'
import { useSession as useBetterAuthSession, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '@/lib/supabase-client'

interface AuthUser {
  id: string
  email: string
  name?: string
  [key: string]: unknown
}

interface AuthContextType {
  user: AuthUser | null
  session: unknown | null
  loading: boolean
  signUp: (email: string, password: string, userData: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>
  signOut: () => Promise<{ error: unknown }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: sessionData, isPending } = useBetterAuthSession()

  const user = sessionData?.user
    ? {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name,
      }
    : null

  const signUp = async (email: string, password: string, userData: Record<string, unknown>) => {
    return authSignUp(email, password, userData)
  }

  const signIn = async (email: string, password: string) => {
    return authSignIn(email, password)
  }

  const signOut = async () => {
    return authSignOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session: sessionData?.session ?? null,
        loading: isPending,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
