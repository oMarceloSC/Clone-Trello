# Serviços do Frontend

## Visão Geral

A camada de serviços é responsável pela comunicação entre o frontend e a API REST do backend.

Todos os serviços utilizam uma instância compartilhada do Axios, responsável por:

- Configuração da URL da API.
- Envio automático do JWT.
- Padronização das requisições.
- Centralização da comunicação HTTP.

A organização segue a arquitetura baseada em funcionalidades.

---

# Estrutura

```text
src/

├── services/
│   └── api.ts
│
└── features/
    └── auth/
        └── services/
            └── auth.service.ts
```

Novas funcionalidades possuirão seus próprios serviços.

Exemplo:

```text
features/

workspaces/
    services/

boards/
    services/

lists/
    services/

cards/
    services/
```

---

# API

## Arquivo

```text
src/services/api.ts
```

---

## Responsabilidades

- Criar instância única do Axios.
- Definir URL da API.
- Configurar cabeçalhos padrão.
- Adicionar automaticamente o JWT.
- Ser reutilizada por todos os módulos.

---

## Configuração

```ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});
```

---

# Variáveis de Ambiente

A URL do backend é obtida através da variável:

```env
VITE_API_URL
```

Exemplo:

```env
VITE_API_URL=http://localhost:3333
```

O arquivo `.env.example` documenta todas as variáveis necessárias para execução do projeto.

---

# Interceptor de Requisição

Antes de cada requisição, o Axios verifica a existência de um token JWT.

Caso exista, é enviado automaticamente:

```text
Authorization: Bearer TOKEN
```

Fluxo:

```
Serviço

↓

Axios

↓

Interceptor

↓

localStorage

↓

Authorization

↓

Backend
```

---

# Serviço de Autenticação

## Arquivo

```text
src/features/auth/services/auth.service.ts
```

Responsável por toda comunicação relacionada à autenticação.

---

# login()

## Endpoint

```http
POST /auth/login
```

---

## Entrada

```ts
{
    email: string;
    password: string;
}
```

---

## Resposta

```ts
{
    token: string;

    user: User;
}
```

---

## Responsabilidades

- Enviar credenciais.
- Receber JWT.
- Receber usuário autenticado.

O armazenamento da sessão é responsabilidade do `AuthContext`.

---

# registerUser()

## Endpoint

```http
POST /auth/register
```

---

## Entrada

```ts
{
    name: string;
    email: string;
    password: string;
}
```

---

## Resposta

```ts
{
    message: string;

    user: User;
}
```

---

## Responsabilidades

- Criar novo usuário.
- Retornar usuário criado.

---

# getCurrentUser()

## Endpoint

```http
GET /auth/me
```

---

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pelo interceptor do Axios.

---

## Resposta

```ts
{
    user: User;
}
```

---

## Responsabilidades

- Validar token.
- Recuperar usuário autenticado.
- Restaurar a sessão durante a inicialização da aplicação.

Esse método é utilizado exclusivamente pelo `AuthProvider`.

---

# Fluxo da Autenticação

```
LoginPage

↓

signIn()

↓

auth.service

↓

Axios

↓

Backend

↓

JWT

↓

AuthContext
```

---

# Fluxo de Recuperação da Sessão

```
Aplicação

↓

AuthProvider

↓

getCurrentUser()

↓

Axios

↓

GET /auth/me

↓

Usuário

↓

AuthContext
```

---

# Tipos Utilizados

## User

```ts
type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt?: string;
}
```

---

## LoginRequest

```ts
type LoginRequest = {
    email: string;
    password: string;
}
```

---

## LoginResponse

```ts
type LoginResponse = {
    token: string;
    user: User;
}
```

---

## RegisterRequest

```ts
type RegisterRequest = {
    name: string;
    email: string;
    password: string;
}
```

---

## RegisterResponse

```ts
type RegisterResponse = {
    message: string;
    user: User;
}
```

---

## CurrentUserResponse

```ts
type CurrentUserResponse = {
    user: User;
}
```

---

# Tratamento de Erros

Os serviços apenas propagam os erros recebidos da API.

A responsabilidade pela exibição das mensagens pertence às páginas.

Exemplo:

```
API

↓

AxiosError

↓

Página

↓

Mensagem ao usuário
```

---

# Boas Práticas

Os serviços devem:

- Não acessar diretamente componentes React.
- Não manipular interface.
- Não acessar o DOM.
- Não executar navegação.
- Apenas comunicar com a API.

Toda lógica de interface permanece nas páginas ou nos hooks.

---

# Próximos Serviços

Serão implementados conforme novas funcionalidades forem desenvolvidas.

```text
workspace.service.ts

board.service.ts

list.service.ts

card.service.ts

notification.service.ts
```

---

# Melhorias Futuras

Estão planejadas para as próximas milestones:

- Interceptor global de respostas.
- Tratamento automático de respostas `401 Unauthorized`.
- Cancelamento de requisições.
- Refresh Token.
- Retry automático de requisições.
- Cache de consultas.
- Integração com TanStack Query (caso necessário).

---

# Estado Atual

## Implementado

- Instância compartilhada do Axios.
- Configuração por variável de ambiente.
- Interceptor JWT.
- login().
- registerUser().
- getCurrentUser().

## Planejado

- workspace.service.ts.
- board.service.ts.
- list.service.ts.
- card.service.ts.
- notification.service.ts.
- Interceptor de respostas.
- Refresh Token.
- Cache de requisições.