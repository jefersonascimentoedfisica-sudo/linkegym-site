'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import ReviewsSection from '@/components/ReviewsSection'
import BookingModal from '@/components/BookingModal'
import ConsultationPaymentModal from '@/components/ConsultationPaymentModal'
import ConsultationConfirmation from '@/components/ConsultationConfirmation'
import PersonalRequestModal from '@/components/PersonalRequestModal'
import { formatConsultationPrice, getServiceTypeLabel } from '@/lib/consultations-helper'
import { getProfessionalPlan, getPlanLabel, getPlanColor } from '@/lib/professional-plans-helper'

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
  const [showPersonalRequestModal, setShowPersonalRequestModal] = useState(false)
  const [plan, setPlan] = useState<any>(null)

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
        
        // Fetch professional plan
        const planResult = await getProfessionalPlan(id)
        if (planResult.success && planResult.data) {
          setPlan(planResult.data)
        }
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

  const handleConsultationPaymentSuccess = (consultationId: string, clientName: string) => {
    setConsultationClientName(clientName)
    setShowConsultationPaymentModal(false)
    setShowConsultationConfirmation(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
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
          <Link href="/search-professionals" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Voltar
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-blue-100">{typeLabel}</p>
                {plan && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPlanColor(plan.plan_type)}`}>
                    {getPlanLabel(plan.plan_type)}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{professional.name}</h1>
              <p className="text-blue-100">{professional.years_experience} anos de experiência</p>
            </div>
            {professional.rating && (
              <div className="text-right">
                <div className="text-3xl font-bold">⭐ {professional.rating.toFixed(1)}</div>
                <p className="text-blue-100 text-sm">{professional.review_count} avaliações</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Professional Info */}
          <div className="md:col-span-2">
            {/* About */}
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{professional.bio}</p>

              {/* Specialties */}
              {professional.specialties && professional.specialties.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((spec: string) => (
                      <span key={spec} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Neighborhoods */}
              {professional.service_neighborhoods && professional.service_neighborhoods.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Bairros de Atendimento</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.service_neighborhoods.map((neighborhood: string) => (
                      <span key={neighborhood} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        📍 {neighborhood}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Services Section (for Personal Trainers) */}
            {isPT && (
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Serviços Oferecidos</h2>
                <div className="space-y-4">
                  {professional.offers_fixed_personal && (
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                      <div className="text-3xl">💪</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">Personal Fixo</h3>
                        <p className="text-gray-600 text-sm mb-2">Acompanhamento contínuo e personalizado</p>
                        <p className="text-xl font-bold text-green-600">
                          {professional.fixed_personal_price === 'sob_consulta' ? 'Sob Consulta' : `R$ ${professional.fixed_personal_price}/mês`}
                        </p>
                      </div>
                    </div>
                  )}
                  {professional.offers_single_class && (
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">📅</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">Aula Avulsa</h3>
                        <p className="text-gray-600 text-sm mb-2">Sessões pontuais conforme sua disponibilidade</p>
                        <p className="text-xl font-bold text-blue-600">R$ {professional.single_class_price || 100}/aula</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Details */}
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Profissionais</h2>
              <div className="space-y-4">
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
              {!isPT ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🥗 Consulta Nutricional</h3>
                  <p className="text-3xl font-bold text-green-600 mb-6">
                    {formatConsultationPrice(professional.consultation_price || 150)}
                  </p>
                </>
              ) : (
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Agendar Aula</h3>
              )}

              <div className="space-y-4">
                {/* Consultation Button (for Nutritionists) */}
                {!isPT && (
                  <button
                    onClick={() => setShowConsultationPaymentModal(true)}
                    className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                  >
                    <span>💳</span>
                    <span>Agendar Consulta</span>
                  </button>
                )}

                {/* Booking Button (for Personal Trainers) */}
                {isPT && (
                  <>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                    >
                      <span>📅</span>
                      <span>Agendar Aula</span>
                    </button>

                    {professional.offers_fixed_personal && (
                      <button
                        onClick={() => setShowPersonalRequestModal(true)}
                        className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2"
                      >
                        <span>💪</span>
                        <span>Quero Acompanhamento</span>
                      </button>
                    )}
                  </>
                )}

                {/* Service Type Info (for Nutritionists) */}
                {!isPT && professional.service_type && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Tipo de atendimento:</p>
                    <p className="font-semibold text-gray-900">
                      {getServiceTypeLabel(professional.service_type)}
                    </p>
                  </div>
                )}

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
                  <strong>💡 Dica:</strong> {!isPT ? 'Clique em "Agendar Consulta" para marcar seu atendimento!' : 'Clique em "Agendar Aula" para marcar sua primeira sessão!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {isPT && (
        <BookingModal
          professionalId={id}
          professionalName={professional.name}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {/* Consultation Payment Modal */}
      {!isPT && (
        <ConsultationPaymentModal
          isOpen={showConsultationPaymentModal}
          onClose={() => setShowConsultationPaymentModal(false)}
          nutritionistId={id}
          nutritionistName={professional.name}
          consultationPrice={professional.consultation_price || 150}
          whatsappNumber={whatsappNumber || ''}
          onPaymentSuccess={handleConsultationPaymentSuccess}
        />
      )}

      {/* Consultation Confirmation */}
      {!isPT && (
        <ConsultationConfirmation
          clientName={consultationClientName}
          nutritionistName={professional.name}
          whatsappNumber={whatsappNumber || ''}
          consultationPrice={professional.consultation_price || 150}
          onClose={() => setShowConsultationConfirmation(false)}
        />
      )}

      {/* Personal Request Modal */}
      {isPT && (
        <PersonalRequestModal
          isOpen={showPersonalRequestModal}
          onClose={() => setShowPersonalRequestModal(false)}
          professionalId={id}
          professionalName={professional.name}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2024 LinkeGym. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
