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

```
BrowserRouter

↓

AuthProvider

↓

App

↓

AppRoutes

↓

Routes
```

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
├── /dashboard
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

---

## Dashboard

```text
/dashboard
```

Fluxo:

```
Usuário

↓

Dashboard

↓

RequireAuthentication

↓

Sessão válida?

↓

Sim → Dashboard

Não → Login
```

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
           \
            \
             Login

ou

RequireAuthentication
                 \
                  \
                 Dashboard
```

---

# Rotas Planejadas

## Workspace

```
/workspaces/:id
```

---

## Boards

```
/boards/:id
```

---

## Perfil

```
/profile
```

---

## Notificações

```
/notifications
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

- Layout autenticado.
- Página 404.
- Lazy Loading.
- Code Splitting.
- Breadcrumbs.
- Proteção por permissões.
- Rotas por Workspace.
- Rotas por Board.
- Rotas dinâmicas.
- Navegação baseada em permissões.

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

## Planejado

- Página 404.
- Layout autenticado.
- Rotas dos Workspaces.
- Rotas dos Boards.
- Rotas de Perfil.
- Recuperação de senha.
- Lazy Loading.
- Code Splitting.