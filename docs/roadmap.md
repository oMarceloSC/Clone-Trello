# Roadmap

## Visão Geral

Este documento apresenta o planejamento de desenvolvimento do Clone do Trello.

O projeto é desenvolvido por milestones, permitindo evolução contínua da aplicação enquanto mantém estabilidade, qualidade e organização da base de código.

Cada milestone representa um conjunto de funcionalidades relacionadas.

---

# Milestone 1 — Foundation ✅

## Infraestrutura

* [x] Configuração inicial do projeto
* [x] Docker
* [x] PostgreSQL
* [x] Prisma ORM
* [x] Adapter PostgreSQL para Prisma 7
* [x] Sistema de Migrations
* [x] Fastify
* [x] TypeScript

## Arquitetura

* [x] Estrutura modular
* [x] Controllers
* [x] Use Cases
* [x] Schemas
* [x] Middlewares
* [x] Tratamento global de erros
* [x] Validação de ambiente
* [x] Documentação modular

## Autenticação do Backend

* [x] Cadastro
* [x] Login
* [x] JWT
* [x] Hash de senha
* [x] Middleware de autenticação
* [x] Endpoint `/auth/me`

---

# Milestone 2 — Workspaces ✅

## CRUD

* [x] Criar Workspace
* [x] Listar Workspaces
* [x] Buscar Workspace por ID
* [x] Atualizar Workspace
* [x] Excluir Workspace

## Convites

* [x] Criar convite
* [x] Gerar token único
* [x] Definir expiração
* [x] Aceitar convite
* [x] Validar email do convidado
* [x] Atualizar convite para `ACCEPTED`
* [x] Marcar convite expirado

## Membros

* [x] Criar membro automaticamente após aceitar convite
* [x] Listar membros
* [x] Atualizar permissão
* [x] Remover membro

## Permissões

* [x] OWNER
* [x] ADMIN
* [x] MEMBER
* [x] VIEWER
* [x] Proteger atualização
* [x] Proteger exclusão
* [x] Proteger convites
* [x] Proteger gerenciamento de membros

---

# Milestone 3 — Frontend de Integração ✅

## Infraestrutura

* [x] Inicializar React com Vite
* [x] Configurar TypeScript
* [x] Configurar ESLint
* [x] Criar estrutura inicial
* [x] Configurar variáveis de ambiente

## Navegação

* [x] Configurar React Router
* [x] Criar rota de login
* [x] Criar rota de cadastro
* [x] Criar rota protegida
* [x] Configurar redirecionamentos
* [x] Criar página 404
* [x] Criar layout autenticado

## Comunicação

- [x] Configurar Axios
- [x] Configurar URL da API
- [x] Criar interceptor JWT
- [x] Criar serviço de autenticação
- [x] Implementar serviço de recuperação de senha
- [x] Implementar serviço de redefinição de senha
- [x] Criar interceptor de respostas
- [x] Tratar sessão expirada

## Autenticação

- [x] Implementar Login
- [x] Implementar Cadastro
- [x] Implementar Logout
- [x] Persistir token no localStorage
- [x] Persistir usuário no localStorage
- [x] Validar formulários com Zod
- [x] Integrar React Hook Form
- [x] Implementar AuthContext
- [x] Recuperar sessão com `/auth/me`
- [x] Bloquear páginas públicas para usuários autenticados
- [x] Implementar recuperação de senha
- [x] Implementar redefinição de senha

## Workspaces

* [x] Listar Workspaces no Dashboard
* [x] Criar Workspace
* [x] Visualizar Workspace
* [x] Atualizar Workspace
* [x] Excluir Workspace
* [x] Listar membros
* [x] Alterar permissões
* [x] Remover membro
* [x] Criar convite
* [x] Aceitar convite

## Interface

- [x] Criar estilos globais iniciais
- [x] Criar layout de autenticação
- [x] Criar feedback de erro
- [x] Criar feedback de sucesso
- [x] Estado de carregamento de Workspaces
- [x] Estado vazio de Workspaces
- [x] Modal de criação de Workspace
- [x] Formulário de criação de Workspace
- [x] Atualização automática da lista após criação
- [x] Sidebar compartilhada
- [x] Header compartilhado
- [x] WorkspacePage
- [x] Página 404 personalizada
- [x] Página de recuperação de senha
- [x] Página de redefinição de senha
- [x] Link "Esqueci minha senha"
- [x] Exibição do link de redefinição durante o desenvolvimento
- [x] Botão para copiar o link de redefinição
- [x] Redirecionamento automático para Login após redefinição da senha
- [x] Mensagem de confirmação após redefinição da senha
- [x] Breadcrumb de navegação
- [x] Cards de resumo do Workspace
- [x] Modal de edição de Workspace
- [x] Atualização automática da interface após edição
- [x] Controle de permissões para edição
- [x] Botão destrutivo para exclusão
- [x] Modal de confirmação de exclusão
- [x] Controle de permissão para exclusão
- [x] Redirecionamento após exclusão

---

# Milestone 4 — Boards 🚧

## Backend

* [x] Model Board
* [x] Model BoardMember
* [x] Criar Board
* [x] Listar Boards
* [x] Buscar Board por ID
* [x] Atualizar Board
* [x] Controle de acesso aos Boards
* [x] Excluir Board
* [ ] Favoritar Board
* [ ] Arquivar Board
* [ ] Sistema de permissões do Board

