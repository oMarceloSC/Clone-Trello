# Serviços do Frontend

## Visão Geral

A camada de serviços é responsável pela comunicação entre o frontend e a API REST do backend.

Todos os serviços utilizam uma instância compartilhada do Axios, responsável por:

- Configuração da URL da API.
- Envio automático do JWT.
- Padronização das requisições.
- Centralização da comunicação HTTP.
- Tratamento uniforme das respostas.

A organização segue a arquitetura baseada em funcionalidades.

---

# Estrutura

```text
src/

├── services/
│   └── api.ts
│
└── features/
    ├── auth/
    │   └── services/
    │       └── auth.service.ts
    │
    ├── workspaces/
    │   └── services/
    │       └── workspace.service.ts
    │
    └── boards/
        └── services/
            └── board.service.ts
```

Novas funcionalidades possuirão seus próprios serviços.

Exemplo:

```text
features/

boards/
    services/

lists/
    services/

cards/
    services/

notifications/
    services/
```

---

# Instância da API

## Arquivo

```text
src/services/api.ts
```

## Responsabilidades

- Criar uma instância única do Axios.
- Definir a URL base do backend.
- Configurar cabeçalhos padrão.
- Adicionar automaticamente o JWT.
- Ser reutilizada por todos os módulos do frontend.

---

## Configuração

```ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

# Variáveis de Ambiente

A URL do backend é obtida através da variável:

```env
VITE_API_URL
```

Exemplo:

```env
VITE_API_URL=http://localhost:3333
```

O arquivo `.env.example` documenta as variáveis necessárias para executar o frontend sem expor informações privadas.

---

# Interceptor de Requisição

Antes de cada requisição, o Axios verifica se existe um token JWT armazenado.

Caso exista, o header abaixo é adicionado automaticamente:

```text
Authorization: Bearer TOKEN
```

Fluxo:

```text
Serviço

↓

Axios

↓

Interceptor de Requisição

↓

localStorage

↓

Authorization

↓

Backend
```

---

# Interceptor de Respostas

Além do interceptor de requisição, a aplicação também utiliza um interceptor global de respostas.

Sua responsabilidade é tratar automaticamente sessões inválidas ou expiradas.

Quando uma resposta retorna:

```http
401 Unauthorized
```

o interceptor:

- Remove o token armazenado.
- Remove os dados do usuário autenticado.
- Dispara um evento global de sessão expirada.
- Evita múltiplos disparos simultâneos para a mesma situação.

As requisições de login (`POST /auth/login`) são ignoradas por esse tratamento para permitir a exibição normal de mensagens como:

```text
Email ou senha inválidos
```

Fluxo:

```text
Backend

↓

401 Unauthorized

↓

Interceptor de Respostas

↓

Limpeza da sessão

↓

Evento global

↓

AuthProvider

↓

Redirecionamento para Login
```

---

# Serviço de Autenticação

## Arquivo

```text
src/features/auth/services/auth.service.ts
```

Responsável por toda comunicação relacionada à autenticação.

Atualmente disponibiliza:

```text
login()

registerUser()

forgotPassword()

resetPassword()

getCurrentUser()
```

---

# login()

## Endpoint

```http
POST /auth/login
```

## Entrada

```ts
{
  email: string;
  password: string;
}
```

## Resposta

```ts
{
  token: string;
  user: User;
}
```

## Responsabilidades

- Enviar email e senha.
- Receber o token JWT.
- Receber os dados do usuário autenticado.

O armazenamento da sessão é responsabilidade do `AuthContext`.

---

# registerUser()

## Endpoint

```http
POST /auth/register
```

## Entrada

```ts
{
  name: string;
  email: string;
  password: string;
}
```

## Resposta

```ts
{
  message: string;
  user: User;
}
```

## Responsabilidades

- Criar um novo usuário.
- Retornar os dados do usuário criado.
- Não enviar a confirmação de senha para o backend.

---

# forgotPassword()

## Endpoint

```http
POST /auth/forgot-password
```

## Entrada

```ts
type ForgotPasswordRequest = {
  email: string;
}
```

## Resposta

```ts
type ForgotPasswordResponse = {
  message: string;
  resetToken: string | null;
  resetUrl: string | null;
}
```

## Responsabilidades

- Solicitar a recuperação da senha.
- Enviar o email informado para o backend.
- Receber a mensagem de confirmação.
- Receber o link de redefinição durante o ambiente de desenvolvimento.
- Propagar erros para a página responsável.

## Fluxo

```text
ForgotPasswordPage

↓

forgotPassword()

↓

POST /auth/forgot-password

↓

ForgotPasswordResponse

↓

