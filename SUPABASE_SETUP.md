# 🚀 LinkeGym - Supabase Setup Guide

## 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha os dados:
   - **Name:** linkegym-mvp
   - **Database Password:** (guarde bem!)
   - **Region:** South America (São Paulo)
4. Clique em "Create new project"
5. Aguarde a criação (pode levar alguns minutos)

## 2. Copiar Credenciais

Após criar o projeto:

1. Vá para **Settings → API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Preencher .env.local

Crie/atualize o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## 4. Executar Migrations

### Opção A: Via Supabase Dashboard (Recomendado)

1. No Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo de `supabase/migrations/002_complete_schema.sql`
4. Cole na query
5. Clique em **Run**

### Opção B: Via CLI do Supabase

```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-project-ref

# Executar migrations
supabase db push
```

## 5. Verificar Tabelas

Após executar as migrations:

1. Vá para **Table Editor** no Supabase
2. Você deve ver as seguintes tabelas:
   - `neighborhoods` (20 bairros pré-carregados)
   - `users`
   - `professionals`
   - `service_areas`
   - `services`
   - `availability`
   - `bookings`
   - `reviews`
   - `transactions`
   - `earnings`

## 6. Configurar Autenticação

1. Vá para **Authentication → Providers**
2. Habilite:
   - **Email** (já vem habilitado)
   - **Google** (opcional)
   - **GitHub** (opcional)

## 7. Estrutura do Banco

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `neighborhoods` | 20 bairros de Guarulhos |
| `users` | Alunos/Clientes |
| `professionals` | Personal Trainers e Nutricionistas |
| `service_areas` | Bairros de atendimento com prioridade |
| `services` | Serviços oferecidos |
| `availability` | Horários disponíveis |
| `bookings` | Agendamentos |
| `reviews` | Avaliações |
| `transactions` | Transações e ganhos |
| `earnings` | Ganhos acumulados |

### Relacionamentos

```
users (1) ──→ (N) professionals
users (1) ──→ (N) bookings
professionals (1) ──→ (N) service_areas
professionals (1) ──→ (N) services
professionals (1) ──→ (N) availability
professionals (1) ──→ (N) bookings
professionals (1) ──→ (N) reviews
professionals (1) ──→ (N) transactions
professionals (1) ──→ (N) earnings
bookings (1) ──→ (N) reviews
neighborhoods (1) ──→ (N) service_areas
```

## 8. Dados de Teste

A migration já inclui dados de teste:
- 5 alunos de exemplo
- 10 profissionais de exemplo
- Serviços e áreas de atendimento

## 9. Row Level Security (RLS)

O banco já vem com RLS configurado para segurança:
- Usuários só veem seus próprios dados
- Profissionais verificados são públicos
- Bookings são privados

## 10. Próximos Passos

Após configurar o Supabase:

1. ✅ Instalar cliente Supabase no Next.js
2. ✅ Implementar autenticação
3. ✅ Conectar formulários ao banco
4. ✅ Criar dashboards
5. ✅ Implementar agendamentos

## Troubleshooting

### Erro: "Relation does not exist"
- Verifique se as migrations foram executadas
- Tente novamente a migration

### Erro: "Permission denied"
- Verifique as políticas RLS
- Certifique-se de estar autenticado

### Erro: "Invalid API key"
- Verifique as credenciais em `.env.local`
- Copie novamente do Supabase

## Contato

Para dúvidas, consulte a documentação:
- https://supabase.com/docs
- https://supabase.com/docs/guides/getting-started

---

**Pronto!** Após completar estes passos, o banco de dados estará pronto para uso! 🚀
