# Roadmap

## Visão Geral

Este documento apresenta o planejamento de desenvolvimento do Clone do Trello.

O projeto será desenvolvido por milestones, permitindo evolução contínua da aplicação mantendo estabilidade, qualidade e organização da base de código.

Cada milestone representa um conjunto de funcionalidades completas antes do início da próxima etapa.

---

# Milestone 1 — Foundation ✅

## Infraestrutura

- [x] Configuração inicial do projeto
- [x] Docker
- [x] PostgreSQL
- [x] Prisma ORM
- [x] Sistema de Migrations
- [x] Fastify
- [x] TypeScript

## Arquitetura

- [x] Estrutura modular
- [x] Controllers
- [x] Use Cases
- [x] Schemas
- [x] Middlewares
- [x] Tratamento global de erros
- [x] Validação de ambiente

## Autenticação

- [x] Cadastro
- [x] Login
- [x] JWT
- [x] Hash de senha
- [x] Middleware de autenticação
- [x] Endpoint `/auth/me`

---

# Milestone 2 — Workspaces ✅

## Objetivos

- [x] Criar Workspace
- [x] Listar Workspaces
- [x] Buscar Workspace por ID
- [x] Atualizar Workspace
- [x] Excluir Workspace

### Membros

- [x] Criar convites
- [x] Aceitar convites
- [x] Listar membros
- [x] Atualizar permissões
- [x] Remover membros

### Permissões

- [x] OWNER
- [x] ADMIN
- [x] MEMBER
- [x] VIEWER

---

# Milestone 3 — Frontend 🚧

## Infraestrutura

- [x] Inicializar React + Vite
- [x] Configurar TypeScript
- [x] Configurar ESLint
- [x] Estrutura inicial de pastas
- [x] Configurar variáveis de ambiente

## Navegação

- [x] React Router
- [x] Rotas protegidas

## Comunicação

- [x] Axios
- [x] Interceptor JWT

## Autenticação

- [x] Login
- [x] Logout
- [ ] Cadastro
- [ ] AuthContext
- [ ] Persistência automática da sessão

## Workspaces

- [ ] Dashboard
- [ ] Listagem de Workspaces
- [ ] Criar Workspace
- [ ] Atualizar Workspace
- [ ] Excluir Workspace
- [ ] Gerenciar membros
- [ ] Convites

---

# Milestone 4 — Boards

## Backend

- [ ] Criar Board
- [ ] Listar Boards
- [ ] Buscar Board
- [ ] Atualizar Board
- [ ] Excluir Board

## Frontend

- [ ] Tela de Boards
- [ ] Criar Board
- [ ] Atualizar Board
- [ ] Excluir Board

---

# Milestone 5 — Lists

## Backend

- [ ] Criar List
- [ ] Listar Lists
- [ ] Atualizar List
- [ ] Excluir List
- [ ] Reordenação

## Frontend

- [ ] Interface das Lists
- [ ] CRUD de Lists

---

# Milestone 6 — Cards

## Backend

- [ ] Criar Card
- [ ] Atualizar Card
- [ ] Excluir Card
- [ ] Movimentação
- [ ] Datas de entrega
- [ ] Membros
- [ ] Comentários
- [ ] Etiquetas
- [ ] Checklist
- [ ] Upload de anexos

## Frontend

- [ ] Interface dos Cards
- [ ] Modal do Card
- [ ] Drag and Drop
- [ ] Comentários
- [ ] Checklist
- [ ] Etiquetas
- [ ] Uploads

---

# Milestone 7 — Colaboração

## WebSocket

- [ ] Socket.IO
- [ ] Atualizações em tempo real
- [ ] Sincronização de Boards
- [ ] Sincronização de Lists
- [ ] Sincronização de Cards
- [ ] Indicador de usuários online

---

# Milestone 8 — Dashboard e Notificações

## Dashboard

- [ ] Estatísticas
- [ ] Histórico
- [ ] Atividades recentes

## Notificações

- [ ] Notificações em tempo real
- [ ] Central de notificações
- [ ] Marcar como lidas

## Busca

- [ ] Busca Global

---

# Milestone 9 — Refinamento do Frontend

## Interface

- [ ] Responsividade
- [ ] Tema Escuro
- [ ] Animações
- [ ] Skeleton Loading
- [ ] Empty States
- [ ] Error Pages

## Experiência do Usuário

- [ ] Toasts
- [ ] Confirmações
- [ ] Feedback visual
- [ ] Melhorias de acessibilidade

---

# Milestone 10 — Qualidade

## Testes

- [ ] Testes Unitários
- [ ] Testes de Integração
- [ ] Testes E2E

## DevOps

- [ ] GitHub Actions
- [ ] CI/CD
- [ ] Deploy
- [ ] Monitoramento

---

# Objetivo Final

Construir um Clone do Trello completo utilizando tecnologias modernas e arquitetura escalável, simulando um ambiente de desenvolvimento profissional.

Ao final do projeto, a aplicação deverá possuir:

- Backend totalmente modularizado.
- Frontend moderno em React.
- Comunicação em tempo real.
- Sistema completo de Workspaces, Boards, Lists e Cards.
- Gerenciamento de usuários e permissões.
- Interface responsiva.
- Documentação completa.
- Testes automatizados.
- Pipeline de CI/CD.
- Estrutura pronta para produção.