Exibição do link de redefinição
```

---

# resetPassword()

## Endpoint

```http
POST /auth/reset-password
```

## Entrada

```ts
type ResetPasswordRequest = {
  token: string;
  password: string;
}
```

## Resposta

```ts
type ResetPasswordResponse = {
  message: string;
}
```

## Responsabilidades

- Enviar o token de recuperação.
- Enviar a nova senha.
- Receber a confirmação da redefinição.
- Propagar erros para a página responsável.

## Fluxo

```text
ResetPasswordPage

↓

resetPassword()

↓

POST /auth/reset-password

↓

Mensagem de sucesso

↓

Redirecionamento para Login
```

---

# getCurrentUser()

## Endpoint

```http
GET /auth/me
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pelo interceptor do Axios.

## Resposta

```ts
{
  user: User;
}
```

## Responsabilidades

- Validar o token armazenado.
- Recuperar o usuário autenticado.
- Restaurar a sessão ao iniciar a aplicação.
- Permitir que o `AuthProvider` mantenha o estado atualizado.

---

# Serviço de Workspaces

## Arquivo

```text
src/features/workspaces/services/workspace.service.ts
```

Responsável por toda comunicação relacionada aos Workspaces, membros e convites.

Atualmente disponibiliza:

```text
listWorkspaces()

getWorkspaceById()

createWorkspace()

updateWorkspace()

deleteWorkspace()

listWorkspaceMembers()

updateWorkspaceMemberRole()

createWorkspaceInvitation()

listPendingWorkspaceInvitations()

acceptWorkspaceInvitation()
```


---

# listWorkspaces()

## Endpoint

```http
GET /workspaces
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pela instância compartilhada do Axios.

## Resposta

```ts
{
  workspaces: Workspace[];
}
```

O serviço retorna diretamente:

```ts
Workspace[]
```

para simplificar o consumo pelas páginas.

## Responsabilidades

- Buscar todos os Workspaces do usuário autenticado.
- Retornar os dados dos Workspaces.
- Retornar os membros relacionados.
- Fornecer os dados necessários ao Dashboard.

## Fluxo

```text
DashboardPage

↓

listWorkspaces()

↓

GET /workspaces

↓

Workspace[]

↓

Renderização dos cards
```

---

# createWorkspace()

## Endpoint

```http
POST /workspaces
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pela instância compartilhada do Axios.

## Entrada

```ts
type CreateWorkspaceRequest = {
  name: string;
  description?: string;
}
```

## Resposta

```ts
type CreateWorkspaceResponse = {
  message: string;
  workspace: Workspace;
}
```

## Responsabilidades

- Criar um novo Workspace.
- Associar automaticamente o usuário autenticado como OWNER.
- Retornar o Workspace criado.
- Atualizar imediatamente a interface sem necessidade de nova consulta à API.

## Fluxo

```text
DashboardPage

↓

Modal de criação

↓

React Hook Form

↓

createWorkspace()

↓

POST /workspaces

↓

Workspace criado

↓

Adicionado ao início da lista
```

---

# getWorkspaceById()

## Endpoint

```http
GET /workspaces/:id
```

## Headers

```text
Authorization: Bearer TOKEN
```

## Resposta

```ts
Workspace
```

## Responsabilidades

- Buscar um Workspace específico.
- Exibir as informações gerais do Workspace.
- Permitir o carregamento da WorkspacePage.

## Fluxo

```text
WorkspacePage

↓

getWorkspaceById()

↓

GET /workspaces/:id

↓

Workspace
```

---

# updateWorkspace()

## Endpoint

```http
PATCH /workspaces/:id
```

## Headers

```text
Authorization: Bearer TOKEN
```

## Entrada

```ts
type UpdateWorkspaceRequest = {
  name: string;
  description?: string;
}
```

## Resposta

```ts
type UpdateWorkspaceResponse = {
  message: string;
  workspace: Workspace;
}
```

## Responsabilidades

- Atualizar nome e descrição.
- Retornar o Workspace atualizado.
- Atualizar imediatamente a WorkspacePage.

## Fluxo

```text
WorkspacePage

↓

Modal de edição

↓

updateWorkspace()

↓

PATCH /workspaces/:id

↓

Workspace atualizado

↓

Atualização automática da interface
```

---

# deleteWorkspace()

## Endpoint

```http
DELETE /workspaces/:id
```

## Headers

```text
Authorization: Bearer TOKEN
```

## Resposta

```ts
type DeleteWorkspaceResponse = {
  message: string;
}
```

## Responsabilidades

- Excluir permanentemente um Workspace.
- Permitir apenas usuários OWNER.
- Redirecionar o usuário ao Dashboard após sucesso.

