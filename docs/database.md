# Banco de Dados

## Visão Geral

O Clone do Trello utiliza o **PostgreSQL** como banco de dados relacional e o **Prisma ORM** como camada de acesso aos dados.

A modelagem foi projetada para ser altamente escalável, permitindo o crescimento da aplicação sem necessidade de grandes refatorações.

Todo o banco foi pensado para suportar colaboração em tempo real, controle de permissões, histórico de atividades e crescimento modular.

---

# Tecnologias

| Tecnologia | Finalidade |
|------------|------------|
| PostgreSQL | Banco de Dados |
| Prisma ORM | ORM |
| Docker | Containerização |

---

# Arquitetura

```
Application

↓

Prisma Client

↓

PostgreSQL
```

Toda a comunicação entre a aplicação e o banco de dados acontece através do Prisma ORM.

---

# Models Implementados

Atualmente o schema Prisma possui sete modelos.

```
User

Workspace

WorkspaceMember

WorkspaceInvitation

PasswordResetToken

Board

BoardMember
```

---

# Model: User

Representa um usuário cadastrado na plataforma.

Cada usuário pode participar de vários Workspaces e também pode enviar convites para outros usuários.

## Campos

| Campo | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| name | String | Nome do usuário |
| email | String | Email único |
| passwordHash | String | Senha criptografada |
| avatarUrl | String? | Avatar do usuário |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Última atualização |

---

## Relacionamentos

```
User

├── WorkspaceMember

└── WorkspaceInvitation (Invites Sent)
```

Um usuário pode:

- Participar de vários Workspaces.
- Enviar vários convites.

---

# Model: Workspace

Representa um espaço de trabalho.

Cada Workspace agrupa Boards, membros, permissões, convites e, futuramente, atividades.

## Campos

| Campo | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador |
| name | String | Nome do Workspace |
| description | String? | Descrição |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Última atualização |

---

## Relacionamentos

```
Workspace

├── WorkspaceMember

└── WorkspaceInvitation

PasswordResetToken

Board

BoardMember
```

---

# Model: WorkspaceMember

Tabela responsável por relacionar usuários aos Workspaces.

Também armazena o nível de permissão de cada membro.

---

## Campos

| Campo | Tipo |
|--------|------|
| id | UUID |
| userId | UUID |
| workspaceId | UUID |
| role | Enum |
| createdAt | DateTime |

---

## Permissões

```
OWNER

ADMIN

MEMBER

VIEWER
```

### Descrição

| Permissão | Capacidades |
|-----------|-------------|
| OWNER | Controle total do Workspace |
| ADMIN | Administração do Workspace |
| MEMBER | Participação normal |
| VIEWER | Apenas visualização |

### Permissões implementadas atualmente

| Ação | OWNER | ADMIN | MEMBER | VIEWER |
|------|:-----:|:-----:|:------:|:------:|
| Atualizar Workspace | ✅ | ✅ | ❌ | ❌ |
| Excluir Workspace | ✅ | ❌ | ❌ | ❌ |
| Convidar membros | ✅ | ✅ | ❌ | ❌ |
| Listar membros | ✅ | ✅ | ✅ | ✅ |
| Alterar permissões | ✅ | ❌ | ❌ | ❌ |

---

## Fluxo de Associação

A entrada de um usuário em um Workspace ocorre através do seguinte fluxo:

```
Usuário convidado

↓

WorkspaceInvitation (PENDING)

↓

Aceitar Convite

↓

WorkspaceMember (MEMBER)
```

Somente após a aceitação do convite é criado um registro em `WorkspaceMember`.

A partir desse momento o usuário passa a fazer parte oficialmente do Workspace.

---

# Model: WorkspaceInvitation

Representa um convite enviado para ingresso em um Workspace.

Os convites são independentes dos membros do Workspace.

Somente quando um convite for aceito será criado um registro em `WorkspaceMember`.

---

## Campos

| Campo | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador |
| email | String | Email do convidado |
| token | UUID | Token único do convite |
| status | Enum | Estado do convite |
| workspaceId | UUID | Workspace relacionado |
| invitedById | UUID | Usuário que enviou |
| expiresAt | DateTime | Data de expiração |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Última atualização |

---

## Status

```
PENDING

ACCEPTED

EXPIRED

CANCELED
```

---

## Relacionamentos

```
WorkspaceInvitation

├── Workspace

└── User (Invited By)
```

---

# Relacionamento Atual

```
                    User
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
WorkspaceMember   WorkspaceInvitation
        ▲            ▲
        │            │
        └──────┬─────┘
               │
          Workspace
```

### Relações

- User ↔ WorkspaceMember (1:N)
- Workspace ↔ WorkspaceMember (1:N)
- Workspace ↔ WorkspaceInvitation (1:N)
- User ↔ WorkspaceInvitation (1:N)
- Workspace ↔ Board (1:N)
- User ↔ Board (1:N, criador)
- Board ↔ BoardMember (1:N)
- User ↔ BoardMember (1:N); User ↔ Board é N:N por BoardMember
- User ↔ PasswordResetToken (1:N)

---

# Índices

## User

```
email
```

Índice único.

---

## WorkspaceMember

```
(userId, workspaceId)
```

Chave composta única.

Impede que um usuário seja adicionado duas vezes ao mesmo Workspace.

---

## WorkspaceInvitation

```
token
```

Índice único.

```
email
```

Índice.

```
workspaceId
```

Índice.

Esses índices aceleram:

- Busca por token.
- Busca por email.
- Busca de convites de um Workspace.

