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

#### Email já cadastrado

**409 Conflict**

```json
{
  "statusCode": 409,
  "message": "Email já está em uso"
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