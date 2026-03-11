'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLAN_FEATURES } from '@/lib/professional-plans-helper'

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    {
      id: 'basic',
      ...PLAN_FEATURES.basic,
      highlighted: false
    },
    {
      id: 'ouro',
      ...PLAN_FEATURES.ouro,
      highlighted: true
    },
    {
      id: 'plus',
      ...PLAN_FEATURES.plus,
      highlighted: false
    }
  ]

  const getPlanCardStyle = (planId: string) => {
    if (planId === 'ouro') {
      return 'border-2 border-yellow-400 shadow-xl scale-105'
    }
    return 'border border-gray-200'
  }

  const getPlanHeaderColor = (planId: string) => {
    const colors: Record<string, string> = {
      basic: 'bg-gray-100',
      ouro: 'bg-yellow-100',
      plus: 'bg-purple-100'
    }
    return colors[planId]
  }

  const getPlanButtonColor = (planId: string) => {
    const colors: Record<string, string> = {
      basic: 'bg-gray-600 hover:bg-gray-700',
      ouro: 'bg-yellow-600 hover:bg-yellow-700',
      plus: 'bg-purple-600 hover:bg-purple-700'
    }
    return colors[planId]
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
          <div className="flex gap-3">
            <Link href="/" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium">
              ← Voltar
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Planos para Profissionais</h1>
          <p className="text-xl text-blue-100">Escolha o plano ideal para seu negócio crescer</p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg overflow-hidden transition transform hover:shadow-2xl ${getPlanCardStyle(plan.id)}`}
            >
              {/* Header */}
              <div className={`${getPlanHeaderColor(plan.id)} p-6 text-center`}>
                <div className="text-3xl font-bold text-gray-900 mb-2">{plan.badge}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="p-6 text-center border-b border-gray-200">
                {plan.price === 0 ? (
                  <div className="text-4xl font-bold text-gray-900">Grátis</div>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-gray-900">
                      R$ {plan.price.toFixed(2)}
                    </div>
                    <p className="text-gray-600 text-sm mt-2">/mês</p>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-white font-bold py-3 px-4 rounded-lg transition ${getPlanButtonColor(plan.id)}`}
                >
                  {plan.price === 0 ? 'Usar Plano Básico' : 'Contratar Plano'}
                </button>
              </div>

              {/* Highlight Badge */}
              {plan.highlighted && (
                <div className="bg-yellow-400 text-yellow-900 text-center py-2 font-bold text-sm">
                  ⭐ MAIS POPULAR
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Comparação Completa</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-6 py-4 text-left font-bold text-gray-900">Recurso</th>
                  <th className="border border-gray-300 px-6 py-4 text-center font-bold text-gray-900">Básico</th>
                  <th className="border border-gray-300 px-6 py-4 text-center font-bold text-gray-900">Ouro</th>
                  <th className="border border-gray-300 px-6 py-4 text-center font-bold text-gray-900">Plus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Fotos</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Até 3</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Até 10</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Ilimitadas</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Regiões</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Até 2</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Até 5</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Todas</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Leads/Mês</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Até 10</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Ilimitados</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Ilimitados</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Badge Verificado</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">❌</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">❌</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">✓</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Prioridade na Busca</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">❌</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">❌</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">✓</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Estatísticas</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">❌</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Básicas</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Completas</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">Suporte</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Email</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Email</td>
                  <td className="border border-gray-300 px-6 py-4 text-center text-gray-700">Prioritário</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Posso trocar de plano?</h3>
              <p className="text-gray-700">Sim! Você pode fazer upgrade ou downgrade a qualquer momento. As mudanças serão aplicadas imediatamente.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Há contrato de longa duração?</h3>
              <p className="text-gray-700">Não. Todos os planos são mensais e você pode cancelar a qualquer momento, sem multa.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Como funciona o plano básico?</h3>
              <p className="text-gray-700">O plano básico é totalmente grátis! Você pode ter um perfil completo e receber até 10 leads por mês.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Qual é a melhor forma de pagamento?</h3>
              <p className="text-gray-700">Aceitamos cartão de crédito e débito via Stripe. O pagamento é seguro e recorrente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-blue-100 mb-8">Escolha seu plano e comece a receber leads hoje mesmo</p>
          <Link href="/register-professional" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            Cadastre-se Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; 2024 LinkeGym. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
