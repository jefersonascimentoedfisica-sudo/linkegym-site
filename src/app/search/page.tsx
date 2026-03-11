'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

// Mock data - In production, this would come from Supabase
const MOCK_PROFESSIONALS = [
  {
    id: 1,
    name: 'Carlos Silva',
    type: 'personal_trainer',
    neighborhood: 'Vila Galvão',
    rating: 4.9,
    reviews: 127,
    specialties: ['Musculação', 'Emagrecimento', 'Hipertrofia'],
    cref: '123456/SP',
    photo: '👨‍🏫',
    bio: 'Personal trainer com 10 anos de experiência',
    whatsapp: '11999999999',
    instagram: '@carlossilva_pt',
    priority: 1,
  },
  {
    id: 2,
    name: 'Ana Costa',
    type: 'nutritionist',
    neighborhood: 'Vila Galvão',
    rating: 4.8,
    reviews: 95,
    specialties: ['Emagrecimento', 'Nutrição Esportiva'],
    crn: '654321/SP',
    photo: '👩‍⚕️',
    bio: 'Nutricionista especializada em performance',
    whatsapp: '11988888888',
    instagram: '@anacosta_nutri',
    priority: 1,
  },
  {
    id: 3,
    name: 'João Santos',
    type: 'personal_trainer',
    neighborhood: 'Vila Galvão',
    rating: 4.7,
    reviews: 82,
    specialties: ['Funcional', 'Reabilitação'],
    cref: '789012/SP',
    photo: '👨‍🏫',
    bio: 'Especialista em treinamento funcional',
    whatsapp: '11977777777',
    instagram: '@joaosantos_pt',
    priority: 2,
  },
  {
    id: 4,
    name: 'Maria Oliveira',
    type: 'nutritionist',
    neighborhood: 'Maia',
    rating: 4.6,
    reviews: 68,
    specialties: ['Nutrição Clínica', 'Diabetes'],
    crn: '345678/SP',
    photo: '👩‍⚕️',
    bio: 'Nutricionista clínica com foco em saúde',
    whatsapp: '11966666666',
    instagram: '@marianutri',
    priority: 1,
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'personal_trainer'
  const neighborhood = searchParams.get('neighborhood') || ''

  const filteredProfessionals = MOCK_PROFESSIONALS.filter((prof) => {
    const typeMatch = prof.type === type
    const neighborhoodMatch = !neighborhood || prof.neighborhood === neighborhood
    return typeMatch && neighborhoodMatch
  }).sort((a, b) => a.priority - b.priority)

  return (
    <div className="min-h-screen bg-gray-50">
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
          <Link href="/" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
            ← Voltar
          </Link>
        </div>
      </nav>

      {/* Search Info */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {type === 'personal_trainer' ? '💪 Personal Trainers' : '🥗 Nutricionistas'} em {neighborhood || 'Guarulhos'}
          </h1>
          <p className="text-gray-600">
            {filteredProfessionals.length} profissional{filteredProfessionals.length !== 1 ? 'is' : ''} encontrado{filteredProfessionals.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600 mb-4">Nenhum profissional encontrado</p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Voltar à busca
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((prof) => (
              <div key={prof.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                {/* Photo */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-48 flex items-center justify-center text-6xl">
                  {prof.photo}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{prof.name}</h3>
                      <p className="text-sm text-gray-600">
                        {type === 'personal_trainer' ? 'Personal Trainer' : 'Nutricionista'}
                      </p>
                    </div>
                    {prof.priority === 1 && (
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">
                        ⭐ Destaque
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {'⭐'.repeat(Math.floor(prof.rating))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{prof.rating}</span>
                    <span className="text-sm text-gray-600">({prof.reviews} avaliações)</span>
                  </div>

                  {/* Neighborhood */}
                  <p className="text-sm text-gray-600 mb-3">
                    📍 {prof.neighborhood}
                  </p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Especialidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {prof.specialties.map((spec, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Registration */}
                  <p className="text-xs text-gray-600 mb-4">
                    {type === 'personal_trainer' ? `CREF: ${prof.cref}` : `CRN: ${prof.crn}`} ✅
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/professional/${prof.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center transition"
                    >
                      Ver Perfil
                    </Link>
                    <a
                      href={`https://wa.me/${prof.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-center transition"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
