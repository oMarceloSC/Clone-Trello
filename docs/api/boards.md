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

# Excluir Board

## DELETE

```http
DELETE /boards/:id
```

### Descrição

Exclui permanentemente um Board.

### Autenticação

Endpoint protegido por JWT. O usuário deve estar autenticado e ser `OWNER` do próprio Board.

### Headers

```text
Authorization: Bearer TOKEN
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID | Sim | Identificador do Board que será excluído. |

O parâmetro é validado com Zod e deve conter um UUID válido.

### Resposta

**200 OK**

```json
{
  "message": "Board excluído com sucesso"
}
```

### Regras de Negócio

- somente o `OWNER` do Board pode excluí-lo;
- `ADMIN`, `MEMBER` e `VIEWER` do Board não podem realizar a exclusão;
- `OWNER` e `ADMIN` do Workspace não podem excluir o Board quando não forem `OWNER` do próprio Board;
- possuir acesso de visualização ao Board ou privilégios no Workspace não concede permissão de exclusão;
- a exclusão é permanente e remove o Board pelo seu identificador.

### Fluxo

```text
Usuário autenticado

↓

DELETE /boards/:id

↓

Valida o UUID

↓

Busca a participação do usuário no Board

↓

Valida a role OWNER do Board

↓

Exclui o Board

↓

Retorna mensagem de sucesso
```

### Possíveis Erros

#### ID inválido

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Erro de validação"
}
```

#### Token não informado, inválido ou expirado

**401 Unauthorized**

```json
{
  "message": "Token inválido ou expirado"
}
```

#### Sem permissão

**403 Forbidden**

```json
{
  "statusCode": 403,
  "message": "Você não tem permissão para realizar esta ação neste Board."
}
```

#### Board não encontrado ou usuário sem participação

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Board não encontrado."
}
```

---

# Favoritar ou Desfavoritar Board

## PATCH

```http
PATCH /boards/:id/favorite
```

### Descrição

Atualiza o estado de favorito do Board para o usuário autenticado. O favorito pertence ao `BoardMember` e, portanto, é individual para cada usuário.

### Autenticação

Endpoint protegido por JWT. O usuário autenticado deve possuir um `BoardMember` no Board informado.

### Headers

```text
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID | Sim | Identificador do Board. |

### Request Body

Para favoritar:

```json
{
  "isFavorite": true
}
```

Para desfavoritar:

```json
{
  "isFavorite": false
}
```

O campo `isFavorite` é obrigatório e deve ser booleano.

### Resposta ao Favoritar

**200 OK**

```json
{
  "message": "Board favoritado com sucesso",
  "member": {
    "id": "uuid",
    "boardId": "uuid",
    "userId": "uuid",
    "role": "OWNER",
    "isFavorite": true,
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-18T12:05:00.000Z"
  }
}
```

### Resposta ao Desfavoritar

**200 OK**

```json
{
  "message": "Board removido dos favoritos com sucesso",
  "member": {
    "id": "uuid",
    "boardId": "uuid",
    "userId": "uuid",
    "role": "OWNER",
    "isFavorite": false,
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-18T12:10:00.000Z"
  }
}
```

### Regras de Negócio

- somente usuários que possuem um `BoardMember` podem favoritar ou desfavoritar o Board;
- `OWNER`, `ADMIN`, `MEMBER` e `VIEWER` do Board podem alterar o próprio favorito;
- o favorito é individual e não altera o estado dos demais membros;
- `OWNER` e `ADMIN` do Workspace com acesso apenas de visualização não podem favoritar o Board;
- usuários sem participação no Board recebem `404 Board não encontrado.`;
- o único campo atualizado é `BoardMember.isFavorite`.

### Fluxo

```text
Usuário autenticado

↓

PATCH /boards/:id/favorite

↓

Valida ID do Board

↓

Valida isFavorite

↓

Valida se o usuário é BoardMember

↓

Atualiza BoardMember.isFavorite

↓

Retorna BoardMember atualizado
```

### Possíveis Erros

#### ID ou body inválido

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Erro de validação"
}
```

#### Token não informado, inválido ou expirado

**401 Unauthorized**

```json
{
  "message": "Token inválido ou expirado"
}
```

#### Board não encontrado ou usuário sem participação

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Board não encontrado."
}
```

---

# Arquivar ou Restaurar Board

## PATCH

```http
PATCH /boards/:id/archive
```

### Descrição

Arquiva ou restaura um Board por meio da atualização de `Board.isArchived`.

### Autenticação

Endpoint protegido por JWT. O usuário autenticado deve ser `OWNER` ou `ADMIN` do próprio Board.

### Headers

