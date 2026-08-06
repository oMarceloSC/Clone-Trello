# Autenticação no Frontend

## Visão Geral

O frontend do Clone do Trello possui um fluxo de autenticação integrado à API REST do backend.

A autenticação é centralizada por meio de um `AuthContext`, responsável por controlar:

- Usuário autenticado.
- Estado da sessão.
- Login.
- Logout.
- Recuperação automática da sessão.
- Persistência do token.
- Proteção das rotas.
- Redirecionamento de usuários autenticados e não autenticados.

O token JWT é armazenado no `localStorage` e validado pelo backend através do endpoint `/auth/me` sempre que a aplicação é carregada.

---

# Tecnologias

| Tecnologia | Responsabilidade |
|---|---|
| React | Construção da interface |
| React Context API | Estado global da autenticação |
| React Router | Navegação e proteção das rotas |
| Axios | Comunicação com a API |
| React Hook Form | Gerenciamento dos formulários |
| Zod | Validação dos dados |
| JWT | Autenticação entre frontend e backend |
| localStorage | Persistência do token e dos dados do usuário |

---

# Estrutura

A autenticação está organizada dentro da feature `auth`.

```text
src/
└── features/
    └── auth/
        ├── contexts/
        │   ├── auth-context.ts
        │   └── AuthProvider.tsx
        ├── hooks/
        │   └── useAuth.ts
        ├── pages/
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── ForgotPasswordPage.tsx
        │   └── ResetPasswordPage.tsx
        ├── schemas/
        │   ├── login.schema.ts
        │   ├── register.schema.ts
        │   ├── forgot-password.schema.ts
        │   └── reset-password.schema.ts
        ├── services/
        │   └── auth.service.ts
        └── types/
            └── auth.types.ts
```

---

# Endpoints Consumidos

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/auth/register` | Cadastro de usuário |
| POST | `/auth/login` | Autenticação |
| POST | `/auth/forgot-password` | Solicitação de recuperação de senha |
| POST | `/auth/reset-password` | Redefinição da senha |
| GET | `/auth/me` | Recuperação da sessão atual |

---

# AuthContext

## Visão Geral

O `AuthContext` centraliza o estado de autenticação da aplicação.

Ele evita que páginas e componentes precisem acessar diretamente o `localStorage` ou executar manualmente as regras de autenticação.

---

## Dados Disponibilizados

```ts
type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => void;
};
```

### user

Contém os dados do usuário autenticado.

Quando não existe uma sessão válida:

```ts
user === null
```

---

### isAuthenticated

Indica se existe um usuário autenticado.

```ts
isAuthenticated = Boolean(user);
```

---

### isLoading

Indica que a aplicação ainda está verificando a sessão armazenada.

Durante esse período, as rotas exibem:

```text
Carregando sessão...
```

---

### signIn

Executa o login, armazena o token e atualiza o usuário no contexto.

---

### signOut

Remove os dados da sessão e atualiza o estado global da autenticação.

---

# AuthProvider

## Arquivo

```text
src/features/auth/contexts/AuthProvider.tsx
```

## Responsabilidades

- Manter o usuário autenticado.
- Controlar o carregamento inicial.
- Executar o login.
- Executar o logout.
- Restaurar a sessão.
- Validar o token no backend.
- Remover sessões inválidas.
- Escutar eventos globais de expiração da sessão.
- Limpar automaticamente a autenticação após respostas `401 Unauthorized`.
- Notificar a interface quando uma sessão expirar.
- Disponibilizar os dados para toda a aplicação.

O `AuthProvider` envolve a aplicação no arquivo `main.tsx`.

```tsx
<BrowserRouter>
  <AuthProvider>
    <App />
  </AuthProvider>
