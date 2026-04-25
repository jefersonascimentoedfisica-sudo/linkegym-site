'use client';

import { useState } from 'react';
import { formatConsultationPrice, getErrorMessage } from '@/lib/client-utils';

interface ConsultationPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  nutritionistId: string;
  nutritionistName: string;
  consultationPrice: number;
  whatsappNumber: string;
  onPaymentSuccess: (consultationId: string, clientName: string) => void;
}

export default function ConsultationPaymentModal({
  isOpen,
  onClose,
  nutritionistId,
  nutritionistName,
  consultationPrice,
  whatsappNumber,
  onPaymentSuccess,
}: ConsultationPaymentModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    notes: '',
  });
  const [consultationId, setConsultationId] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate form
      if (!formData.clientName || !formData.clientEmail) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.clientEmail)) {
        throw new Error('Email inválido');
      }

      setStep('processing');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create consultation record via API
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nutritionist_id: nutritionistId,
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          price: consultationPrice,
          notes: formData.notes || undefined,
          status: 'paid',
        }),
      });
      const json = await res.json();

      if (json.error || !json.data) {
        throw new Error(json.error || 'Erro ao registrar consulta');
      }

      setConsultationId(json.data.id);
      setStep('success');
      onPaymentSuccess(json.data.id, formData.clientName);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao processar pagamento'));
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">🥗 Agendar Consulta</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' && (
            <>
              {/* Nutritionist Info */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Consulta com:</p>
                <p className="text-lg font-bold text-gray-900">{nutritionistName}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {formatConsultationPrice(consultationPrice)}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handlePayment} className="space-y-4">
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                {/* Client Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="seu@email.com"
                    required
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Ex: Tenho dúvidas sobre nutrição esportiva..."
                    rows={3}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Info Box */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-gray-700">
                  ℹ️ Após confirmar o pagamento, você será direcionado para o WhatsApp da nutricionista para combinar data e horário.
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mt-6">
                  <button
                    type="submit"
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
                        <span>Pagar Consulta</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 font-semibold">Processando pagamento...</p>
              <p className="text-sm text-gray-500 mt-2">Por favor, aguarde</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h3>
              <p className="text-gray-600 mb-4">
                Sua consulta foi registrada com sucesso.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Agora você será direcionada para o WhatsApp da nutricionista para combinar data, horário e detalhes do seu atendimento.
              </p>
              <button
                onClick={() => {
                  setStep('form');
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>Falar com a nutricionista</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
