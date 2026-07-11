# Roteamento do Frontend

## Visão Geral

O frontend utiliza o **React Router** para controlar a navegação entre as páginas.

As rotas são centralizadas no arquivo:

```text
src/routes/AppRoutes.tsx
```

---

# Configuração

O `BrowserRouter` é registrado no arquivo:

```text
src/main.tsx
```

Estrutura:

```text
BrowserRouter
      ↓
App
      ↓
AppRoutes
      ↓
Routes
```

---

# Rotas Atuais

| Rota         | Acesso      | Status         | Descrição                |
| ------------ | ----------- | -------------- | ------------------------ |
| `/`          | Público     | ✅ Implementada | Redireciona para o login |
| `/login`     | Público     | ✅ Implementada | Login                    |
| `/register`  | Público     | ✅ Implementada | Cadastro                 |
| `/dashboard` | Autenticado | ✅ Implementada | Dashboard inicial        |
| `*`          | Público     | ✅ Implementada | Redireciona para o login |

---

# Rota Inicial

A rota:

```text
/
```

redireciona automaticamente para:

```text
/login
```

---

# Rotas Públicas

## Login

```text
/login
```

Permite autenticar usuários.

## Cadastro

```text
/register
```

Permite criar uma conta.

---

# Rotas Protegidas

## Dashboard

```text
/dashboard
```

A rota utiliza:

```text
RequireAuthentication
```

Esse componente verifica a existência do token:

```text
@clone-trello:token
```

Caso o token não exista:

```text
/dashboard
     ↓
/login
```

---

# Fluxo de Proteção

```text
Usuário acessa rota protegida
          ↓
RequireAuthentication
          ↓
Token existe?
     ┌────┴────┐
     │         │
    Sim       Não
     │         │
 Página     /login
```

---

# Navegação após Login

```text
/login
   ↓
Login concluído
   ↓
/dashboard
```

---

# Navegação após Cadastro

```text
/register
    ↓
Cadastro concluído
    ↓
/login
    ↓
Mensagem de sucesso
```

---

# Navegação após Logout

```text
/dashboard
    ↓
Remoção da sessão
    ↓
/login
```

---

# Rotas Planejadas

| Rota               | Acesso      | Status      | Descrição             |
| ------------------ | ----------- | ----------- | --------------------- |
| `/workspaces/:id`  | Autenticado | ⏳ Planejada | Detalhes do Workspace |
| `/boards/:id`      | Autenticado | ⏳ Planejada | Board                 |
| `/forgot-password` | Público     | ⏳ Planejada | Recuperação de senha  |
| `/reset-password`  | Público     | ⏳ Planejada | Redefinição de senha  |
| `/notifications`   | Autenticado | ⏳ Planejada | Notificações          |
| `/profile`         | Autenticado | ⏳ Planejada | Perfil do usuário     |

---

# Melhorias Planejadas

* Criar layout para rotas autenticadas.
* Criar página `NotFoundPage`.
* Centralizar a autenticação em `AuthContext`.
* Verificar a validade do token.
* Bloquear `/login` e `/register` para usuários já autenticados.
* Preservar a rota original após redirecionamento para login.
* Adicionar lazy loading.
* Adicionar code splitting por rota.