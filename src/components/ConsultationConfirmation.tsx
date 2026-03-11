'use client';

interface ConsultationConfirmationProps {
  clientName: string;
  nutritionistName: string;
  whatsappNumber: string;
  consultationPrice: number;
  onClose: () => void;
}

export default function ConsultationConfirmation({
  clientName,
  nutritionistName,
  whatsappNumber,
  consultationPrice,
  onClose,
}: ConsultationConfirmationProps) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Olá ${nutritionistName}! Acabei de pagar minha consulta pelo LinkeGym e gostaria de combinar a data e o horário do meu atendimento.`
  )}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-lg text-center">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-2xl font-bold">Pagamento Confirmado!</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Consulta com:</p>
            <p className="text-lg font-bold text-gray-900 mb-3">{nutritionistName}</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {consultationPrice.toFixed(2)}
            </p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Próximo passo:</strong> Você será direcionada para o WhatsApp da nutricionista para combinar data, horário e detalhes do seu atendimento.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-lg text-center transition flex items-center justify-center gap-2 text-lg"
            >
              <span>💬</span>
              <span>Falar com a nutricionista no WhatsApp</span>
            </a>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
            >
              Fechar
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600">
            <p className="mb-2">
              <strong>📧 Confirmação:</strong> Um email foi enviado para você com os detalhes da consulta.
            </p>
            <p>
              <strong>💡 Dica:</strong> Tenha em mãos suas dúvidas e objetivos para aproveitar melhor a consulta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
