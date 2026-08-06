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

# Recuperação de Senha

## POST

```
/auth/forgot-password
```

### Descrição

Gera um token temporário para redefinição da senha.

Nesta fase do projeto, o endpoint retorna o link de redefinição para facilitar os testes durante o desenvolvimento. Futuramente esse link será enviado por email.

### Request Body

```json
{
  "email": "marcelo@email.com"
}
```

### Resposta

**200 OK**

```json
{
  "message": "Se existir uma conta com este email, as instruções de recuperação foram geradas.",
  "resetToken": "uuid-do-token",
  "resetUrl": "http://localhost:5173/reset-password?token=uuid-do-token"
}
```

Caso o email não esteja cadastrado, a resposta permanece a mesma, evitando a identificação de usuários existentes.

```json
{
  "message": "Se existir uma conta com este email, as instruções de recuperação foram geradas.",
  "resetToken": null,
  "resetUrl": null
}
```

### Fluxo

```text
Usuário informa o email

↓

POST /auth/forgot-password

↓

Backend gera um token temporário

↓

Token é armazenado no banco de dados

↓

Link de redefinição é retornado

↓

Frontend utiliza o link para abrir a tela de redefinição
```

### Possíveis Erros

#### Erro de validação

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Erro de validação"
}
```

---

# Redefinição de Senha

## POST

```
/auth/reset-password
```

### Descrição

Redefine a senha do usuário utilizando um token de recuperação válido.

### Request Body

```json
{
  "token": "uuid-do-token",
  "password": "NovaSenha123"
}
```

### Resposta

**200 OK**

```json
{
  "message": "Senha redefinida com sucesso"
}
```

### Possíveis Erros

#### Token inválido

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Token de recuperação inválido ou expirado"
}
```

#### Token já utilizado

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Este token de recuperação já foi utilizado"
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

### Fluxo

```text
Usuário acessa o link de recuperação

↓

POST /auth/reset-password

↓

Token validado

↓

Senha atualizada

↓

Token marcado como utilizado

↓

Usuário pode realizar login com a nova senha
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

## Fluxo de Recuperação de Senha

```text
Usuário esquece a senha

↓

POST /auth/forgot-password

↓

Token temporário

↓

Tela de redefinição

↓

POST /auth/reset-password

↓

Senha atualizada

↓

Login com a nova senha
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
- Recuperação de senha.
- Redefinição de senha.
- Geração de token temporário.
- Invalidação automática do token após o uso.
- Expiração automática do token de recuperação.

## Planejado

- Envio do link de recuperação por email.
- Refresh Token.
- Revogação de sessão.
- Logout global.