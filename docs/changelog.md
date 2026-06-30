# Changelog

Todas as mudanças importantes deste projeto serão documentadas neste arquivo.

O formato utilizado é inspirado no padrão **Keep a Changelog**.

---

# [0.1.0] - Foundation

## Added

### Infraestrutura

- Configuração inicial do projeto.
- Docker.
- PostgreSQL.
- Prisma ORM.
- Sistema de Migrations.
- Fastify.
- TypeScript.

### Arquitetura

- Estrutura modular.
- Controllers.
- Use Cases.
- Schemas.
- Middlewares.
- AppError.
- Middleware global de erros.

### Autenticação

- Cadastro de usuários.
- Login.
- Hash de senha.
- JWT.
- Middleware de autenticação.
- Endpoint `/auth/me`.

### Banco de Dados

- Model User.
- Model Workspace.
- Model WorkspaceMember.

### Documentação

- README.
- architecture.md.
- backend.md.
- database.md.
- api.md.
- roadmap.md.
- changelog.md.
- decisions.md.

---

# Próxima Versão

## 0.2.0

- CRUD de Workspaces.
- Permissões.
- Convites.
- Gerenciamento de membros.