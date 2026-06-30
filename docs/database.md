# Banco de Dados

## Visão Geral

O Clone do Trello utiliza o **PostgreSQL** como banco de dados relacional e o **Prisma ORM** como camada de acesso aos dados.

A modelagem foi projetada para ser altamente escalável, permitindo o crescimento da aplicação sem necessidade de grandes refatorações.

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

Atualmente o sistema possui três entidades.

```
User

Workspace

WorkspaceMember
```

---

# Model: User

Representa um usuário cadastrado na plataforma.

Cada usuário pode participar de vários Workspaces.

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

│

└── WorkspaceMember
```

Um usuário pode participar de vários Workspaces.

---

# Model: Workspace

Representa um espaço de trabalho.

Cada Workspace agrupa Boards, membros e configurações.

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

│

└── WorkspaceMember
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

---

# Relacionamento Atual

```
User

│

├──────────────┐
│              │
│              ▼
│      WorkspaceMember
│              ▲
│              │
└──────────────┘

Workspace
```

WorkspaceMember representa a relação N:N entre usuários e Workspaces.

---

# Índices

Atualmente:

## User

```
email
```

Possui índice único.

---

## WorkspaceMember

```
(userId, workspaceId)
```

Possui chave composta única.

Isso impede que um usuário seja adicionado duas vezes ao mesmo Workspace.

---

# Estratégia de Chaves

Todos os modelos utilizam:

```
UUID
```

Como chave primária.

Vantagens:

- Segurança
- Escalabilidade
- Compatibilidade com ambientes distribuídos
- Dificulta enumeração de registros

---

# Estratégia de Datas

Todos os modelos seguem o padrão:

```
createdAt

updatedAt
```

Permitindo auditoria básica da aplicação.

---

# Exclusão

Atualmente os relacionamentos utilizam:

```
Cascade
```

Ao remover um User ou Workspace, os registros relacionados em WorkspaceMember também são removidos.

---

# Banco Atual

```
User

Workspace

WorkspaceMember
```

---

# Modelos Planejados

Os próximos modelos serão implementados na seguinte ordem:

```
Board

↓

BoardMember

↓

List

↓

Card

↓

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

Invitation

↓

Activity
```

---

# Modelo Final (Planejado)

```
User

│

├── WorkspaceMember

│

├── BoardMember

│

├── Comment

│

├── Notification

│

└── Activity

↓

Workspace

↓

Board

↓

List

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
- Permitir múltiplos Boards por Workspace.
- Permitir múltiplas Lists por Board.
- Permitir múltiplos Cards por List.
- Permitir múltiplos membros por Card.
- Suportar colaboração em tempo real.

---

# Próxima Atualização

Na próxima milestone serão adicionadas as entidades:

- Board
- BoardMember

Após a implementação, este documento será atualizado com os novos relacionamentos e diagramas.