## Fluxo

```text
WorkspacePage

↓

Modal de confirmação

↓

deleteWorkspace()

↓

DELETE /workspaces/:id

↓

Workspace removido

↓

Dashboard
```

---

# listWorkspaceMembers()

## Endpoint

```http
GET /workspaces/:id/members
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pelo interceptor do Axios.

## Resposta

```ts
WorkspaceMember[]
```

## Responsabilidades

- Buscar todos os membros do Workspace.
- Retornar nome, email e cargo.
- Exibir a lista de participantes na WorkspacePage.

## Fluxo

```text
WorkspacePage

↓

listWorkspaceMembers()

↓

GET /workspaces/:id/members

↓

WorkspaceMember[]

↓

Renderização da lista de membros
```

---

# updateWorkspaceMemberRole()

## Endpoint

```http
PATCH /workspaces/:workspaceId/members/:memberId
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pelo interceptor do Axios.

## Entrada

```ts
type UpdateWorkspaceMemberRoleRequest = {
  role: "ADMIN" | "MEMBER" | "VIEWER";
}
```

## Resposta

```ts
type UpdateWorkspaceMemberRoleResponse = {
  message: string;
  member: WorkspaceMember;
}
```

## Responsabilidades

- Atualizar a permissão de um membro do Workspace.
- Permitir apenas alterações realizadas pelo OWNER.
- Retornar apenas o membro atualizado.
- Atualizar a interface sem recarregar toda a lista de membros.

## Fluxo

```text
WorkspaceMembersSection

↓

updateWorkspaceMemberRole()

↓

PATCH /workspaces/:workspaceId/members/:memberId

↓

WorkspaceMember atualizado

↓

Atualização do membro na lista
```

---

# removeWorkspaceMember()

## Endpoint

```http
DELETE /workspaces/:workspaceId/members/:memberId
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pelo interceptor do Axios.

## Resposta

```ts
type RemoveWorkspaceMemberResponse = {
  message: string;
}
```

## Responsabilidades

- Remover um membro do Workspace.
- Retornar a mensagem de sucesso enviada pela API.
- Propagar erros para o `WorkspaceMembersSection`.

## Fluxo

```text
WorkspaceMembersSection

↓

removeWorkspaceMember()

↓

DELETE /workspaces/:workspaceId/members/:memberId

↓

Atualização local da lista e dos contadores
```

---

# createWorkspaceInvitation()

## Endpoint

```http
POST /workspaces/:workspaceId/invitations
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pelo interceptor do Axios.

## Entrada

```ts
type CreateWorkspaceInvitationRequest = {
  email: string;
}
```

## Resposta

```ts
type CreateWorkspaceInvitationResponse = {
  message: string;
  invitation: WorkspaceInvitation;
}
```

## Responsabilidades

- Criar um convite para um usuário.
- Enviar o email do convidado ao backend.
- Gerar um token único para o convite.
- Retornar os dados do convite criado.
- Permitir que o frontend gere o link de compartilhamento.

## Fluxo

```text
WorkspaceMembersSection

↓

Modal de convite

↓

createWorkspaceInvitation()

↓

POST /workspaces/:workspaceId/invitations

↓

WorkspaceInvitation

↓

Exibição do link para compartilhamento
```

---

# listPendingWorkspaceInvitations()

## Endpoint

```http
GET /workspace-invitations/pending
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pelo interceptor do Axios.

## Resposta

```ts
PendingWorkspaceInvitation[]
```

## Responsabilidades

- Buscar todos os convites pendentes do usuário autenticado.
- Retornar os dados do Workspace.
- Retornar quem enviou o convite.
- Exibir os convites no Dashboard.
- Permitir aceitação direta do convite.

## Fluxo

```text
DashboardPage

↓

listPendingWorkspaceInvitations()

↓

GET /workspace-invitations/pending

↓

PendingWorkspaceInvitation[]

↓

Renderização dos cards de convite
```

---

# acceptWorkspaceInvitation()

## Endpoint

```http
POST /workspace-invitations/:token/accept
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pelo interceptor do Axios.

## Resposta

```ts
type AcceptWorkspaceInvitationResponse = {
  message: string;
  workspaceMember: WorkspaceMember;
  invitation: WorkspaceInvitation;
}
```

## Responsabilidades

- Aceitar um convite pendente.
- Adicionar o usuário ao Workspace.
- Atualizar automaticamente a lista de Workspaces.
- Remover o convite da lista de pendentes.

## Fluxo

```text
DashboardPage

↓

Botão "Aceitar convite"

↓

acceptWorkspaceInvitation()

↓

POST /workspace-invitations/:token/accept

↓

WorkspaceMember criado

↓

Atualização automática da interface
```

