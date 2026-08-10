# Boards API

Responsável pelo gerenciamento dos Boards pertencentes aos Workspaces.

---

# Criar Board

## POST

```
/workspaces/:workspaceId/boards
```

### Descrição

Cria um novo Board dentro de um Workspace.

O usuário deve possuir uma das seguintes permissões no Workspace:

- OWNER
- ADMIN
- MEMBER

Usuários com permissão `VIEWER` não podem criar Boards.

---

### Headers

```
Authorization: Bearer TOKEN
```

---

### Parâmetros

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| workspaceId | UUID | Sim | Identificador do Workspace |

---

### Request Body

```json
{
  "title": "Desenvolvimento",
  "description": "Board responsável pelo desenvolvimento do sistema",
  "backgroundColor": "#0C66E4",
  "coverImage": null
}
```

---

### Resposta

**201 Created**

```json
{
  "message": "Board criado com sucesso",
  "board": {
    "id": "uuid",
    "title": "Desenvolvimento",
    "description": "Board responsável pelo desenvolvimento do sistema",
    "backgroundColor": "#0C66E4",
    "coverImage": null,
    "isArchived": false,
    "workspaceId": "uuid",
    "createdById": "uuid",
    "createdAt": "2026-08-07T20:00:00.000Z",
    "updatedAt": "2026-08-07T20:00:00.000Z",
    "members": [
      {
        "id": "uuid",
        "boardId": "uuid",
        "userId": "uuid",
        "role": "OWNER",
        "isFavorite": false,
        "createdAt": "2026-08-07T20:00:00.000Z",
        "updatedAt": "2026-08-07T20:00:00.000Z"
      }
    ]
  }
}
```

---

### Regras de Negócio

Ao criar um Board:

- O Workspace deve existir.
- O usuário deve pertencer ao Workspace.
- Usuários `VIEWER` não podem criar Boards.
- O criador do Board é automaticamente registrado como `OWNER` do Board.
- O Board inicia com `isArchived = false`.

---

### Possíveis Erros

#### Workspace não encontrado

**404 Not Found**

```json
{
  "message": "Workspace não encontrado."
}
```

---

#### Permissão insuficiente

**403 Forbidden**

```json
{
  "message": "Você não tem permissão para criar Boards neste Workspace."
}
```

---

#### Token inválido

**401 Unauthorized**

```json
{
  "message": "Token inválido ou expirado"
}
```

---

# Listar Boards

## GET

```
/workspaces/:workspaceId/boards
```

### Descrição

Lista todos os Boards ativos pertencentes a um Workspace.

Apenas usuários membros do Workspace podem visualizar os Boards.

Boards arquivados não são retornados.

---

### Headers

```
Authorization: Bearer TOKEN
```

---

### Parâmetros

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| workspaceId | UUID | Sim | Identificador do Workspace |

---

### Resposta

**200 OK**

```json
{
  "boards": [
    {
      "id": "uuid",
      "title": "Desenvolvimento",
      "description": "Board responsável pelo desenvolvimento",
      "backgroundColor": "#0C66E4",
      "coverImage": null,
      "isArchived": false,
      "workspaceId": "uuid",
      "createdById": "uuid",
      "createdAt": "2026-08-07T20:00:00.000Z",
      "updatedAt": "2026-08-07T20:00:00.000Z",
      "members": [
        {
          "id": "uuid",
          "userId": "uuid",
          "role": "OWNER",
          "isFavorite": false,
          "createdAt": "2026-08-07T20:00:00.000Z",
          "updatedAt": "2026-08-07T20:00:00.000Z"
        }
      ]
    }
  ]
}
```

---

### Regras de Negócio

A listagem:

- verifica se o usuário pertence ao Workspace;
- retorna apenas Boards ativos (`isArchived = false`);
- retorna a participação do usuário em cada Board;
- ordena os Boards pela data de criação (mais recentes primeiro).

---

### Possíveis Erros

#### Workspace não encontrado

**404 Not Found**

```json
{
  "message": "Workspace não encontrado."
}
```

---

#### Token inválido

**401 Unauthorized**

```json
{
  "message": "Token inválido ou expirado"
}
```

---

# Fluxo de Criação

```text
Usuário autenticado

↓

POST /workspaces/:workspaceId/boards

↓

Valida Workspace

↓

Valida participação

↓

Valida permissão

↓

Cria Board

↓

Cria BoardMember (OWNER)

↓

Retorna Board criado
```

---

# Fluxo de Listagem

```text
Usuário autenticado

↓

GET /workspaces/:workspaceId/boards

↓

Valida Workspace

↓

Valida participação

↓

Busca Boards ativos

↓

Retorna lista de Boards
```

---

# Estado Atual

## Implementado

- Criação de Boards.
- Listagem de Boards.
- Associação automática do criador como OWNER.
- Controle de permissões.
- Validação de Workspace.
- Integração com autenticação JWT.

## Planejado

- Buscar Board por ID.
- Atualizar Board.
- Excluir Board.
- Favoritar Board.
- Arquivar Board.
- Gerenciamento de membros do Board.