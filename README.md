# Documentação Técnica — Clone do Trello

## 1. Visão geral do sistema

O projeto consiste em uma plataforma de gerenciamento de tarefas inspirada no Trello, permitindo que usuários criem workspaces, quadros, listas e cartões para organizar projetos pessoais, acadêmicos ou profissionais.

O sistema terá colaboração em tempo real usando Socket.IO, permitindo que alterações feitas por um usuário sejam refletidas instantaneamente para outros membros do mesmo quadro.

A aplicação será dividida em:

* Frontend: React, TypeScript
* Backend: Node.js, Fastify, TypeScript
* Banco de dados: PostgreSQL
* ORM: Prisma
* Tempo real: Socket.IO
* Autenticação: JWT
* Uploads: anexos em cartões
* Notificações: internas e em tempo real

---

# 2. Objetivos do projeto

## Objetivo principal

Criar uma aplicação completa de produtividade com organização visual de tarefas, colaboração entre usuários e atualização em tempo real.

## Objetivos específicos

* Permitir cadastro e login de usuários.
* Criar workspaces para organizar equipes ou projetos.
* Criar quadros dentro dos workspaces.
* Criar listas dentro dos quadros.
* Criar cartões dentro das listas.
* Permitir comentários, etiquetas, checklists e anexos nos cartões.
* Adicionar membros aos workspaces e quadros.
* Enviar convites por email.
* Registrar histórico de atividades.
* Enviar notificações.
* Permitir busca global.
* Implementar drag and drop.
* Atualizar alterações em tempo real.
* Criar sistema de permissões.
* Criar dashboard com métricas.
* Suportar modo escuro e responsividade.

---

# 3. Arquitetura do sistema

## Arquitetura geral

```txt
trello-clone/
├── frontend/
├── backend/
├── shared/
└── docker-compose.yml
```

## Comunicação

```txt
React Frontend
   |
   | REST API
   |
Fastify Backend
   |
   | Prisma ORM
   |
PostgreSQL

React Frontend
   |
   | Socket.IO
   |
Socket Server
```

## Responsabilidades

## Frontend

* Interface do usuário.
* Autenticação visual.
* Consumo das APIs REST.
* Conexão com Socket.IO.
* Drag and Drop.
* Dashboard.
* Busca global.
* Tema claro/escuro.
* Layout responsivo.

## Backend

* Autenticação.
* Regras de negócio.
* Validação de dados.
* Controle de permissões.
* APIs REST.
* Eventos WebSocket.
* Uploads.
* Notificações.
* Registro de atividades.

## Banco de dados

* Armazena usuários.
* Workspaces.
* Quadros.
* Listas.
* Cartões.
* Comentários.
* Etiquetas.
* Checklists.
* Anexos.
* Atividades.
* Notificações.
* Convites.

---

# 4. Estrutura de pastas

## Backend

```txt
backend/
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── socket.ts
│   │
│   ├── database/
│   │   └── prisma.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── workspaces/
│   │   ├── boards/
│   │   ├── lists/
│   │   ├── cards/
│   │   ├── comments/
│   │   ├── labels/
│   │   ├── checklists/
│   │   ├── attachments/
│   │   ├── activities/
│   │   ├── notifications/
│   │   └── search/
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── permission.middleware.ts
│   │
│   ├── websocket/
│   │   ├── socket.server.ts
│   │   ├── board.events.ts
│   │   └── card.events.ts
│   │
│   ├── utils/
│   │   ├── mail.ts
│   │   ├── token.ts
│   │   └── upload.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── package.json
└── tsconfig.json
```

## Frontend

```txt
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── board/
│   │   ├── card/
│   │   ├── workspace/
│   │   └── dashboard/
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── WorkspacePage.tsx
│   │   ├── BoardPage.tsx
│   │   └── SearchPage.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── board.service.ts
│   │   ├── card.service.ts
│   │   └── socket.service.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   └── useTheme.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx
│   │
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── tsconfig.json
```

