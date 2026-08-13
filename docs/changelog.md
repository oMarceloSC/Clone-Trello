# Changelog

Todas as mudanças importantes deste projeto serão documentadas neste arquivo.

O formato utilizado é inspirado no padrão **Keep a Changelog**, e o projeto segue versionamento semântico.

---

# [0.4.0] - Boards

## Added

### Backend

* Model `Board`.
* Model `BoardMember`.
* Enum `BoardRole`.
* Endpoint para criação de Boards.
* Endpoint para listagem de Boards.
* Endpoint para busca de Board por ID.
* Endpoint para atualização de Board.
* Exclusão de Boards.
* Endpoint `DELETE /boards/:id`.
* Controle de permissão para exclusão restrito ao `OWNER` do Board.
* Integração da rota de exclusão de Boards ao Fastify.
* Associação automática do criador como `OWNER`.
* Validação de acesso ao Workspace antes da criação.
* Integração das rotas de Boards ao Fastify.

### Comunicação com a API

* Serviço `listBoards()`.
* Serviço `createBoard()`.
* Integração com o endpoint `GET /workspaces/:workspaceId/boards`.
* Integração com o endpoint `POST /workspaces/:workspaceId/boards`.
* Serviço `getBoardById()`.
* Integração com o endpoint `GET /boards/:id`.
* Busca individual de Boards.
* Serviço `updateBoard()`.
* Integração com o endpoint `PATCH /boards/:id`.
* Atualização de Boards pelo frontend.
* Serviço `deleteBoard()`.
* Integração com o endpoint `DELETE /boards/:id`.

### Boards no Frontend

* Listagem de Boards por Workspace na `WorkspacePage`.
* Criação de Boards pelo frontend por meio de modal.
* Formulário de criação utilizando React Hook Form e Zod.
* Campo opcional para descrição.
* Campo opcional para cor de fundo.
* Campo opcional para imagem de capa.
* Atualização automática da lista de Boards após criação.
* Estado vazio para Workspaces sem Boards.
* Estado de carregamento durante a busca de Boards.
* Navegação da WorkspacePage para a BoardPage.
* Página de visualização de Board.
* Exibição das informações gerais do Board.
* Breadcrumb da BoardPage.
* Cards de resumo do Board.
* Lista de membros do Board.
* Área preparada para a futura implementação das Lists.
* Modal de edição de Board.
* Atualização automática da interface após edição.
* Botão para excluir Board.
* Modal de confirmação da exclusão do Board.
* Estado de carregamento durante a exclusão.
* Mensagens de erro e sucesso da exclusão.
* Redirecionamento automático para o Workspace após a exclusão.

### Estilização

* Grid responsivo de Boards.
* Cards de Boards.
* Modal de criação de Boards.
* Seletor visual de cor.
* Suporte para imagem de capa.
* Estado vazio dos Boards.
* Estado de carregamento dos Boards.
* Feedback visual para erros de carregamento dos Boards.
* Layout da BoardPage.
* Breadcrumb da BoardPage.
* Cards de resumo do Board.
* Lista de membros do Board.
* Área destinada às Lists.
* Modal de edição de Board.
* Estados de carregamento da BoardPage.
* Estados de erro da BoardPage.
* Estilos do modal de exclusão do Board.
* Warning visual para a ação destrutiva.
* Responsividade do modal de exclusão do Board.

### Segurança e Permissões

* Controle visual para impedir criação por usuários `VIEWER`.
* OWNER e ADMIN do Workspace podem visualizar todos os Boards do Workspace.
* MEMBER e VIEWER visualizam apenas Boards dos quais participam.
* Usuários externos ao Workspace não possuem acesso aos Boards.

### Documentação

* Documentação da API de Boards.
* Atualização da documentação das páginas com a listagem de Boards.
* Atualização da documentação das páginas com a criação de Boards.
* Atualização da documentação dos serviços com `listBoards()`.
* Atualização da documentação dos serviços com `createBoard()`.
* Atualização da documentação da estilização para a área de Boards.
* Atualização da arquitetura do frontend para incluir a Feature Boards.
* Atualização da documentação da API de Boards com busca por ID.
* Atualização da documentação da API de Boards com atualização.
* Atualização da documentação das páginas para incluir a BoardPage.
* Atualização da documentação dos serviços com `getBoardById()`.
* Atualização da documentação dos serviços com `updateBoard()`.
* Atualização da arquitetura do frontend para documentar a BoardPage.
* Atualização da documentação da estilização da BoardPage.
* Atualização da documentação da API de Boards com a exclusão.
* Atualização da documentação da BoardPage com o fluxo de exclusão.
* Atualização da documentação dos serviços com `deleteBoard()`.
* Atualização da arquitetura do frontend com a exclusão de Boards.
* Atualização da documentação de estilização com o modal de exclusão.
* Atualização do roadmap para registrar a exclusão de Boards como concluída.

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
* Página 404 personalizada para rotas inexistentes.
* Substituição do redirecionamento automático da rota coringa pela `NotFoundPage`.

