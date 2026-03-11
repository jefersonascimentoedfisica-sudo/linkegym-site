# Linkegym MVP - Setup Guide

## 🚀 Configuração do Projeto

### 1. Supabase Setup

#### Passo 1: Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Escolha a região mais próxima (ex: São Paulo)

#### Passo 2: Obter Credenciais
1. No painel do Supabase, vá para **Settings → API**
2. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

#### Passo 3: Adicionar Credenciais ao Projeto
1. Abra `.env.local`
2. Substitua os valores:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

#### Passo 4: Executar Migrations
1. No painel do Supabase, vá para **SQL Editor**
2. Crie uma nova query
3. Copie todo o conteúdo de `supabase/migrations/001_initial_schema.sql`
4. Cole no SQL Editor do Supabase
5. Clique em **Run**

### 2. Instalar Dependências

```bash
cd linkegym-mvp
npm install
```

### 3. Executar Projeto Localmente

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:3000`

### 4. Estrutura do Projeto

```
linkegym-mvp/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Layout global
│   │   ├── (auth)/         # Páginas de autenticação
│   │   ├── (client)/       # Páginas do cliente
│   │   ├── (professional)/ # Páginas do profissional
│   │   └── (admin)/        # Páginas do admin
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                # Utilitários e configurações
│   │   └── supabase.ts    # Cliente Supabase
│   └── styles/             # Estilos globais
├── public/                 # Arquivos estáticos
├── supabase/
│   └── migrations/        # SQL migrations
├── .env.local            # Variáveis de ambiente
└── package.json          # Dependências
```

### 5. Banco de Dados

#### Tabelas Criadas:
- **users** - Usuários (cliente, profissional, admin)
- **professionals** - Dados dos profissionais
- **service_areas** - Bairros de atendimento com prioridade
- **services** - Serviços oferecidos
- **availability** - Horários disponíveis
- **bookings** - Agendamentos
- **reviews** - Avaliações
- **guarulhos_neighborhoods** - Lista de bairros de Guarulhos

#### Relacionamentos:
```
users (1) ──→ (N) professionals
professionals (1) ──→ (N) service_areas
professionals (1) ──→ (N) services
professionals (1) ──→ (N) availability
users (1) ──→ (N) bookings (como client)
professionals (1) ──→ (N) bookings
services (1) ──→ (N) bookings
bookings (1) ──→ (1) reviews
```

### 6. Funcionalidades Implementadas

#### MVP - Fase 1:
- ✅ Estrutura do banco de dados
- ✅ Configuração do Supabase
- ✅ Setup do Next.js com TypeScript

#### Próximas Fases:
- [ ] Autenticação (Cliente, Profissional, Admin)
- [ ] Home page
- [ ] Busca de profissionais
- [ ] Perfil do profissional
- [ ] Cadastro de profissional
- [ ] Sistema de agendamento
- [ ] Dashboard do cliente
- [ ] Dashboard do profissional
- [ ] Dashboard do admin
- [ ] Sistema de pagamento simulado
- [ ] Avaliações

### 7. Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Futuro: Mercado Pago / Pagar.me
# NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=...
# PAGAR_ME_API_KEY=...
```

### 8. Troubleshooting

#### Erro: "Supabase URL not configured"
- Verifique se `.env.local` está preenchido corretamente
- Reinicie o servidor: `npm run dev`

#### Erro: "Connection refused"
- Verifique se o Supabase está online
- Teste a conexão no painel do Supabase

#### Erro: "Table does not exist"
- Execute as migrations novamente no SQL Editor do Supabase
- Verifique se as tabelas foram criadas em **Database → Tables**

### 9. Próximos Passos

1. ✅ Banco de dados configurado
2. ⏭️ Implementar autenticação
3. ⏭️ Criar páginas públicas (Home, Busca, Perfil)
4. ⏭️ Implementar cadastro de profissional
5. ⏭️ Criar dashboards
6. ⏭️ Integrar pagamento simulado
7. ⏭️ Testar fluxos completos

---

**Linkegym MVP** - Marketplace de Profissionais de Saúde e Fitness
