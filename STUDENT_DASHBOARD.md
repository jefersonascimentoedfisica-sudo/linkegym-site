# Dashboard do Aluno - LinkeGym

## Visão Geral

O Dashboard do Aluno é uma página protegida onde os alunos podem gerenciar todas as suas aulas, consultas, pagamentos e favoritos em um único lugar.

## Acesso

**URL:** `/student-dashboard`

**Autenticação:** Email armazenado em `localStorage` com chave `studentEmail`

## Funcionalidades

### 1. Próximos Agendamentos 📅

Exibe todas as aulas e consultas agendadas para o futuro:

- **Informações Exibidas:**
  - Nome do profissional
  - Tipo (Personal Trainer / Nutricionista)
  - Data e horário
  - Observações
  - Status (Confirmado)

- **Ações Disponíveis:**
  - 💬 **WhatsApp**: Abre conversa com o profissional
  - 📅 **Reagendar**: Altera data/horário
  - ✕ **Cancelar**: Cancela o agendamento

### 2. Histórico 📋

Lista todas as aulas e consultas passadas:

- **Informações:**
  - Data e horário
  - Nome do profissional
  - Observações
  - Status (Concluído, Cancelado, etc)

- **Ações:**
  - Avaliar (após conclusão)
  - Ver detalhes

### 3. Histórico de Pagamentos 💳

Exibe todos os pagamentos realizados:

- **Informações:**
  - Data do pagamento
  - Descrição (Aula / Consulta)
  - Valor pago
  - Status (Pago / Pendente)
  - Método de pagamento

- **Estatísticas:**
  - Total gasto
  - Número de transações

- **Recursos:**
  - Download de recibos
  - Filtro por período

### 4. Profissionais Favoritos ⭐

Gerencia profissionais marcados como favoritos:

- **Informações por Profissional:**
  - Nome e tipo
  - Bio/descrição
  - Avaliação média
  - Anos de experiência
  - Preço da aula/consulta

- **Ações:**
  - Ver perfil completo
  - Contato via WhatsApp
  - Remover dos favoritos
  - Agendar aula/consulta

### 5. Editar Perfil 👤

Permite que o aluno atualize seus dados:

- **Campos Editáveis:**
  - Nome
  - Telefone
  - Data de nascimento
  - Cidade
  - Bairro
  - Bio

- **Campos Não Editáveis:**
  - Email (identificador único)

## Banco de Dados

### Tabela `students`

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Tabela `favorites`

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  professional_id UUID REFERENCES professionals(id),
  created_at TIMESTAMP,
  UNIQUE(student_id, professional_id)
);
```

### Alterações em Tabelas Existentes

```sql
ALTER TABLE bookings ADD student_id UUID REFERENCES students(id);
ALTER TABLE consultations ADD student_id UUID REFERENCES students(id);
```

## Componentes

### Página Principal: `student-dashboard/page.tsx`

- Layout com abas
- Estatísticas no topo
- Navegação entre seções
- Autenticação

### Componentes Reutilizáveis

1. **UpcomingBookings.tsx**
   - Lista agendamentos próximos
   - Botões de ação (WhatsApp, Reagendar, Cancelar)

2. **RescheduleModal.tsx**
   - Modal para reagendamento
   - Seletor de data/hora
   - Validação

3. **PaymentHistory.tsx**
   - Tabela de pagamentos
   - Estatísticas
   - Filtros

4. **FavoriteProfessionals.tsx**
   - Grid de favoritos
   - Informações do profissional
   - Ações rápidas

5. **StudentProfile.tsx**
   - Modo visualização/edição
   - Formulário de atualização
   - Validação

## Funções Auxiliares (`students-helper.ts`)

```typescript
// Obter ou criar aluno
getOrCreateStudent(email, name)

// Obter aluno por email
getStudentByEmail(email)

// Atualizar perfil
updateStudentProfile(studentId, updates)

