# Backend

## Visão Geral

O backend do Clone do Trello foi desenvolvido utilizando Node.js, Fastify, TypeScript e Prisma ORM.

A arquitetura foi projetada para ser modular, escalável e de fácil manutenção, permitindo a implementação de novas funcionalidades sem impactar os módulos existentes.

---

# Stack

| Tecnologia | Finalidade |
|------------|------------|
| Node.js | Runtime JavaScript |
| TypeScript | Tipagem estática |
| Fastify | Framework HTTP |
| Prisma ORM | ORM |
| PostgreSQL | Banco de Dados |
| JWT | Autenticação |
| Zod | Validação |
| Bcrypt | Criptografia de senhas |
| Docker | Containerização |

---

# Estrutura

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
│
├── .env
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

---

# Organização das Pastas

## config

Responsável pelas configurações da aplicação.

Exemplos:

- Variáveis de ambiente
- Configuração JWT
- Configurações gerais

Atualmente:

```
config
└── env.ts
```

---

## lib

Contém bibliotecas compartilhadas.

Atualmente:

```
lib
└── prisma.ts
```

Responsável por disponibilizar uma única instância do Prisma Client para toda a aplicação.

---

## middlewares

Contém todos os middlewares utilizados pela API.

Atualmente:

```
middlewares

├── auth.middleware.ts

└── error.middleware.ts
```

### auth.middleware

Valida o JWT enviado pelo cliente.

### error.middleware

Responsável pelo tratamento global de erros.

---

## modules

A principal pasta da aplicação.

Cada funcionalidade do sistema possui seu próprio módulo.

Exemplo:

```
modules

├── auth

├── workspaces

├── boards

├── lists

├── cards
```

Essa organização evita dependências desnecessárias entre funcionalidades.

---

## plugins

Reservada para plugins do Fastify.

Exemplos futuros:

```
plugins

├── socket.ts

├── jwt.ts

└── cors.ts
```

---

## routes

Centraliza o registro das rotas da aplicação.

Cada módulo registra suas próprias rotas.

---

## shared

Contém recursos compartilhados.

Exemplos:

```
shared

├── constants

├── enums

├── errors

├── interfaces
```

Atualmente:

```
shared/errors

└── app-error.ts
```

---

## types

Tipos globais da aplicação.

Exemplo:

Extensão do FastifyRequest.

---

## utils

Funções utilitárias reutilizáveis.

Exemplos futuros:

```
utils

├── jwt.ts

├── hash.ts

├── logger.ts

├── upload.ts
```

---

# Organização dos Módulos

Todos os módulos seguem exatamente o mesmo padrão.

Exemplo:

```
auth

│

├── controllers

├── routes

├── schemas

├── use-cases

└── types
```

---

# Controllers

Os Controllers possuem apenas uma responsabilidade.

Receber a requisição HTTP.

Eles não implementam regras de negócio.

Responsabilidades:

- Receber Request
- Validar dados
- Executar Use Case
- Retornar Response

---

# Schemas

Responsáveis pela validação dos dados.

A validação é realizada utilizando Zod.

Exemplos:

```
register.schema.ts

login.schema.ts
```

---

# Use Cases

Os Use Cases concentram toda a regra de negócio.

Cada arquivo executa apenas uma operação.

Exemplo:

```
register.use-case.ts

login.use-case.ts
```

No futuro:

```
create-card.use-case.ts

move-card.use-case.ts

archive-card.use-case.ts
```

---

# Banco de Dados

Toda comunicação com o banco é realizada utilizando Prisma ORM.

Fluxo:

```
Use Case

↓

Prisma

↓

PostgreSQL
```

Nenhum Controller acessa diretamente o banco.

---

# Sistema de Autenticação

Fluxo:

```
Cadastro

↓

Hash da senha

↓

Banco

↓

Login

↓

JWT

↓

Cliente

↓

Authorization Header

↓

Middleware

↓

Controller
```

---

# Sistema de Erros

A aplicação utiliza uma classe própria para erros.

```
AppError
```

Exemplo:

```ts
throw new AppError("Email já está em uso", 409)
```

Esses erros são tratados pelo middleware global.

---

# Middleware Global

O middleware global trata:

- Erros de validação
- Erros de autenticação
- Erros de negócio
- Erros inesperados

Isso garante respostas padronizadas.

---

# Fluxo de uma Requisição

```
Cliente

↓

Fastify

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

# Estrutura Atual da API

## Auth

### POST

```
/auth/register
```

Cadastro.

---

### POST

```
/auth/login
```

Login.

---

### GET

```
/auth/me
```

Retorna o usuário autenticado.

---

# Funcionalidades Implementadas

## Infraestrutura

- Docker
- PostgreSQL
- Prisma ORM
- Fastify
- TypeScript

---

## Banco

- User
- Workspace
- WorkspaceMember

---

## Auth

- Cadastro
- Login
- JWT
- Hash de senha
- Middleware de autenticação

---

## Qualidade

- AppError
- Error Middleware
- Validação com Zod
- Env Validation

---

# Próximos Módulos

A próxima etapa do backend será:

```
Workspaces
```

Após isso:

```
Boards

↓

Lists

↓

Cards

↓

Comments

↓

Labels

↓

Attachments

↓

Notifications

↓

Socket.IO
```

---

# Objetivos da Arquitetura

A estrutura foi planejada para garantir:

- Organização
- Escalabilidade
- Reutilização
- Facilidade de manutenção
- Baixo acoplamento
- Alta coesão
- Facilidade para testes
- Crescimento contínuo da aplicação