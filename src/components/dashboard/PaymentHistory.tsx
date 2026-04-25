'use client'

import { formatCurrency } from '@/lib/client-utils'
import type { PaymentRecord } from '@/lib/domain-types'

interface PaymentHistoryProps {
  payments: PaymentRecord[]
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">💳</div>
        <p className="text-gray-600 text-lg">Nenhum pagamento realizado</p>
      </div>
    )
  }

  const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Pagamentos</h2>

      {/* Summary */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 mb-1">Total Gasto</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 mb-1">Transações</p>
            <p className="text-3xl font-bold text-blue-600">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Método</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.booking_id ? 'Aula' : 'Consulta Nutricional'}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {payment.status === 'paid' ? '✅ Pago' : '⏳ Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                  {payment.payment_method === 'stripe' ? '💳 Stripe' : '💳 ' + payment.payment_method}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download Invoice */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>💡 Dica:</strong> Você pode baixar recibos de pagamento diretamente do seu email de confirmação.
        </p>
      </div>
    </>
  )
}