// Favoritos
addFavorite(studentId, professionalId)
removeFavorite(studentId, professionalId)
isFavorite(studentId, professionalId)
getStudentFavorites(studentId)

// Agendamentos
getStudentBookings(studentId)
getStudentConsultations(studentId)
getStudentPayments(studentId)

// Ações
cancelBooking(bookingId)
cancelConsultation(consultationId)
rescheduleBooking(bookingId, newDate, newTime)

// Formatadores
formatDate(dateString)
getStatusColor(status)
getStatusLabel(status)
```

## Fluxo de Autenticação

1. **Login**: Email armazenado em `localStorage`
2. **Dashboard**: Carrega dados do aluno
3. **Logout**: Remove email do `localStorage`

### Implementação Futura

- Integração com OAuth/Manus Auth
- Sessões seguras
- Recuperação de senha

## Estatísticas Exibidas

No topo do dashboard:

- 📅 **Próximos Agendamentos**: Contagem de aulas/consultas futuras
- 💳 **Pagamentos Realizados**: Total de transações
- ⭐ **Profissionais Favoritos**: Quantidade de favoritos
- ✓ **Aulas/Consultas Concluídas**: Histórico de conclusões

## Ações Principais

### Cancelar Agendamento
- Requer confirmação
- Atualiza status para "cancelled"
- Notifica o profissional (futura integração)

### Reagendar Aula
- Abre modal com seletor de data/hora
- Valida disponibilidade
- Atualiza banco de dados
- Notifica profissional (futura integração)

### Contato via WhatsApp
- Abre conversa com número do profissional
- Mensagem pré-preenchida
- Funciona em Web e Mobile

### Favoritar Profissional
- Adiciona à tabela `favorites`
- Exibe no painel de favoritos
- Permite remover facilmente

## Segurança

### Implementado
- ✅ Validação de entrada
- ✅ Verificação de propriedade (student_id)
- ✅ RLS policies no Supabase

### Recomendado (Futuro)
- 🔒 Autenticação OAuth
- 🔒 Tokens JWT
- 🔒 Rate limiting
- 🔒 Criptografia de dados sensíveis

## Próximas Melhorias

1. **Notificações em Tempo Real**
   - Confirmação de agendamento
   - Lembretes de aula
   - Mensagens do profissional

2. **Sistema de Avaliação**
   - Avaliar após conclusão
   - Feedback detalhado
   - Fotos/vídeos

3. **Integração de Calendário**
   - Sincronizar com Google Calendar
   - Lembretes automáticos
   - Visualização mensal

4. **Relatórios**
   - Progresso em aulas
   - Estatísticas de gasto
   - Metas alcançadas

5. **Comunicação**
   - Chat integrado
   - Notificações push
   - Email automático

6. **Pagamento**
   - Salvar métodos de pagamento
   - Pagamento recorrente
   - Cupons/descontos

## Testes

### Testar Fluxo Completo

1. Acessar `/student-dashboard`
2. Verificar carregamento de dados
3. Testar cada aba
4. Testar ações (cancelar, reagendar, etc)
5. Testar edição de perfil

### Verificar Banco de Dados

```sql
-- Ver alunos
SELECT * FROM students;

-- Ver favoritos
SELECT * FROM favorites;

-- Ver agendamentos do aluno
SELECT * FROM bookings WHERE student_id = 'id';
```

## Troubleshooting

### Erro: "Aluno não encontrado"
- Verifique se `studentEmail` está em `localStorage`
- Verifique se aluno existe no banco
- Crie novo aluno se necessário

### Dados não carregam
- Verifique conexão com Supabase
- Verifique RLS policies
- Verifique logs do console

### Ações não funcionam
- Verifique se `student_id` está correto
- Verifique permissões no banco
- Verifique validação de entrada

## Suporte

Para dúvidas ou problemas, entre em contato com o time de desenvolvimento.
