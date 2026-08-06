<div align="center">

# 🚀 Clone do Trello

### Aplicação Full Stack inspirada no Trello, desenvolvida com React, Fastify, Prisma ORM e PostgreSQL.

Projeto desenvolvido para estudo de Arquitetura de Software, Engenharia de Software, desenvolvimento Full Stack moderno e composição de portfólio profissional.

---

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Backend](https://img.shields.io/badge/backend-Fastify-blue)
![Frontend](https://img.shields.io/badge/frontend-React-61DAFB)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)
![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748)
![Language](https://img.shields.io/badge/language-TypeScript-3178C6)
![Build](https://img.shields.io/badge/build-Vite-646CFF)
![Validation](https://img.shields.io/badge/validation-Zod-3068B7)
![Forms](https://img.shields.io/badge/forms-React%20Hook%20Form-EC5990)
![HTTP](https://img.shields.io/badge/http-Axios-5A29E4)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

# 📖 Sobre o Projeto

O Clone do Trello é uma aplicação Full Stack desenvolvida com foco em arquitetura escalável, boas práticas de desenvolvimento e utilização de tecnologias modernas do ecossistema JavaScript/TypeScript.

O objetivo do projeto vai além da reprodução da interface do Trello. Toda a aplicação está sendo construída utilizando uma arquitetura modular baseada em casos de uso (**Use Cases**), separação clara de responsabilidades e documentação completa de cada módulo.

O projeto também serve como estudo prático de:

- Arquitetura de Software.
- Engenharia de Software.
- Desenvolvimento Full Stack.
- Banco de Dados Relacional.
- Segurança de aplicações.
- Comunicação em tempo real.
- Desenvolvimento de interfaces modernas.
- Documentação técnica.

Todo o desenvolvimento está sendo realizado por milestones, permitindo evolução contínua da aplicação enquanto mantém estabilidade e organização da base de código.

---

# 🎯 Objetivos

- Desenvolver uma aplicação Full Stack moderna.
- Aplicar arquitetura modular baseada em Use Cases.
- Utilizar Prisma ORM com PostgreSQL.
- Implementar autenticação utilizando JWT.
- Construir um sistema completo de Workspaces, Boards, Lists e Cards.
- Desenvolver um sistema de permissões baseado em papéis.
- Implementar colaboração em tempo real utilizando Socket.IO.
- Produzir documentação técnica completa.
- Construir um projeto de nível profissional para portfólio.

---

# ✨ Principais Funcionalidades

## Backend

Atualmente o backend já possui:

- ✅ Cadastro de usuários.
- ✅ Login.
- ✅ Autenticação JWT.
- ✅ Middleware de autenticação.
- ✅ Endpoint `/auth/me`.
- ✅ Recuperação automática da sessão.
- ✅ Recuperação de senha.
- ✅ Redefinição de senha.
- ✅ Tokens temporários para recuperação.
- ✅ Expiração automática de tokens.
- ✅ CRUD completo de Workspaces.
- ✅ Sistema de permissões.
- ✅ Sistema de membros.
- ✅ Sistema de convites.
- ✅ Atualização de permissões.
- ✅ Remoção de membros.
- ✅ Tratamento global de erros.
- ✅ Validação utilizando Zod.

---

## Frontend

O frontend já possui:

- ✅ Login.
- ✅ Cadastro.
- ✅ Recuperação de senha.
- ✅ Redefinição de senha.
- ✅ Dashboard.
- ✅ Workspace.
- ✅ Gerenciamento de membros.
- ✅ Atualização de permissões.
- ✅ Criação de convites.
- ✅ Aceitação de convites.
- ✅ Página 404 personalizada.
- ✅ Recuperação automática da sessão.
- ✅ Tratamento automático de sessão expirada.
- ✅ Layout autenticado.
- ✅ Breadcrumbs.
- ✅ Estados de carregamento.
- ✅ Estados de erro.
- ✅ Feedback de sucesso.

---

# 🛠️ Tecnologias

## Backend

- Node.js
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- BcryptJS
- Zod
- Docker
- Docker Compose

---

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- React Hook Form
- Zod
- Tailwind CSS

---

## Banco de Dados

- PostgreSQL

---

## Ferramentas

- Git
- GitHub
- VS Code
- Thunder Client
- Prisma Studio
- Docker Desktop

---

# 🏗 Arquitetura

O projeto utiliza uma arquitetura modular baseada em **Use Cases**, separando claramente responsabilidades entre camadas.

Cada módulo possui sua própria estrutura contendo:

- Controllers
- Routes
- Schemas
- Use Cases
- Types

---

## Fluxo do Backend

```text
HTTP Request

↓

Routes

↓

Controllers

↓

Use Cases

↓

Prisma ORM

↓

PostgreSQL
```

---

## Fluxo do Frontend

```text
Página

↓

Service

↓

Axios

↓

API REST

↓

Backend
```

---

# 📁 Estrutura do Projeto

```text
Clone-Trello/

├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── docs/
│   ├── api/
│   ├── frontend/
│   ├── architecture.md
│   ├── backend.md
│   ├── database.md
│   ├── roadmap.md
│   ├── changelog.md
│   └── decisions.md
│
├── docker-compose.yml
└── README.md
```

---

# 📚 Documentação

Toda a documentação técnica do projeto está organizada na pasta `docs`, separada por assunto.

## API

| Documento | Descrição |
|-----------|-----------|
| auth.md | Autenticação |
| workspaces.md | Workspaces |
| workspace-invitations.md | Convites |

---

## Frontend

| Documento | Descrição |
|-----------|-----------|
| architecture.md | Arquitetura do Frontend |
| auth.md | Fluxo de autenticação |
| components.md | Componentes compartilhados |
| pages.md | Páginas |
| routing.md | Rotas |
| services.md | Serviços |
| styling.md | Estilos |

---

## Documentação Geral

| Documento | Descrição |
|-----------|-----------|
| architecture.md | Arquitetura geral |
| backend.md | Estrutura do backend |
| database.md | Modelagem do banco |
| roadmap.md | Planejamento do projeto |
| changelog.md | Histórico de versões |
| decisions.md | Decisões arquiteturais |

---

# ✅ Funcionalidades Implementadas

## Infraestrutura

- [x] Docker.
- [x] PostgreSQL.
- [x] Prisma ORM.
- [x] Sistema de Migrations.
- [x] Fastify.
- [x] TypeScript.
- [x] Estrutura modular.
- [x] Validação de ambiente.
- [x] Tratamento global de erros.

---

## Autenticação

- [x] Cadastro de usuários.
- [x] Login.
- [x] Hash de senha.
- [x] JWT.
- [x] Middleware de autenticação.
- [x] Endpoint `/auth/me`.
- [x] Recuperação automática da sessão.
- [x] Recuperação de senha.
- [x] Redefinição de senha.
- [x] Tokens temporários de recuperação.
- [x] Expiração automática de tokens.
- [x] Invalidação automática dos tokens utilizados.

---

## Workspaces

- [x] Criar Workspace.
- [x] Listar Workspaces.
- [x] Buscar Workspace.
- [x] Atualizar Workspace.
- [x] Excluir Workspace.
- [x] Sistema de membros.
- [x] Sistema de permissões.
- [x] Atualização de permissões.
- [x] Remoção de membros.
- [x] Convites.
- [x] Aceitação de convites.

---

# 🗺️ Roadmap

O desenvolvimento do projeto é dividido em milestones, permitindo evolução contínua da aplicação e documentação completa de cada etapa.

| Milestone | Status |
|-----------|:------:|
| ✅ Milestone 1 — Foundation | Concluído |
| ✅ Milestone 2 — Workspaces | Concluído |
| ✅ Milestone 3 — Frontend de Integração | Concluído |
| 🚧 Milestone 4 — Boards | Em andamento |
| ⏳ Milestone 5 — Lists | Próximo |
| ⏳ Milestone 6 — Cards | Planejado |
| ⏳ Milestone 7 — Colaboração em Tempo Real | Planejado |
| ⏳ Milestone 8 — Dashboard, Atividades e Notificações | Planejado |
| ⏳ Milestone 9 — Refinamento do Frontend | Planejado |
| ⏳ Milestone 10 — Qualidade e Produção | Planejado |
| ⏳ Milestone 11 — Assistente Inteligente | Planejado |

O planejamento completo está disponível em:

```text
docs/roadmap.md
```

---

# 🚀 Como Executar o Projeto

## Pré-requisitos

Antes de iniciar o projeto, é necessário possuir instalado:

- Node.js 22 ou superior
- Docker Desktop
- Git
- PostgreSQL (caso não utilize Docker)

---

## Clonando o Repositório

```bash
git clone https://github.com/SEU-USUARIO/clone-trello.git
```

Entre na pasta do projeto:

```bash
cd clone-trello
```

---

# 🐳 Banco de Dados

Inicie o PostgreSQL utilizando Docker:

```bash
docker compose up -d
```

Verifique se o container está em execução:

```bash
docker ps
```

---

# ⚙️ Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5433/clone_trello"
JWT_SECRET="sua-chave-secreta"
PORT=3333
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Inicie o servidor:

```bash
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3333
```

---

# 💻 Frontend

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env`:

```env
VITE_API_URL=http://localhost:3333
```

Inicie a aplicação:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

---

# 🧪 Testes

Atualmente os testes das APIs são realizados utilizando:

- Thunder Client
- Prisma Studio

Futuramente serão adicionados:

- Testes Unitários
- Testes de Integração
- Testes End-to-End (E2E)

---

# 📦 Convenção de Commits

O projeto segue a convenção **Conventional Commits**.

Exemplos:

```text
feat(auth): implementar recuperação de senha

feat(workspaces): adicionar remoção de membros

fix(auth): corrigir validação do token

docs(api): atualizar documentação da autenticação

refactor(workspaces): reorganizar use cases

test(auth): adicionar testes de login
```

Tipos utilizados:

- `feat`
- `fix`
- `docs`
- `refactor`
- `style`
- `test`
- `chore`

---

# 📊 Status do Projeto

| Área | Status |
|------|:------:|
| Backend | ✅ |
| Frontend | 🚧 |
| Banco de Dados | ✅ |
| Documentação | 🚧 |
| Testes Automatizados | ⏳ |
| Deploy | ⏳ |

---

# 🔜 Próximas Funcionalidades

As próximas etapas do projeto incluem:

## Boards

- CRUD completo.
- Favoritos.
- Arquivamento.
- Permissões.

---

## Lists

- CRUD completo.
- Ordenação.

---

## Cards

- CRUD completo.
- Comentários.
- Etiquetas.
- Checklist.
- Datas de entrega.
- Upload de anexos.

---

## Colaboração em Tempo Real

- Socket.IO.
- Usuários online.
- Atualizações em tempo real.
- Sincronização de Boards.
- Sincronização de Cards.

---

## Dashboard

- Estatísticas.
- Métricas.
- Histórico.
- Busca global.

---

## Refinamento da Interface

- Design System.
- Componentes reutilizáveis.
- Skeleton Loading.
- Empty States.
- Toasts.
- Tema escuro.
- Responsividade.

---

## Assistente Inteligente

Está previsto um módulo de Inteligência Artificial integrado ao sistema, capaz de:

- Resumir Boards.
- Sugerir tarefas.
- Auxiliar na organização do Workspace.
- Explicar funcionalidades.
- Responder perguntas sobre o projeto.
- Executar ações mediante confirmação do usuário.

---

# 🤝 Contribuição

Embora este seja um projeto de estudo, sugestões, melhorias e feedbacks são sempre bem-vindos.

Caso deseje contribuir:

1. Faça um Fork do projeto.
2. Crie uma branch para sua feature.
3. Realize suas alterações.
4. Envie um Pull Request.

---

# 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

---

# 👨‍💻 Autor

Desenvolvido por **Marcelo Cruz**.

Projeto criado com foco em:

- Arquitetura de Software.
- Engenharia de Software.
- Desenvolvimento Full Stack.
- Estudos acadêmicos.
- Construção de portfólio profissional.

---

# ⭐ Considerações Finais

Este projeto está sendo desenvolvido de forma incremental, com documentação detalhada de cada funcionalidade implementada.

O objetivo é construir uma aplicação moderna, escalável e bem documentada, simulando um ambiente profissional de desenvolvimento e servindo como base para estudos avançados, portfólio e futuras evoluções.

Ao final do desenvolvimento, o Clone do Trello contará com:

- Backend modular.
- Frontend moderno em React.
- Autenticação completa.
- Recuperação de senha.
- Sistema de Workspaces.
- Boards.
- Lists.
- Cards.
- Permissões.
- Convites.
- Comunicação em tempo real.
- Dashboard.
- Busca global.
- Assistente Inteligente.
- Testes automatizados.
- Pipeline de CI/CD.
- Documentação completa.
- Estrutura pronta para produção.

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere deixar uma estrela no repositório! ⭐**

</div>