---

# Estratégia de Chaves

Todos os modelos utilizam:

```
UUID
```

Como chave primária.

### Vantagens

- Segurança.
- Escalabilidade.
- Compatibilidade com ambientes distribuídos.
- Dificulta enumeração de registros.

---

# Estratégia de Datas

Board, BoardMember, User, Workspace e WorkspaceInvitation seguem o padrão abaixo. WorkspaceMember e PasswordResetToken possuem createdAt, mas não updatedAt:

```
createdAt

updatedAt
```

Além disso, alguns modelos possuem campos específicos.

Exemplo:

```
expiresAt
```

Utilizado para controlar automaticamente a validade dos convites.

---

# Exclusão

Atualmente os relacionamentos utilizam:

```
Cascade
```

Ao remover um User ou Workspace, todos os registros relacionados também são removidos automaticamente.

Isso inclui:

- WorkspaceMember
- WorkspaceInvitation
- Board e seus BoardMembers (ao excluir Workspace ou o usuário criador)
- BoardMember e PasswordResetToken relacionados ao usuário

---

# Banco Atual

Atualmente o banco suporta:

- Cadastro de usuários.
- Autenticação JWT.
- Criação de Workspaces.
- Listagem de Workspaces.
- Busca por Workspace.
- Atualização de Workspace.
- Exclusão de Workspace.
- Convites para Workspace.
- Aceitação de convites.
- Associação automática de membros.
- Listagem de membros.
- Controle de permissões.

---

# Model: Board

Implementado em `backend/prisma/schema.prisma`.

| Campo | Tipo/default | Observação |
|---|---|---|
| id | String / uuid() | Chave primária |
| title | String | Obrigatório |
| description, backgroundColor, coverImage | String? | Nullable no banco |
| isArchived | Boolean / false | Define lista ativa ou arquivada |
| workspaceId | String | FK Workspace |
| createdById | String | FK User, relação BoardCreator |
| createdAt | DateTime / now() | Criação |
| updatedAt | DateTime / @updatedAt | Atualização |

Possui `members: BoardMember[]`. Índices em workspaceId, createdById e isArchived. Workspace e criador usam `onDelete: Cascade`.

# Model: BoardMember

| Campo | Tipo/default | Observação |
|---|---|---|
| id | String / uuid() | Chave primária |
| boardId, userId | String | FKs Board e User, ambas Cascade |
| role | BoardRole / MEMBER | OWNER, ADMIN, MEMBER ou VIEWER |
| isFavorite | Boolean / false | Favorito individual do usuário |
| createdAt | DateTime / now() | Criação |
| updatedAt | DateTime / @updatedAt | Atualização |

Restrição única composta `[boardId, userId]` e índice em userId. User possui `boardsCreated` e `boardMembers`; Workspace possui `boards`.

Não existe FK de BoardMember para WorkspaceMember: a aplicação valida esse vínculo. Remover WorkspaceMember limpa BoardMembers apenas daquele Workspace em transação; se o usuário é OWNER de Board nesse Workspace, a operação é rejeitada. A regra de propriedade é verificada antes da transação. A matriz de autorização está em [Boards API](api/boards.md).

# Model: PasswordResetToken

Também implementado: id UUID, token único, userId, expiresAt, usedAt opcional e createdAt. Relação User com Cascade; índices em userId e expiresAt. Não possui updatedAt.

---

# Model: BoardList

A migration `20261007003215_create_board_listt` adiciona `BoardList`, com ID UUID, título, posição inteira, timestamps e FK `boardId`. Há índices em `boardId` e `[boardId, position]`. Excluir o Board remove suas Lists em cascata.

# Model: Card

A migration `20261016005239_create_cards` adiciona `Card`, com ID UUID, título, descrição opcional, posição inteira, prazo opcional, sinalizador `isArchived` com padrão `false`, timestamps e FK `listId`. Há índices em `listId`, `[listId, position]` e `isArchived`. Excluir a List remove seus Cards em cascata.

A posição é persistida no PostgreSQL e seu índice não é único. O caso de uso de movimentação recompõe a ordem dos Cards ativos em transação. Consulte a [API de Cards](api/cards.md#posições) para as regras de inserção e arquivamento.

---

# Modelos Planejados

Os próximos modelos serão implementados na seguinte ordem.

```
CardMember

↓

Comment

↓

Label

↓

CardLabel

↓

Checklist

↓

ChecklistItem

↓

Attachment

↓

Notification

↓

Activity
```

---

# Modelo Final (Planejado)

```
User

├── WorkspaceMember

├── WorkspaceInvitation

├── BoardMember

├── Comment

├── Notification

└── Activity

↓

Workspace

├── WorkspaceInvitation

└── Board

↓

Board

↓

BoardList

↓

Card

├── Label

├── Checklist

├── Attachment

├── Comment

└── Activity
```

---

# Estratégia de Crescimento

A modelagem foi planejada para:

- Permitir múltiplos usuários por Workspace.
- Permitir convites pendentes.
- Permitir controle de permissões.
- Permitir múltiplos Boards por Workspace.
- Permitir múltiplas Lists por Board.
- Permitir múltiplos Cards por List.
- Permitir múltiplos membros por Card.
- Suportar colaboração em tempo real.
- Facilitar futuras integrações com envio de e-mails.
- Facilitar auditoria através de registros de atividades.

---

# Próxima Atualização

As próximas alterações no schema para Cards seguem as funcionalidades pendentes da [Milestone 6](roadmap.md#milestone-6--cards).