</BrowserRouter>
```

---

# Hook useAuth

## Arquivo

```text
src/features/auth/hooks/useAuth.ts
```

O hook `useAuth` permite acessar o contexto de autenticação em qualquer componente descendente do `AuthProvider`.

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

Caso seja utilizado fora do `AuthProvider`, uma exceção é lançada.

```text
useAuth deve ser utilizado dentro de AuthProvider.
```

---

# Cadastro

## Rota

```text
/register
```

## Objetivo

Permitir que um novo usuário crie uma conta informando:

- Nome.
- Email.
- Senha.
- Confirmação de senha.

---

## Funcionalidades

- Formulário de cadastro.
- Validação com React Hook Form e Zod.
- Validação do nome.
- Validação do formato do email.
- Validação do tamanho mínimo da senha.
- Confirmação de senha.
- Tratamento de email duplicado.
- Feedback durante a requisição.
- Exibição de erros retornados pela API.
- Redirecionamento para o login.
- Mensagem visual após cadastro concluído.

---

## Endpoint Consumido

```http
POST /auth/register
```

---

## Dados Enviados

```json
{
  "name": "Marcelo Cruz",
  "email": "marcelo@email.com",
  "password": "123456"
}
```

O campo `passwordConfirmation` existe apenas no frontend e não é enviado para o backend.

---

## Resposta Esperada

```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "uuid",
    "name": "Marcelo Cruz",
    "email": "marcelo@email.com",
    "avatarUrl": null,
    "createdAt": "2026-07-11T18:00:00.000Z"
  }
}
```

---

## Fluxo

```text
Usuário acessa /register
        ↓
Preenche o formulário
        ↓
React Hook Form coleta os dados
        ↓
Zod valida os campos
        ↓
POST /auth/register
        ↓
Usuário criado
        ↓
Redirecionamento para /login
        ↓
Mensagem de cadastro concluído
```

---

## Validações

### Nome

- Obrigatório.
- Espaços externos removidos.
- Mínimo de 3 caracteres.

Mensagem:

```text
O nome deve possuir pelo menos 3 caracteres
```

### Email

- Obrigatório.
- Deve possuir formato válido.

Mensagem:

```text
Informe um email válido
```

### Senha

- Obrigatória.
- Mínimo de 6 caracteres.

Mensagem:

```text
A senha deve possuir pelo menos 6 caracteres
```

### Confirmação de senha

- Obrigatória.
- Deve ser igual à senha.

Mensagem:

```text
As senhas não coincidem
```

---

## Erros

### Email já utilizado

```text
Email já está em uso
```

### Erro inesperado

```text
Ocorreu um erro inesperado.
```

---

# Login

## Rota

```text
/login
```

## Objetivo

Autenticar um usuário cadastrado utilizando email e senha.

---

## Funcionalidades

- Formulário de login.
- Validação com React Hook Form e Zod.
- Integração com o `AuthContext`.
- Armazenamento do JWT.
- Armazenamento dos dados do usuário.
- Atualização do estado global da sessão.
- Redirecionamento para o dashboard.
- Tratamento de credenciais inválidas.
- Feedback durante o envio.
- Exibição de confirmação após cadastro.
- Exibição automática da mensagem de sessão expirada.

---

## Endpoint Consumido

```http
POST /auth/login
```

---

## Dados Enviados

```json
{
  "email": "marcelo@email.com",
  "password": "123456"
}
```

---

## Resposta Esperada

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "name": "Marcelo Cruz",
    "email": "marcelo@email.com",
    "avatarUrl": null
  }
}
```

---

## Fluxo

```text
Usuário acessa /login
        ↓
Preenche email e senha
        ↓
Validação com Zod
        ↓
signIn()
        ↓
POST /auth/login
        ↓
Token e usuário retornados
        ↓
Dados salvos no localStorage
        ↓
Usuário salvo no AuthContext
        ↓
Redirecionamento para /dashboard
```

---

# Recuperação de Senha

## Rota

```text
/forgot-password
```

## Objetivo

Permitir que o usuário solicite a redefinição da senha informando seu email.