### Comunicação com a API

* Instância centralizada do Axios.
* Configuração da URL do backend.
* Interceptor para envio automático do JWT.
* Interceptor global de respostas.
* Tratamento automático de respostas `401 Unauthorized`.
* Limpeza automática da sessão após token inválido ou expirado.
* Evento global de expiração da sessão.
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
* Serviço `updateWorkspace()`.
* Integração com o endpoint `PATCH /workspaces/:id`.
* Atualização de Workspaces pelo frontend.
* Serviço `deleteWorkspace()`.
* Integração com o endpoint `DELETE /workspaces/:id`.
* Exclusão de Workspaces pelo frontend.

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
* Encerramento automático da sessão após respostas `401 Unauthorized`.
* Redirecionamento automático para Login após sessão expirada.
* Exibição da mensagem de sessão expirada.
* Dashboard integrado ao AuthContext.
* Página de recuperação de senha.
* Página de redefinição de senha.
* Link "Esqueci minha senha" na LoginPage.
* Integração com o endpoint `POST /auth/forgot-password`.
* Integração com o endpoint `POST /auth/reset-password`.
* Serviço `forgotPassword()`.
* Serviço `resetPassword()`.
* Validação do formulário de recuperação utilizando React Hook Form e Zod.
* Validação do formulário de redefinição utilizando React Hook Form e Zod.
* Geração do link de redefinição durante o ambiente de desenvolvimento.
* Botão para copiar o link de redefinição.
* Redirecionamento automático para Login após redefinição da senha.
* Mensagem de confirmação após redefinição da senha.

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
* Modal de edição de Workspace.
* Atualização do nome e da descrição.
* Validação do formulário de edição com React Hook Form e Zod.
* Atualização automática da interface após edição.
* Controle de edição baseado nas permissões `OWNER` e `ADMIN`.
* Atualização dinâmica do Breadcrumb após alteração do nome.
* Exclusão de Workspace disponível exclusivamente para o `OWNER`.
* Botão de exclusão condicionado à permissão do usuário.
* Modal de confirmação antes da exclusão.
* Aviso sobre a remoção permanente dos dados relacionados.
* Estado de carregamento durante a exclusão.
* Tratamento de erros sem fechar o modal.
* Redirecionamento automático para o Dashboard após a exclusão.
* Listagem de membros do Workspace.
* Exibição do nome, email e cargo dos membros.
* Integração com o endpoint `GET /workspaces/:id/members`.
* Exibição dos membros em tabela.
* Estado de carregamento da listagem de membros.
* Estado vazio para Workspaces sem membros adicionais.
* Remoção de membros disponível exclusivamente para o `OWNER`.
* Modal de confirmação para remoção de membros.
* Integração com o endpoint `DELETE /workspaces/:id/members/:memberId`.
* Atualização da lista e dos contadores sem recarregar a página.
* Exibição das mensagens de sucesso e erro retornadas pela API.
* Tratamento de erros durante a listagem de membros.
* Atualização das permissões dos membros diretamente pela WorkspacePage.
* Integração com o endpoint `PATCH /workspaces/:workspaceId/members/:memberId`.
* Serviço `updateWorkspaceMemberRole()`.
* Atualização otimista da permissão do membro.
* Atualização individual dos membros sem recarregar toda a listagem.
* Feedback visual durante a atualização das permissões.
* Mensagens individuais de sucesso e erro por membro.
* Restrição da alteração de permissões ao proprietário (`OWNER`).
* Bloqueio da edição da própria permissão do proprietário.
* Bloqueio da edição da permissão de outros proprietários.
* Criação de convites para Workspaces diretamente pela interface.
* Integração com o endpoint `POST /workspaces/:id/invitations`.
* Serviço `createWorkspaceInvitation()`.
* Modal para criação de convites.
* Geração e exibição do link do convite.
* Botão para copiar o link do convite.
* Listagem de convites pendentes do usuário autenticado.
* Integração com o endpoint `GET /workspace-invitations/pending`.
* Serviço `listPendingWorkspaceInvitations()`.
* Aceitação de convites diretamente pelo Dashboard.
* Integração com o endpoint `POST /workspace-invitations/:token/accept`.
* Serviço `acceptWorkspaceInvitation()`.
* Página `AcceptWorkspaceInvitationPage`.
* Atualização automática da lista de convites após aceitação.
* Atualização automática da lista de Workspaces após aceitar um convite.
### Estilização

