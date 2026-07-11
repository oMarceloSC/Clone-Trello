# Gerenciamento de Estado

## Visão Geral

O frontend do Clone do Trello utiliza a **Context API** do React para gerenciamento do estado global da aplicação.

Atualmente apenas a autenticação utiliza estado global.

Essa abordagem reduz o acoplamento entre componentes e evita a necessidade de bibliotecas externas para gerenciamento de estado nesta fase do projeto.

---

# Tecnologias

| Tecnologia | Finalidade |
|------------|------------|
| React Context API | Estado global |
| React Hooks | Manipulação do estado |
| localStorage | Persistência da sessão |

---

# Estado Atual

Atualmente existe um contexto global.

```text
AuthContext
```

No futuro serão adicionados outros contextos conforme a evolução do projeto.

Exemplo:

```text
WorkspaceContext

BoardContext

NotificationContext

ThemeContext
```

---

# AuthContext

## Arquivos

```text
src/features/auth/contexts/
├── auth-context.ts
└── AuthProvider.tsx
```

---

## Objetivo

Centralizar todas as informações relacionadas à autenticação.

O restante da aplicação não precisa acessar diretamente o `localStorage` ou realizar chamadas ao endpoint `/auth/me`.

---

## Dados Disponíveis

```ts
type AuthContextData = {
    user: User | null;

    isAuthenticated: boolean;

    isLoading: boolean;

    signIn(
        credentials: LoginRequest
    ): Promise<void>;

    signOut(): void;
}
```

---

## user

Representa o usuário autenticado.

Quando não existe sessão:

```ts
user === null
```

---

## isAuthenticated

Indica se existe um usuário autenticado.

```ts
Boolean(user)
```

---

## isLoading

Indica que a aplicação ainda está restaurando a sessão.

Durante esse período é exibida a tela:

```text
Carregando sessão...
```

---

## signIn()

Responsável por:

- autenticar usuário;
- salvar token;
- salvar usuário;
- atualizar contexto.

Fluxo:

```
Login

↓

POST /auth/login

↓

JWT

↓

AuthContext

↓

Dashboard
```

---

## signOut()

Responsável por:

- remover token;
- remover usuário;
- limpar contexto.

Fluxo:

```
Dashboard

↓

Logout

↓

AuthContext

↓

Login
```

---

# Persistência

A sessão é persistida utilizando:

```text
localStorage
```

---

## Chaves

```text
@clone-trello:token

@clone-trello:user
```

---

## Recuperação

Quando o frontend inicia:

```
App

↓

AuthProvider

↓

Existe token?

↓

Não

↓

Login

↓

Sim

↓

GET /auth/me

↓

Sessão válida?

↓

Sim

↓

Atualiza usuário

↓

Dashboard

↓

Não

↓

Remove sessão

↓

Login
```

---

# Hook useAuth

## Arquivo

```text
src/features/auth/hooks/useAuth.ts
```

O hook encapsula o acesso ao contexto.

Exemplo:

```ts
const {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
} = useAuth();
```

Isso evita chamadas diretas ao `useContext`.

---

# Fluxo da Sessão

```
BrowserRouter

↓

AuthProvider

↓

AuthContext

↓

Pages

↓

Components
```

Todos os componentes podem acessar a autenticação utilizando:

```ts
useAuth()
```

---

# Benefícios

A utilização do Context proporciona:

- Estado único da autenticação.
- Reutilização.
- Código desacoplado.
- Eliminação de duplicação.
- Facilidade para testes.
- Escalabilidade.

---

# Próximos Contextos

Conforme o projeto evoluir, serão adicionados:

```text
WorkspaceContext

BoardContext

ThemeContext

NotificationContext
```

Cada contexto será responsável apenas por seu domínio.

---

# Evolução Planejada

Nas próximas milestones o AuthContext receberá novas responsabilidades.

Entre elas:

- Refresh Token.
- Atualização automática do usuário.
- Alteração de avatar.
- Alteração de perfil.
- Recuperação de senha.
- Revogação de sessão.
- Logout automático após token expirado.

---

# Estado Atual

## Implementado

- AuthContext.
- AuthProvider.
- Hook useAuth.
- Persistência da sessão.
- Recuperação automática da sessão.
- Estado de carregamento.
- Login.
- Logout.

## Planejado

- WorkspaceContext.
- BoardContext.
- NotificationContext.
- ThemeContext.
- Refresh Token.
- Sessão compartilhada entre abas.