---

# Serviço de Boards

## Arquivo

```text
src/features/boards/services/board.service.ts
```

Responsável pela comunicação entre o frontend e os endpoints relacionados aos Boards.

Atualmente disponibiliza:

```text
listBoards()

createBoard()
```

---

# listBoards()

## Endpoint

```http
GET /workspaces/:workspaceId/boards
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pela instância compartilhada do Axios.

## Resposta

```ts
Board[]
```

## Responsabilidades

- Buscar todos os Boards do Workspace.
- Retornar apenas Boards ativos.
- Fornecer os dados necessários para a `WorkspacePage`.
- Atualizar a interface após alterações.

## Fluxo

```text
WorkspacePage

↓

listBoards()

↓

GET /workspaces/:workspaceId/boards

↓

Board[]

↓

Renderização dos cards
```

---

# createBoard()

## Endpoint

```http
POST /workspaces/:workspaceId/boards
```

## Headers

```text
Authorization: Bearer TOKEN
```

## Entrada

```ts
type CreateBoardRequest = {
  title: string;
  description?: string;
  backgroundColor?: string;
  coverImage?: string;
}
```

## Resposta

```ts
type CreateBoardResponse = {
  message: string;
  board: Board;
}
```

## Responsabilidades

- Criar um novo Board.
- Associar automaticamente o usuário autenticado como OWNER.
- Atualizar imediatamente a lista de Boards.
- Propagar erros para a `WorkspacePage`.

## Fluxo

```text
WorkspacePage

↓

Modal de criação

↓

createBoard()

↓

POST /workspaces/:workspaceId/boards

↓

Board criado

↓

Atualização automática da lista
```

---

# Estruturas Utilizadas

## Workspace

```ts
type Workspace = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
}
```

---

## WorkspaceMember

```ts
type WorkspaceMember = {
  id: string;
  userId?: string;
  workspaceId?: string;
  role: WorkspaceRole;
  createdAt: string;
  user?: WorkspaceMemberUser;
}
```

---

## WorkspaceMemberUser

```ts
type WorkspaceMemberUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}
```

---

## WorkspaceRole

```ts
type WorkspaceRole =
  | "OWNER"
  | "ADMIN"
  | "MEMBER"
  | "VIEWER";
