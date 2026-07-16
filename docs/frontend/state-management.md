# Gerenciamento de Estado

## Visão Geral

O frontend do Clone do Trello utiliza a **Context API** do React para gerenciamento do estado global da aplicação.

Atualmente o único estado global da aplicação é responsável pela autenticação dos usuários.

Os demais estados permanecem locais às páginas e componentes, sendo compartilhados através de Props quando necessário.

Essa abordagem reduz o acoplamento entre componentes e evita a necessidade de bibliotecas externas de gerenciamento de estado nesta fase do projeto.

---

# Tecnologias

| Tecnologia | Finalidade |
|------------|------------|
| React Context API | Estado global |
| React Hooks | Gerenciamento de estado |
| localStorage | Persistência da sessão |

---

# Estado Atual

Atualmente existe apenas um contexto global.

```text
AuthContext
```

As demais informações da aplicação são controladas por estados locais.

Exemplos:

- Lista de Workspaces.
- Workspace atualmente aberto.
- Modal de criação.
- Modal de edição.
- Modal de exclusão.
- Lista de membros.
- Estados de carregamento.
- Estados de erro.

Essa divisão mantém o estado global enxuto e evita compartilhamentos desnecessários.

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

Nenhum outro módulo da aplicação precisa acessar diretamente:

- localStorage;
- Token JWT;
- endpoint `/auth/me`.

Toda a autenticação passa pelo AuthContext.

---

# Dados Disponíveis

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

# user

Representa o usuário autenticado.

Quando não existe sessão:

```ts
user === null
```

---

# isAuthenticated

Indica se existe um usuário autenticado.

```ts
Boolean(user)
```

É utilizado pelas rotas protegidas.

---

# isLoading

Indica que a aplicação ainda está restaurando a sessão.

Enquanto esse estado permanece verdadeiro é exibida a tela:

```text
Carregando sessão...
```

Nenhuma página protegida é renderizada antes da conclusão dessa validação.

---

# signIn()

Responsável por:

- autenticar usuário;
- salvar token;
- salvar usuário;
- atualizar contexto;
- disponibilizar a sessão para toda a aplicação.

Fluxo:

```text
Login

↓

POST /auth/login

↓

JWT

↓

AuthContext

↓

AuthenticatedLayout

↓

Dashboard
```

---

# signOut()

Responsável por:

- remover token;
- remover usuário;
- limpar contexto;
- redirecionar para Login.

Fluxo:

```text
Workspace

↓

Logout

↓

AuthContext

↓

Login
```

---

# Persistência da Sessão

A autenticação permanece salva utilizando:

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

# Recuperação da Sessão

Sempre que o frontend inicia:

```text
App

↓

AuthProvider

↓

Existe token?

├── Não
│
│   ↓
│
│   Login
│
└── Sim

    ↓

    GET /auth/me

    ↓

    Sessão válida?

    ├── Sim
    │
    │   ↓
    │
    │   Atualiza usuário
    │
    │   ↓
    │
    │   Dashboard
    │
    └── Não

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

O hook encapsula todo acesso ao AuthContext.

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

# Estados Locais

Embora exista apenas um contexto global, diversas páginas utilizam estados locais através do `useState`.

Essa estratégia evita tornar global um estado que pertence apenas a uma tela específica.

---

## DashboardPage

Controla:

- Lista de Workspaces.
- Estado de carregamento.
- Estado vazio.
- Modal de criação.
- Atualização imediata após criação.

Fluxo:

```text
Dashboard

↓

listWorkspaces()

↓

useState

↓

Renderização
```

---

## WorkspacePage

Controla:

- Workspace carregado.
- Estado de carregamento.
- Estado de erro.
- Modal de edição.
- Modal de exclusão.
- Atualização após edição.
- Redirecionamento após exclusão.

Fluxo:

```text
WorkspacePage

↓

getWorkspaceById()

↓

useState

↓

Renderização
```

---

## WorkspaceMembersSection

Este componente possui estado próprio.

Ele controla:

- Lista de membros.
- Carregamento.
- Estado vazio.
- Estado de erro.
- Nova tentativa.

Fluxo:

```text
WorkspaceMembersSection

↓

listWorkspaceMembers()

↓

useState

↓

Lista de membros
```

Esse estado não precisa ser compartilhado com outras páginas.

---

# Fluxo Geral do Estado

```text
BrowserRouter

↓

AuthProvider

↓

AuthContext

↓

AuthenticatedLayout

↓

Pages

↓

Components

↓

useState
```

Apenas a autenticação é global.

Os demais estados permanecem locais.

---

# Benefícios

A arquitetura atual oferece:

- Estado global mínimo.
- Separação de responsabilidades.
- Baixo acoplamento.
- Componentes independentes.
- Melhor desempenho.
- Menor quantidade de renderizações.
- Facilidade para manutenção.
- Escalabilidade.

---

# Próximos Contextos

Conforme a aplicação crescer poderão ser adicionados:

```text
WorkspaceContext

BoardContext

NotificationContext

ThemeContext
```

Esses Contexts somente serão criados quando realmente houver necessidade de compartilhamento global.

Até esse momento, estados locais continuam sendo a abordagem preferida.

---

# Evolução Planejada

O AuthContext continuará evoluindo.

Próximas funcionalidades previstas:

- Refresh Token.
- Atualização automática da sessão.
- Logout automático após token expirado.
- Alteração de perfil.
- Alteração de avatar.
- Recuperação de senha.
- Sessões simultâneas.

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
- Estados locais para Dashboard.
- Estados locais para WorkspacePage.
- Estados locais para WorkspaceMembersSection.
- Atualização automática após criação de Workspace.
- Atualização automática após edição de Workspace.
- Atualização automática após exclusão de Workspace.
- Carregamento independente da lista de membros.
- Tratamento local de erros.
- Controle local dos modais.

## Planejado

- WorkspaceContext.
- BoardContext.
- NotificationContext.
- ThemeContext.
- Refresh Token.
- Sessão compartilhada entre abas.
- Sincronização automática entre múltiplas janelas.
- Cache de consultas.
- Integração futura com TanStack Query, caso a complexidade da aplicação justifique.