## Frontend

* [x] Listar Boards
* [x] Criar Board
* [x] Visualizar Board
* [x] BoardPage
* [x] Atualizar Board
* [x] Navegação workspace → Board
* [x] Excluir Board
* [ ] Favoritar Board
* [ ] Arquivar Board

---

# Milestone 5 — Lists

## Backend

* [ ] Model List
* [ ] Criar List
* [ ] Listar Lists
* [ ] Atualizar List
* [ ] Excluir List
* [ ] Reordenar Lists

## Frontend

* [ ] Exibir Lists
* [ ] Criar List
* [ ] Atualizar List
* [ ] Excluir List
* [ ] Reordenar Lists

---

# Milestone 6 — Cards

## Backend

* [ ] Model Card
* [ ] Model CardMember
* [ ] Criar Card
* [ ] Buscar Card
* [ ] Atualizar Card
* [ ] Excluir Card
* [ ] Arquivar Card
* [ ] Movimentar Card
* [ ] Datas de entrega
* [ ] Membros
* [ ] Comentários
* [ ] Etiquetas
* [ ] Checklist
* [ ] Upload de anexos

## Frontend

* [ ] Exibir Cards
* [ ] Criar Card
* [ ] Atualizar Card
* [ ] Excluir Card
* [ ] Modal do Card
* [ ] Drag and Drop
* [ ] Datas de entrega
* [ ] Membros
* [ ] Comentários
* [ ] Etiquetas
* [ ] Checklist
* [ ] Uploads

---

# Milestone 7 — Colaboração em Tempo Real

## WebSocket

* [ ] Configurar Socket.IO no backend
* [ ] Configurar Socket.IO Client
* [ ] Autenticar conexões
* [ ] Criar Rooms por Workspace
* [ ] Criar Rooms por Board
* [ ] Sincronizar Boards
* [ ] Sincronizar Lists
* [ ] Sincronizar Cards
* [ ] Sincronizar comentários
* [ ] Exibir usuários online

---

# Milestone 8 — Dashboard, Atividades e Notificações

## Dashboard

* [ ] Estatísticas
* [ ] Métricas
* [ ] Atividades recentes
* [ ] Cards concluídos
* [ ] Prazos próximos

## Atividades

* [ ] Model Activity
* [ ] Histórico do Workspace
* [ ] Histórico do Board
* [ ] Histórico do Card

## Notificações

* [ ] Model Notification
* [ ] Central de notificações
* [ ] Marcar notificação como lida
* [ ] Notificações em tempo real

## Busca

* [ ] Busca global
* [ ] Busca de Workspaces
* [ ] Busca de Boards
* [ ] Busca de Cards

---

# Milestone 9 — Refinamento do Frontend

## Interface

* [ ] Responsividade
* [ ] Tema escuro
* [ ] Design System
* [ ] Animações
* [ ] Skeleton loading
* [ ] Empty states
* [ ] Error pages
* [ ] Modais
* [ ] Toasts
- [ ] Criar componentes reutilizáveis
- [ ] Criar estados de carregamento
- [ ] Criar empty states
- [ ] Criar sistema de mensagens ou toasts

## Experiência do Usuário

* [ ] Confirmações para ações destrutivas
* [ ] Feedback visual
* [ ] Navegação por teclado
* [ ] Acessibilidade
* [ ] Otimização para dispositivos móveis

---

# Milestone 10 — Qualidade e Produção

## Testes

* [ ] Testes unitários
* [ ] Testes de integração
* [ ] Testes E2E
* [ ] Testes de permissões
* [ ] Testes do WebSocket

## Segurança

* [ ] Rate limiting
* [ ] Helmet
* [ ] Refresh tokens
* [ ] Revogação de sessão
* [ ] Auditoria de segurança

## DevOps

* [ ] GitHub Actions
* [ ] CI
* [ ] CD
* [ ] Deploy do backend
* [ ] Deploy do frontend
* [ ] Banco de produção
* [ ] Monitoramento
* [ ] Logs estruturados

---

# Milestone 11 — Assistente Inteligente

## Backend

- [ ] Criar módulo Assistant
- [ ] Integrar API de IA
- [ ] Criar contexto por Workspace
- [ ] Criar contexto por Board
- [ ] Implementar ferramentas internas
- [ ] Validar permissões
- [ ] Registrar ações do assistente

## Frontend

- [ ] Criar painel do assistente
- [ ] Criar histórico de mensagens
- [ ] Exibir carregamento das respostas
- [ ] Permitir resumo de Boards
- [ ] Permitir sugestão de tarefas
- [ ] Confirmar ações antes da execução

---

# Objetivo Final

Construir um Clone do Trello completo utilizando tecnologias modernas e arquitetura escalável, simulando um ambiente profissional de desenvolvimento.

Ao final, a aplicação deverá possuir:

* Backend modular.
* Frontend moderno em React.
* Autenticação completa.
* Recuperação de senha.
* Redefinição de senha.
* Workspaces, Boards, Lists e Cards.
* Sistema de membros e permissões.
* Convites.
* Comunicação em tempo real.
* Notificações.
* Busca global.
* Interface responsiva.
* Tema escuro.
* Documentação completa.
* Testes automatizados.
* Pipeline de CI/CD.
* Estrutura pronta para produção.
