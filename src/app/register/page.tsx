'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  useEffect(() => {
    if (type === 'professional') {
      router.push('/register/professional')
    } else if (type === 'student') {
      router.push('/register/student')
    }
  }, [type, router])

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-white">LinkeGym</Link>
          <Link href="/" className="text-white hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition">
            ← Voltar
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Escolha seu tipo de cadastro
          </h1>
          <p className="text-xl text-blue-100">
            Selecione se você é um aluno ou um profissional
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Student Card */}
          <Link href="/register/student">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer h-full">
              <div className="text-6xl mb-4 text-center">👨‍🎓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Sou Aluno</h2>
              <p className="text-gray-600 text-center mb-6">
                Procuro profissionais de saúde e fitness para melhorar minha performance
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2 font-semibold">Você poderá:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Buscar profissionais próximos</li>
                  <li>✓ Ver perfis completos</li>
                  <li>✓ Entrar em contato via WhatsApp</li>
                  <li>✓ Deixar avaliações</li>
                </ul>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
                Cadastrar como Aluno →
              </button>
            </div>
          </Link>

          {/* Professional Card */}
          <Link href="/register/professional">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer h-full border-2 border-orange-500">
              <div className="text-6xl mb-4 text-center">💪</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Sou Profissional</h2>
              <p className="text-gray-600 text-center mb-6">
                Sou Personal Trainer ou Nutricionista e quero oferecer meus serviços
              </p>
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2 font-semibold">Você poderá:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Criar perfil profissional</li>
                  <li>✓ Definir bairros de atendimento</li>
                  <li>✓ Receber contatos de alunos</li>
                  <li>✓ Acompanhar ganhos</li>
                </ul>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition">
                Cadastrar como Profissional →
              </button>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-white">
            Já tem conta?{' '}
            <Link href="/login" className="font-bold hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
