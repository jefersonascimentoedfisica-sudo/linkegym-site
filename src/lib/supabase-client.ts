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

// ============================================================
// Supabase-compatible shim for legacy client-side code
// Routes all data operations through internal Next.js API routes
// ============================================================

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

const buildApiUrl = (path: string) => {
  if (typeof window !== 'undefined') {
    return new URL(path, window.location.origin)
  }
  return new URL(path, getBaseUrl())
}

type QueryResult<T = unknown> = { data: T | null; error: Error | null }

class QueryBuilder<T = Record<string, unknown>> {
  private table: string
  private filters: Record<string, unknown> = {}
  private _orderBy: string | null = null
  private _orderDir: string = 'desc'
  private _limit: number | null = null
  private _single = false
  private _select = '*'

  constructor(table: string) {
    this.table = table
  }

  select(fields = '*') {
    this._select = fields
    return this
  }

  eq(field: string, value: unknown) {
    this.filters[field] = value
    return this
  }

  order(field: string, options: { ascending?: boolean } = {}) {
    this._orderBy = field
    this._orderDir = options.ascending === false ? 'desc' : 'asc'
    return this
  }

  limit(n: number) {
    this._limit = n
    return this
  }

  single() {
    this._single = true
    return this
  }

  insert(rows: unknown) {
    return new InsertBuilder(this.table, Array.isArray(rows) ? rows : [rows])
  }

  update(data: Record<string, unknown>) {
    return new UpdateBuilder(this.table, data, this.filters)
  }

  async then(resolve: (value: QueryResult<T>) => void, reject?: (reason: unknown) => void) {
    try {
      const url = buildApiUrl(`/api/${this.table}`)
      for (const [k, v] of Object.entries(this.filters)) {
        url.searchParams.set(k, String(v))
      }
      if (this._orderBy) url.searchParams.set('orderBy', this._orderBy)
      url.searchParams.set('orderDir', this._orderDir)
      if (this._limit) url.searchParams.set('limit', String(this._limit))

      const res = await fetch(url.toString())
      const json = await res.json()

      if (json.error && !res.ok) {
        resolve({ data: null, error: new Error(json.error) })
        return
      }

      if (this._single) {
        const item = Array.isArray(json.data) ? json.data[0] : json.data
        resolve({ data: item ?? null, error: null })
      } else {
        resolve({ data: json.data ?? [], error: null })
      }
    } catch (err: unknown) {
      if (reject) reject(err)
      else resolve({ data: null, error: err as Error })
    }
  }
}

class InsertBuilder {
  private table: string
  private rows: unknown[]

  constructor(table: string, rows: unknown[]) {
    this.table = table
    this.rows = rows
  }

  select() {
    return this
  }

  async then(resolve: (value: QueryResult) => void, reject?: (reason: unknown) => void) {
    try {
      const res = await fetch(`${getBaseUrl()}/api/${this.table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.rows[0]),
      })
      const json = await res.json()
      if (json.error && !res.ok) {
        resolve({ data: null, error: new Error(json.error) })
        return
      }
      resolve({ data: json.data, error: null })
    } catch (err: unknown) {
      if (reject) reject(err)
      else resolve({ data: null, error: err as Error })
    }
  }
}

class UpdateBuilder {
  private table: string
  private data: Record<string, unknown>
  private filters: Record<string, unknown>

  constructor(table: string, data: Record<string, unknown>, filters: Record<string, unknown>) {
    this.table = table
    this.data = data
    this.filters = filters
  }

  eq(field: string, value: unknown) {
    this.filters[field] = value
    return this
  }

  async then(resolve: (value: QueryResult) => void, reject?: (reason: unknown) => void) {
    try {
      const url = buildApiUrl(`/api/${this.table}`)
      for (const [k, v] of Object.entries(this.filters)) {
        url.searchParams.set(k, String(v))
      }
      const res = await fetch(url.toString(), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data),
      })
      const json = await res.json()
      if (json.error && !res.ok) {
        resolve({ data: null, error: new Error(json.error) })
        return
      }
      resolve({ data: json.data, error: null })
    } catch (err: unknown) {
      if (reject) reject(err)
      else resolve({ data: null, error: err as Error })
    }
  }
}

class StorageShim {
  from(bucket: string) {
    void bucket
    return {
      upload: async (pathName: string, file: unknown) => {
        void pathName
        void file
        return { data: null, error: new Error('Storage não disponível') }
      },
      getPublicUrl: (pathName: string) => {
        void pathName
        return { data: { publicUrl: '' } }
      },
    }
  }
}

class SupabaseShim {
  storage = new StorageShim()

  // Legacy client components still expect Supabase's broad dynamic typing.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from(table: string): any {
    const builder = new QueryBuilder(table)
    return {
      select: (fields?: string) => builder.select(fields),
      insert: (rows: unknown) => new InsertBuilder(table, Array.isArray(rows) ? rows : [rows]),
      update: (data: Record<string, unknown>) => new UpdateBuilder(table, data, {}),
    }
  }
}

export const supabase = new SupabaseShim()
