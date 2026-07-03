# Workspaces API

Responsável pelo gerenciamento dos Workspaces.

---

# Criar Workspace

## POST

```
/workspaces
```

### Descrição

Cria um novo Workspace para o usuário autenticado.

O criador é automaticamente associado ao Workspace como **OWNER**.

### Headers

```
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Projetos Pessoais",
  "description": "Workspace destinado aos meus projetos."
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
    "description": "Workspace destinado aos meus projetos.",
    "createdAt": "2026-06-27T00:00:00.000Z",
    "updatedAt": "2026-06-27T00:00:00.000Z",
    "members": [
      {
        "id": "uuid",
        "role": "OWNER",
        "createdAt": "2026-06-27T00:00:00.000Z",
        "userId": "uuid"
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

# Listar Workspaces

## GET

```
/workspaces
```

### Descrição

Retorna todos os Workspaces dos quais o usuário autenticado faz parte.

### Headers

```
Authorization: Bearer TOKEN
```

### Resposta

**200 OK**

```json
{
  "workspaces": [
    {
      "id": "uuid",
      "name": "Projetos Pessoais",
      "description": "Workspace destinado aos meus projetos.",
      "createdAt": "2026-06-27T00:00:00.000Z",
      "updatedAt": "2026-06-27T00:00:00.000Z",
      "members": [
        {
          "id": "uuid",
          "role": "OWNER",
          "createdAt": "2026-06-27T00:00:00.000Z",
          "user": {
            "id": "uuid",
            "name": "Marcelo Cruz",
            "email": "marcelo@email.com",
            "avatarUrl": null
          }
        }
      ]
    }
  ]
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

---

# Próximos Endpoints

- GET /workspaces/:id
- PATCH /workspaces/:id
- DELETE /workspaces/:id
- POST /workspaces/:id/invitations
- GET /workspaces/:id/members
- PATCH /workspaces/:id/members/:memberId
- DELETE /workspaces/:id/members/:memberId