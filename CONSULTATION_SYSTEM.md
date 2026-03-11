# Sistema de Consultas com Nutricionistas - LinkeGym

## Visão Geral

O sistema de consultas foi implementado para permitir que clientes paguem consultas nutricionais diretamente no site e depois entrem em contato com a nutricionista para agendar o atendimento.

## Fluxo Completo

```
1. Cliente acessa perfil da nutricionista
2. Vê o valor da consulta
3. Clica em "Agendar Consulta"
4. Preenche nome, email e observações
5. Realiza pagamento
6. Recebe confirmação
7. É direcionado para WhatsApp da nutricionista
8. Combina data e horário via WhatsApp
```

## Componentes Criados

### 1. Tabela `consultations`
Armazena informações das consultas:
- `id`: UUID único
- `nutritionist_id`: Referência à nutricionista
- `client_name`: Nome do cliente
- `client_email`: Email do cliente
- `notes`: Observações (opcional)
- `price`: Valor da consulta
- `status`: paid | scheduled | completed | cancelled
- `payment_id`: Referência ao pagamento
- `scheduled_date`: Data agendada (após WhatsApp)
- `scheduled_time`: Horário agendado (após WhatsApp)
- `created_at`, `updated_at`: Timestamps

### 2. Colunas Adicionadas em `professionals`
- `consultation_price`: Preço da consulta (padrão: R$ 150.00)
- `service_type`: presencial | online | ambos
- `service_regions`: JSON array de regiões/bairros atendidos

### 3. Componentes React

#### `ConsultationPaymentModal.tsx`
Modal de pagamento da consulta:
- Exibe nome da nutricionista
- Mostra valor da consulta
- Formulário com nome, email e observações
- Processamento de pagamento
- Confirmação de sucesso

#### `ConsultationConfirmation.tsx`
Tela de confirmação pós-pagamento:
- Mensagem de sucesso
- Botão grande para abrir WhatsApp
- Informações de confirmação por email
- Dicas para a consulta

### 4. Funções Auxiliares (`consultations-helper.ts`)

```typescript
// Criar consulta
createConsultation(nutritionistId, clientName, clientEmail, price, notes?)

// Obter consulta por ID
getConsultationById(consultationId)

// Obter consultas de uma nutricionista
getConsultationsByNutritionistId(nutritionistId)

// Atualizar status
updateConsultationStatus(consultationId, status)

// Agendar consulta
scheduleConsultation(consultationId, date, time)

// Obter perfil da nutricionista
getNutritionistProfile(nutritionistId)

// Atualizar configurações de consulta
updateNutritionistSettings(nutritionistId, price, serviceType, regions)

// Formatadores
formatConsultationPrice(price)
getServiceTypeLabel(serviceType)
```

### 5. Integração no Perfil

Na página `/professional/[id]`:

#### Para Nutricionistas:
- Exibe "🥗 Consulta Nutricional" com o valor
- Botão destacado "Agendar Consulta" em verde
- Mostra tipo de atendimento (presencial/online/ambos)
- Botão alternativo "Falar no WhatsApp"

#### Para Personal Trainers:
- Mantém funcionalidade original
- Botão "Agendar Aula" em laranja
- Sem alterações

## Mensagem Automática no WhatsApp

Quando o cliente clica em "Falar com a nutricionista no WhatsApp":

```
URL: https://wa.me/{telefone}?text={mensagem_codificada}

Mensagem:
"Olá {Nome}! Acabei de pagar minha consulta pelo LinkeGym 
e gostaria de combinar a data e o horário do meu atendimento."
```

A mensagem é gerada dinamicamente com:
- Nome da nutricionista
- `encodeURIComponent` para compatibilidade
- Compatível com WhatsApp Web e mobile

## Banco de Dados