---

# 5. Modelagem do banco de dados

## Entidades principais

## User

Representa o usuário da aplicação.

Responsabilidades:

* Criar conta.
* Fazer login.
* Participar de workspaces.
* Participar de quadros.
* Criar cartões.
* Comentar.
* Receber notificações.

## Workspace

Agrupa quadros relacionados a uma equipe, projeto ou organização.

Exemplo:

* Workspace: Faculdade
* Workspace: Trabalho
* Workspace: Projetos Pessoais

## WorkspaceMember

Relaciona usuários aos workspaces e define o papel do usuário.

Papéis possíveis:

* OWNER
* ADMIN
* MEMBER
* VIEWER

## Board

Representa um quadro dentro de um workspace.

Exemplo:

* Projeto Clone Trello
* Planejamento de Estudos
* Desenvolvimento LifeXP

## BoardMember

Controla quais usuários têm acesso a um quadro específico.

## List

Representa uma coluna do quadro.

Exemplo:

* A fazer
* Em andamento
* Revisão
* Concluído

## Card

Representa uma tarefa dentro de uma lista.

Pode conter:

* Título
* Descrição
* Data de entrega
* Etiquetas
* Checklist
* Comentários
* Anexos
* Membros responsáveis

## Comment

Comentário feito dentro de um cartão.

## Label

Etiqueta colorida associada a cartões.

Exemplo:

* Bug
* Urgente
* Frontend
* Backend
* Design

## Checklist

Grupo de itens dentro de um cartão.

## ChecklistItem

Item individual de uma checklist.

## Attachment

Arquivo anexado a um cartão.

## Activity

Histórico de ações realizadas no sistema.

Exemplo:

* Usuário criou um cartão.
* Usuário moveu um cartão.
* Usuário comentou.
* Usuário adicionou uma etiqueta.

## Notification

Notificação enviada ao usuário.

## Invitation

Convite enviado por email para participar de um workspace ou quadro.

---

# 6. Models Prisma

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  avatarUrl    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  workspaceMembers WorkspaceMember[]
  boardMembers     BoardMember[]
  cardsCreated     Card[] @relation("CardCreator")
  comments         Comment[]
  notifications    Notification[]
  activities       Activity[]
}

model Workspace {
  id          String   @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members WorkspaceMember[]
  boards  Board[]
  invitations Invitation[]
}

model WorkspaceMember {
  id          String @id @default(uuid())
  userId      String
  workspaceId String
  role        WorkspaceRole @default(MEMBER)

  user      User      @relation(fields: [userId], references: [id])
  workspace Workspace @relation(fields: [workspaceId], references: [id])

  @@unique([userId, workspaceId])
}

enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

model Board {
  id          String   @id @default(uuid())
  title       String
  description String?
  workspaceId String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace Workspace @relation(fields: [workspaceId], references: [id])
  lists     List[]
  labels    Label[]
  members   BoardMember[]
  activities Activity[]
}

model BoardMember {
  id      String @id @default(uuid())
  userId  String
  boardId String
  role    BoardRole @default(MEMBER)

  user  User  @relation(fields: [userId], references: [id])
  board Board @relation(fields: [boardId], references: [id])

  @@unique([userId, boardId])
}

enum BoardRole {
  ADMIN
  MEMBER
  VIEWER
}

model List {
  id       String   @id @default(uuid())
  title    String
  position Int
  boardId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  board Board @relation(fields: [boardId], references: [id])
  cards Card[]
}

model Card {
  id          String   @id @default(uuid())
  title       String
  description String?
  position    Int
  dueDate     DateTime?
  listId      String
  creatorId   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  list       List @relation(fields: [listId], references: [id])
  creator    User @relation("CardCreator", fields: [creatorId], references: [id])
  comments   Comment[]
  labels     CardLabel[]
  members    CardMember[]
  checklists Checklist[]
  attachments Attachment[]
  activities Activity[]
}