* Estilos globais iniciais.
* Layout das páginas de autenticação.
* Estilos dos formulários.
* Feedback visual de erros.
* Feedback visual de cadastro concluído.
* Feedback visual para sessão expirada.
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
* Modal de edição do Workspace.
* Formulário de atualização.
* Feedback visual durante a atualização.
* Mensagens de sucesso após edição.
* Botão destrutivo para exclusão de Workspace.
* Modal de confirmação de exclusão.
* Aviso visual para ações irreversíveis.
* Estados visuais de confirmação, carregamento, sucesso e erro.
* Responsividade das ações de edição e exclusão.
* Modal de criação de convites.
* Exibição do link do convite.
* Botão para copiar o link.
* Cards de convites pendentes.
* Botão de aceitação de convites.
* Página de aceitação de convite.
* Estados visuais para criação e aceitação de convites.
* Responsividade da área de convites.
* Layout da Página 404.
* Card central da Página 404.
* Navegação por botões para retorno, Dashboard e Login.
* Responsividade da Página 404.
* Layout da ForgotPasswordPage.
* Layout da ResetPasswordPage.
* Link "Esqueci minha senha".
* Área de exibição do link de redefinição.
* Botão para copiar o link de redefinição.
* Estados visuais da recuperação de senha.
* Estados visuais da redefinição de senha.
* Responsividade do fluxo de recuperação de senha.
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
* Atualização da documentação dos serviços com `updateWorkspace()`.
* Atualização da documentação da WorkspacePage para incluir edição.
* Atualização da arquitetura para refletir o fluxo de atualização de Workspaces.
* Atualização da documentação de roteamento.
* Atualização da documentação das páginas com a exclusão de Workspace.
* Atualização da documentação dos serviços com `deleteWorkspace()`.
* Atualização da arquitetura global com o fluxo de exclusão.
* Atualização da documentação de estilização para ações destrutivas.
* Atualização da documentação de componentes planejados para confirmação.
* Atualização da documentação da WorkspacePage com a listagem de membros.
* Atualização da documentação dos serviços com `listWorkspaceMembers()`.
* Atualização da arquitetura para incluir o fluxo de membros.
* Atualização da documentação da API de Workspaces.
* Atualização da documentação dos serviços com `updateWorkspaceMemberRole()`.
* Atualização da documentação dos componentes para refletir o `WorkspaceMembersSection`.
* Atualização da documentação dos serviços com `createWorkspaceInvitation()`.
* Atualização da documentação dos serviços com `listPendingWorkspaceInvitations()`.
* Atualização da documentação dos serviços com `acceptWorkspaceInvitation()`.
* Atualização da documentação das páginas para incluir `AcceptWorkspaceInvitationPage`.
* Atualização da arquitetura do frontend com o fluxo de convites.
* Atualização da documentação de roteamento para incluir a rota de aceitação de convites.
* Atualização da documentação da estilização com o fluxo completo de convites.
* Atualização da documentação dos componentes compartilhados para o modal de criação de convites.
* Atualização da documentação do frontend com o fluxo de remoção de membros.
* Atualização do roadmap para registrar a remoção de membros como concluída.
* Atualização da documentação dos serviços com o interceptor global de respostas.
* Atualização da documentação da autenticação com o tratamento automático da sessão.
* Atualização da documentação de roteamento para incluir o fluxo de sessão expirada.
* Atualização da arquitetura do frontend com o interceptor global do Axios.
* Atualização da documentação da estilização para o feedback de sessão expirada.
* Atualização do roadmap para registrar o interceptor de respostas e o tratamento de sessão expirada como concluídos.
* Atualização da documentação de roteamento para incluir a Página 404.
* Atualização da documentação das páginas com a `NotFoundPage`.
* Atualização da documentação da estilização da Página 404.
* Atualização da arquitetura do frontend para documentar a rota coringa.
* Atualização do roadmap para registrar a Página 404 como concluída.
* Atualização da documentação da API de autenticação com os endpoints de recuperação de senha.
* Atualização da documentação do frontend para o fluxo de recuperação de senha.
* Atualização da documentação das páginas para incluir `ForgotPasswordPage`.
* Atualização da documentação das páginas para incluir `ResetPasswordPage`.
* Atualização da documentação dos serviços com `forgotPassword()`.
* Atualização da documentação dos serviços com `resetPassword()`.
* Atualização da documentação de roteamento para incluir as rotas de recuperação e redefinição de senha.
* Atualização da documentação de estilização para o fluxo de recuperação de senha.
* Atualização da arquitetura do frontend com o fluxo de recuperação de senha.
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