---

## Funcionalidades

- Formulário de recuperação.
- Validação utilizando React Hook Form e Zod.
- Integração com o endpoint `/auth/forgot-password`.
- Exibição do link de redefinição durante o desenvolvimento.
- Botão para copiar o link.
- Navegação direta para a tela de redefinição.
- Tratamento de erros retornados pela API.

---

## Endpoint Consumido

```http
POST /auth/forgot-password
```

---

## Fluxo

```text
Usuário acessa /forgot-password

↓

Informa o email

↓

Validação com Zod

↓

POST /auth/forgot-password

↓

Token gerado

↓

Link de redefinição exibido

↓

Usuário acessa a tela de redefinição
```

---

# Redefinição de Senha

## Rota

```text
/reset-password
```

## Objetivo

Permitir que o usuário informe uma nova senha utilizando um token de recuperação válido.

---

## Funcionalidades

- Leitura do token enviado pela URL.
- Validação utilizando React Hook Form e Zod.
- Confirmação da nova senha.
- Integração com o endpoint `/auth/reset-password`.
- Redirecionamento automático para o Login após sucesso.
- Exibição de confirmação da redefinição da senha.
- Tratamento de tokens inválidos ou expirados.

---

## Endpoint Consumido

```http
POST /auth/reset-password
```

---

## Fluxo

```text
Usuário acessa /reset-password?token=...

↓

Nova senha

↓

Confirmação da senha

↓

POST /auth/reset-password

↓

Senha atualizada

↓

Redirecionamento para /login

↓

Mensagem de sucesso
```

---

# Persistência da Sessão

O token e os dados do usuário são armazenados no `localStorage`.

## Chaves

```text
@clone-trello:token
@clone-trello:user
```

## Token

```ts
localStorage.setItem(
  "@clone-trello:token",
  response.token,
);
```

## Usuário

```ts
localStorage.setItem(
  "@clone-trello:user",
  JSON.stringify(response.user),
);
```

O `localStorage` mantém os dados após o fechamento ou atualização da página.

Entretanto, os dados armazenados não são considerados suficientes para validar a sessão. O token também é verificado no backend através do endpoint `/auth/me`.

---

# Recuperação da Sessão

Quando o frontend é iniciado, o `AuthProvider` executa automaticamente a recuperação da sessão.

## Fluxo

```text
Aplicação iniciada
       ↓
AuthProvider montado
       ↓
Existe token no localStorage?
       ├── Não
       │    ↓
       │  Sessão encerrada
       │
       └── Sim
            ↓
       GET /auth/me
            ↓
       Token válido?
       ├── Sim
       │    ↓
       │  Usuário atualizado
       │    ↓
       │  Sessão restaurada
       │
       └── Não
            ↓
       Dados removidos
            ↓
       Redirecionamento para /login
```

---

## Endpoint Consumido

```http
GET /auth/me
```

O interceptor do Axios envia automaticamente:

```text
Authorization: Bearer TOKEN
```

---

## Resposta Esperada

```json
{
  "user": {
    "id": "uuid",
    "name": "Marcelo Cruz",
    "email": "marcelo@email.com",
    "avatarUrl": null,
    "createdAt": "2026-07-11T18:00:00.000Z"
  }
}
```

---

## Sessão Inválida

Caso o token seja inválido ou esteja expirado:

- O token é removido.
- Os dados do usuário são removidos.
- O estado do contexto é limpo.
- O usuário é redirecionado para o login.

---

# Expiração Automática da Sessão

Além da recuperação automática da sessão, o frontend monitora todas as respostas da API através de um interceptor global do Axios.

Quando uma requisição autenticada recebe a resposta:

```http
401 Unauthorized
```

o sistema executa automaticamente:

- Remoção do token armazenado.
- Remoção dos dados do usuário.
- Disparo de um evento global de sessão expirada.
- Atualização do `AuthContext`.
- Redirecionamento automático para a tela de Login.

