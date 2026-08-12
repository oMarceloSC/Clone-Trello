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

Lista os Boards ativos pertencentes a um Workspace de acordo com as permissões do usuário.

Regras de visualização:

- OWNER do Workspace visualiza todos os Boards.
- ADMIN do Workspace visualiza todos os Boards.
- MEMBER do Workspace visualiza apenas os Boards dos quais participa.
- VIEWER do Workspace visualiza apenas os Boards dos quais participa.

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
- OWNER e ADMIN do Workspace visualizam todos os Boards do Workspace;
- MEMBER e VIEWER visualizam apenas os Boards dos quais participam;
- retorna a participação do usuário em cada Board quando existir;
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

# Buscar Board

## GET

```
/boards/:id
```

### Descrição

Retorna um Board específico.

### Headers

```
Authorization: Bearer TOKEN
```

### Parâmetros

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| id | UUID | Sim | Identificador do Board |

### Resposta

**200 OK**

```json
{
  "board": {
    "id": "uuid",
    "title": "Desenvolvimento",
    "description": "Board responsável pelo desenvolvimento",
    "backgroundColor": "#0C66E4",
    "coverImage": null,
    "isArchived": false,
    "workspace": {
      "id": "uuid",
      "name": "Workspace Principal"
    },
    "members": [
      {
        "id": "uuid",
        "role": "OWNER",
        "user": {
          "id": "uuid",
          "name": "Marcelo Cruz",
          "email": "marcelo@email.com",
          "avatarUrl": null
        }
      }
    ]
  }
}
```

### Regras de Negócio

O acesso ao Board segue as seguintes regras:

- o Board deve existir;
- o usuário deve pertencer ao Workspace;
- OWNER e ADMIN do Workspace podem visualizar qualquer Board;
- MEMBER e VIEWER somente podem visualizar Boards dos quais participam;
- usuários sem acesso recebem **404**, evitando expor a existência do Board.

### Possíveis Erros

#### Board não encontrado

**404 Not Found**

```json
{
  "message": "Board não encontrado."
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

# Atualizar Board

## PATCH

```
/boards/:id
```

### Descrição

Atualiza as informações de um Board.

### Headers

```
Authorization: Bearer TOKEN
```

### Request Body

```json
{
  "title": "Backend",
  "description": "Nova descrição",
  "backgroundColor": "#0052CC",
  "coverImage": null
}
```

Todos os campos são opcionais.

### Resposta

**200 OK**

```json
{
  "message": "Board atualizado com sucesso",
  "board": {
    "id": "uuid",
    "title": "Backend",
    "description": "Nova descrição"
  }
}
```

### Regras de Negócio

- o usuário deve possuir acesso ao Board;
- apenas OWNER e ADMIN do Board podem atualizá-lo;
- OWNER e ADMIN do Workspace que não sejam membros do Board possuem apenas permissão de visualização;
- apenas os campos enviados são atualizados.

### Possíveis Erros

#### Sem permissão

**403 Forbidden**

```json
{
  "message": "Você não tem permissão para realizar esta ação neste Board."
}
```

#### Board não encontrado

**404 Not Found**

```json
{
  "message": "Board não encontrado."
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
- Busca de Board por ID.
- Atualização de Board.
- Associação automática do criador como OWNER.
- Controle de permissões.
- Controle de acesso centralizado (`BoardAccessService`).
- Visibilidade baseada em permissões do Workspace e participação no Board.
- Validação de Workspace.
- Integração com autenticação JWT.

## Planejado

- Excluir Board.
- Favoritar Board.
- Arquivar Board.
- Gerenciamento de membros do Board.