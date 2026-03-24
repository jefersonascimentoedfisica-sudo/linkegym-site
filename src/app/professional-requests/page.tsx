'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPersonalRequestStatusLabel as getStatusLabel, getPersonalRequestStatusColor as getStatusColor } from '@/lib/client-utils'

interface PersonalRequest {
  id: string
  professional_id: string
  student_name: string
  student_email: string
  student_phone: string
  student_neighborhood: string
  objective: string
  availability: string
  notes: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  created_at: string
}

export default function ProfessionalRequestsPage() {
  const [requests, setRequests] = useState<PersonalRequest[]>([])
  const [professionals, setProfessionals] = useState<any[]>([])
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Fetch all professionals
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await fetch('/api/professionals?professional_type=personal_trainer')
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        const data = json.data || []
        setProfessionals(data)
        if (data.length > 0) {
          setSelectedProfessionalId(data[0].id)
        }
      } catch (err: any) {
        console.error('Error fetching professionals:', err)
        setError(err.message)
      }
    }

    fetchProfessionals()
  }, [])

  // Fetch requests for selected professional
  useEffect(() => {
    if (!selectedProfessionalId) return

    const fetchRequests = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/personal-requests?professional_id=${selectedProfessionalId}`)
        const json = await res.json()
        if (json.error) {
          setError(json.error)
        } else {
          setRequests(json.data || [])
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [selectedProfessionalId])

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    setUpdatingId(requestId)
    try {
      const res = await fetch(`/api/personal-requests?id=${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (json.error) {
        setError(json.error)
      } else {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: newStatus as any } : r))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredRequests = filterStatus === 'all'
    ? requests
    : requests.filter(r => r.status === filterStatus)

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    completed: requests.filter(r => r.status === 'completed').length,
  }

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
          <div className="flex gap-4">
            <Link href="/bookings-management" className="text-blue-600 hover:text-blue-700 font-medium">
              📅 Agendamentos
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Voltar
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">💪 Solicitações de Acompanhamento</h1>
          <p className="text-purple-100">Gerencie as solicitações de acompanhamento contínuo</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Professional Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Selecione seu perfil:
          </label>
          <select
            value={selectedProfessionalId}
            onChange={(e) => setSelectedProfessionalId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione um profissional</option>
            {professionals.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>
        </div>

        {/* Statistics */}
        {selectedProfessionalId && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
              <p className="text-gray-600 text-sm mt-2">Total de Solicitações</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-gray-600 text-sm mt-2">Pendentes</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
              <p className="text-gray-600 text-sm mt-2">Aceitas</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
              <p className="text-gray-600 text-sm mt-2">Concluídas</p>
            </div>
          </div>
        )}

        {/* Filter */}
        {selectedProfessionalId && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Filtrar por status:
            </label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'accepted', 'rejected', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {status === 'all' ? 'Todos' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">Carregando solicitações...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">Nenhuma solicitação encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-white rounded-lg shadow p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Student Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{request.student_name}</h3>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600">Email:</p>
                        <a href={`mailto:${request.student_email}`} className="text-blue-600 hover:text-blue-700 font-medium">
                          {request.student_email}
                        </a>
                      </div>

                      <div>
                        <p className="text-gray-600">Telefone:</p>
                        <a href={`tel:${request.student_phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                          {request.student_phone}
                        </a>
                      </div>

                      <div>
                        <p className="text-gray-600">Bairro:</p>
                        <p className="font-medium text-gray-900">📍 {request.student_neighborhood}</p>
                      </div>

                      <div>
                        <p className="text-gray-600">Objetivo:</p>
                        <p className="font-medium text-gray-900">{request.objective}</p>
                      </div>

                      <div>
                        <p className="text-gray-600">Disponibilidade:</p>
                        <p className="font-medium text-gray-900">{request.availability}</p>
                      </div>

                      {request.notes && (
                        <div>
                          <p className="text-gray-600">Observações:</p>
                          <p className="font-medium text-gray-900">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Status & Actions */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Status:</p>
                      <div className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${getStatusBadgeColor(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </div>

                      <p className="text-gray-600 text-xs mt-4">
                        Recebida em: {new Date(request.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="space-y-2 mt-6">
                      <p className="text-sm font-semibold text-gray-700">Alterar status:</p>
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                        disabled={updatingId === request.id}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value="pending">Pendente</option>
                        <option value="accepted">Aceita</option>
                        <option value="rejected">Rejeitada</option>
                        <option value="completed">Concluída</option>
                      </select>

                      {request.status === 'accepted' && (
                        <a
                          href={`https://wa.me/${request.student_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${request.student_name}! Recebi sua solicitação de acompanhamento. Vamos conversar sobre seus objetivos e começar o programa!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-center transition text-sm"
                        >
                          💬 Falar no WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2024 LinkeGym. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
