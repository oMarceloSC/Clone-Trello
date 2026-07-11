# Changelog

Todas as mudanças importantes deste projeto serão documentadas neste arquivo.

O formato utilizado é inspirado no padrão **Keep a Changelog**, e o projeto segue versionamento semântico.

---

# [0.3.0] - Frontend Integration

## Added

### Infraestrutura do Frontend

* Inicialização da aplicação React.
* Configuração do Vite.
* Configuração do TypeScript.
* Configuração do ESLint.
* Estrutura inicial baseada em funcionalidades.
* Configuração das variáveis de ambiente.
* Arquivo `.env.example`.

### Navegação

* Configuração do React Router.
* Rota pública de login.
* Rota pública de cadastro.
* Rota protegida do dashboard.
* Redirecionamento da rota inicial.
* Redirecionamento de rotas desconhecidas.
* Componente inicial de proteção de rotas.

### Comunicação com a API

* Instância centralizada do Axios.
* Configuração da URL do backend.
* Interceptor para envio automático do JWT.
* Serviço inicial de autenticação.
* Endpoint `/auth/me`.
* Recuperação automática da sessão.

### Autenticação no Frontend

* Página de login.
* Formulário de login com React Hook Form.
* Validação do login com Zod.
* Persistência inicial do token no `localStorage`.
* Persistência inicial do usuário no `localStorage`.
* Logout.
* Dashboard inicial autenticado.
* Página de cadastro.
* Formulário de cadastro com React Hook Form.
* Validação do cadastro com Zod.
* Confirmação de senha.
* Tratamento de email duplicado.
* Redirecionamento para login após cadastro.
* Mensagem de sucesso após criação da conta.
* AuthContext.
* AuthProvider.
* Hook `useAuth`.
* Estado global de autenticação.
* Bloqueio de páginas públicas para usuários autenticados.
* Validação automática da sessão durante a inicialização da aplicação.

### Estilização

* Estilos globais iniciais.
* Layout das páginas de autenticação.
* Estilos dos formulários.
* Feedback visual de erros.
* Feedback visual de cadastro concluído.
* Layout inicial do dashboard.
* Tela de carregamento da recuperação de sessão.

### Documentação

* Documentação da arquitetura inicial do frontend.
* Documentação da autenticação.
* Documentação das páginas.
* Documentação das rotas.
* Documentação dos serviços.
* Documentação das decisões arquiteturais do frontend.
* Documentação do gerenciamento de estado.
* Documentação dos componentes compartilhados.
* Documentação da estilização.

---

# [0.2.0] - Workspace Management

## Added

### Workspace

* Estrutura inicial do módulo Workspaces.
* Endpoint para criação de Workspaces.
* Endpoint para listagem de Workspaces.
* Endpoint para busca de Workspace por ID.
* Endpoint para atualização de Workspace.
* Endpoint para exclusão de Workspace.
* Associação automática do criador como `OWNER`.
* Validação de acesso através da tabela `WorkspaceMember`.
* Model `WorkspaceInvitation`.
* Endpoint para criação de convites.
* Geração automática de token UUID.
* Expiração de convites em 7 dias.
* Validação para impedir convites duplicados.
* Validação para impedir convites de usuários já pertencentes ao Workspace.
* Endpoint para aceitar convites.
* Criação automática de `WorkspaceMember` ao aceitar convite.
* Atualização do convite para `ACCEPTED`.
* Tratamento de convites expirados.
* Endpoint para listagem de membros.
* Ordenação dos membros pela data de ingresso.
* Endpoint para alteração das permissões.
* Controle das roles `OWNER`, `ADMIN`, `MEMBER` e `VIEWER`.
* Endpoint para remoção de membros.

### Arquitetura

* Organização do módulo Workspaces utilizando:

  * Controllers.
  * Routes.
  * Schemas.
  * Use Cases.
  * Types.
* Separação das rotas de convites.
* Uso de transação para aceitar convites.

### Segurança

* Todas as rotas de Workspaces protegidas por JWT.
* Workspaces acessíveis somente por membros.
* Atualização permitida apenas para `OWNER` e `ADMIN`.
* Exclusão permitida apenas para `OWNER`.
* Convites permitidos apenas para `OWNER` e `ADMIN`.
* Aceitação permitida apenas pelo usuário correspondente ao email convidado.
* Listagem de membros limitada aos participantes do Workspace.
* Alteração de permissões permitida apenas para `OWNER`.
* Proteção da role do proprietário.
* Remoção de membros permitida apenas para `OWNER`.
* Retorno `404` para recursos sem acesso, reduzindo enumeração de IDs.

### Documentação

* Documentação da API de Workspaces.
* Documentação dos convites.
* Documentação dos membros.
* Atualização da modelagem do banco.
* Atualização da arquitetura.
* Atualização do roadmap.

---

# [0.1.0] - Foundation

## Added

### Infraestrutura

* Configuração inicial do projeto.
* Docker.
* PostgreSQL.
* Prisma ORM.
* Adapter do PostgreSQL para Prisma 7.
* Sistema de Migrations.
* Fastify.
* TypeScript.
* Configuração de variáveis de ambiente.
* Validação de ambiente com Zod.

### Arquitetura

* Estrutura modular do backend.
* Controllers.
* Routes.
* Schemas.
* Use Cases.
* Middlewares.
* Classe `AppError`.
* Middleware global de erros.

### Autenticação

* Cadastro de usuários.
* Login.
* Hash de senha com Bcrypt.
* JWT.
* Middleware de autenticação.
* Endpoint `/auth/me`.

### Banco de Dados

* Model `User`.
* Model `Workspace`.
* Model `WorkspaceMember`.
* Enum `WorkspaceRole`.

### Documentação

* README.
* Arquitetura.
* Backend.
* Banco de dados.
* API.
* Roadmap.
* Changelog.
* Decisões arquiteturais.
* Planejamento do WebSocket.

---

# Próximas Versões

## 0.4.0 — Frontend de Workspaces

Planejado:

* AuthContext.
* Recuperação da sessão.
* Dashboard com Workspaces.
* Criação de Workspace.
* Página de detalhes do Workspace.
* Gerenciamento de membros.
* Gerenciamento de convites.