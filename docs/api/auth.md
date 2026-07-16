# Auth API

Responsável pelo gerenciamento de autenticação dos usuários.

---

# Cadastro de Usuário

## POST

```
/auth/register
```

### Descrição

Cria um novo usuário na plataforma.

### Request Body

```json
{
  "name": "Marcelo Cruz",
  "email": "marcelo@email.com",
  "password": "123456"
}
```

### Resposta

**201 Created**

```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "uuid",
    "name": "Marcelo Cruz",
    "email": "marcelo@email.com",
    "avatarUrl": null,
    "createdAt": "2026-06-26T20:00:00.000Z"
  }
}
```

### Possíveis Erros

#### Token não informado

**401 Unauthorized**

```json
{
  "message": "Token não informado"
}
```

---

#### Token inválido ou expirado

**401 Unauthorized**

```json
{
  "message": "Token inválido ou expirado"
}
```

Quando esse erro ocorre, o frontend:

- Remove o token do `localStorage`.
- Remove o usuário armazenado.
- Limpa o `AuthContext`.
- Redireciona automaticamente para a página de Login.

---

# Login

## POST

```
/auth/login
```

### Descrição

Autentica um usuário utilizando email e senha.

### Request Body

```json
{
  "email": "marcelo@email.com",
  "password": "123456"
}
```

### Resposta

**200 OK**

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

### Possíveis Erros

#### Credenciais inválidas

**401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Email ou senha inválidos"
}
```

#### Erro de validação

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Erro de validação"
}
```

---

# Usuário Autenticado

## GET

```
/auth/me
```

### Headers

```
Authorization: Bearer TOKEN
```

### Resposta

**200 OK**

```json
{
  "user": {
    "id": "uuid",
    "name": "Marcelo Cruz",
    "email": "marcelo@email.com",
    "avatarUrl": null,
    "createdAt": "2026-06-26T20:00:00.000Z"
  }
}
```

### Possíveis Erros

#### Token não informado

**401 Unauthorized**

```json
{
  "message": "Token não informado"
}
```

#### Token inválido

**401 Unauthorized**

```json
{
  "message": "Token inválido ou expirado"
}
```

### Utilização

O endpoint `/auth/me` é utilizado pelo frontend para restaurar automaticamente a sessão do usuário.

Sempre que a aplicação é iniciada:

```text
Aplicação inicia

↓

Existe token salvo?

↓

Sim

↓

GET /auth/me

↓

Token válido?

↓

Sim

↓

Atualiza AuthContext

↓

Renderiza Dashboard

↓

Não

↓

Remove sessão

↓

Redireciona para Login
```

Essa abordagem garante que o frontend sempre possua informações atualizadas do usuário autenticado antes de liberar o acesso às rotas protegidas.

---

# Fluxo Completo da Autenticação

```text
Cadastro

↓

POST /auth/register

↓

Login

↓

POST /auth/login

↓

JWT

↓

localStorage

↓

Inicialização da aplicação

↓

GET /auth/me

↓

AuthContext

↓

Rotas protegidas
```

---

# Estado Atual

## Implementado

- Cadastro de usuários.
- Login.
- JWT.
- Endpoint `/auth/me`.
- Recuperação automática da sessão.
- Validação de token.
- Integração com o AuthContext do frontend.

## Planejado

- Recuperação de senha.
- Refresh Token.
- Revogação de sessão.
- Logout global.