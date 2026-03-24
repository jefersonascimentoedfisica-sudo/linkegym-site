'use client'

import { useState } from 'react'

const AVAILABLE_TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
]

interface RescheduleModalProps {
  isOpen: boolean
  onClose: () => void
  booking: any
  onSuccess: () => void
}

export default function RescheduleModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newDate || !newTime) {
      setError('Por favor, selecione data e horário')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/bookings?id=${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_date: newDate, booking_time: newTime }),
      })
      const success = res.ok

      if (success) {
        onSuccess()
      } else {
        setError('Erro ao reagendar')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao reagendar')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const today = new Date()
  const minDate = today.toISOString().split('T')[0]
  const maxDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">📅 Reagendar Aula</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Reagendando aula com <strong>{booking.professionals?.name}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nova Data *
              </label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                min={minDate}
                max={maxDateStr}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* New Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Novo Horário *
              </label>
              <select
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Selecione um horário</option>
                {AVAILABLE_TIMES.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {loading ? '⏳ Processando...' : '✓ Confirmar Reagendamento'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
