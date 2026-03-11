'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

const GUARULHOS_NEIGHBORHOODS = [
  'Centro', 'Vila Galvão', 'Maia', 'Picanço', 'Bonsucesso',
  'Cumbica', 'Taboão', 'Cocaia', 'Pimentas', 'São João',
  'Jardim Adriana', 'Gopoúva', 'Vila Augusta', 'Vila Rio',
  'Jardim Tranquilidade', 'Parque Cecap', 'Jardim São Paulo',
  'Vila Endres', 'Jardim Santa Mena', 'Parque Continental'
]

interface Professional {
  id: string
  name: string
  professional_type: string
  bio: string
  specialties: string[]
  lesson_price?: number
  consultation_price?: number
  rating: number
  review_count: number
  whatsapp: string
}

export default function Home() {
  const router = useRouter()
  const [professionalType, setProfessionalType] = useState('personal_trainer')
  const [neighborhood, setNeighborhood] = useState('')
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const fetchProfessionals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6)

      if (error) throw error
      setProfessionals(data || [])
      setFilteredProfessionals(data || [])
    } catch (err) {
      console.error('Error fetching professionals:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    router.push('/search-professionals')
  }

  const ProfessionalCard = ({ prof }: { prof: Professional }) => {
    const isPT = prof.professional_type === 'personal_trainer'
    const price = isPT ? prof.lesson_price : prof.consultation_price
    const priceLabel = isPT ? 'Aula' : 'Consulta'

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden border border-gray-200">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{prof.name}</h3>
              <p className="text-sm text-blue-100">
                {isPT ? '💪 Personal Trainer' : '🥗 Nutricionista'}
              </p>
            </div>
            {prof.rating > 0 && (
              <div className="text-right">
                <div className="text-xl font-bold">⭐ {prof.rating.toFixed(1)}</div>
                <p className="text-xs text-blue-100">({prof.review_count})</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Bio */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{prof.bio}</p>

          {/* Specialties */}
          {prof.specialties && prof.specialties.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {prof.specialties.slice(0, 2).map((spec, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
                {prof.specialties.length > 2 && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    +{prof.specialties.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          {price && (
            <div className="mb-4 p-2 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600">{priceLabel}</p>
              <p className="text-xl font-bold text-green-600">
                R$ {price.toFixed(2)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Link
              href={`/professional/${prof.id}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center transition block text-sm"
            >
              Ver Perfil
            </Link>
            {prof.whatsapp && (
              <a
                href={`https://wa.me/${prof.whatsapp.replace(/\D/g, '')}?text=Olá! Encontrei seu perfil no LinkeGym e gostaria de saber mais.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-center transition block text-sm"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
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
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">Sobre</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contato</Link>
          </div>
          <div className="flex gap-3">
            <Link href="/student-dashboard" className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg font-medium">
              📊 Dashboard
            </Link>
            <Link href="/professional-requests" className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium">
              💪 Solicitações
            </Link>
            <Link href="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
              Cadastro
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Conectando você à saúde e performance.
            </h1>
            <p className="text-xl text-blue-100">
              Encontre personal trainers e nutricionistas próximos de você.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              {/* Professional Type */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tipo de Profissional</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setProfessionalType('personal_trainer')}
                    className={`p-3 rounded-lg border-2 font-medium transition ${
                      professionalType === 'personal_trainer'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    💪 Personal Trainer
                  </button>
                  <button
                    onClick={() => setProfessionalType('nutritionist')}
                    className={`p-3 rounded-lg border-2 font-medium transition ${
                      professionalType === 'nutritionist'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    🥗 Nutricionista
                  </button>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Cidade</label>
                <input
                  type="text"
                  value="Guarulhos, SP"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
                />
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Bairro</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700"
                >
                  <option value="">Selecione um bairro...</option>
                  {GUARULHOS_NEIGHBORHOODS.map((bairro) => (
                    <option key={bairro} value={bairro}>
                      {bairro}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
              >
                🔍 Encontrar Profissionais
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Professionals Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Profissionais em Destaque
            </h2>
            <p className="text-lg text-gray-600">
              Conheça alguns dos melhores profissionais de Guarulhos
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="text-gray-600 mt-4">Carregando profissionais...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {professionals.map(prof => (
                  <ProfessionalCard key={prof.id} prof={prof} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/search-professionals"
                  className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                >
                  Ver Todos os Profissionais →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-600 font-medium">Profissionais Verificados</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
              <p className="text-gray-600 font-medium">Clientes Satisfeitos</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.9★</div>
              <p className="text-gray-600 font-medium">Avaliação Média</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600 font-medium">Suporte Disponível</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Por que escolher LinkeGym?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', title: 'Busca Inteligente', desc: 'Encontre profissionais por especialidade, bairro e modalidade' },
              { icon: '✅', title: 'Profissionais Verificados', desc: 'Todos com registro profissional validado (CREF/CRN)' },
              { icon: '💬', title: 'Contato Direto', desc: 'Comunique-se via WhatsApp e redes sociais' },
              { icon: '📍', title: 'Próximos de Você', desc: 'Profissionais organizados por bairro e prioridade' },
              { icon: '⭐', title: 'Avaliações Reais', desc: 'Veja opiniões de clientes reais' },
              { icon: '📱', title: 'Mobile-First', desc: 'Acesse de qualquer lugar, a qualquer hora' },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Transformar Sua Saúde?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Conecte-se com os melhores profissionais de Guarulhos hoje mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-lg transition"
            >
              Começar Agora
            </button>
            <Link
              href="/register?type=professional"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
            >
              Sou Profissional
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 text-2xl">LinkeGym</h3>
              <p className="text-sm">Conectando você à saúde e performance.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Alunos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/search-professionals" className="hover:text-white">Buscar Profissionais</Link></li>
                <li><Link href="/about" className="hover:text-white">Sobre</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Profissionais</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register?type=professional" className="hover:text-white">Cadastre-se</Link></li>
                <li><Link href="/about" className="hover:text-white">Como Funciona</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-white">Fale Conosco</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 LinkeGym. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
