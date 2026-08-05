# Roteamento do Frontend

## Visão Geral

O frontend do Clone do Trello utiliza o **React Router** para controlar toda a navegação da aplicação.

As rotas são centralizadas no arquivo:

```text
src/routes/AppRoutes.tsx
```

A proteção das rotas utiliza o `AuthContext`, permitindo diferenciar usuários autenticados de visitantes.

As páginas privadas são renderizadas dentro do `AuthenticatedLayout`.

---

# Arquitetura

```text
BrowserRouter

↓

AuthProvider

↓

App

↓

AppRoutes

↓

RequireGuest
            \
             Login / Cadastro

ou

RequireAuthentication

↓

AuthenticatedLayout

↓

Outlet

↓

Página
```

O `BrowserRouter` controla a navegação da aplicação.

O `AuthProvider` disponibiliza o estado da autenticação.

O `AppRoutes` define todas as rotas disponíveis.

O `AuthenticatedLayout` compartilha Sidebar e Header entre as páginas privadas.

---

# Estrutura Atual

```text
AppRoutes

├── /
├── /login
├── /register
├── (AuthenticatedLayout)
│   ├── /dashboard
│   ├── /workspaces/:id
│   └── /workspace-invitations/:token/accept
└── *
```

---

# Rotas Implementadas

| Rota | Acesso | Status | Descrição |
|---|---|---|---|
| `/` | Público | ✅ | Redireciona para o Dashboard |
| `/login` | Visitante | ✅ | Login |
| `/register` | Visitante | ✅ | Cadastro |
| `/dashboard` | Autenticado | ✅ | Dashboard |
| `/workspaces/:id` | Autenticado | ✅ | Visualização e gerenciamento do Workspace |
| `/workspace-invitations/:token/accept` | Autenticado | ✅ | Aceitação de convite por token |
| `*` | Público | ✅ | Redirecionamento temporário |

---

# Página Inicial

Quando o usuário acessa:

```text
/
```

é redirecionado para:

```text
/dashboard
```

O sistema verifica a autenticação e decide se o usuário pode continuar ou se deve ser enviado para o Login.

---

# Rotas Públicas

Atualmente existem duas rotas públicas.

## Login

```text
/login
```

Responsável pela autenticação do usuário.

---

## Cadastro

```text
/register
```

Responsável pela criação de novos usuários.

---

# RequireGuest

As páginas públicas utilizam:

```text
RequireGuest
```

Esse componente impede que usuários autenticados acessem Login ou Cadastro.

Fluxo:

```text
Usuário autenticado

↓

/login ou /register

↓

/dashboard
```

---

# Rotas Protegidas

As páginas privadas utilizam:

```text
RequireAuthentication
```

Esse componente garante que apenas usuários autenticados tenham acesso.

Fluxo:

```text
RequireAuthentication

↓

AuthenticatedLayout

↓

Outlet

↓

Página privada
```

---

# Dashboard

## Rota

```text
/dashboard
```

## Acesso

Somente usuários autenticados.

## Fluxo

```text
Usuário

↓

RequireAuthentication

↓

AuthenticatedLayout

↓

DashboardPage
```

O Dashboard permite:

- Listar Workspaces.
- Criar Workspaces.
- Abrir um Workspace.
- Listar convites pendentes.
- Aceitar convites diretamente.
- Atualizar automaticamente a lista de Workspaces após aceitar um convite.
- Visualizar estados de carregamento e erro.

---

# Aceitação de Convites

## Rota

```text
/workspace-invitations/:token/accept
```

## Acesso

Somente usuários autenticados.

Caso o usuário não esteja autenticado, será redirecionado para:

```text
/login
```

Após autenticar-se, poderá acessar novamente o link de convite.

---

## Objetivo

Permitir que um convite seja aceito diretamente através do token presente na URL.

Essa rota continua disponível para compartilhamento de links entre usuários e também para testes da API.

---

## Fluxo

```text
Usuário

↓

Link do convite

↓

RequireAuthentication

↓

AuthenticatedLayout

↓

AcceptWorkspaceInvitationPage

↓

POST /workspace-invitations/:token/accept

↓

Dashboard
```

---

## Funcionalidades

A rota permite:

- Ler o token da URL.
- Aceitar o convite.
- Exibir carregamento.
- Exibir mensagens de erro.
- Exibir mensagens de sucesso.
- Redirecionar automaticamente após a aceitação.

