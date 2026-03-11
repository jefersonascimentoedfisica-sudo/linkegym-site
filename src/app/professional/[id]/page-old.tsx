'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import ReviewsSection from '@/components/ReviewsSection'
import BookingModal from '@/components/BookingModal'
import ConsultationPaymentModal from '@/components/ConsultationPaymentModal'
import ConsultationConfirmation from '@/components/ConsultationConfirmation'
import { formatConsultationPrice, getServiceTypeLabel } from '@/lib/consultations-helper'

export default function ProfessionalProfile() {
  const params = useParams()
  const id = params.id as string
  const [professional, setProfessional] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showConsultationPaymentModal, setShowConsultationPaymentModal] = useState(false)
  const [showConsultationConfirmation, setShowConsultationConfirmation] = useState(false)
  const [consultationClientName, setConsultationClientName] = useState('')

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('professionals')
          .select('*')
          .eq('id', id)
          .single()

        if (err) throw err
        if (!data) throw new Error('Profissional não encontrado')

        setProfessional(data)
      } catch (err: any) {
        console.error('Error fetching professional:', err)
        setError(err.message || 'Erro ao carregar profissional')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProfessional()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
            <Link href="/search-professionals" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Voltar
            </Link>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600 text-lg mb-6">{error || 'Profissional não encontrado'}</p>
          <Link href="/search-professionals" className="text-blue-600 hover:text-blue-700 font-medium">
            Voltar para busca
          </Link>
        </div>
      </div>
    )
  }

  const isPT = professional.professional_type === 'personal_trainer'
  const typeLabel = isPT ? '💪 Personal Trainer' : '🥗 Nutricionista'
  const whatsappNumber = professional.whatsapp?.replace(/\D/g, '')

  // Generate personalized WhatsApp message
  const getWhatsAppMessage = () => {
    const name = professional.name || 'Profissional'
    if (isPT) {
      return `Olá ${name}! Encontrei seu perfil no LinkeGym e gostaria de saber mais sobre suas aulas de personal trainer.`
    } else {
      return `Olá ${name}! Encontrei seu perfil no LinkeGym e gostaria de saber mais sobre consultas nutricionais.`
    }
  }

  const whatsappMessage = getWhatsAppMessage()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
          <Link href="/search-professionals" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Voltar
          </Link>
        </div>
      </nav>

      {/* Profile Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl">
                {isPT ? '💪' : '🥗'}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{professional.name}</h1>
              <p className="text-xl text-blue-100 mb-4">{typeLabel}</p>
              <p className="text-blue-100 text-lg">
                ⭐ {professional.years_experience || 0} anos de experiência
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Bio */}
            {professional.bio && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {professional.bio}
                </p>
              </div>
            )}

            {/* Specialties */}
            {professional.specialties && professional.specialties.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Especialidades</h2>
                <div className="flex flex-wrap gap-3">
                  {professional.specialties.map((specialty: string) => (
                    <span
                      key={specialty}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Areas */}
            {professional.service_neighborhoods && professional.service_neighborhoods.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bairros Atendidos</h2>
                <div className="flex flex-wrap gap-3">
                  {professional.service_neighborhoods.map((neighborhood: string) => (
                    <span
                      key={neighborhood}
                      className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-medium flex items-center gap-2"
                    >
                      📍 {neighborhood}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Details */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Profissionais</h2>
              <div className="space-y-4">
                {professional.years_experience && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Anos de Experiência:</span>
                    <span className="text-gray-900 font-bold">{professional.years_experience} anos</span>
                  </div>
                )}

                {professional.professional_type && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Tipo de Profissional:</span>
                    <span className="text-gray-900 font-bold">{typeLabel}</span>
                  </div>
                )}

                {professional.cref && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">CREF:</span>
                    <span className="text-gray-900 font-bold">{professional.cref}</span>
                  </div>
                )}

                {professional.crn && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">CRN:</span>
                    <span className="text-gray-900 font-bold">{professional.crn}</span>
                  </div>
                )}

                {professional.email && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <a href={`mailto:${professional.email}`} className="text-blue-600 hover:text-blue-700 font-bold">
                      {professional.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection professionalId={id} />
          </div>

          {/* Right Column - Contact Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Agendar Aula</h3>

              <div className="space-y-4">
                {/* Booking Button */}
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                >
                  <span>📅</span>
                  <span>Agendar Aula</span>
                </button>

                <div className="border-t border-gray-200 my-4"></div>
                <p className="text-sm font-semibold text-gray-700 text-center">Ou entre em contato:</p>

                {/* WhatsApp Button */}
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                  >
                    <span>💬</span>
                    <span>Falar no WhatsApp</span>
                  </a>
                )}

                {/* Phone Button */}
                {professional.phone && (
                  <a
                    href={`tel:${professional.phone}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                  >
                    <span>📞</span>
                    <span>Ligar</span>
                  </a>
                )}

                {/* Email Button */}
                {professional.email && (
                  <a
                    href={`mailto:${professional.email}`}
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                  >
                    <span>✉️</span>
                    <span>Email</span>
                  </a>
                )}

                {/* Instagram Button */}
                {professional.instagram && (
                  <a
                    href={`https://instagram.com/${professional.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                  >
                    <span>📷</span>
                    <span>Instagram</span>
                  </a>
                )}
              </div>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Dica:</strong> Clique em "Agendar Aula" para marcar sua primeira sessão!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        professionalId={id}
        professionalName={professional?.name || 'Profissional'}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2024 LinkeGym. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
