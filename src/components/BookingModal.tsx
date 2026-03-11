'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

interface BookingModalProps {
  professionalId: string;
  professionalName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AVAILABLE_TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];

export default function BookingModal({
  professionalId,
  professionalName,
  isOpen,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    bookingDate: '',
    bookingTime: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // Validate form
      if (!formData.studentName || !formData.studentEmail || !formData.bookingDate || !formData.bookingTime) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.studentEmail)) {
        throw new Error('Email inválido');
      }

      // Check if date is in the future
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        throw new Error('Selecione uma data futura');
      }

      // Insert booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            professional_id: professionalId,
            student_name: formData.studentName,
            student_email: formData.studentEmail,
            booking_date: formData.bookingDate,
            booking_time: formData.bookingTime,
            notes: formData.notes,
            status: 'pending',
          },
        ])
        .select();

      if (error) throw error;

      setMessageType('success');
      setMessage('✅ Aula agendada com sucesso! O profissional entrará em contato em breve.');

      // Reset form
      setFormData({
        studentName: '',
        studentEmail: '',
        bookingDate: '',
        bookingTime: '',
        notes: '',
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      console.error('Error booking:', err);
      setMessageType('error');
      setMessage(`❌ ${err.message || 'Erro ao agendar aula. Tente novamente.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Get minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Get maximum date (60 days from now)
  const maxDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold">Agendar Aula</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-80 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Agendando aula com <strong>{professionalName}</strong>
          </p>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seu Nome *
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Digite seu nome"
                required
              />
            </div>

            {/* Student Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Booking Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data da Aula *
              </label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                min={minDate}
                max={maxDateStr}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Agende com até 60 dias de antecedência
              </p>
            </div>

            {/* Booking Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Horário *
              </label>
              <select
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleInputChange}
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

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ex: Tenho dúvida sobre musculação..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition mt-6"
            >
              {submitting ? '⏳ Agendando...' : '✓ Confirmar Agendamento'}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
            >
              Cancelar
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>💡 Dica:</strong> Após confirmar, o profissional receberá seu agendamento e entrará em contato para confirmar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
