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
auth
│
├── controllers
│
├── routes
│
├── schemas
│
├── use-cases
│
└── types
```

---

# Controllers

Os Controllers possuem apenas uma responsabilidade:

- Receber a requisição.
- Validar os dados.
- Chamar o Use Case.
- Retornar a resposta.

Eles não possuem regras de negócio.

Exemplo:

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

create-board.use-case.ts

move-card.use-case.ts
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
- Erros de negócio.
- Erros internos.

Além disso, foi criada uma classe AppError para padronizar erros de domínio.

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

Exemplo:

```
Auth

↓

/auth/register

/auth/login

/auth/me
```

No futuro:

```
/workspaces

/boards

/cards

/comments
```

---

# Comunicação em Tempo Real

As funcionalidades colaborativas utilizarão Socket.IO.

Exemplos:

- Movimentação de cartões.
- Criação de comentários.
- Atualização de listas.
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

Novos módulos podem ser adicionados mantendo o mesmo padrão estrutural.

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

---

# Estado Atual da Arquitetura

## Implementado

- Estrutura modular.
- Fastify.
- Prisma ORM.
- PostgreSQL.
- Docker.
- Use Cases.
- Controllers.
- Rotas.
- Middleware global de erros.
- Middleware de autenticação.
- Validação com Zod.
- JWT.

## Em desenvolvimento

- Plugins.
- Socket.IO.
- Upload de arquivos.
- Sistema de permissões.
- Dashboard.
- Busca Global.

---

# Próximos Passos

A evolução da arquitetura seguirá a seguinte ordem:

1. Workspaces
2. Sistema de Permissões
3. Boards
4. Lists
5. Cards
6. Comentários
7. Etiquetas
8. Checklists
9. Uploads
10. Socket.IO
11. Notificações
12. Dashboard
13. Busca Global

Cada novo módulo seguirá exatamente a arquitetura descrita neste documento.