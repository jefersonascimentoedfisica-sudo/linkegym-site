import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'https://linkegymbrasil.com.br',
})

export const { signIn: authSignIn, signUp: authSignUp, signOut: authSignOut, useSession } = authClient

// Compatibility shim for legacy code that calls signUp/signIn/signOut directly
export const signUp = async (email: string, password: string, userData: { name?: string; [key: string]: unknown }) => {
  try {
    const result = await authClient.signUp.email({
      email,
      password,
      name: userData?.name || email,
    })
    return { data: result.data, error: result.error }
  } catch (err: unknown) {
    return { data: null, error: err }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const result = await authClient.signIn.email({ email, password })
    return { data: result.data, error: result.error }
  } catch (err: unknown) {
    return { data: null, error: err }
  }
}

export const signOut = async () => {
  try {
    const result = await authClient.signOut()
    return { error: result.error }
  } catch (err: unknown) {
    return { error: err }
  }
}

export const getSession = async () => {
  try {
    const result = await authClient.getSession()
    return { data: { session: result.data?.session }, error: result.error }
  } catch (err: unknown) {
    return { data: { session: null }, error: err }
  }
}

export const getCurrentUser = async () => {
  try {
    const result = await authClient.getSession()
    return { data: { user: result.data?.user }, error: result.error }
  } catch (err: unknown) {
    return { data: { user: null }, error: err }
  }
}
