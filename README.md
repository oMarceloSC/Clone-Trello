<div align="center">

# 🚀 Clone do Trello

### Um Clone completo do Trello desenvolvido com React, TypeScript, Fastify, Prisma, PostgreSQL e Socket.IO.

Projeto desenvolvido para estudo de arquitetura de software, desenvolvimento Full Stack moderno e composição de portfólio.

---

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Backend](https://img.shields.io/badge/backend-Fastify-blue)
![Frontend](https://img.shields.io/badge/frontend-React-61DAFB)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)
![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748)
![Language](https://img.shields.io/badge/language-TypeScript-3178C6)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

# 📖 Sobre o Projeto

Este projeto consiste no desenvolvimento de um Clone completo do Trello utilizando tecnologias modernas do ecossistema JavaScript/TypeScript.

O objetivo não é apenas reproduzir a interface do Trello, mas desenvolver uma aplicação Full Stack robusta, organizada e escalável, seguindo boas práticas utilizadas em equipes profissionais de desenvolvimento de software.

Além das funcionalidades tradicionais de gerenciamento de tarefas, o projeto também implementará colaboração em tempo real, autenticação, sistema de permissões, upload de arquivos, notificações e métricas.

---

# 🎯 Objetivos

- Desenvolver uma aplicação Full Stack moderna.
- Aplicar conceitos de Clean Architecture (adaptada).
- Utilizar Prisma ORM com PostgreSQL.
- Implementar comunicação em tempo real utilizando Socket.IO.
- Criar uma arquitetura escalável baseada em módulos.
- Construir um projeto de nível profissional para portfólio.

---

# 🛠️ Tecnologias

## Backend

- Node.js
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Zod
- Socket.IO
- Docker

---

## Frontend *(Em desenvolvimento)*

- React
- TypeScript
- Vite
- Tailwind CSS
- Socket.IO Client

---

# 🏗 Arquitetura

O projeto utiliza uma arquitetura modular baseada em **Use Cases**, onde cada domínio possui seus próprios:

- Controllers
- Routes
- Schemas
- Use Cases
- Types

Fluxo da aplicação:

```
HTTP Request
      │
      ▼
Routes
      │
      ▼
Controllers
      │
      ▼
Use Cases
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL
```

---

# 📁 Estrutura do Projeto

```
Clone-Trello
│
├── backend
├── frontend
├── docs
│
├── docker-compose.yml
└── README.md
```

---

# 📚 Documentação

Toda a documentação técnica do projeto encontra-se na pasta **docs**.

| Documento | Descrição |
|-----------|-----------|
| architecture.md | Arquitetura completa |
| backend.md | Estrutura do Backend |
| database.md | Modelagem do Banco |
| api.md | Documentação da API |
| roadmap.md | Planejamento do projeto |
| changelog.md | Histórico de versões |
| decisions.md | Decisões arquiteturais |

---

# ✅ Funcionalidades Implementadas

## Infraestrutura

- [x] Docker
- [x] PostgreSQL
- [x] Prisma ORM
- [x] Sistema de Migrations
- [x] Fastify
- [x] TypeScript
- [x] Estrutura Modular
- [x] Validação de variáveis de ambiente
- [x] Tratamento global de erros

---

## Autenticação

- [x] Cadastro de usuários
- [x] Login
- [x] Hash de senha
- [x] JWT
- [x] Middleware de autenticação
- [x] Endpoint protegido (`/auth/me`)

---

# 🚧 Funcionalidades em Desenvolvimento

- CRUD de Workspaces
- Sistema de Permissões
- Convites por Email
- Boards
- Lists
- Cards
- Comentários
- Etiquetas
- Checklist
- Datas de Entrega
- Upload de Arquivos
- Histórico de Atividades
- Dashboard
- Busca Global
- Socket.IO
- Notificações
- Drag and Drop
- Modo Escuro
- Responsividade

---

# 📌 Roadmap

## ✅ Milestone 1 — Foundation

- Infraestrutura
- Docker
- PostgreSQL
- Prisma
- Fastify
- Arquitetura Base
- Autenticação
- Middleware de Erros
- Validação de Ambiente

---

## 🚧 Milestone 2 — Workspaces

- CRUD de Workspaces
- Convites
- Permissões
- Membros

---

## ⏳ Milestone 3 — Boards

- CRUD de Boards
- Favoritos
- Arquivamento

---

## ⏳ Milestone 4 — Lists

- CRUD de Lists
- Ordenação

---

## ⏳ Milestone 5 — Cards

- CRUD de Cards
- Comentários
- Etiquetas
- Checklist
- Datas
- Upload

---

## ⏳ Milestone 6 — Real Time

- Socket.IO
- Atualizações em tempo real
- Notificações

---

## ⏳ Milestone 7 — Dashboard

- Estatísticas
- Métricas
- Busca Global

---

# 🚀 Executando o Projeto

## Backend

Clone o projeto

```bash
git clone <repository-url>
```

Entre na pasta

```bash
cd backend
```

Instale as dependências

```bash
npm install
```

Configure o arquivo `.env`

```env
DATABASE_URL=
JWT_SECRET=
PORT=3333
```

Suba o banco de dados

```bash
docker compose up -d
```

Execute as migrations

```bash
npx prisma migrate dev
```

Inicie a aplicação

```bash
npm run dev
```

---

# 📈 Status do Projeto

| Módulo | Status |
|---------|--------|
| Infraestrutura | ✅ |
| Banco de Dados | ✅ |
| Autenticação | ✅ |
| Workspaces | 🚧 |
| Boards | ⏳ |
| Lists | ⏳ |
| Cards | ⏳ |
| Socket.IO | ⏳ |
| Dashboard | ⏳ |

---

# 👨‍💻 Autor

Desenvolvido por **Marcelo Cruz**

Projeto criado com foco em aprendizado, arquitetura de software e desenvolvimento Full Stack moderno.

---

# ⭐ Considerações

Este projeto está sendo desenvolvido de forma incremental, documentando todas as decisões arquiteturais e etapas de desenvolvimento.

O objetivo é construir uma aplicação com padrões semelhantes aos utilizados em projetos profissionais, mantendo código limpo, modular e escalável.