model CardMember {
  id     String @id @default(uuid())
  cardId String
  userId String

  card Card @relation(fields: [cardId], references: [id])
  user User @relation(fields: [userId], references: [id])

  @@unique([cardId, userId])
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  cardId    String
  userId    String
  createdAt DateTime @default(now())

  card Card @relation(fields: [cardId], references: [id])
  user User @relation(fields: [userId], references: [id])
}

model Label {
  id      String @id @default(uuid())
  name    String
  color   String
  boardId String

  board Board @relation(fields: [boardId], references: [id])
  cards CardLabel[]
}

model CardLabel {
  id      String @id @default(uuid())
  cardId  String
  labelId String

  card  Card  @relation(fields: [cardId], references: [id])
  label Label @relation(fields: [labelId], references: [id])

  @@unique([cardId, labelId])
}

model Checklist {
  id     String @id @default(uuid())
  title  String
  cardId String

  card  Card @relation(fields: [cardId], references: [id])
  items ChecklistItem[]
}

model ChecklistItem {
  id          String  @id @default(uuid())
  title       String
  isCompleted Boolean @default(false)
  checklistId String

  checklist Checklist @relation(fields: [checklistId], references: [id])
}

model Attachment {
  id        String   @id @default(uuid())
  filename  String
  url       String
  mimeType  String
  size      Int
  cardId    String
  createdAt DateTime @default(now())

  card Card @relation(fields: [cardId], references: [id])
}

model Activity {
  id        String   @id @default(uuid())
  action    String
  metadata  Json?
  userId    String
  boardId   String?
  cardId    String?
  createdAt DateTime @default(now())

  user  User   @relation(fields: [userId], references: [id])
  board Board? @relation(fields: [boardId], references: [id])
  card  Card?  @relation(fields: [cardId], references: [id])
}

model Notification {
  id        String   @id @default(uuid())
  title     String
  message   String
  isRead    Boolean  @default(false)
  userId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
}

model Invitation {
  id          String   @id @default(uuid())
  email       String
  token       String   @unique
  status      InvitationStatus @default(PENDING)
  workspaceId String
  createdAt   DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id])
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  EXPIRED
  CANCELED
}
```

---

# 7. Fluxo de autenticação

## Cadastro

1. Usuário envia nome, email e senha.
2. Backend valida os dados.
3. Backend verifica se o email já existe.
4. Senha é criptografada.
5. Usuário é salvo no banco.
6. Backend retorna token JWT.

Endpoint:

```txt
POST /auth/register
```

## Login

1. Usuário envia email e senha.
2. Backend busca usuário pelo email.
3. Backend compara a senha enviada com a senha criptografada.
4. Backend gera JWT.
5. Frontend salva o token.
6. Usuário é redirecionado para o dashboard.

Endpoint:

```txt
POST /auth/login
```

## Recuperação de senha

1. Usuário informa email.
2. Backend gera token temporário.
3. Sistema envia email com link de recuperação.
4. Usuário acessa o link.
5. Define nova senha.
6. Backend atualiza senha no banco.

Endpoints:

```txt
POST /auth/forgot-password
POST /auth/reset-password
```

---

# 8. Fluxo de colaboração em tempo real

## Conceito

Cada quadro terá uma sala própria no Socket.IO.

Exemplo:

```txt
board:123
```

Quando um usuário entra em um quadro, o frontend conecta o usuário na sala desse quadro.

## Fluxo

1. Usuário acessa um quadro.
2. Frontend emite evento `join-board`.
3. Backend adiciona o socket na sala do quadro.
4. Quando algum usuário cria, edita, move ou remove algo, o backend emite evento para todos os membros da sala.
5. Frontend atualiza a interface em tempo real.

## Eventos principais

```txt
join-board
leave-board
card-created
card-updated
card-moved
card-deleted
list-created
list-updated
list-moved
list-deleted
comment-created
label-added
checklist-updated
notification-created
```

## Exemplo de fluxo

Usuário move um cartão:

```txt
Frontend
  -> PATCH /cards/:id/move