```

---

## WorkspaceInvitation

```ts
type WorkspaceInvitation = {
  id: string;
  email: string;
  token: string;
  status: WorkspaceInvitationStatus;
  workspaceId: string;
  invitedById: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## PendingWorkspaceInvitation

```ts
type PendingWorkspaceInvitation = {
  id: string;
  email: string;
  token: string;
  status: WorkspaceInvitationStatus;
  workspaceId: string;
  invitedById: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;

  workspace: {
    id: string;
    name: string;
    description: string | null;
  };

  invitedBy: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}
```

---

# Fluxo Geral dos Serviços

```text
Page

↓

Service

↓

Axios

↓

Interceptor

↓

Backend

↓

Resposta

↓

Atualização da Interface
```

---

# Tipos Utilizados

## User

```ts
type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt?: string;
}
```

---

## LoginRequest

```ts
type LoginRequest = {
  email: string;
  password: string;
}
```

---

## LoginResponse

```ts
type LoginResponse = {
  token: string;
  user: User;
}
```

---

## RegisterRequest

```ts
type RegisterRequest = {
  name: string;
  email: string;
  password: string;
}
```

---

## RegisterResponse

```ts
type RegisterResponse = {
  message: string;
  user: User;
}
```

---

## CurrentUserResponse

```ts
type CurrentUserResponse = {
  user: User;
}
```

---

## ForgotPasswordRequest

```ts
type ForgotPasswordRequest = {
  email: string;
}
```

---

## ForgotPasswordResponse

```ts
type ForgotPasswordResponse = {
  message: string;
  resetToken: string | null;
  resetUrl: string | null;
}
```

---

## ResetPasswordRequest

```ts
type ResetPasswordRequest = {
  token: string;
  password: string;
}
```

---

## ResetPasswordResponse

```ts
type ResetPasswordResponse = {
  message: string;
}
```

---

## ListWorkspacesResponse

```ts
type ListWorkspacesResponse = {
  workspaces: Workspace[];
}
```

---

## CreateWorkspaceRequest

```ts
type CreateWorkspaceRequest = {
  name: string;
  description?: string;
}
```

---

## CreateWorkspaceResponse

```ts
type CreateWorkspaceResponse = {
  message: string;
  workspace: Workspace;
}
```

---

## UpdateWorkspaceRequest

```ts
type UpdateWorkspaceRequest = {
  name: string;
  description?: string;
}
```

---

## UpdateWorkspaceResponse

```ts
type UpdateWorkspaceResponse = {
  message: string;
  workspace: Workspace;
}
```

---

## DeleteWorkspaceResponse

```ts
type DeleteWorkspaceResponse = {
  message: string;
}
```

---

## UpdateWorkspaceMemberRoleRequest

```ts
type UpdateWorkspaceMemberRoleRequest = {
  role: "ADMIN" | "MEMBER" | "VIEWER";
}
```

---

## UpdateWorkspaceMemberRoleResponse

```ts
type UpdateWorkspaceMemberRoleResponse = {
  message: string;
  member: WorkspaceMember;
}
```

---

## Board

```ts
type Board = {
  id: string;
  title: string;
  description: string | null;
  backgroundColor: string | null;
  coverImage: string | null;
  isArchived: boolean;
  workspaceId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## CreateBoardRequest

```ts
type CreateBoardRequest = {
  title: string;
  description?: string;
  backgroundColor?: string;
  coverImage?: string;
}
```

---

## CreateBoardResponse

```ts
type CreateBoardResponse = {
  message: string;
  board: Board;
}
```

---

## ListBoardsResponse

```ts
type ListBoardsResponse = {
  boards: Board[];
}
```

---

# Tratamento de Erros

Os serviços apenas propagam os erros retornados pela API.

A responsabilidade pela exibição das mensagens pertence às páginas ou aos hooks responsáveis pelo fluxo.

Quando uma resposta `401 Unauthorized` é recebida em qualquer requisição autenticada (exceto durante o login), o interceptor global realiza automaticamente:

- Limpeza do token.
- Limpeza do usuário autenticado.
- Disparo do evento global de sessão expirada.

O `AuthProvider` recebe esse evento, limpa o estado da autenticação e permite que a aplicação redirecione automaticamente o usuário para a tela de Login.

Exemplo:

```text
API

↓

AxiosError

↓

Interceptor de Respostas

↓

AuthProvider

↓

LoginPage

↓

Mensagem ao usuário
```

Mensagens utilizadas atualmente:

- Não foi possível carregar os Workspaces.
- Não foi possível carregar o Workspace.
- Não foi possível atualizar o Workspace.
- Não foi possível excluir o Workspace.
- Não foi possível criar o Workspace.
- Sua sessão expirou. Entre novamente.
- Não foi possível solicitar a recuperação da senha.
- Não foi possível redefinir a senha.
- Não foi possível carregar os Boards.
- Não foi possível criar o Board.

---

# Boas Práticas

Os serviços devem:

- Não acessar diretamente componentes React.
- Não manipular elementos da interface.
- Não acessar o DOM.
- Não executar navegação.
- Não manter estados visuais.
- Apenas comunicar com a API.
- Retornar dados tipados.
- Propagar erros para a camada responsável.

---

# Serviços Planejados

```text
list.service.ts

card.service.ts

notification.service.ts
```

---

# Melhorias Futuras

- Padronizar os erros da API.
- Permitir cancelamento de convites.
- Permitir reenvio de convites.
- Adicionar cancelamento de requisições.
- Adicionar cache de consultas.
- Avaliar TanStack Query conforme a complexidade crescer.
- Implementar retry automático quando necessário.
- Implementar Refresh Token.
- Renovação automática do JWT.
- Controle de múltiplas sessões.

---

# Estado Atual

## Implementado

- Instância compartilhada do Axios.
- Configuração por variável de ambiente.
- Interceptor de requisição JWT.
- Interceptor global de respostas.
- Tratamento automático de respostas `401 Unauthorized`.
- Limpeza automática de sessões inválidas.
- Evento global de sessão expirada.
- `login()`.
- `registerUser()`.
- `getCurrentUser()`.
- `listWorkspaces()`.
- `createWorkspace()`.
- `getWorkspaceById()`.
- `updateWorkspace()`.
- `deleteWorkspace()`.
- `listWorkspaceMembers()`.
- `updateWorkspaceMemberRole()`.
- `removeWorkspaceMember()`.
- `createWorkspaceInvitation()`.
- `listPendingWorkspaceInvitations()`.
- `acceptWorkspaceInvitation()`.
- `forgotPassword()`.
- `resetPassword()`.
- `listBoards()`.
- `createBoard()`.

## Planejado

- Cancelamento de convites.
- Reenvio de convites.
- Serviços de Lists.
- Serviços de Cards.
- Integração com envio de email para recuperação de senha.
- Refresh Token.
- Cache de requisições.