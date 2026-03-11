# Sistema de Pagamento - LinkeGym

## Visão Geral

O sistema de pagamento foi implementado para permitir que alunos paguem por aulas avulsas antes de confirmar o agendamento. O sistema está preparado para integração com Stripe ou Mercado Pago.

## Arquitetura

### Tabelas do Banco de Dados

#### `payments`
Armazena informações de pagamentos:
- `id`: UUID único
- `booking_id`: Referência ao agendamento
- `professional_id`: Referência ao profissional
- `student_email`: Email do aluno
- `amount`: Valor da aula em BRL
- `currency`: Moeda (padrão: BRL)
- `status`: pending | paid | completed | cancelled
- `payment_method`: stripe | mercado_pago
- `stripe_payment_intent_id`: ID do Stripe (se aplicável)
- `stripe_charge_id`: ID da cobrança do Stripe
- `mercado_pago_payment_id`: ID do Mercado Pago
- `created_at`, `updated_at`: Timestamps

#### Colunas Adicionadas
- `professionals.lesson_price`: Preço da aula (padrão: R$ 100.00)
- `bookings.payment_status`: Status do pagamento (pending, paid, etc)

## Componentes

### PaymentModal.tsx
Modal para confirmação de pagamento:
- Exibe detalhes da aula
- Mostra valor a pagar
- Processa pagamento
- Exibe confirmação

### Serviços

#### `payments-helper.ts`
Funções auxiliares:
- `createPayment()`: Cria registro de pagamento
- `updatePaymentStatus()`: Atualiza status
- `getPaymentByBookingId()`: Busca pagamento por agendamento
- `getProfessionalLessonPrice()`: Obtém preço da aula
- `calculatePlatformFee()`: Calcula taxa (10% padrão)
- `calculateProfessionalEarnings()`: Calcula ganhos do profissional

#### `stripe-service.ts`
Integração com Stripe:
- `createStripePaymentIntent()`: Cria intenção de pagamento
- `confirmPayment()`: Confirma pagamento
- `getPaymentStatus()`: Obtém status

#### `email-service.ts`
Envio de emails:
- `sendPaymentConfirmationToStudent()`: Email para aluno
- `sendPaymentConfirmationToProfessional()`: Email para profissional

### API Routes

#### `/api/payments/stripe/create-intent`
POST - Cria intenção de pagamento no Stripe
- Body: `{ amount, bookingId, studentEmail, professionalId }`
- Response: `{ clientSecret, paymentIntentId, publishableKey }`

#### `/api/payments/stripe/status/[paymentIntentId]`
GET - Obtém status do pagamento
- Response: `{ status, paymentIntentId }`

## Fluxo de Pagamento

```
1. Aluno clica em "Agendar Aula"
2. Preenche formulário de agendamento
3. Clica em "Confirmar Agendamento"
4. Modal de pagamento é exibido
5. Aluno confirma pagamento
6. Sistema cria intenção de pagamento no Stripe
7. Pagamento é processado
8. Status é atualizado para "paid"
9. Agendamento é marcado como "confirmado"
10. Emails de confirmação são enviados
```

## Integração com Stripe

### Configuração

1. Adicione as variáveis de ambiente:
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

2. Instale a biblioteca Stripe:
```bash
npm install stripe
```

3. Atualize `/api/payments/stripe/create-intent/route.ts`:
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100),
  currency: 'brl',
  metadata: {
    bookingId,
    studentEmail,
    professionalId,
  },
});
```

## Integração com Mercado Pago

### Configuração

1. Adicione as variáveis de ambiente:
```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_...
```

2. Crie novo serviço `mercado-pago-service.ts`
3. Implemente funções similares ao Stripe

## Divisão de Receita

### Cálculo Padrão
- **Taxa de Plataforma**: 10%
- **Ganho do Profissional**: 90%

Exemplo:
- Aula: R$ 100.00
- Taxa: R$ 10.00
- Profissional recebe: R$ 90.00

### Customização
Para alterar a taxa, modifique em `payments-helper.ts`:
```typescript
const feePercentage = 15; // 15% de taxa
```

## Status de Pagamento

| Status | Descrição |
|--------|-----------|
| pending | Pagamento aguardando confirmação |
| paid | Pagamento confirmado |
| completed | Aula realizada |
| cancelled | Pagamento cancelado |

## Emails

### Para Aluno
- Confirmação de pagamento
- Detalhes da aula
- Link para dashboard

### Para Profissional
- Notificação de nova aula
- Dados do aluno
- Valor a receber (após taxa)

## Segurança

- ✅ Validação de entrada
- ✅ Verificação de assinatura webhook
- ✅ Armazenamento seguro de IDs
- ✅ Sem armazenamento de dados de cartão
- ✅ Conformidade com PCI DSS (via Stripe)

## Próximas Melhorias

1. **Webhook Stripe**: Processar eventos de pagamento
2. **Dashboard Financeiro**: Relatórios de receita
3. **Reembolsos**: Processar devoluções
4. **Agendamentos Recorrentes**: Pagamentos automáticos
5. **Relatórios de Imposto**: Gerar recibos
6. **Integração Bancária**: Transferência automática de fundos

## Testes

### Cartões de Teste (Stripe)
- Sucesso: `4242 4242 4242 4242`
- Falha: `4000 0000 0000 0002`
- Requer Autenticação: `4000 0025 0000 3155`

### Datas de Expiração
- Qualquer data futura (ex: 12/25)

### CVC
- Qualquer número de 3 dígitos

## Troubleshooting

### Erro: "Failed to create payment intent"
- Verifique se `STRIPE_SECRET_KEY` está configurado
- Verifique conexão com API do Stripe

### Pagamento não aparece no dashboard
- Verifique se webhook está configurado
- Verifique logs de erro

### Email não foi enviado
- Verifique se `SENDGRID_API_KEY` está configurado
- Verifique logs de email

## Suporte

Para dúvidas ou problemas, entre em contato com o time de desenvolvimento.
