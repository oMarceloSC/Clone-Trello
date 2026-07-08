# Changelog

Todas as mudanças importantes deste projeto serão documentadas neste arquivo.

O formato utilizado é inspirado no padrão **Keep a Changelog** e o projeto segue o versionamento semântico (**Semantic Versioning**).

---

# [0.2.0] - Workspace Management

## Added

- Endpoint para atualização de Workspace.
- Controle de permissões para atualização utilizando as roles OWNER e ADMIN.

### Workspace

- Estrutura inicial do módulo Workspaces.
- Endpoint para criação de Workspaces.
- Endpoint para listagem de Workspaces.
- Endpoint para busca de Workspace por ID.
- Associação automática do criador do Workspace como `OWNER`.
- Validação de acesso através da tabela `WorkspaceMember`.
- Endpoint para exclusão de Workspace.
- Exclusão permitida apenas para usuários OWNER.
- Model WorkspaceInvitation.
- Endpoint para criação de convites.
- Geração automática de token UUID.
- Expiração de convites em 7 dias.
- Validação para impedir convites duplicados.
- Validação para impedir convites de usuários já pertencentes ao Workspace.
- Endpoint para aceitar convites de Workspace.
- Criação automática de `WorkspaceMember` ao aceitar convite.
- Atualização do status do convite para `ACCEPTED`.
- Validação de token único do convite.
- Validação para garantir que o convite pertence ao usuário autenticado.
- Tratamento de convites expirados.

### Arquitetura

- Organização do módulo Workspaces utilizando:
  - Controllers
  - Routes
  - Schemas
  - Use Cases
  - Types

### Segurança

- Todas as rotas do módulo protegidas por autenticação JWT.
- Busca de Workspace limitada aos membros pertencentes ao Workspace.
- Retorno `404 Not Found` quando o usuário não possui acesso ao Workspace, evitando enumeração de recursos.
- Endpoint para atualização de Workspace.
- Controle de permissões para atualização utilizando as roles OWNER e ADMIN.
- Exclusão protegida por validação de permissões.
- Retorno 403 Forbidden para usuários sem permissão de exclusão.
- Apenas OWNER e ADMIN podem enviar convites.
- Aceitação de convite permitida apenas para o usuário dono do email convidado.
- Convites expirados são marcados automaticamente como `EXPIRED`.

### Documentação

- Criação da documentação específica do módulo:
  - `docs/api/workspaces.md`

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
- Configuração do ambiente utilizando `.env`.
- Validação das variáveis de ambiente com Zod.

### Arquitetura

- Estrutura modular da aplicação.
- Organização baseada em módulos.
- Controllers.
- Use Cases.
- Schemas.
- Middlewares.
- AppError.
- Middleware global de tratamento de erros.

### Autenticação

- Cadastro de usuários.
- Login.
- Geração de JWT.
- Hash de senha utilizando Bcrypt.
- Middleware de autenticação.
- Endpoint `/auth/me`.

### Banco de Dados

- Model `User`.
- Model `Workspace`.
- Model `WorkspaceMember`.
- Enum `WorkspaceRole`.

### Documentação

- README.
- architecture.md.
- backend.md.
- database.md.
- roadmap.md.
- decisions.md.
- websocket.md.
- API organizada por módulos.