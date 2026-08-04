# Arquitetura do Sistema

## Visão Geral

O Clone do Trello foi projetado utilizando uma arquitetura modular baseada em **Use Cases**, priorizando organização, escalabilidade e facilidade de manutenção.

O objetivo dessa arquitetura é permitir que novas funcionalidades sejam adicionadas sem impactar módulos já existentes, mantendo baixo acoplamento entre as camadas da aplicação.

A aplicação é dividida em dois grandes blocos:

- Backend
- Frontend

A comunicação entre ambos acontece através de uma API REST e, futuramente, por WebSockets utilizando Socket.IO.

---

# Arquitetura Geral

```
                  React + TypeScript
                        │
                 Pages / Layouts
                        │
                 Frontend Services
                        │
                        │ HTTP / WebSocket
                        ▼
              Fastify REST API
                        │
                    Routes
                        │
                 Middlewares
                        │
                Controllers
                        │
                  Use Cases
                        │
                  Prisma ORM
                        │
                 PostgreSQL Database
```

---

# Tecnologias

## Backend

- Node.js
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Zod
- Socket.IO
- Docker

## Frontend

- React
- TypeScript
- Vite
- CSS
- Socket.IO Client

---

# Estrutura do Projeto

```
Clone-Trello
│
├── backend
│
├── frontend
│
├── docs
│
└── docker-compose.yml
```

---

# Arquitetura do Backend

```
backend
│
├── prisma
│
├── src
│
│   ├── config
│   ├── lib
│   ├── middlewares
│   ├── modules
│   ├── plugins
│   ├── routes
│   ├── shared
│   ├── types
│   ├── utils
│   │
│   ├── app.ts
│   └── server.ts
```

---

# Arquitetura do Frontend

O frontend utiliza uma arquitetura baseada em funcionalidades.

```text
frontend
│
├── src
│   ├── assets
│   ├── components
│   ├── features
│   ├── layouts
│   ├── pages
│   ├── routes
│   ├── services
│   ├── styles
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
```

As funcionalidades são organizadas por domínio.

Exemplo:

```text
features
│
├── auth
└── workspaces
```

Cada feature pode possuir:

```text
contexts

hooks

pages

schemas

services

types
```

O frontend também utiliza um `AuthenticatedLayout`, responsável por compartilhar Sidebar, Header e área de conteúdo entre as páginas privadas.

---

# Organização por Módulos

Cada domínio da aplicação possui seu próprio módulo.

Exemplo:

```
modules
│
├── auth
├── workspaces
├── boards
├── lists
├── cards
├── comments
├── labels
├── attachments
├── notifications
├── dashboard
└── search
```

Essa organização evita dependências desnecessárias entre diferentes partes do sistema.

---

# Estrutura Interna de um Módulo

Todos os módulos seguem exatamente o mesmo padrão.

```
workspaces
│
├── controllers
├── routes
├── schemas
├── use-cases
└── types
```

Cada responsabilidade fica isolada, facilitando manutenção, testes e evolução da aplicação.

---

# Controllers

Os Controllers possuem apenas uma responsabilidade:

- Receber a requisição.
- Validar os dados.
- Chamar o Use Case.
- Retornar a resposta.

Eles não possuem regras de negócio.

Fluxo:

```
Request

↓

Controller

↓

Use Case
```

---

# Use Cases

Os Use Cases concentram toda a regra de negócio da aplicação.

Cada Use Case executa apenas uma funcionalidade.

Exemplos:

```
register.use-case.ts

login.use-case.ts

create-workspace.use-case.ts

invite-workspace-member.use-case.ts

accept-workspace-invitation.use-case.ts

list-workspace-members.use-case.ts

update-workspace-member-role.use-case.ts
```

Essa abordagem mantém arquivos pequenos, organizados e fáceis de manter.

---

# Prisma ORM

O Prisma é responsável pelo acesso ao banco de dados.

Todos os Use Cases utilizam o Prisma para executar consultas.

Fluxo:

```
Use Case

↓

Prisma Client

↓

PostgreSQL
```

---

# PostgreSQL

O PostgreSQL é utilizado como banco de dados principal da aplicação.

Motivos da escolha:

- Alta performance.
- Confiabilidade.
- Excelente integração com Prisma.
- Escalabilidade.

---

# Validação

Todas as entradas da API são validadas utilizando Zod.

Exemplo:

```
Request

↓

Schema (Zod)

↓

Controller
```

Isso garante que dados inválidos não cheguem às regras de negócio.

---

# Tratamento Global de Erros

A aplicação utiliza um middleware global para tratamento de exceções.

Tipos de erro tratados:

- Erros de validação.
- Erros de autenticação.
- Erros de autorização.
- Erros de negócio.
- Erros internos.

Além disso, foi criada uma classe `AppError` para padronizar todos os erros de domínio.

---

# Autenticação

O sistema utiliza autenticação baseada em JWT.

Fluxo:

```
Login

↓

JWT

↓

Cliente

↓

Authorization: Bearer TOKEN

↓

Middleware

↓

Controller
```

---

# Fluxo de uma Requisição

```
Cliente

↓

HTTP Request

↓

Route

↓

Middleware

↓

Controller

↓

Use Case

↓

Prisma

↓

PostgreSQL

↓

Response
```

---

# Fluxo de uma Ação no Frontend

```text
Usuário

↓

Página React

↓

Validação com Zod

↓

Service

↓

Axios

↓

Fastify API

↓

Resposta

↓

Atualização da Interface
```

As páginas não acessam diretamente o backend.

Toda comunicação HTTP é centralizada na camada de Services.

---

# Estrutura das Rotas

Cada módulo possui seu próprio arquivo de rotas.

