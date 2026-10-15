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
- ✅ Boards: CRUD, favoritos por usuário, arquivamento/restauração e membros.
- ✅ Lists: criação, listagem, edição, exclusão e reordenação com permissões por Board.
- ✅ Criação concorrente de Lists protegida por transação serializável.

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
- ✅ Boards ativos e arquivados, criação, edição e restauração no Workspace.
- ✅ BoardPage com favorito, arquivamento, exclusão e gerenciamento de membros.
- ✅ Lists na BoardPage: criação, edição inline e exclusão com confirmação, sem reload.
- ✅ Drag-and-drop horizontal de Lists por mouse/toque, reordenação por teclado e recuperação de sincronização.

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
- CSS global em `src/index.css`
- dnd-kit para reordenação de Lists

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
- node:test/tsx e Playwright com Microsoft Edge para a auditoria de Lists

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
| [workspace.md](docs/api/workspace.md) | Workspaces, membros e convites |
| [boards.md](docs/api/boards.md) | Boards, membros e permissões |
| [lists.md](docs/api/lists.md) | CRUD, reordenação e permissões de Lists |

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
| [LISTS_MILESTONE_5_AUDIT.md](docs/LISTS_MILESTONE_5_AUDIT.md) | Evidências, correções e limitações da auditoria de Lists |

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

## Boards

- [x] Criar, listar, visualizar e atualizar Boards.
- [x] Excluir Boards.
- [x] Favoritar e desfavoritar Boards por usuário.
- [x] Arquivar, restaurar e listar Boards arquivados.
- [x] Gerenciar membros do Board.
- [x] Adicionar membros existentes no Workspace.
- [x] Alterar roles e remover membros conforme permissões.

---

## Lists

- [x] Model BoardList e migration.
- [x] Criar, listar, editar título e excluir Lists.
- [x] Reordenar Lists com persistência e confirmação por GET.
- [x] Drag-and-drop horizontal e alternativa por teclado.
- [x] Permissões, confirmação de exclusão e tratamento de falhas sem reload.
- [x] Proteção contra respostas obsoletas e testes automatizados com banco isolado.

---

# 🗺️ Roadmap

O desenvolvimento do projeto é dividido em milestones, permitindo evolução contínua da aplicação e documentação completa de cada etapa.

| Milestone | Status |
|-----------|:------:|
| ✅ Milestone 1 — Foundation | Concluído |
| ✅ Milestone 2 — Workspaces | Concluído |
| ✅ Milestone 3 — Frontend de Integração | Concluído |
| ✅ Milestone 4 — Boards | Concluído |
| ✅ Milestone 5 — Lists | Concluído no escopo auditado |
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

APIs também podem ser verificadas manualmente com Thunder Client e Prisma Studio. A Milestone 5 possui testes automatizados de API e interface real:

```powershell
cd backend
npm run test:lists
```

No Windows, use `npm.cmd run test:lists` se a política do PowerShell bloquear o wrapper `npm.ps1`.

Requisitos para a suíte completa:

- Dependências instaladas em `backend` e `frontend`, incluindo as de desenvolvimento; Prisma Client gerado.
- PostgreSQL disponível no `DATABASE_URL` existente e usuário com permissão para criar bancos temporários.
- `JWT_SECRET` configurado no ambiente do backend.
- Microsoft Edge instalado no ambiente que executa Playwright. A auditoria foi executada no Windows com Edge headless.

A suíte cria um banco `lists_audit_<UUID>` exclusivo, aplica nele as migrations existentes e cria fixtures descartáveis. Não executa reset ou seed no banco de desenvolvimento. Inicia backend e frontend temporários e remove seu próprio banco no teardown. Não é necessário manter `npm run dev` aberto para esse comando.

A auditoria registrou **27 testes de API e 16 cenários de navegador aprovados**, com zero falhas finais. O runner informa 44 registros porque também conta o agrupador da interface; são 43 casos efetivos. Consulte o [relatório de auditoria](docs/LISTS_MILESTONE_5_AUDIT.md) para reprodução, resultados e limitações. Para apenas inspecionar bancos deixados por uma interrupção, execute `node tests/audit-cleanup.mjs` a partir de `backend`; a remoção exige opção explícita e verificação das fixtures.

Verificações estáticas disponíveis: `npx.cmd tsc --noEmit` no backend; `npx.cmd tsc -p tsconfig.app.json --noEmit`, `npm.cmd run lint` e `npm.cmd run build` no frontend. O script genérico `npm test` do backend ainda é um placeholder; utilize `test:lists` para esta suíte.

Permanecem fora da cobertura: outros navegadores, leitor de tela, dispositivo móvel físico, carga elevada e todas as combinações de concorrência entre clientes. A conclusão da milestone não equivale a homologação de produção. Testes dos demais módulos e infraestrutura de CI permanecem planejados.

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
| Testes Automatizados | ✅ Lists; demais módulos planejados |
| Deploy | ⏳ |

---

# 🔜 Próximas Funcionalidades

As próximas etapas do projeto incluem:

## Boards

- Permissões da Milestone 4 concluídas; ampliações futuras dependem de novos requisitos.
- Testes automatizados dos fluxos de Boards.

---

## Lists

- CRUD e reordenação concluídos na Milestone 5. A validação complementar segue as limitações da auditoria; o próximo módulo funcional é Cards.

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
