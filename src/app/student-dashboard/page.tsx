'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate, getBookingStatusLabel as getStatusLabel, getBookingStatusColor as getStatusColor } from '@/lib/client-utils'
import UpcomingBookings from '@/components/dashboard/UpcomingBookings'
import PaymentHistory from '@/components/dashboard/PaymentHistory'
import FavoriteProfessionals from '@/components/dashboard/FavoriteProfessionals'
import StudentProfile from '@/components/dashboard/StudentProfile'

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [consultations, setConsultations] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'payments' | 'favorites' | 'profile'>('upcoming')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Get current user email from localStorage or session
        const userEmail = localStorage.getItem('studentEmail') || 'demo@example.com'

        // Fetch student data
        const studentRes = await fetch(`/api/students?email=${encodeURIComponent(userEmail)}`)
        const studentJson = await studentRes.json()
        const studentData = studentJson.data
        if (!studentData) throw new Error('Aluno não encontrado')
        setStudent(studentData)

        // Fetch bookings
        const bookingsRes = await fetch(`/api/bookings?student_id=${studentData.id}`)
        const bookingsJson = await bookingsRes.json()
        setBookings(bookingsJson.data || [])

        // Fetch consultations
        const consultRes = await fetch(`/api/consultations?student_id=${studentData.id}`)
        const consultJson = await consultRes.json()
        setConsultations(consultJson.data || [])

        // Fetch payments
        const paymentsRes = await fetch(`/api/payments?student_id=${studentData.id}`)
        const paymentsJson = await paymentsRes.json()
        setPayments(paymentsJson.data || [])

        // Fetch favorites
        const favRes = await fetch(`/api/favorites?student_id=${studentData.id}`)
        const favJson = await favRes.json()
        setFavorites(favJson.data || [])
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
            <Link href="/search-professionals" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Voltar
            </Link>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600 text-lg mb-6">{error || 'Erro ao carregar dashboard'}</p>
          <Link href="/search-professionals" className="text-blue-600 hover:text-blue-700 font-medium">
            Voltar para busca
          </Link>
        </div>
      </div>
    )
  }

  const upcomingBookings = bookings.filter(b => new Date(b.booking_date) > new Date() && b.status !== 'cancelled')
  const upcomingConsultations = consultations.filter(c => c.status === 'paid' || c.status === 'scheduled')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Olá, {student.name}!</span>
            <button
              onClick={() => {
                localStorage.removeItem('studentEmail')
                window.location.href = '/'
              }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📊 Meu Dashboard</h1>
          <p className="text-blue-100">Gerencie suas aulas, consultas e pagamentos</p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{upcomingBookings.length + upcomingConsultations.length}</div>
            <p className="text-gray-600">Próximos Agendamentos</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{payments.length}</div>
            <p className="text-gray-600">Pagamentos Realizados</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">{favorites.length}</div>
            <p className="text-gray-600">Profissionais Favoritos</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {bookings.filter(b => b.status === 'completed').length + consultations.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-gray-600">Aulas/Consultas Concluídas</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📅 Próximos Agendamentos
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Histórico
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === 'payments'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💳 Pagamentos
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === 'favorites'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⭐ Favoritos
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👤 Perfil
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'upcoming' && (
              <UpcomingBookings
                bookings={upcomingBookings}
                consultations={upcomingConsultations}
                studentId={student.id}
              />
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Aulas e Consultas</h2>
                <div className="space-y-4">
                  {bookings.length === 0 && consultations.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Nenhum histórico disponível</p>
                  ) : (
                    <>
                      {bookings.map(booking => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-900">{booking.professionals?.name}</h3>
                              <p className="text-sm text-gray-600">
                                {formatDate(booking.booking_date)} às {booking.booking_time}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{booking.notes}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                              {getStatusLabel(booking.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {consultations.map(consultation => (
                        <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-900">🥗 {consultation.professionals?.name}</h3>
                              <p className="text-sm text-gray-600">
                                Consulta Nutricional - {formatDate(consultation.created_at)}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{consultation.notes}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(consultation.status)}`}>
                              {getStatusLabel(consultation.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <PaymentHistory payments={payments} />
            )}

            {activeTab === 'favorites' && (
              <FavoriteProfessionals favorites={favorites} studentId={student.id} />
            )}

            {activeTab === 'profile' && (
              <StudentProfile student={student} onUpdate={setStudent} />
            )}
          </div>
        </div>
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