Backend
  -> Atualiza banco
  -> Registra atividade
  -> Emite socket card-moved
Outros usuários
  -> Recebem evento
  -> Atualizam tela
```

---

# 9. Estrutura das APIs REST

## Auth

```txt
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

## Users

```txt
GET    /users/me
PATCH  /users/me
PATCH  /users/me/avatar
```

## Workspaces

```txt
POST   /workspaces
GET    /workspaces
GET    /workspaces/:id
PATCH  /workspaces/:id
DELETE /workspaces/:id
POST   /workspaces/:id/invite
GET    /workspaces/:id/members
PATCH  /workspaces/:id/members/:memberId
DELETE /workspaces/:id/members/:memberId
```

## Boards

```txt
POST   /workspaces/:workspaceId/boards
GET    /workspaces/:workspaceId/boards
GET    /boards/:id
PATCH  /boards/:id
DELETE /boards/:id
POST   /boards/:id/members
DELETE /boards/:id/members/:memberId
```

## Lists

```txt
POST   /boards/:boardId/lists
PATCH  /lists/:id
PATCH  /lists/:id/move
DELETE /lists/:id
```

## Cards

```txt
POST   /lists/:listId/cards
GET    /cards/:id
PATCH  /cards/:id
PATCH  /cards/:id/move
DELETE /cards/:id
POST   /cards/:id/members
DELETE /cards/:id/members/:userId
```

## Comments

```txt
POST   /cards/:cardId/comments
GET    /cards/:cardId/comments
PATCH  /comments/:id
DELETE /comments/:id
```

## Labels

```txt
POST   /boards/:boardId/labels
PATCH  /labels/:id
DELETE /labels/:id
POST   /cards/:cardId/labels/:labelId
DELETE /cards/:cardId/labels/:labelId
```

## Checklists

```txt
POST   /cards/:cardId/checklists
PATCH  /checklists/:id
DELETE /checklists/:id
POST   /checklists/:id/items
PATCH  /checklist-items/:id
DELETE /checklist-items/:id
```

## Attachments

```txt
POST   /cards/:cardId/attachments
GET    /cards/:cardId/attachments
DELETE /attachments/:id
```

## Activities

```txt
GET /boards/:boardId/activities
GET /cards/:cardId/activities
```

## Notifications

```txt
GET   /notifications
PATCH /notifications/:id/read
PATCH /notifications/read-all
```

## Search

```txt
GET /search?q=termo
```

---

# 10. Controllers

## AuthController

Responsável por:

* register
* login
* forgotPassword
* resetPassword
* me

## WorkspaceController

Responsável por:

* createWorkspace
* listWorkspaces
* getWorkspaceById
* updateWorkspace
* deleteWorkspace
* inviteMember
* listMembers
* updateMemberRole
* removeMember

## BoardController

Responsável por:

* createBoard
* listBoards
* getBoardById
* updateBoard
* deleteBoard
* addMember
* removeMember

## ListController

Responsável por:

* createList
* updateList
* moveList
* deleteList

## CardController

Responsável por:

* createCard
* getCardById
* updateCard
* moveCard
* deleteCard
* addMember
* removeMember

## CommentController

Responsável por:

* createComment
* listComments
* updateComment
* deleteComment

## NotificationController

Responsável por:

* listNotifications
* markAsRead
* markAllAsRead

---

# 11. Services

## AuthService

Contém regras de autenticação:

* Criação de usuário.
* Criptografia de senha.
* Validação de login.
* Geração de JWT.
* Recuperação de senha.

## WorkspaceService

Contém regras de workspace:

* Criar workspace.
* Adicionar criador como OWNER.
* Convidar membros.
* Validar permissões.
* Gerenciar membros.

## BoardService

Contém regras de quadro:

* Criar quadro.
* Associar ao workspace.
* Listar quadros do usuário.
* Controlar membros.
* Validar acesso.

## ListService

Contém regras de listas:

* Criar lista.
* Ordenar listas.
* Atualizar posição.
* Remover lista.

## CardService

Contém regras de cartões:

* Criar cartão.
* Atualizar título, descrição e data.
* Mover cartão entre listas.
* Atualizar posição.
* Adicionar membros.
* Registrar atividades.
* Emitir eventos Socket.IO.

## ActivityService

Responsável por registrar ações importantes do sistema.

## NotificationService

Responsável por criar e enviar notificações internas.

## SearchService

Responsável por buscar:

* Workspaces
* Boards
* Cards
* Comentários
* Membros

---

# 12. WebSockets com Socket.IO

## Configuração inicial

```ts
io.on("connection", socket => {
  socket.on("join-board", boardId => {
    socket.join(`board:${boardId}`);
  });

  socket.on("leave-board", boardId => {
    socket.leave(`board:${boardId}`);
  });
});
```

## Eventos emitidos pelo backend

```ts
io.to(`board:${boardId}`).emit("card-created", card);
io.to(`board:${boardId}`).emit("card-updated", card);
io.to(`board:${boardId}`).emit("card-moved", data);
io.to(`board:${boardId}`).emit("card-deleted", cardId);
io.to(`board:${boardId}`).emit("comment-created", comment);
io.to(`board:${boardId}`).emit("list-created", list);
io.to(`board:${boardId}`).emit("list-updated", list);
io.to(`board:${boardId}`).emit("list-deleted", listId);
```

## Eventos no frontend

```ts
socket.on("card-created", handleCardCreated);
socket.on("card-updated", handleCardUpdated);
socket.on("card-moved", handleCardMoved);
socket.on("comment-created", handleCommentCreated);
socket.on("list-created", handleListCreated);
```

---

# 13. Casos de uso

## Criar workspace

Ator: usuário autenticado.

Fluxo:

1. Usuário informa nome e descrição.
2. Sistema cria workspace.
3. Sistema adiciona usuário como OWNER.
4. Sistema retorna workspace criado.

## Criar quadro

Ator: membro do workspace.

Fluxo:

1. Usuário seleciona workspace.
2. Informa título do quadro.
3. Sistema cria quadro.
4. Sistema adiciona usuário como membro admin.
5. Sistema retorna quadro.

## Criar cartão

Ator: membro do quadro.

Fluxo:

1. Usuário escolhe uma lista.
2. Informa título do cartão.
3. Sistema calcula posição.
4. Sistema cria cartão.
5. Sistema registra atividade.
6. Sistema emite evento `card-created`.

## Mover cartão

Ator: membro do quadro.

Fluxo:

1. Usuário arrasta cartão.
2. Frontend envia nova lista e nova posição.
3. Backend atualiza banco.
4. Backend registra atividade.
5. Backend emite evento `card-moved`.
6. Outros usuários veem a alteração em tempo real.

## Convidar membro

Ator: OWNER ou ADMIN.

Fluxo:

1. Usuário informa email.
2. Sistema cria convite.
3. Sistema envia email.
4. Convidado acessa link.
5. Sistema adiciona usuário ao workspace.

---

# 14. Componentes React

## Layout

```txt
AppLayout
Sidebar
Header
ThemeToggle
ProtectedRoute
```

## Autenticação

```txt
LoginForm
RegisterForm
ForgotPasswordForm
ResetPasswordForm
```

## Workspace

```txt
WorkspaceList
WorkspaceCard
CreateWorkspaceModal
WorkspaceMembersModal
InviteMemberModal
```

## Board

```txt
BoardView
BoardHeader
BoardSidebar
BoardMemberList
CreateBoardModal
```

## List

```txt
BoardList
CreateListButton
EditListTitle
```

## Card

```txt
CardItem
CardModal
CardDescription
CardComments
CardLabels
CardChecklist
CardAttachments
CardMembers
CardDueDate
```

