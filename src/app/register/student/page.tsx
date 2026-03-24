'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/db'
import * as schema from '@/lib/schema'

export default function StudentRegister() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não correspondem!')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        user_type: 'student',
      })

      if (signUpError) {
        const errMsg = signUpError instanceof Error ? signUpError.message : String(signUpError)
        setError(errMsg)
        setLoading(false)
        return
      }

      const userData = data as { user?: { id?: string } } | null
      if (userData?.user?.id) {
        try {
          await db.insert(schema.users).values({
            id: userData.user.id,
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            userType: 'student',
          })
        } catch (dbErr: unknown) {
          const msg = dbErr instanceof Error ? dbErr.message : String(dbErr)
          setError(msg)
          setLoading(false)
          return
        }
      }

      setSubmitted(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo à LinkeGym!</h1>
          <p className="text-gray-600 mb-6">
            Sua conta foi criada com sucesso. Você será redirecionado em breve...
          </p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402727665/W9B2DZe626mJSzUHcntkhr/linkegym-logo_5dc03736.png"
              alt="LinkeGym Logo"
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <p className="text-xs text-gray-600 leading-tight">Conectando você à</p>
              <p className="text-xs text-gray-600 leading-tight">saúde e performance.</p>
            </div>
          </Link>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Voltar
          </Link>
        </div>
      </nav>

      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Aluno</h1>
          <p className="text-gray-600 mb-8">
            Crie sua conta para começar a buscar profissionais
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Seu nome completo" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Senha *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition mt-6">
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Faça login
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
