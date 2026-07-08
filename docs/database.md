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

Atualmente o sistema possui quatro entidades.

```
User

Workspace

WorkspaceMember

WorkspaceInvitation
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

Atualmente:

- OWNER pode atualizar e excluir Workspaces.
- ADMIN pode atualizar Workspaces.
- MEMBER não possui permissões administrativas.
- VIEWER possui acesso somente leitura.

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
     ┌──────────┼──────────┐
     │          │          │
     ▼          ▼          ▼
WorkspaceMember │ WorkspaceInvitation
     ▲          │          ▲
     │          │          │
     └──────────┼──────────┘
                │
           Workspace
```

WorkspaceMember representa a relação N:N entre usuários e Workspaces.

WorkspaceInvitation representa convites pendentes para ingresso em um Workspace.

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

Todos os modelos seguem o padrão:

```
createdAt

updatedAt
```

Além disso, alguns modelos possuem campos específicos.

Exemplo:

```
expiresAt
```

Utilizado para controle automático de validade dos convites.

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

---

# Banco Atual

```
User

Workspace

WorkspaceMember

WorkspaceInvitation
```

---

# Modelos Planejados

Os próximos modelos serão implementados na seguinte ordem.

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

├── Board

└── WorkspaceInvitation

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
- Permitir convites pendentes.
- Permitir múltiplos Boards por Workspace.
- Permitir múltiplas Lists por Board.
- Permitir múltiplos Cards por List.
- Permitir múltiplos membros por Card.
- Suportar colaboração em tempo real.
- Facilitar futuras integrações com envio de e-mails.

---

# Próxima Atualização

Na próxima milestone serão adicionadas as entidades:

- Board
- BoardMember

Após a implementação, este documento será atualizado com os novos relacionamentos, diagramas e regras de negócio.