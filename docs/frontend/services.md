# Serviços do Frontend

## Visão Geral

A camada de serviços é responsável pela comunicação entre o frontend e a API REST.

O Axios é utilizado como cliente HTTP.

A organização inicial é dividida entre:

```text
src/services/
└── api.ts
```

e serviços específicos por feature:

```text
src/features/auth/services/
└── auth.service.ts
```

---

# Instância da API

## Arquivo

```text
src/services/api.ts
```

## Responsabilidade

Criar uma instância centralizada do Axios.

Configuração:

```ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

# Variável de Ambiente

A URL do backend é configurada por:

```env
VITE_API_URL=http://localhost:3333
```

O arquivo `.env.example` documenta a variável necessária sem expor dados privados.

---

# Interceptor JWT

Antes de cada requisição, o Axios procura o token:

```text
@clone-trello:token
```

Caso exista, adiciona:

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
JWT
   ↓
API
```

---

# Serviço de Autenticação

## Arquivo

```text
src/features/auth/services/auth.service.ts
```

Atualmente disponibiliza:

```text
login

registerUser
```

---

# login

Envia as credenciais para:

```http
POST /auth/login
```

## Entrada

```ts
{
  email: string;
  password: string;
}
```

## Saída

```ts
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}
```

## Responsabilidade

* Enviar email e senha.
* Retornar token e usuário.
* Não armazenar diretamente os dados da sessão.

O armazenamento ainda é feito pela `LoginPage` e será movido para o `AuthContext`.

---

# registerUser

Envia os dados para:

```http
POST /auth/register
```

## Entrada

```ts
{
  name: string;
  email: string;
  password: string;
}
```

## Saída

```ts
{
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt?: string;
  };
}
```

## Responsabilidade

* Enviar os dados de cadastro.
* Retornar o usuário criado.
* Não enviar a confirmação de senha ao backend.

---

# Tipos Relacionados

## User

```ts
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt?: string;
};
```

## LoginRequest

```ts
export type LoginRequest = {
  email: string;
  password: string;
};
```

## LoginResponse

```ts
export type LoginResponse = {
  token: string;
  user: User;
};
```

## RegisterRequest

```ts
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};
```

## RegisterResponse

```ts
export type RegisterResponse = {
  message: string;
  user: User;
};
```

---

# Tratamento de Erros

As páginas identificam erros do Axios utilizando:

```ts
axios.isAxiosError(error)
```

Quando possível, a mensagem do backend é exibida:

```ts
error.response?.data?.message
```

Caso não exista uma mensagem específica, é utilizado um texto genérico.

---

# Serviços Planejados

```text
workspace.service.ts

board.service.ts

list.service.ts

card.service.ts

notification.service.ts
```

---

# Próximas Melhorias

* Criar serviço de Workspaces.
* Criar interceptor de respostas.
* Tratar respostas `401`.
* Limpar a sessão automaticamente quando o token expirar.
* Padronizar os tipos de erro da API.
* Centralizar o tratamento de erros.
* Integrar o `AuthContext`.
* Adicionar cancelamento de requisições quando necessário.
