'use client'

import { useState } from 'react'
import { cancelBooking, rescheduleBooking, formatDate } from '@/lib/students-helper'
import RescheduleModal from './RescheduleModal'

interface UpcomingBookingsProps {
  bookings: any[]
  consultations: any[]
  studentId: string
}

export default function UpcomingBookings({
  bookings,
  consultations,
  studentId,
}: UpcomingBookingsProps) {
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return

    try {
      setLoading(true)
      const success = await cancelBooking(bookingId)
      if (success) {
        setMessage({ type: 'success', text: 'Agendamento cancelado com sucesso' })
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setMessage({ type: 'error', text: 'Erro ao cancelar agendamento' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao cancelar agendamento' })
    } finally {
      setLoading(false)
    }
  }

  const handleReschedule = (booking: any) => {
    setSelectedBooking(booking)
    setShowRescheduleModal(true)
  }

  const handleWhatsApp = (professional: any) => {
    const whatsappNumber = professional.whatsapp?.replace(/\D/g, '')
    if (!whatsappNumber) {
      alert('Número de WhatsApp não disponível')
      return
    }

    const message = `Olá ${professional.name}! Gostaria de confirmar meu agendamento para ${selectedBooking?.booking_date} às ${selectedBooking?.booking_time}.`
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const allScheduled = [...bookings, ...consultations]

  if (allScheduled.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-600 text-lg mb-6">Você não tem agendamentos próximos</p>
        <a
          href="/search-professionals"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Buscar Profissionais
        </a>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Próximos Agendamentos</h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {allScheduled.map(item => {
          const isPT = item.professionals?.professional_type === 'personal_trainer'
          const isBooking = !!item.booking_date
          const date = isBooking ? item.booking_date : item.scheduled_date
          const time = isBooking ? item.booking_time : item.scheduled_time

          return (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {isPT ? '💪' : '🥗'} {item.professionals?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isPT ? 'Personal Trainer' : 'Nutricionista'}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ✅ Confirmado
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">📅 Data</p>
                  <p className="font-bold text-gray-900">{formatDate(date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">🕐 Horário</p>
                  <p className="font-bold text-gray-900">{time}</p>
                </div>
                {item.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">📝 Observações</p>
                    <p className="text-gray-900">{item.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleWhatsApp(item.professionals)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleReschedule(item)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <span>📅</span>
                  <span>Reagendar</span>
                </button>
                <button
                  onClick={() => handleCancel(item.id)}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <span>✕</span>
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selectedBooking && (
        <RescheduleModal
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          booking={selectedBooking}
          onSuccess={() => {
            setShowRescheduleModal(false)
            window.location.reload()
          }}
        />
      )}
    </>
  )
}