### Auth

```
POST   /auth/register

POST   /auth/login

GET    /auth/me
```

### Workspaces

```
POST   /workspaces

GET    /workspaces

GET    /workspaces/:id

PATCH  /workspaces/:id

DELETE /workspaces/:id

POST   /workspaces/:id/invitations

GET    /workspaces/:id/members

PATCH  /workspaces/:id/members/:memberId

POST   /workspace-invitations/:token/accept
```

---

# Módulo de Workspaces

O módulo de Workspaces é responsável por gerenciar espaços de trabalho, membros, convites e permissões.

## Funcionalidades implementadas

- Criar Workspace.
- Listar Workspaces.
- Buscar Workspace por ID.
- Atualizar Workspace.
- Excluir Workspace.
- Criar convites.
- Aceitar convites.
- Listar membros.
- Atualizar permissões dos membros.

---

## Fluxo de criação de Workspace

```
Usuário

↓

Criar Workspace

↓

Workspace

↓

WorkspaceMember (OWNER)
```

---

## Fluxo de exclusão de Workspace

```text
OWNER

↓

WorkspacePage

↓

Botão Excluir Workspace

↓

Modal de confirmação

↓

DELETE /workspaces/:id

↓

Use Case de exclusão

↓

Workspace removido

↓

Redirecionamento para Dashboard
```

A exclusão somente está disponível para o proprietário do Workspace.

A interface oculta a ação para usuários sem permissão, enquanto o backend realiza a validação definitiva da autorização.

---

## Fluxo de Convites

```
OWNER / ADMIN

↓

Cria Convite

↓

WorkspaceInvitation (PENDING)

↓

Usuário convidado

↓

Aceita Convite

↓

WorkspaceMember (MEMBER)

↓

WorkspaceInvitation (ACCEPTED)
```

---

## Fluxo de Permissões

```
OWNER
│
├── Atualizar Workspace
├── Excluir Workspace
├── Convidar membros
├── Listar membros
├── Alterar permissões
└── Remover membros

ADMIN
│
├── Atualizar Workspace
├── Convidar membros
└── Listar membros

MEMBER
│
└── Listar membros

VIEWER
│
└── Listar membros
```

---

# Comunicação em Tempo Real

As funcionalidades colaborativas utilizarão Socket.IO.

Exemplos:

- Movimentação de cartões.
- Criação de comentários.
- Atualização de listas.
- Atualização automática de Boards.
- Notificações.
- Presença de usuários.

Fluxo:

```
Usuário A

↓

Socket.IO Server

↓

Usuário B
```

---

# Escalabilidade

A arquitetura foi planejada para suportar crescimento sem necessidade de grandes refatorações.

Novos módulos podem ser adicionados mantendo exatamente o mesmo padrão estrutural.

Exemplo:

```
modules

├── calendar

├── analytics

├── integrations

├── automation

├── ai
```

Sem alterar módulos existentes.

---

# Princípios Utilizados

- Separação de responsabilidades.
- Baixo acoplamento.
- Alta coesão.
- Organização por domínio.
- Modularização.
- Reutilização de código.
- Escalabilidade.
- Código limpo.
- Arquitetura baseada em Use Cases.

---

# Estado Atual da Arquitetura

## Implementado

### Infraestrutura

- Estrutura modular.
- Fastify.
- Prisma ORM.
- PostgreSQL.
- Docker.
- JWT.
- Zod.
- Middleware global de erros.
- Middleware de autenticação.

### Auth

- Cadastro.
- Login.
- Usuário autenticado.

### Workspaces

- Criar Workspace.
- Listar Workspaces.
- Buscar Workspace.
- Atualizar Workspace.
- Excluir Workspace.

### Convites

- Criar convite.
- Aceitar convite.
- Controle de expiração.
- Token único por convite.

### Membros

- Adição automática após aceitar convite.
- Listagem de membros.
- Atualização de permissões.

### Frontend

- React com TypeScript.
- React Router.
- Axios.
- React Hook Form.
- Zod.
- AuthContext.
- AuthenticatedLayout.
- Login.
- Cadastro.
- Recuperação automática da sessão.
- Dashboard.
- Listagem de Workspaces.
- Criação de Workspaces.
- Visualização de Workspace.
- Atualização de Workspace.
- Exclusão de Workspace.
- Controle visual de permissões.
- Modal de confirmação para exclusão.
- Remoção de membros pelo `OWNER`.
- Modal de confirmação para remoção de membros.
- Atualização automática da lista e dos contadores de membros.

---

## Em desenvolvimento

### Frontend

- Alteração de permissões dos membros.
- Sistema de convites.
- Página 404.
- Interceptor global de respostas.
- Tratamento automático de sessão expirada.
- Componentes reutilizáveis.
- Sistema de toasts.

### Backend

- Boards.
- Lists.
- Cards.
- Socket.IO.
- Upload de arquivos.
- Dashboard avançado.
- Busca Global.
- Notificações.

---

# Próximos Passos

A evolução da arquitetura seguirá a seguinte ordem:

1. Sistema de convites no frontend.
2. Boards.
3. Lists.
4. Cards.
5. Comentários.
6. Etiquetas.
7. Checklists.
8. Uploads.
9. Socket.IO.
10. Notificações.
13. Dashboard avançado.
14. Busca Global.

Cada novo módulo continuará seguindo exatamente a arquitetura descrita neste documento, mantendo:

- Organização por domínio.
- Controllers.
- Routes.
- Schemas.
- Use Cases.
- Types.
- Services.
- Contexts.
- Pages.

Essa padronização garante baixo acoplamento, alta coesão e facilita a evolução contínua do projeto.
