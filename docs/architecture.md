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
                        │ HTTP / WebSocket
                        ▼
              Fastify REST API
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
- Tailwind CSS
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
└── Alterar permissões

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

---

## Em desenvolvimento

- Boards.
- Lists.
- Cards.
- Socket.IO.
- Upload de arquivos.
- Dashboard.
- Busca Global.
- Notificações.

---

# Próximos Passos

A evolução da arquitetura seguirá a seguinte ordem:

1. Boards
2. Lists
3. Cards
4. Comentários
5. Etiquetas
6. Checklists
7. Uploads
8. Socket.IO
9. Notificações
10. Dashboard
11. Busca Global

Cada novo módulo seguirá exatamente a arquitetura descrita neste documento.