## Dashboard

```txt
DashboardOverview
MetricCard
RecentBoards
RecentActivities
ProductivityChart
```

## Busca

```txt
GlobalSearchInput
SearchResults
SearchCardResult
SearchBoardResult
```

---

# 15. Fluxo do usuário

## Primeiro acesso

1. Usuário cria conta.
2. Usuário faz login.
3. Sistema redireciona para dashboard.
4. Usuário cria workspace.
5. Usuário cria quadro.
6. Usuário cria listas.
7. Usuário cria cartões.
8. Usuário adiciona membros.
9. Usuário acompanha tarefas em tempo real.

## Uso diário

1. Usuário entra no dashboard.
2. Visualiza métricas.
3. Acessa quadro recente.
4. Move cartões.
5. Comenta tarefas.
6. Marca checklists.
7. Recebe notificações.
8. Usa busca global para encontrar cartões.

---

# 16. Funcionalidades principais

## Cadastro

Permite criar uma conta usando nome, email e senha.

## Login

Permite acessar o sistema usando email e senha.

## Recuperação de senha

Permite redefinir a senha usando um token enviado por email.

## Workspaces

Organizam os quadros por projeto, equipe ou contexto.

## Quadros

Representam painéis visuais de organização.

## Listas

Representam etapas do fluxo de trabalho.

## Cartões

Representam tarefas individuais.

## Comentários

Permitem discussão dentro dos cartões.

## Etiquetas

Classificam cartões visualmente.

## Checklist

Divide uma tarefa em subtarefas.

## Datas de entrega

Indicam prazo de conclusão.

## Membros

Permitem atribuir responsáveis.

## Convites por email

Permitem adicionar pessoas ao workspace.

## Upload de anexos

Permite adicionar arquivos aos cartões.

## Histórico de atividades

Registra alterações importantes.

## Notificações

Informa eventos relevantes ao usuário.

## Busca global

Permite procurar cartões, quadros, comentários e membros.

---

# 17. Funcionalidades avançadas

## Drag and Drop

Permite mover cartões entre listas e alterar sua ordem.

Biblioteca sugerida:

```txt
@dnd-kit/core
@dnd-kit/sortable
```

## Atualização em tempo real

Usa Socket.IO para sincronizar alterações do quadro.

## Sistema de permissões

Papéis sugeridos:

```txt
OWNER
ADMIN
MEMBER
VIEWER
```

## Dashboard

Exibe:

* Total de workspaces.
* Total de quadros.
* Total de cartões.
* Cartões vencidos.
* Cartões concluídos.
* Atividades recentes.

## Métricas

Exemplos:

* Cartões por status.
* Cartões por membro.
* Tarefas próximas do vencimento.
* Produtividade semanal.
* Quantidade de comentários.
* Quantidade de cartões criados.

## Modo escuro

Gerenciado no frontend com contexto de tema e persistência no localStorage.

## Responsividade

A interface deve funcionar bem em:

* Desktop.
* Tablet.
* Celular.

---

# 18. Planejamento de desenvolvimento por etapas

## Etapa 1 — Setup inicial

* Criar monorepo.
* Configurar frontend com React + TypeScript.
* Configurar backend com Fastify + TypeScript.
* Configurar Prisma.
* Configurar PostgreSQL.
* Configurar Docker Compose.
* Configurar variáveis de ambiente.

## Etapa 2 — Autenticação

* Criar model User.
* Criar cadastro.
* Criar login.
* Criar JWT.
* Criar middleware de autenticação.
* Criar rota `/auth/me`.
* Criar recuperação de senha.

## Etapa 3 — Workspaces

* Criar model Workspace.
* Criar WorkspaceMember.
* Criar CRUD de workspaces.
* Criar sistema de papéis.
* Criar convite por email.

## Etapa 4 — Quadros

