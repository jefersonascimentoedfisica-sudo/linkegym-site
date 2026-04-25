'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import type { Professional } from '@/lib/domain-types';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type BookingFilterStatus = BookingStatus | 'all';

const BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

interface Booking {
  id: string;
  professional_id: string;
  student_name: string;
  student_email: string;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filterStatus, setFilterStatus] = useState<BookingFilterStatus>('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch professionals on mount
  useEffect(() => {
    fetchProfessionals();
  }, []);

  // Fetch bookings when professional is selected
  useEffect(() => {
    if (selectedProfessionalId) {
      fetchBookings(selectedProfessionalId);
    }
  }, [selectedProfessionalId]);

  const fetchProfessionals = async () => {
    try {
      const { data, error: err } = await supabase
        .from('professionals')
        .select('id, name, professional_type')
        .order('name');

      if (err) throw err;
      const professionalRows = (Array.isArray(data) ? data : []) as Professional[];
      setProfessionals(professionalRows);

      // Select first professional by default
      if (professionalRows.length > 0) {
        setSelectedProfessionalId(professionalRows[0].id);
      }
    } catch (err: unknown) {
      console.error('Error fetching professionals:', err);
      setError('Erro ao carregar profissionais');
    }
  };

  const fetchBookings = async (professionalId: string) => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('bookings')
        .select('*')
        .eq('professional_id', professionalId)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (err) throw err;
      setBookings((Array.isArray(data) ? data : []) as Booking[]);
    } catch (err: unknown) {
      console.error('Error fetching bookings:', err);
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      setUpdatingStatus(true);
      const { error: err } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (err) throw err;

      // Update local state
      setBookings(
        bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (err: unknown) {
      console.error('Error updating booking status:', err);
      alert('Erro ao atualizar status do agendamento');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStatusSelect = (bookingId: string, value: string) => {
    if (!BOOKING_STATUSES.includes(value as BookingStatus)) {
      alert('Status inválido para o agendamento');
      return;
    }

    void handleStatusChange(bookingId, value as BookingStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳ Pendente';
      case 'confirmed':
        return '✅ Confirmado';
      case 'completed':
        return '✓ Concluído';
      case 'cancelled':
        return '✕ Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const filteredBookings = bookings.filter(
    booking => filterStatus === 'all' || booking.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            LinkeGym
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/search-professionals" className="text-gray-600 hover:text-gray-900">
              ← Voltar
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📅 Gerenciar Agendamentos</h1>
          <p className="text-blue-100">Visualize e atualize o status de todas as aulas agendadas</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Professional Selector */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Selecione o Profissional</h2>
          <select
            value={selectedProfessionalId}
            onChange={e => setSelectedProfessionalId(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">-- Selecione um profissional --</option>
            {professionals.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.name} ({prof.professional_type === 'personal_trainer' ? '💪' : '🥗'})
              </option>
            ))}
          </select>
        </div>

        {selectedProfessionalId && (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Total</p>
                <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Confirmados</p>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Concluídos</p>
                <p className="text-3xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ⏳ Pendentes
              </button>
              <button
                onClick={() => setFilterStatus('confirmed')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'confirmed'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ✅ Confirmados
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ✓ Concluídos
              </button>
              <button
                onClick={() => setFilterStatus('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'cancelled'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ✕ Cancelados
              </button>
            </div>

            {/* Bookings Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-600">Carregando agendamentos...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg">
                  {bookings.length === 0
                    ? 'Nenhum agendamento ainda'
                    : 'Nenhum agendamento com este status'}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aluno</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hora</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking, idx) => (
                        <tr key={booking.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{booking.student_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.student_email}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatDate(booking.booking_date)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{booking.booking_time}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {getStatusLabel(booking.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <select
                              value={booking.status}
                              onChange={e => handleStatusSelect(booking.id, e.target.value)}
                              disabled={updatingStatus}
                              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
                            >
                              <option value="pending">⏳ Pendente</option>
                              <option value="confirmed">✅ Confirmado</option>
                              <option value="completed">✓ Concluído</option>
                              <option value="cancelled">✕ Cancelado</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes Section */}
            {filteredBookings.some(b => b.notes) && (
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Observações dos Alunos</h3>
                <div className="space-y-4">
                  {filteredBookings
                    .filter(b => b.notes)
                    .map(booking => (
                      <div key={booking.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <p className="font-semibold text-gray-900">{booking.student_name}</p>
                        <p className="text-sm text-gray-600 mb-2">{formatDate(booking.booking_date)} às {booking.booking_time}</p>
                        <p className="text-gray-700">{booking.notes}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2024 LinkeGym. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
