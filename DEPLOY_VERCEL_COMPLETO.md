# 🚀 Guia Completo de Deploy - LinkeGym na Vercel

## 📋 Resumo das Mudanças Implementadas

✅ **Logo Oficial Integrado**
- Logo completo com tagline "Conectando você à saúde e performance" no header
- Favicon quadrado (ícone) configurado
- Responsivo em desktop e mobile
- Clicável para voltar à home

✅ **Páginas Atualizadas**
- Home (`/`)
- Busca de Profissionais (`/search`)
- Perfil do Profissional (`/professional/[id]`)
- Cadastro de Profissional (`/register/professional`)
- Cadastro de Aluno (`/register/student`)

---

## 🎯 Passo a Passo para Deploy

### Passo 1: Acessar Vercel

1. Vá para https://vercel.com
2. Clique em **"Sign Up"** ou **"Log In"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

### Passo 2: Importar Projeto

1. Após fazer login, clique em **"Add New..."**
2. Selecione **"Project"**
3. Procure por **"linkegym-site"** na lista de repositórios
4. Clique em **"Import"**

### Passo 3: Configurar Variáveis de Ambiente

Na página de configuração do projeto, você verá uma seção **"Environment Variables"**.

Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://tttypwipemjeacygljlz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_NRFI9sVumNTJS689qtluWg_VlgTQ4mw
```

**Importante:** Essas são as chaves públicas do Supabase, seguras para usar no frontend.

### Passo 4: Configurar Build

1. **Framework Preset:** Next.js (deve ser detectado automaticamente)
2. **Build Command:** `npm run build` ou `pnpm build`
3. **Output Directory:** `.next`
4. **Install Command:** `npm install` ou `pnpm install`

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (geralmente 2-3 minutos)
3. Você receberá um link público como: `https://linkegym-xxx.vercel.app`

---

## 📱 Acessar pelo Celular

1. Abra o link gerado em qualquer navegador mobile
2. O site é totalmente responsivo
3. Teste todas as funcionalidades:
   - Busca de profissionais
   - Perfil detalhado
   - Agendamento de aulas
   - Consultas com nutricionistas
   - Sistema de avaliações

---

## 🎨 Verificação Visual

### Desktop
- Logo aparece no lado esquerdo do header
- Tagline "Conectando você à saúde e performance" visível
- Navegação limpa e profissional

### Mobile
- Logo redimensiona corretamente
- Tagline fica oculta em telas pequenas (hidden sm:block)
- Header compacto e responsivo

### Favicon
- Ícone quadrado com design fitness-tech
- Aparece na aba do navegador
- Cores: azul (#0066FF) e laranja (#FF9900)

---

## ⚠️ Troubleshooting

### Erro 404 ao acessar
- Verifique se o build foi bem-sucedido
- Limpe o cache do navegador (Ctrl+Shift+Del)

### Imagens não carregam
- As imagens estão hospedadas no CDN
- Verifique sua conexão com a internet

### Variáveis de ambiente não funcionam
- Certifique-se de que as variáveis foram adicionadas corretamente
- Redeploy o projeto após adicionar variáveis

### Supabase não conecta
- Verifique as chaves do Supabase
- Confirme que o banco de dados está ativo

---

## 🔧 Comandos Úteis (Local)

```bash
# Instalar dependências
npm install
# ou
pnpm install

# Rodar em desenvolvimento
npm run dev
# ou
pnpm dev

# Build para produção
npm run build
# ou
pnpm build

# Testar build localmente
npm run start
# ou
pnpm start
```

---

## 📊 Funcionalidades Disponíveis

✅ Busca de profissionais com filtros  
✅ Perfil detalhado com avaliações  
✅ Agendamento de aulas  
✅ Consultas com nutricionistas  
✅ Sistema de avaliações (1-5 estrelas)  
✅ Dashboard do aluno  
✅ Dashboard do profissional  
✅ Contato via WhatsApp  
✅ Cadastro de profissionais  
✅ Cadastro de alunos  

---

## 🎯 Próximos Passos (Opcional)

1. **Domínio Customizado:** Configure um domínio próprio na Vercel
2. **Analytics:** Adicione Google Analytics para rastrear usuários
3. **SEO:** Otimize meta tags e schema markup
4. **Email:** Configure notificações por email
5. **Pagamentos:** Integre Stripe ou Mercado Pago

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel Dashboard
2. Consulte a documentação do Next.js
3. Verifique a documentação do Supabase

---

**Versão:** 1.0  
**Data:** Março 2026  
**Status:** Pronto para Deploy ✅