* Criar model Board.
* Criar BoardMember.
* Criar CRUD de quadros.
* Criar tela de listagem de quadros.
* Criar tela principal do quadro.

## Etapa 5 — Listas

* Criar model List.
* Criar CRUD de listas.
* Implementar ordenação.
* Exibir listas no quadro.

## Etapa 6 — Cartões

* Criar model Card.
* Criar CRUD de cartões.
* Criar modal de cartão.
* Adicionar descrição.
* Adicionar data de entrega.
* Adicionar membros.

## Etapa 7 — Comentários, etiquetas e checklist

* Criar comentários.
* Criar etiquetas.
* Relacionar etiquetas aos cartões.
* Criar checklist.
* Criar itens de checklist.

## Etapa 8 — Drag and Drop

* Instalar DnD Kit.
* Arrastar cartões.
* Reordenar cartões.
* Mover cartões entre listas.
* Persistir posição no banco.

## Etapa 9 — Socket.IO

* Configurar servidor Socket.IO.
* Criar salas por quadro.
* Emitir eventos de criação, edição, movimentação e remoção.
* Atualizar frontend em tempo real.

## Etapa 10 — Anexos

* Criar upload de arquivos.
* Salvar metadados no banco.
* Exibir anexos no cartão.
* Permitir remoção de anexos.

## Etapa 11 — Atividades e notificações

* Registrar histórico de ações.
* Criar notificações internas.
* Notificar membros em tempo real.
* Marcar notificações como lidas.

## Etapa 12 — Busca global

* Criar endpoint de busca.
* Buscar por cartões, quadros, comentários e membros.
* Criar tela de resultados.

## Etapa 13 — Dashboard e métricas

* Criar cards de métricas.
* Criar gráficos.
* Mostrar atividades recentes.
* Mostrar cartões vencidos.

## Etapa 14 — Interface final

* Melhorar UI.
* Adicionar modo escuro.
* Ajustar responsividade.
* Criar estados de loading.
* Criar mensagens de erro.
* Criar feedback visual.

## Etapa 15 — Finalização

* Testar fluxos principais.
* Testar permissões.
* Testar WebSocket.
* Criar README.
* Publicar no GitHub.
* Preparar deploy.

---

# 19. Tecnologias recomendadas

## Frontend

```txt
React
TypeScript
Vite
React Router
Axios
Socket.IO Client
Dnd Kit
React Hook Form
Zod
Tailwind CSS
Lucide React
Recharts
```

## Backend

```txt
Node.js
TypeScript
Fastify
Prisma
PostgreSQL
Socket.IO
JWT
Bcrypt
Zod
Nodemailer
Multer ou Multipart
```

## Infraestrutura

```txt
Docker
Docker Compose
PostgreSQL
Cloudinary ou S3 para uploads
Vercel para frontend
Render/Railway/Fly.io para backend
```

---

# 20. Ordem recomendada para começar

A melhor ordem para desenvolver é:

1. Backend base.
2. Banco com Prisma.
3. Cadastro e login.
4. Workspaces.
5. Quadros.
6. Listas.
7. Cartões.
8. Frontend do quadro.
9. Drag and Drop.
10. Socket.IO.
11. Comentários, etiquetas e checklists.
12. Permissões.
13. Uploads.
14. Atividades.
15. Notificações.
16. Busca.
17. Dashboard.
18. Modo escuro.
19. Responsividade.
20. README e publicação no GitHub.

---

# 21. Resultado esperado

Ao final do projeto, o sistema deverá permitir que vários usuários colaborem em quadros de tarefas em tempo real, com controle de acesso, organização visual, comentários, anexos, histórico, notificações e métricas.

Esse projeto é excelente para portfólio porque demonstra domínio de:

* Frontend moderno.
* Backend estruturado.
* Banco relacional.
* Autenticação.
* Permissões.
* Upload de arquivos.
* WebSockets.
* Drag and Drop.
* Modelagem avançada.
* Arquitetura de software.
* Experiência de usuário.
