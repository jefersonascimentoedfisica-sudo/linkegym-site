'use client'

import { useState } from 'react'

const OBJECTIVES = [
  'Emagrecimento',
  'Hipertrofia',
  'Força',
  'Resistência',
  'Mobilidade',
  'Saúde Geral',
  'Performance',
  'Reabilitação',
]

const AVAILABILITY = [
  'Manhã (6h-12h)',
  'Tarde (12h-18h)',
  'Noite (18h-22h)',
  'Finais de semana',
  'Flexível',
]

const NEIGHBORHOODS = [
  'Centro', 'Vila Galvão', 'Maia', 'Picanço', 'Bonsucesso',
  'Cumbica', 'Taboão', 'Cocaia', 'Pimentas', 'São João',
  'Jardim Adriana', 'Gopoúva', 'Vila Augusta', 'Vila Rio',
  'Jardim Tranquilidade', 'Parque Cecap', 'Jardim São Paulo',
  'Vila Endres', 'Jardim Santa Mena', 'Parque Continental'
]

interface PersonalRequestModalProps {
  isOpen: boolean
  onClose: () => void
  professionalId: string
  professionalName: string
}

export default function PersonalRequestModal({
  isOpen,
  onClose,
  professionalId,
  professionalName,
}: PersonalRequestModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    student_phone: '',
    student_neighborhood: '',
    objective: '',
    availability: [] as string[],
    notes: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(value)
        ? prev.availability.filter(a => a !== value)
        : [...prev.availability, value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (!formData.student_name || !formData.student_email || !formData.student_phone) {
      setError('Preencha todos os campos obrigatórios')
      setLoading(false)
      return
    }

    if (!formData.student_neighborhood) {
      setError('Selecione seu bairro')
      setLoading(false)
      return
    }

    if (!formData.objective) {
      setError('Selecione seu objetivo')
      setLoading(false)
      return
    }

    if (formData.availability.length === 0) {
      setError('Selecione pelo menos uma disponibilidade')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/personal-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professional_id: professionalId,
          student_name: formData.student_name,
          student_email: formData.student_email,
          student_phone: formData.student_phone,
          student_neighborhood: formData.student_neighborhood,
          objective: formData.objective,
          availability: formData.availability.join(', '),
          notes: formData.notes,
          status: 'pending',
        }),
      })
      const result = await res.json()

      if (!result.error) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setFormData({
            student_name: '',
            student_email: '',
            student_phone: '',
            student_neighborhood: '',
            objective: '',
            availability: [],
            notes: '',
          })
          setSuccess(false)
        }, 2000)
      } else {
        setError(result.error || 'Erro ao enviar solicitação')
      }

    } catch (err: any) {
      setError(err.message || 'Erro ao enviar solicitação')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 sticky top-0">
          <h2 className="text-2xl font-bold">Solicitar Acompanhamento</h2>
          <p className="text-blue-100 mt-1">com {professionalName}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-4">
            <p className="font-bold">✅ Solicitação enviada com sucesso!</p>
            <p>O profissional receberá sua solicitação em breve.</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
            <p className="font-bold">✕ Erro</p>
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seu Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="student_name"
              placeholder="Seu nome completo"
              value={formData.student_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="student_email"
              placeholder="seu@email.com"
              value={formData.student_email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="student_phone"
              placeholder="(11) 99999-9999"
              value={formData.student_phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Neighborhood */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seu Bairro <span className="text-red-500">*</span>
            </label>
            <select
              name="student_neighborhood"
              value={formData.student_neighborhood}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um bairro</option>
              {NEIGHBORHOODS.map(neighborhood => (
                <option key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </option>
              ))}
            </select>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seu Objetivo <span className="text-red-500">*</span>
            </label>
            <select
              name="objective"
              value={formData.objective}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um objetivo</option>
              {OBJECTIVES.map(objective => (
                <option key={objective} value={objective}>
                  {objective}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Sua Disponibilidade <span className="text-red-500">*</span> (selecione pelo menos uma)
            </label>
            <div className="space-y-2">
              {AVAILABILITY.map(availability => (
                <label key={availability} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(availability)}
                    onChange={() => handleCheckboxChange(availability)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-gray-700">{availability}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observações (opcional)
            </label>
            <textarea
              name="notes"
              placeholder="Conte mais sobre seu histórico, lesões, ou qualquer informação importante..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : '✓ Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