---

# Workspace

## Rota

```text
/workspaces/:id
```

## Acesso

Somente usuários autenticados que participem do Workspace solicitado.

A autorização definitiva é validada pelo backend.

---

## Fluxo de acesso

```text
Dashboard

↓

Abrir Workspace

↓

/workspaces/:id

↓

RequireAuthentication

↓

AuthenticatedLayout

↓

WorkspacePage
```

---

## Requisições realizadas

Ao carregar a página são realizadas duas requisições principais:

```text
GET /workspaces/:id

↓

Informações gerais do Workspace
```

e:

```text
GET /workspaces/:id/members

↓

Lista completa de membros
```

---

## Funcionalidades disponíveis

A rota permite:

- Visualizar informações gerais.
- Visualizar quantidade de membros.
- Visualizar a permissão do usuário autenticado.
- Listar membros.
- Exibir nome, email e cargo de cada participante.
- Atualizar o Workspace.
- Excluir o Workspace.
- Preparar a área para os futuros Boards.
- Criar convites.
- Gerar links de convite.

---

## Controle de permissões

### OWNER

Pode:

- Visualizar.
- Atualizar.
- Excluir.
- Listar membros.

### ADMIN

Pode:

- Visualizar.
- Atualizar.
- Listar membros.

### MEMBER

Pode:

- Visualizar.
- Listar membros.

### VIEWER

Pode:

- Visualizar.
- Listar membros.

A interface oculta ações não permitidas, mas a proteção real permanece no backend.

---

# AuthenticatedLayout

## Arquivo

```text
src/layouts/AuthenticatedLayout.tsx
```

O layout autenticado compartilha a estrutura visual das páginas privadas.

Responsabilidades:

- Renderizar Sidebar.
- Renderizar Header.
- Exibir informações do usuário autenticado.
- Disponibilizar Logout.
- Renderizar páginas através do `Outlet`.

Estrutura:

```text
AuthenticatedLayout

├── Sidebar
├── Header
└── Outlet
```

Atualmente utilizam esse layout:

- DashboardPage.
- WorkspacePage.

---

# Outlet

O `Outlet` renderiza a página correspondente à rota atual dentro do `AuthenticatedLayout`.

Fluxo:

```text
AuthenticatedLayout

↓

Outlet

↓

DashboardPage
```

ou:

```text
AuthenticatedLayout

↓

Outlet

↓

WorkspacePage
```

No futuro também renderizará:

- BoardPage.
- NotificationPage.
- ProfilePage.

---

# Recuperação da Sessão

Antes de liberar qualquer rota protegida, o sistema verifica a sessão armazenada.

Fluxo:

```text
Aplicação inicia

↓

AuthProvider

↓

Existe token?

├── Não
│   ↓
│   Login
│
└── Sim
    ↓
    GET /auth/me
    ↓
    Token válido?
    ├── Sim
    │   ↓
    │   Renderiza a aplicação
    │
    └── Não
        ↓
        Limpa sessão
        ↓
        Login
```

Além da validação inicial através do endpoint `/auth/me`, a aplicação monitora continuamente respostas `401 Unauthorized` retornadas pelas requisições autenticadas.

Quando isso ocorre, o interceptor global do Axios remove automaticamente a sessão armazenada, o `AuthProvider` limpa o estado da autenticação e as rotas protegidas passam a redirecionar o usuário novamente para a tela de Login.

---

# Estado de Carregamento

Enquanto o frontend consulta:

```http
GET /auth/me
```

é exibido:

```text
Carregando sessão...
```

Esse estado evita que páginas privadas sejam exibidas antes da validação do token.

---

# Sessão Expirada

Quando qualquer requisição autenticada recebe a resposta:

```http
401 Unauthorized
```

o frontend executa automaticamente o seguinte fluxo:

```text
API

↓

Interceptor de Respostas

↓

Remoção da sessão

↓

AuthProvider

↓

RequireAuthentication

↓

/login

↓

Mensagem:
"Sua sessão expirou. Entre novamente."
```

Esse comportamento garante que o usuário nunca permaneça navegando com um token inválido ou expirado.

As requisições de login (`POST /auth/login`) não utilizam esse fluxo, permitindo que credenciais incorretas continuem exibindo apenas a mensagem retornada pela API.

---

