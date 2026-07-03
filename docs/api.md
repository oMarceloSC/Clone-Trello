# API Documentation

## Visão Geral

A API do Clone do Trello foi desenvolvida utilizando **Fastify** seguindo o padrão REST.

Todas as respostas são enviadas em formato JSON.

A autenticação é realizada utilizando **JWT (JSON Web Token)**.

---

# Base URL

## Desenvolvimento

```
http://localhost:3333
```

## Produção

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

Esse token deve ser enviado em todas as rotas protegidas utilizando o header:

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

## Login

### POST

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

## Usuário Autenticado

### GET

```
/auth/me
```

### Descrição

Retorna os dados do usuário autenticado.

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

---

# Workspaces

## Criar Workspace

### POST

```
/workspaces
```

### Descrição

Cria um novo Workspace para o usuário autenticado.

O usuário que cria o Workspace é automaticamente adicionado como membro com a permissão **OWNER**.

### Headers

```
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Request Body

```json
{
    "name": "Projetos Pessoais",
    "description": "Workspace para organizar meus projetos de portfólio"
}
```

### Resposta

**201 Created**

```json
{
    "message": "Workspace criado com sucesso",
    "workspace": {
        "id": "uuid",
        "name": "Projetos Pessoais",
        "description": "Workspace para organizar meus projetos de portfólio",
        "createdAt": "2026-06-27T00:00:00.000Z",
        "updatedAt": "2026-06-27T00:00:00.000Z",
        "members": [
            {
                "id": "uuid",
                "userId": "uuid",
                "workspaceId": "uuid",
                "role": "OWNER",
                "createdAt": "2026-06-27T00:00:00.000Z"
            }
        ]
    }
}
```

### Possíveis Erros

#### Token inválido

**401 Unauthorized**

```json
{
    "message": "Token inválido ou expirado"
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

# Endpoints Planejados

## Workspaces

```
GET    /workspaces

GET    /workspaces/:id

PATCH  /workspaces/:id

DELETE /workspaces/:id

POST   /workspaces/:id/invitations

GET    /workspaces/:id/members

PATCH  /workspaces/:id/members/:memberId

DELETE /workspaces/:id/members/:memberId
```

---

## Boards

```
POST   /boards

GET    /boards

GET    /boards/:id

PATCH  /boards/:id

DELETE /boards/:id
```

---

## Lists

```
POST   /lists

GET    /lists

PATCH  /lists/:id

DELETE /lists/:id
```

---

## Cards

```
POST   /cards

GET    /cards

PATCH  /cards/:id

DELETE /cards/:id
```

---

## Comments

```
POST   /comments

PATCH  /comments/:id

DELETE /comments/:id
```

---

## Labels

```
POST   /labels

PATCH  /labels/:id

DELETE /labels/:id
```

---

## Attachments

```
POST   /attachments

DELETE /attachments/:id
```

---

## Notifications

```
GET    /notifications

PATCH  /notifications/:id/read
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

Versão atual da API:

```
v0.2.0
```

O histórico completo de alterações pode ser encontrado em:

```
docs/changelog.md
```