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
* Implementação do `AuthenticatedLayout`.
* Compartilhamento da Sidebar entre páginas autenticadas.
* Compartilhamento do Header entre páginas autenticadas.
* Utilização do `Outlet` para renderização das páginas privadas.

### Comunicação com a API

* Instância centralizada do Axios.
* Configuração da URL do backend.
* Interceptor para envio automático do JWT.
* Serviço inicial de autenticação.
* Endpoint `/auth/me`.
* Recuperação automática da sessão.
* Serviço de Workspaces.
* Listagem de Workspaces.
* Criação de Workspaces pelo frontend.
* Integração com o endpoint `POST /workspaces`.
* Atualização imediata da lista após criação.
* Serviço `getWorkspaceById()`.
* Integração com o endpoint `GET /workspaces/:id`.
* Busca individual de Workspaces.

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
* Dashboard integrado ao AuthContext.

### Workspaces no Frontend

* Listagem de Workspaces no Dashboard.
* Criação de Workspaces por modal.
* Validação do formulário com React Hook Form e Zod.
* Descrição opcional do Workspace.
* Associação automática do usuário criador como `OWNER`.
* Inserção do novo Workspace no início da lista sem recarregar a página.
* Estado vazio com opção para criar o primeiro Workspace.
* Página de visualização de Workspace.
* Navegação do Dashboard para a WorkspacePage.
* Exibição do nome, descrição e data de criação.
* Exibição da quantidade de membros.
* Exibição da permissão do usuário autenticado.
* Breadcrumb para navegação.
* Área inicial destinada aos Boards.
* Tratamento de erros ao carregar um Workspace.
* Botão para nova tentativa em caso de falha.

### Estilização

* Estilos globais iniciais.
* Layout das páginas de autenticação.
* Estilos dos formulários.
* Feedback visual de erros.
* Feedback visual de cadastro concluído.
* Layout inicial do dashboard.
* Tela de carregamento da recuperação de sessão.
* Cards de Workspaces.
* Estado vazio para listagem de Workspaces.
* Estado de carregamento dos Workspaces.
* Modal de criação de Workspace.
* Formulário de criação de Workspace.
* Campo de descrição com textarea.
* Botões primário e secundário no modal.
* Estado de carregamento durante a criação.
* Feedback visual de sucesso e erro.
* Responsividade inicial do modal.
* Layout autenticado compartilhado.
* Sidebar responsiva.
* Header compartilhado.
* Navegação adaptativa para dispositivos móveis.
* Layout da WorkspacePage.
* Cards de resumo do Workspace.
* Breadcrumb.
* Área de Boards.
* Estados de carregamento da WorkspacePage.
* Estados de erro da WorkspacePage.

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
* Atualização da documentação das páginas para incluir criação de Workspaces.
* Atualização da documentação dos serviços com `createWorkspace()`.
* Atualização da documentação de estilização com o modal de criação.
* Atualização da arquitetura para documentar o `AuthenticatedLayout`.
* Atualização da documentação de rotas para incluir o `Outlet`.
* Atualização da documentação dos componentes compartilhados.
* Atualização da documentação das páginas autenticadas.
* Documentação da WorkspacePage.
* Atualização da documentação dos serviços com `getWorkspaceById()`.
* Atualização da arquitetura do frontend.
* Atualização da documentação de rotas.
* Atualização da documentação de componentes compartilhados.
* Atualização da documentação de estilização da WorkspacePage.

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
