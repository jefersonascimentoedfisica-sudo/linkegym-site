// Client-safe utility functions (no server-only imports)

export function formatCurrency(amount?: number | null, currency: string = 'BRL'): string {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return 'Valor indisponível'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatConsultationPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export function getServiceTypeLabel(serviceType?: string | null): string {
  switch (serviceType) {
    case 'presencial':
      return 'Presencial'
    case 'online':
      return 'Online'
    case 'ambos':
      return 'Presencial + Online'
    default:
      return serviceType || 'Não informado'
  }
}

export function getPlanLabel(planType?: string | null): string {
  const labels: Record<string, string> = {
    basic: 'Básico',
    ouro: 'Ouro',
    plus: 'Plus',
  }
  return (planType && labels[planType]) || 'Básico'
}

export function getPlanColor(planType?: string | null): string {
  const colors: Record<string, string> = {
    basic: 'bg-gray-100 text-gray-800',
    ouro: 'bg-yellow-100 text-yellow-800',
    plus: 'bg-purple-100 text-purple-800',
  }
  return (planType && colors[planType]) || 'bg-gray-100 text-gray-800'
}

export function getPersonalRequestStatusLabel(status?: string | null): string {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    accepted: 'Aceita',
    rejected: 'Rejeitada',
    completed: 'Concluída',
  }
  return (status && labels[status]) || status || 'Não informado'
}

export function getPersonalRequestStatusColor(status?: string | null): string {
  const colors: Record<string, string> = {
    pending: 'yellow',
    accepted: 'green',
    rejected: 'red',
    completed: 'blue',
  }
  return (status && colors[status]) || 'gray'
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'Data indisponível'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Data indisponível'

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function getBookingStatusColor(status?: string | null): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getBookingStatusLabel(status?: string | null): string {
  switch (status) {
    case 'pending':
      return 'Pendente'
    case 'confirmed':
      return 'Confirmado'
    case 'completed':
      return 'Concluído'
    case 'cancelled':
      return 'Cancelado'
    case 'paid':
      return 'Pago'
    case 'scheduled':
      return 'Agendado'
    default:
      return status || 'Não informado'
  }
}

export function getErrorMessage(err: unknown, fallback = 'Erro inesperado'): string {
  return err instanceof Error ? err.message : fallback
}