### Tabela `consultations`
```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY,
  nutritionist_id UUID REFERENCES professionals(id),
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  notes TEXT,
  price DECIMAL(10, 2),
  status VARCHAR(50),
  payment_id UUID REFERENCES payments(id),
  scheduled_date DATE,
  scheduled_time TIME,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Alterações em `professionals`
```sql
ALTER TABLE professionals ADD consultation_price DECIMAL(10, 2);
ALTER TABLE professionals ADD service_type VARCHAR(50);
ALTER TABLE professionals ADD service_regions TEXT;
```

## Status de Consulta

| Status | Descrição |
|--------|-----------|
| paid | Pagamento confirmado, aguardando agendamento |
| scheduled | Data e hora agendadas |
| completed | Consulta realizada |
| cancelled | Consulta cancelada |

## Fluxo de Pagamento

1. **Modal de Pagamento**
   - Cliente preenche formulário
   - Clica em "Pagar Consulta"
   - Sistema processa pagamento (mock por enquanto)

2. **Registro de Consulta**
   - Consulta é criada com status "paid"
   - Referência ao pagamento é salva
   - Email de confirmação é enviado

3. **Confirmação**
   - Tela de sucesso é exibida
   - Botão para abrir WhatsApp
   - Cliente é direcionado para nutricionista

4. **Agendamento**
   - Cliente combina data/hora via WhatsApp
   - Nutricionista atualiza status para "scheduled"
   - Consulta é confirmada

## Configuração da Nutricionista

Campos que a nutricionista pode definir:

1. **Preço da Consulta**
   - Padrão: R$ 150.00
   - Pode ser alterado no perfil

2. **Tipo de Atendimento**
   - Presencial: 📍
   - Online: 💻
   - Ambos: 📍 + 💻

3. **Regiões de Atendimento**
   - Para presencial
   - Lista de bairros/regiões
   - Armazenado como JSON

## Integração com Pagamento

A consulta está integrada com o sistema de pagamentos:

1. Quando pagamento é confirmado
2. Consulta é criada com `payment_id`
3. Status é marcado como "paid"
4. Email de confirmação é enviado

## Email de Confirmação

### Para Cliente
- Confirmação de pagamento
- Valor da consulta
- Nome da nutricionista
- Instruções para contato

### Para Nutricionista
- Notificação de nova consulta
- Dados do cliente
- Valor recebido
- Instruções para agendamento

## Próximas Melhorias

1. **Dashboard da Nutricionista**
   - Gerenciar consultas
   - Ver histórico
   - Atualizar status

2. **Calendário Integrado**
   - Nutricionista define horários disponíveis
   - Cliente escolhe data/hora automaticamente
   - Confirmação automática

3. **Lembretes**
   - Email 24h antes da consulta
   - WhatsApp de confirmação

4. **Relatórios**
   - Histórico de consultas
   - Receita por mês
   - Taxa de conclusão

5. **Avaliações**
   - Cliente avalia consulta
   - Feedback para nutricionista

## Testes

### Testar Fluxo Completo

1. Acessar perfil de nutricionista
2. Clicar em "Agendar Consulta"
3. Preencher formulário
4. Clicar em "Pagar Consulta"
5. Aguardar confirmação
6. Clicar em "Falar com a nutricionista"
7. Verificar se WhatsApp abre com mensagem

### Verificar Banco de Dados

```sql
-- Ver consultas criadas
SELECT * FROM consultations;

-- Ver consultas por nutricionista
SELECT * FROM consultations WHERE nutritionist_id = 'id';

-- Ver consultas pagas
SELECT * FROM consultations WHERE status = 'paid';
```

## Troubleshooting

### Erro: "Erro ao registrar consulta"
- Verifique se a nutricionista existe no banco
- Verifique se `nutritionist_id` está correto
- Verifique logs do servidor

### WhatsApp não abre
- Verifique se número está no formato correto
- Remova caracteres especiais
- Teste URL manualmente

### Email não foi enviado
- Verifique se `SENDGRID_API_KEY` está configurado
- Verifique logs de email
- Teste serviço de email

## Suporte

Para dúvidas ou problemas, entre em contato com o time de desenvolvimento.
