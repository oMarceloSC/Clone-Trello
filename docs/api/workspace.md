# Workspaces API

## Visão Geral

O módulo de Workspaces é responsável pelo gerenciamento dos espaços de trabalho do sistema.

Um Workspace representa o nível mais alto de organização da aplicação, agrupando Boards, membros, permissões e, futuramente, convites, atividades, notificações e configurações.

Todo Workspace possui pelo menos um membro com a permissão **OWNER**, que é automaticamente definido no momento da criação.

---

# Fluxo Geral

```
Usuário

↓

Workspace

↓

Boards

↓

Lists

↓

Cards
```

Um usuário pode participar de vários Workspaces.

Cada Workspace pode possuir vários membros.

---

# Permissões

Atualmente existem quatro níveis de permissão.

| Role | Descrição |
|------|-----------|
| OWNER | Proprietário do Workspace |
| ADMIN | Administrador |
| MEMBER | Membro comum |
| VIEWER | Apenas visualização |

Atualmente:

- **OWNER** pode atualizar e excluir um Workspace.
- **ADMIN** pode atualizar um Workspace.
- **MEMBER** não possui permissões administrativas.
- **VIEWER** possui apenas acesso de leitura.

As demais permissões serão utilizadas nas próximas funcionalidades, como gerenciamento de membros, Boards e Convites.

---

# Endpoints

---

# Criar Workspace

## POST

```
/workspaces
```

### Descrição

Cria um novo Workspace para o usuário autenticado.

Ao criar um Workspace, o usuário é automaticamente associado como membro utilizando a permissão **OWNER**.

---

### Headers

```
Authorization: Bearer TOKEN

Content-Type: application/json
```

---

### Request Body

```json
{
  "name": "Projetos Pessoais",
  "description": "Workspace destinado aos meus projetos."
}
```

---

### Response

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
        "userId": "uuid",
        "workspaceId": "uuid",
        "role": "OWNER",
        "createdAt": "2026-06-27T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Possíveis Erros

#### Token inválido

**401 Unauthorized**

```json
{
  "message": "Token inválido ou expirado"
}
```

---

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

A listagem é realizada através da tabela `WorkspaceMember`, garantindo que apenas Workspaces onde o usuário possui vínculo sejam retornados.

---

### Headers

```
Authorization: Bearer TOKEN
```

---

### Response

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

---

### Possíveis Erros

#### Token inválido

**401 Unauthorized**

```json
{
  "message": "Token inválido ou expirado"
}
```

---

# Buscar Workspace por ID

## GET

```
/workspaces/:id
```

### Descrição

Retorna um Workspace específico.

Antes de retornar os dados, o sistema verifica se o usuário autenticado pertence ao Workspace solicitado.

Caso o usuário não faça parte do Workspace, a API retorna **404 Not Found**, impedindo que usuários descubram a existência de Workspaces aos quais não possuem acesso.

Essa abordagem aumenta a segurança da aplicação e evita enumeração de identificadores.

---

### Headers

```
Authorization: Bearer TOKEN
```

---

### Path Parameters

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | UUID | Identificador do Workspace |

---

### Response

**200 OK**

```json
{
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

---

### Possíveis Erros

#### Workspace inexistente

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Workspace não encontrado."
}
```

---

#### Usuário sem acesso ao Workspace

**404 Not Found**

```json
{
  "statusCode": 404,
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

# Atualizar Workspace

## PATCH

```
/workspaces/:id
```

### Descrição

Atualiza as informações de um Workspace existente.

Somente usuários com as permissões **OWNER** ou **ADMIN** podem realizar esta operação.

Caso o usuário não pertença ao Workspace, a API retornará **404 Not Found**.

Caso pertença ao Workspace, mas não possua permissão suficiente, retornará **403 Forbidden**.

---

### Headers

```
Authorization: Bearer TOKEN

Content-Type: application/json
```

---

### Path Parameters

| Campo | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador do Workspace |

---

### Request Body

Todos os campos são opcionais.

```json
{
  "name": "Projetos Atualizados",
  "description": "Workspace atualizado pelo endpoint PATCH"
}
```

---

### Response

**200 OK**

```json
{
  "message": "Workspace atualizado com sucesso",
  "workspace": {
    "id": "uuid",
    "name": "Projetos Atualizados",
    "description": "Workspace atualizado pelo endpoint PATCH",
    "createdAt": "2026-06-27T00:00:00.000Z",
    "updatedAt": "2026-06-27T00:15:00.000Z"
  }
}
```

---

### Possíveis Erros

#### Workspace inexistente

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Workspace não encontrado."
}
```

---

#### Usuário sem permissão

**403 Forbidden**

```json
{
  "statusCode": 403,
  "message": "Você não tem permissão para atualizar este Workspace."
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

# Excluir Workspace

## DELETE

```
/workspaces/:id
```

### Descrição

Exclui permanentemente um Workspace.

Esta operação remove o Workspace e todos os seus relacionamentos no banco de dados.

Somente usuários com a permissão **OWNER** podem realizar esta operação.

Caso o usuário não pertença ao Workspace, a API retornará **404 Not Found**.

Caso pertença ao Workspace, mas não seja o proprietário, retornará **403 Forbidden**.

---

### Headers

```
Authorization: Bearer TOKEN
```

---

### Path Parameters

| Campo | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador do Workspace |

---

### Response

**200 OK**

```json
{
  "message": "Workspace excluído com sucesso"
}
```

---

### Possíveis Erros

#### Workspace inexistente

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Workspace não encontrado."
}
```

---

#### Usuário sem permissão

**403 Forbidden**

```json
{
  "statusCode": 403,
  "message": "Você não tem permissão para excluir este Workspace."
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

# Próximos Endpoints

Os seguintes endpoints serão implementados nas próximas etapas do desenvolvimento.

## Listar Membros

```
GET /workspaces/:id/members
```

---

## Convidar Usuário

```
POST /workspaces/:id/invitations
```

---

## Alterar Permissão

```
PATCH /workspaces/:id/members/:memberId
```

---

## Remover Membro

```
DELETE /workspaces/:id/members/:memberId
```

---

# Fluxo de Permissões (Planejado)

```
Usuário

↓

JWT

↓

Middleware

↓

WorkspaceMember

↓

Validação de Role

↓

OWNER

ADMIN

MEMBER

VIEWER

↓

Permissão concedida
```

Esse fluxo será utilizado em todas as operações futuras do módulo de Workspaces, como atualização, exclusão, gerenciamento de membros e convites.

---

# Estado Atual do Módulo

## Implementado

- ✅ Criar Workspace
- ✅ Listar Workspaces
- ✅ Buscar Workspace por ID
- ✅ Associação automática do OWNER
- ✅ Validação de acesso através da tabela WorkspaceMember
- ✅ Atualizar Workspace
- ✅ Controle de permissões para atualização (OWNER e ADMIN)
- ✅ Excluir Workspace
- ✅ Controle de permissão OWNER para exclusão

---

## Próximas Funcionalidades

- Atualizar Workspace
- Excluir Workspace
- Convites
- Gerenciamento de membros
- Sistema de permissões
- Auditoria de atividades