# Redirecionamentos

## Visitante acessando uma rota privada

```text
/dashboard

ou

/workspaces/:id

↓

/login
```

---

## Usuário autenticado acessando Login

```text
/login

↓

/dashboard
```

---

## Usuário autenticado acessando Cadastro

```text
/register

↓

/dashboard
```

---

## Logout

```text
Página autenticada

↓

Logout

↓

/login
```

## Sessão expirada

Quando uma sessão expira durante a utilização da aplicação:

```text
Resposta 401

↓

Interceptor Global

↓

Limpeza da sessão

↓

/login

↓

Mensagem de sessão expirada
```

---

## Workspace excluído

Após excluir um Workspace:

```text
DELETE /workspaces/:id

↓

Workspace removido

↓

/dashboard
```

O redirecionamento utiliza navegação com substituição de histórico para evitar retorno a uma rota já excluída.

---

# Página Não Encontrada

Atualmente qualquer rota inexistente é redirecionada para:

```text
/dashboard
```

O sistema então decide:

```text
Autenticado

↓

Dashboard

ou

Não autenticado

↓

Login
```

Futuramente será implementada uma página dedicada de erro 404.

---

# Fluxo Completo da Navegação

```text
BrowserRouter

↓

AppRoutes

├── RequireGuest
│   ├── LoginPage
│   └── RegisterPage
│
└── RequireAuthentication
    ↓
    AuthenticatedLayout
    ↓
    Outlet
    ├── DashboardPage
    ├── WorkspacePage
    └── AcceptWorkspaceInvitationPage
```

---

# Fluxo da WorkspacePage

```text
Dashboard

↓

Abrir Workspace

↓

/workspaces/:id

↓

GET /workspaces/:id

↓

GET /workspaces/:id/members

↓

WorkspacePage

├── Informações gerais
├── Cards de resumo
├── Lista de membros
├── Atualização
├── Exclusão
└── Área de Boards
```

---

# Rotas Planejadas

## Boards

```text
/boards/:id
```

Será renderizada dentro do `AuthenticatedLayout`.

---

## Perfil

```text
/profile
```

Será renderizada dentro do `AuthenticatedLayout`.

---

## Notificações

```text
/notifications
```

Será renderizada dentro do `AuthenticatedLayout`.

---

## Recuperação de senha

```text
/forgot-password
```

---

## Redefinição de senha

```text
/reset-password
```

---

## Página 404

```text
*
```

---

# Melhorias Futuras

Estão planejadas:

- Página 404.
- Lazy Loading.
- Code Splitting.
- Breadcrumbs reutilizáveis.
- Proteção visual por permissões.
- Rotas por Board.
- Rotas dinâmicas adicionais.
- Navegação baseada em permissões.
- Layout administrativo.
- Recuperação de senha.
- Redirecionamento automático para convites após login.

---

# Estado Atual

## Implementado

- BrowserRouter.
- AppRoutes.
- RequireAuthentication.
- RequireGuest.
- Redirecionamento automático.
- Recuperação da sessão.
- Interceptor global de respostas.
- Tratamento automático de respostas `401 Unauthorized`.
- Limpeza automática da sessão expirada.
- Redirecionamento automático para Login após expiração da sessão.
- Exibição da mensagem de sessão expirada.
- Tela de carregamento.
- Login.
- Cadastro.
- Dashboard protegido.
- AuthenticatedLayout.
- Sidebar compartilhada.
- Header compartilhado.
- Outlet.
- Rota `/workspaces/:id`.
- WorkspacePage protegida.
- Navegação Dashboard → Workspace.
- Visualização de Workspace.
- Atualização de Workspace.
- Exclusão de Workspace.
- Redirecionamento após exclusão.
- Listagem de membros.
- Requisição `GET /workspaces/:id/members`.
- Controle visual de permissões.
- Rota `/workspace-invitations/:token/accept`.
- AcceptWorkspaceInvitationPage.
- Listagem de convites pendentes no Dashboard.
- Aceitação de convites diretamente pelo Dashboard.
- Atualização automática dos Workspaces após aceitar um convite.

## Planejado

- Página 404.
- Rotas dos Boards.
- Rotas de Perfil.
- Rotas de Notificações.
- Recuperação de senha.
- Lazy Loading.
- Code Splitting.
- Proteção baseada em permissões.
- Layout administrativo.