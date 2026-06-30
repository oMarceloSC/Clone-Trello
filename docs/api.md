# API Documentation

## Visão Geral

A API do Clone do Trello foi desenvolvida utilizando **Fastify** seguindo o padrão REST.

Todas as respostas são enviadas em formato JSON.

A autenticação é realizada utilizando **JWT (JSON Web Token)**.

---

# Base URL

Desenvolvimento

```
http://localhost:3333
```

Produção

```
Em definição
```

---

# Padrão das Respostas

## Sucesso

```json
{
    "message": "Operação realizada com sucesso."
}
```

---

## Erro

```json
{
    "statusCode": 400,
    "message": "Descrição do erro"
}
```

---

# Autenticação

Após realizar o login, a API retorna um JWT.

Esse token deve ser enviado nas rotas protegidas.

Exemplo:

```
Authorization: Bearer TOKEN
```

---

# Endpoints

---

# Auth

## Cadastro de Usuário

### POST

```
/auth/register
```

---

### Descrição

Cria um novo usuário na plataforma.

---

### Request Body

```json
{
    "name": "Marcelo Cruz",
    "email": "marcelo@email.com",
    "password": "123456"
}
```

---

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

---

### Possíveis Erros

Email já cadastrado

**409**

```json
{
    "statusCode": 409,
    "message": "Email já está em uso"
}
```

---

Erro de validação

**400**

```json
{
    "statusCode": 400,
    "message": "Erro de validação"
}
```

---

# Login

### POST

```
/auth/login
```

---

### Descrição

Autentica um usuário utilizando email e senha.

---

### Request Body

```json
{
    "email": "marcelo@email.com",
    "password": "123456"
}
```

---

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

---

### Possíveis Erros

Credenciais inválidas

**401**

```json
{
    "statusCode": 401,
    "message": "Email ou senha inválidos"
}
```

---

Erro de validação

**400**

```json
{
    "statusCode": 400,
    "message": "Erro de validação"
}
```

---

# Usuário Autenticado

### GET

```
/auth/me
```

---

### Descrição

Retorna as informações do usuário autenticado.

---

### Headers

```
Authorization: Bearer TOKEN
```

---

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

---

### Possíveis Erros

Token ausente

**401**

```json
{
    "message": "Token não informado"
}
```

---

Token inválido

**401**

```json
{
    "message": "Token inválido ou expirado"
}
```

---

# Endpoints Planejados

## Workspaces

```
POST   /workspaces

GET    /workspaces

GET    /workspaces/:id

PATCH  /workspaces/:id

DELETE /workspaces/:id
```

---

## Boards

```
POST

GET

PATCH

DELETE
```

---

## Lists

```
POST

GET

PATCH

DELETE
```

---

## Cards

```
POST

GET

PATCH

DELETE
```

---

## Comments

```
POST

PATCH

DELETE
```

---

## Labels

```
POST

PATCH

DELETE
```

---

## Attachments

```
POST

DELETE
```

---

## Notifications

```
GET

PATCH
```

---

## Search

```
GET /search
```

---

# Códigos HTTP

| Código | Significado |
|---------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# Versionamento

Atualmente a API encontra-se na versão:

```
v0.1.0
```

As futuras versões serão registradas no arquivo:

```
docs/changelog.md
```