# Roteamento do Frontend

## Visão Geral

O frontend do Clone do Trello utiliza o **React Router** para controlar toda a navegação da aplicação.

As rotas são centralizadas no arquivo:

```text
src/routes/AppRoutes.tsx
```

A proteção das rotas é realizada através do `AuthContext`, permitindo diferenciar usuários autenticados de visitantes.

---

# Arquitetura

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

O `BrowserRouter` é responsável pela navegação.

O `AuthProvider` disponibiliza o estado da autenticação para toda a aplicação.

O `AppRoutes` define todas as rotas disponíveis.

---

# Estrutura Atual

```text
AppRoutes

├── /
├── /login
├── /register
├── (AuthenticatedLayout)
│   ├── /dashboard
│   └── /workspaces/:id
└── *
```

---

# Rotas Implementadas

| Rota | Acesso | Status | Descrição |
|--------|--------|---------|-----------------------------|
| / | Público | ✅ | Redireciona para Dashboard |
| /login | Visitante | ✅ | Login |
| /register | Visitante | ✅ | Cadastro |
| /dashboard | Autenticado | ✅ | Dashboard |
| * | Público | ✅ | Redirecionamento |
| `/workspaces/:id` | Autenticado | ✅ | Visualização de Workspace |


---

# Página Inicial

Quando o usuário acessa:

```text
/
```

é realizado automaticamente:

```text
↓

/dashboard
```

O próprio sistema decide se o usuário continuará no Dashboard ou será enviado para Login.

---

# Rotas Públicas

Atualmente existem duas rotas públicas.

## Login

```text
/login
```

Responsável pela autenticação.

---

## Cadastro

```text
/register
```

Responsável pela criação de usuários.

---

# RequireGuest

As páginas públicas utilizam o componente:

```text
RequireGuest
```

Objetivo:

Impedir que usuários autenticados retornem às páginas de Login ou Cadastro.

Fluxo:

```
Usuário autenticado

↓

/login

↓

Dashboard
```

O mesmo ocorre para:

```
/register
```

---

# Rotas Protegidas

As páginas privadas utilizam:

```text
RequireAuthentication
```

Objetivo:

Garantir que apenas usuários autenticados tenham acesso.

Após a autenticação, todas as páginas privadas passam a ser renderizadas dentro do `AuthenticatedLayout`.

Fluxo:

```
RequireAuthentication

↓

AuthenticatedLayout

↓

Outlet

↓

Página
```

---

## Dashboard

```text
/dashboard
```

Fluxo:

```
Usuário

↓

RequireAuthentication

↓

AuthenticatedLayout

↓

Dashboard
```

---

## Workspace

```
/workspaces/:id
```

Fluxo:

```
Usuário

↓

Dashboard

↓

Abrir

↓

RequireAuthentication

↓

AuthenticatedLayout

↓

WorkspacePage
```

A página somente é exibida caso o usuário possua acesso ao Workspace solicitado.

---

# AuthenticatedLayout

O layout autenticado é responsável por compartilhar toda a estrutura visual das páginas privadas.

Arquivo:

```
src/layouts/AuthenticatedLayout.tsx
```

Responsabilidades:

- Renderizar a Sidebar.
- Renderizar o Header.
- Exibir informações do usuário autenticado.
- Centralizar o botão de Logout.
- Renderizar as páginas através do `Outlet`.

Estrutura:

```
AuthenticatedLayout

├── Sidebar

├── Header

└── Outlet
```

Atualmente utilizam esse layout:

- DashboardPage.
- WorkspacePage.

Todas as futuras páginas autenticadas continuarão reutilizando essa mesma estrutura.

---

# Recuperação da Sessão

Antes de liberar qualquer rota protegida, o sistema verifica se existe uma sessão armazenada.

Fluxo:

```
Aplicação inicia

↓

AuthProvider

↓

Existe Token?

↓

Não

↓

Login

↓

Sim

↓

GET /auth/me

↓

Token válido?

↓

Sim

↓

AuthenticatedLayout

↓

Dashboard

↓

Não

↓

Limpa sessão

↓

Login
```

---

# Estado de Carregamento

Enquanto o frontend consulta:

```http
GET /auth/me
```

é exibida uma tela de carregamento.

```
Carregando sessão...
```

Esse comportamento evita que páginas protegidas sejam exibidas antes da validação da sessão.

---

# Outlet

O `AuthenticatedLayout` utiliza o componente:

```
Outlet
```

O `Outlet` é responsável por renderizar a página correspondente à rota atual.

Fluxo:

```
AuthenticatedLayout

↓

Outlet

↓

DashboardPage

ou

WorkspacePage
```

No futuro também renderizará:

- BoardPage
- NotificationPage
- ProfilePage

---

# Redirecionamentos

## Visitante

```
/

/dashboard

↓

Login
```

---

## Usuário autenticado

```
/login

↓

Dashboard
```

---

## Cadastro

```
/register

↓

Dashboard
```

---

## Logout

```
Dashboard

↓

Logout

↓

Login
```

---

# Página Não Encontrada

Atualmente qualquer rota inexistente é redirecionada para:

```
/dashboard
```

O sistema então decide:

```
Autenticado

↓

Dashboard

Não autenticado

↓

Login
```

Futuramente será implementada uma página dedicada de erro 404.

---

# Fluxo Completo da Navegação

```
BrowserRouter

↓

AppRoutes

↓

RequireGuest

↓

Login / Cadastro

ou

RequireAuthentication

↓

AuthenticatedLayout

↓

Outlet

↓

Dashboard

ou

WorkspacePage
```

---

# Rotas Planejadas

## Boards

```
/boards/:id
Será renderizada dentro do `AuthenticatedLayout`.
```

---

## Perfil

```
/profile
Será renderizada dentro do `AuthenticatedLayout`.
```

---

## Notificações

```
/notifications
Será renderizada dentro do `AuthenticatedLayout`.
```

---

## Recuperação de senha

```
/forgot-password
```

---

## Redefinição de senha

```
/reset-password
```

---

## Página 404

```
*
```

---

# Melhorias Futuras

Estão planejadas para as próximas milestones:

- Página 404.
- Lazy Loading.
- Code Splitting.
- Breadcrumbs.
- Proteção por permissões.
- Rotas por Workspace.
- Rotas por Board.
- Rotas dinâmicas.
- Navegação baseada em permissões.
- Layout administrativo.

---

# Estado Atual

## Implementado

- BrowserRouter.
- AppRoutes.
- RequireAuthentication.
- RequireGuest.
- Redirecionamento automático.
- Recuperação da sessão.
- Tela de carregamento.
- Dashboard protegido.
- Login.
- Cadastro.
- AuthenticatedLayout.
- Sidebar compartilhada.
- Header compartilhado.
- Outlet.
- Rota `/workspaces/:id`.
- WorkspacePage protegida.
- Navegação Dashboard → Workspace.

## Planejado

- Página 404.
- Rotas dos Boards.
- Rotas de Perfil.
- Recuperação de senha.
- Lazy Loading.
- Code Splitting.
- Proteção baseada em permissões.
- Layout administrativo.