```text
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID | Sim | Identificador do Board. |

### Request Body

Para arquivar:

```json
{
  "isArchived": true
}
```

Para restaurar:

```json
{
  "isArchived": false
}
```

O campo `isArchived` é obrigatório e deve ser booleano.

### Resposta ao Arquivar

**200 OK**

```json
{
  "message": "Board arquivado com sucesso",
  "board": {
    "id": "uuid",
    "isArchived": true
  }
}
```

### Resposta ao Restaurar

**200 OK**

```json
{
  "message": "Board desarquivado com sucesso",
  "board": {
    "id": "uuid",
    "isArchived": false
  }
}
```

### Regras de Negócio

- `OWNER` e `ADMIN` do Board podem arquivar e restaurar;
- `MEMBER` e `VIEWER` do Board não podem arquivar nem restaurar;
- `OWNER` e `ADMIN` do Workspace que não sejam membros do Board podem visualizá-lo conforme as regras atuais, mas não podem arquivar nem restaurar;
- o campo alterado é `Board.isArchived`.

### Fluxo

```text
Usuário autenticado

↓

PATCH /boards/:id/archive

↓

Valida ID e isArchived

↓

Valida role OWNER ou ADMIN do Board

↓

Atualiza Board.isArchived

↓

Retorna Board atualizado
```

### Possíveis Erros

- `400 Bad Request` para ID ou body inválido.
- `401 Unauthorized` para token ausente, inválido ou expirado.
- `403 Forbidden` para `BoardMember` sem permissão.
- `404 Not Found` quando o Board não é encontrado ou o usuário não participa dele.

---

# Listar Boards Arquivados

## GET

```http
GET /workspaces/:workspaceId/boards/archived
```

### Descrição

Lista os Boards arquivados visíveis para o usuário autenticado em um Workspace.

### Autenticação e Headers

```text
Authorization: Bearer TOKEN
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `workspaceId` | UUID | Sim | Identificador do Workspace. |

### Resposta

**200 OK**

```json
{
  "boards": [
    {
      "id": "uuid",
      "title": "Board arquivado",
      "isArchived": true,
      "updatedAt": "2026-08-20T12:00:00.000Z",
      "members": []
    }
  ]
}
```

### Regras de Negócio

- valida a participação do usuário no Workspace;
- `OWNER` e `ADMIN` do Workspace visualizam todos os Boards arquivados;
- `MEMBER` e `VIEWER` do Workspace visualizam apenas Boards arquivados dos quais participam;
- retorna somente Boards com `isArchived = true`;
- ordena os resultados por `updatedAt` em ordem decrescente.

### Fluxo

```text
Usuário autenticado

↓

GET /workspaces/:workspaceId/boards/archived

↓

Valida participação no Workspace

↓

Aplica regra de visibilidade

↓

Busca Boards com isArchived = true

↓

Retorna lista de Boards arquivados
```

### Possíveis Erros

- `401 Unauthorized` para token ausente, inválido ou expirado.
- `404 Not Found` quando o Workspace não existe ou o usuário não participa dele.

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

# Fluxo de Exclusão

```text
BoardPage

↓

Confirmação do OWNER do Board

↓

DELETE /boards/:id

↓

Validação de autenticação e permissão

↓

Exclusão permanente do Board

↓

Mensagem de sucesso
```

---

# Fluxo de Favorito

```text
Usuário autenticado

↓

PATCH /boards/:id/favorite

↓

Valida o BoardMember

↓

Atualiza isFavorite apenas para o usuário

↓

Retorna BoardMember atualizado
```

---

# Fluxo de Arquivamento e Restauração

```text
BoardPage ou WorkspacePage

↓

PATCH /boards/:id/archive

↓

Valida OWNER ou ADMIN do Board

↓

Atualiza Board.isArchived

↓

Retorna Board atualizado
```

---

# Estado Atual

## Implementado

- Criação de Boards.
- Listagem de Boards.
- Busca de Board por ID.
- Atualização de Board.
- Exclusão de Board.
- Endpoint `DELETE /boards/:id`.
- Favoritar e desfavoritar Board.
- Endpoint `PATCH /boards/:id/favorite`.
- Atualização individual de `BoardMember.isFavorite`.
- Arquivamento e restauração de Boards.
- Endpoint `PATCH /boards/:id/archive`.
- Listagem de Boards arquivados.
- Endpoint `GET /workspaces/:workspaceId/boards/archived`.
- Associação automática do criador como OWNER.
- Controle de permissões.
- Exclusão permitida exclusivamente ao `OWNER` do Board.
- Favorito disponível para todas as roles que possuem `BoardMember`.
- Arquivamento e restauração disponíveis para `OWNER` e `ADMIN` do Board.
- Controle de acesso centralizado (`BoardAccessService`).
- Visibilidade baseada em permissões do Workspace e participação no Board.
- Validação de Workspace.
- Integração com autenticação JWT.

## Planejado

- Gerenciamento de membros do Board.
