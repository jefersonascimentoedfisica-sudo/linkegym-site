'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FavoriteProfessionalsProps {
  favorites: any[]
  studentId: string
}

export default function FavoriteProfessionals({
  favorites,
  studentId,
}: FavoriteProfessionalsProps) {
  const [favoritesList, setFavoritesList] = useState(favorites)
  const [loading, setLoading] = useState(false)

  const handleRemoveFavorite = async (professionalId: string) => {
    if (!confirm('Tem certeza que deseja remover dos favoritos?')) return

    try {
      setLoading(true)
      const res = await fetch(`/api/favorites?student_id=${studentId}&professional_id=${professionalId}`, { method: 'DELETE' })
      const success = res.ok
      if (success) {
        setFavoritesList(favoritesList.filter(f => f.professional_id !== professionalId))
      }
    } catch (err) {
      console.error('Error removing favorite:', err)
    } finally {
      setLoading(false)
    }
  }

  if (favoritesList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">⭐</div>
        <p className="text-gray-600 text-lg mb-6">Você não tem profissionais favoritos</p>
        <Link
          href="/search-professionals"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Buscar Profissionais
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profissionais Favoritos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favoritesList.map(favorite => {
          const prof = favorite.professionals
          const isPT = prof.professional_type === 'personal_trainer'

          return (
            <div
              key={favorite.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {isPT ? '💪' : '🥗'} {prof.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isPT ? 'Personal Trainer' : 'Nutricionista'}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(prof.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 font-bold disabled:text-gray-400"
                >
                  ✕
                </button>
              </div>

              {prof.bio && (
                <p className="text-gray-600 mb-4 line-clamp-2">{prof.bio}</p>
              )}

              {prof.rating && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-bold text-gray-900">{prof.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-600">({prof.review_count} avaliações)</span>
                </div>
              )}

              {prof.years_experience && (
                <p className="text-sm text-gray-600 mb-4">
                  📅 {prof.years_experience} anos de experiência
                </p>
              )}

              {isPT && prof.lesson_price && (
                <p className="text-lg font-bold text-blue-600 mb-4">
                  R$ {prof.lesson_price.toFixed(2)}
                </p>
              )}

              {!isPT && prof.consultation_price && (
                <p className="text-lg font-bold text-green-600 mb-4">
                  R$ {prof.consultation_price.toFixed(2)}
                </p>
              )}

              <div className="flex gap-3">
                <Link
                  href={`/professional/${prof.id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center transition"
                >
                  Ver Perfil
                </Link>
                {prof.whatsapp && (
                  <a
                    href={`https://wa.me/${prof.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-center transition"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
