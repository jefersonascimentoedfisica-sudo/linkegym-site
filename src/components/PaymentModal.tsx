'use client';

import { useState } from 'react';
import { createStripePaymentIntent } from '@/lib/stripe-service';
import { formatCurrency } from '@/lib/client-utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  professionalId: string;
  studentEmail: string;
  studentName: string;
  lessonPrice: number;
  professionalName: string;
  bookingDate: string;
  bookingTime: string;
  onPaymentSuccess: (paymentId: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  bookingId,
  professionalId,
  studentEmail,
  studentName,
  lessonPrice,
  professionalName,
  bookingDate,
  bookingTime,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setStep('processing');

      // Create payment intent
      const result = await createStripePaymentIntent(
        lessonPrice,
        bookingId,
        studentEmail,
        professionalId
      );

      if (!result) {
        throw new Error('Falha ao criar intenção de pagamento');
      }

      // In a real implementation, you would redirect to Stripe checkout
      // For now, we'll simulate a successful payment
      setTimeout(() => {
        setStep('success');
        onPaymentSuccess(result.paymentIntentId);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento');
      setStep('confirm');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">💳 Confirmar Pagamento</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'confirm' && (
            <>
              {/* Booking Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Detalhes da Aula</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profissional:</span>
                    <span className="font-semibold text-gray-900">{professionalName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-semibold text-gray-900">{bookingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horário:</span>
                    <span className="font-semibold text-gray-900">{bookingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aluno:</span>
                    <span className="font-semibold text-gray-900">{studentName}</span>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700">Valor da Aula:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(lessonPrice)}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  ℹ️ Após confirmar o pagamento, sua aula será confirmada automaticamente.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>💳</span>
                      <span>Confirmar Pagamento</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 font-semibold">Processando pagamento...</p>
              <p className="text-sm text-gray-500 mt-2">Por favor, aguarde</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h3>
              <p className="text-gray-600 mb-4">
                Sua aula foi confirmada com sucesso.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Um email de confirmação foi enviado para {studentEmail}
              </p>
              <button
                onClick={() => {
                  setStep('confirm');
                  onClose();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