O endpoint de autenticação (`POST /auth/login`) é ignorado por esse tratamento para que credenciais inválidas continuem exibindo apenas a mensagem retornada pela API.

## Fluxo

```text
Backend

↓

401 Unauthorized

↓

Interceptor de Respostas

↓

SESSION_EXPIRED_EVENT

↓

AuthProvider

↓

Sessão encerrada

↓

RequireAuthentication

↓

LoginPage

↓

"Sua sessão expirou. Entre novamente."
```

---

# Envio Automático do JWT

A instância do Axios possui um interceptor responsável por adicionar o token às requisições.

```text
Authorization: Bearer TOKEN
```

Fluxo:

```text
Serviço
   ↓
Axios
   ↓
Interceptor
   ↓
Leitura do token
   ↓
Header Authorization
   ↓
Backend
```

---

# Rotas Protegidas

O componente `RequireAuthentication` protege páginas que exigem sessão válida.

## Fluxo

```text
Usuário acessa rota protegida
          ↓
Sessão está carregando?
     ┌────┴────┐
     │         │
    Sim       Não
     │         │
 Loading   Autenticado?
            ┌──┴──┐
            │     │
           Sim   Não
            │     │
         Página  /login
```

---

# Rotas Públicas para Visitantes

As páginas públicas utilizam o componente `RequireGuest`.

Atualmente são protegidas:

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

Caso um usuário autenticado tente acessar:

```text
/login
```

ou:

```text
/register
```

ele é redirecionado para:

```text
/dashboard
```

---

# Logout

O logout é executado através da função:

```ts
signOut();
```

Ela remove:

```text
@clone-trello:token
@clone-trello:user
```

Também atualiza:

```ts
user = null;
```

Depois disso, o usuário é redirecionado para:

```text
/login
```

---

# Estados da Autenticação

## Carregando

```text
isLoading = true
```

A aplicação ainda está verificando a sessão.

---

## Autenticado

```text
user !== null
isAuthenticated = true
```

---

## Não autenticado

```text
user === null
isAuthenticated = false
```

---

# Segurança Atual

## Implementado

- Token JWT enviado via Bearer Token.
- Validação da sessão através do backend.
- Remoção de tokens inválidos.
- Tratamento automático de respostas `401 Unauthorized`.
- Limpeza automática da sessão após token inválido ou expirado.
- Evento global de expiração da sessão.
- Proteção das rotas autenticadas.
- Bloqueio das páginas públicas para usuários autenticados.
- Dados da senha nunca armazenados no frontend.

## Limitações atuais

O token ainda é armazenado no `localStorage`.

Isso facilita a integração inicial, mas exige cuidados contra ataques de XSS.

Futuramente poderá ser avaliada a utilização de:

- Cookies `HttpOnly`.
- Refresh tokens.
- Rotação de tokens.
- Revogação de sessão.
- Content Security Policy.

---

# Estado Atual

## Implementado

- Cadastro.
- Login.
- Logout.
- Recuperação de senha.
- Redefinição de senha.
- `AuthContext`.
- `AuthProvider`.
- Hook `useAuth`.
- Recuperação automática da sessão.
- Validação com `/auth/me`.
- Estado de carregamento.
- Persistência do token.
- Persistência do usuário.
- Interceptor de requisição JWT.
- Interceptor global de respostas.
- Tratamento automático de respostas `401 Unauthorized`.
- Limpeza automática da sessão.
- Mensagem de sessão expirada.
- Mensagem de confirmação após redefinição da senha.
- Rotas protegidas.
- Rotas exclusivas para visitantes.
- Redirecionamento após cadastro.
- Redirecionamento após redefinição da senha.

## Planejado

- Envio da recuperação por email.
- Refresh token.
- Revogação de sessões.
- Cookies `HttpOnly`.
- Perfil do usuário.