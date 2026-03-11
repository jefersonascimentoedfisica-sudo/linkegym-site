# Linkegym MVP - Todo List

## ✅ Fase 1: Estrutura Base (Concluído)
- [x] Criar projeto Next.js com TypeScript
- [x] Instalar Supabase client
- [x] Configurar variáveis de ambiente
- [x] Criar schema do banco de dados
- [x] Criar migrations SQL
- [x] Criar Home page com design moderno
- [x] Criar documentação de setup

## ⏳ Fase 2: Autenticação (Próximo)
- [ ] Criar página de login
- [ ] Criar página de registro (cliente)
- [ ] Criar página de registro (profissional)
- [ ] Implementar autenticação com Supabase Auth
- [ ] Criar middleware de proteção de rotas
- [ ] Implementar logout

## ⏳ Fase 3: Páginas Públicas
- [ ] Criar página de busca de profissionais
- [ ] Implementar filtros (tipo, especialidade, bairro, modalidade, preço)
- [ ] Criar página de perfil do profissional
- [ ] Adicionar Instagram e WhatsApp no perfil
- [ ] Criar página "Sobre"
- [ ] Criar página "FAQ"
- [ ] Criar página de contato

## ⏳ Fase 4: Cadastro de Profissional
- [ ] Criar formulário de cadastro (dados pessoais)
- [ ] Adicionar upload de foto
- [ ] Criar formulário de dados profissionais
- [ ] Implementar seleção de bairros de Guarulhos
- [ ] Implementar sistema de prioridade por bairro
- [ ] Adicionar validação de CREF/CRN
- [ ] Implementar status de validação (pending/approved/rejected)

## ⏳ Fase 5: Dashboard do Profissional
- [ ] Criar layout do dashboard
- [ ] Página "Meu Perfil" (editar dados)
- [ ] Página "Meus Bairros" (gerenciar áreas de atendimento)
- [ ] Página "Meus Serviços" (criar/editar serviços)
- [ ] Página "Meus Horários" (definir disponibilidade)
- [ ] Página "Meus Agendamentos" (visualizar e gerenciar)
- [ ] Página "Minhas Avaliações" (ver reviews)
- [ ] Página "Meus Ganhos" (acompanhar receita)

## ⏳ Fase 6: Dashboard do Cliente
- [ ] Criar layout do dashboard
- [ ] Página "Meu Perfil" (editar dados)
- [ ] Página "Meus Agendamentos" (histórico)
- [ ] Página "Histórico de Pagamentos"
- [ ] Página "Minhas Avaliações" (deixar reviews)

## ⏳ Fase 7: Sistema de Agendamento
- [ ] Criar componente de calendário
- [ ] Implementar seleção de data/hora
- [ ] Criar página de confirmação de agendamento
- [ ] Implementar status de agendamento
- [ ] Adicionar notificações de agendamento

## ⏳ Fase 8: Sistema de Pagamento (Simulado)
- [ ] Criar página de checkout simulado
- [ ] Implementar cálculo de comissão (20%)
- [ ] Criar página de confirmação de pagamento
- [ ] Implementar status de pagamento
- [ ] Preparar arquitetura para Mercado Pago/Pagar.me

## ⏳ Fase 9: Sistema de Avaliações
- [ ] Criar formulário de avaliação (1-5 estrelas + comentário)
- [ ] Implementar cálculo de média de avaliações
- [ ] Exibir avaliações no perfil do profissional
- [ ] Adicionar selo de "Profissional Verificado"

## ⏳ Fase 10: Dashboard Admin
- [ ] Criar layout do dashboard admin
- [ ] Página de validação de CREF/CRN
- [ ] Página de gerenciamento de profissionais
- [ ] Página de gerenciamento de clientes
- [ ] Página de transações
- [ ] Página de relatórios

## ⏳ Fase 11: Testes e Otimizações
- [ ] Testar fluxo completo de cliente
- [ ] Testar fluxo completo de profissional
- [ ] Testar fluxo completo de admin
- [ ] Otimizar performance
- [ ] Testar responsividade mobile
- [ ] Corrigir bugs

## ⏳ Fase 12: Deploy e Publicação
- [ ] Preparar para deploy
- [ ] Deploy em produção
- [ ] Configurar domínio
- [ ] Configurar SSL/TLS
- [ ] Monitorar performance

---

## Notas Importantes

### Banco de Dados
- Todas as tabelas já foram criadas no schema SQL
- Relacionamentos estão configurados
- Índices foram adicionados para performance

### Autenticação
- Usar Supabase Auth (email/password)
- Suportar 3 tipos de usuários: client, professional, admin

### Bairros de Guarulhos
- 20 bairros pré-configurados no banco
- Sistema de prioridade (1-4) para cada bairro

### Comissão
- Plataforma retém 20% do valor do serviço
- Profissional recebe 80%

### Próximas Etapas
1. Conectar Supabase com credenciais reais
2. Implementar autenticação
3. Criar páginas de busca e perfil
4. Implementar cadastro de profissional
5. Criar dashboards
6. Testar fluxos completos
