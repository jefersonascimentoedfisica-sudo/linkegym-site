# 🚀 Guia de Deploy - LinkeGym MVP na Vercel

## Passo 1: Acessar Vercel

1. Vá para https://vercel.com
2. Clique em "Sign Up" ou "Log In"
3. Escolha "Continue with GitHub"
4. Autorize o Vercel a acessar seus repositórios

## Passo 2: Importar Projeto

1. Após fazer login, clique em "Add New..."
2. Selecione "Project"
3. Procure por "linkegym-site" na lista de repositórios
4. Clique em "Import"

## Passo 3: Configurar Variáveis de Ambiente

Na página de configuração, adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://tttypwipemjeacygljlz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_NRFI9sVumNTJS689qtluWg_VlgTQ4mw
```

## Passo 4: Deploy

1. Clique em "Deploy"
2. Aguarde o build completar (geralmente 2-3 minutos)
3. Você receberá um link público como: `https://linkegym-xxx.vercel.app`

## Passo 5: Acessar pelo Celular

1. Abra o link em qualquer navegador
2. O site é totalmente responsivo
3. Teste todas as funcionalidades

## ⚠️ Importante

- **Não compartilhe suas chaves Supabase** em repositórios públicos
- Use variáveis de ambiente para dados sensíveis
- O Supabase já está configurado com dados de teste

## 🔧 Troubleshooting

Se encontrar erros:

1. Verifique se as variáveis de ambiente estão corretas
2. Verifique a conexão com o Supabase
3. Limpe o cache do navegador (Ctrl+Shift+Del)
4. Verifique os logs no Vercel Dashboard

## 📱 Funcionalidades Disponíveis

✅ Busca de profissionais  
✅ Perfil detalhado  
✅ Agendamento de aulas  
✅ Consultas com nutricionistas  
✅ Sistema de avaliações  
✅ Dashboard do aluno  
✅ Dashboard do profissional  
✅ Contato via WhatsApp  

---

**Dúvidas?** Verifique a documentação em `README.md`
