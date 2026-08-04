# Arquitetura do Frontend

## Visão Geral

O frontend do Clone do Trello foi desenvolvido utilizando **React** e **TypeScript**, seguindo uma arquitetura baseada em funcionalidades (*Feature-Based Architecture*).

O principal objetivo é manter o código organizado, desacoplado e escalável, permitindo que novas funcionalidades sejam adicionadas sem impactar módulos existentes.

Toda comunicação com o backend é realizada através da API REST.

---

# Tecnologias

| Tecnologia | Finalidade |
|---|---|
| React | Construção da interface |
| TypeScript | Tipagem estática |
| Vite | Build Tool |
| React Router | Navegação |
| Axios | Comunicação HTTP |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação |
| Context API | Estado global |
| CSS | Estilização |

---

# Arquitetura Geral

```text
Browser

↓

React

↓

React Router

↓

AuthProvider

↓

RequireAuthentication / RequireGuest

↓

AuthenticatedLayout

↓

Pages

↓

Components

↓

Services

↓

Axios

↓

Backend API
```

---

# Estrutura do Projeto

```text
frontend/

├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env
├── .env.example
└── vite.config.ts
```

---

# Organização por Features

Cada domínio da aplicação possui sua própria estrutura.

Atualmente existem:

```text
features/

├── auth/
└── workspaces/
```

Futuramente serão adicionadas:

```text
features/

├── boards/
├── lists/
├── cards/
├── comments/
├── notifications/
└── profile/
```

Cada feature possui autonomia para organizar seus próprios arquivos.

---

# Estrutura de uma Feature

As features seguem uma estrutura baseada em responsabilidade.

Exemplo:

```text
workspaces/

├── components/
│   └── WorkspaceMembersSection.tsx
│
├── pages/
│   ├── WorkspacePage.tsx
│   └── AcceptWorkspaceInvitationPage.tsx
│
├── schemas/
│   ├── create-workspace.schema.ts
│   ├── update-workspace.schema.ts
│   └── create-workspace-invitation.schema.ts
│
├── services/
│   └── workspace.service.ts
│
└── types/
    └── workspace.types.ts
```

Dependendo da necessidade, uma feature também pode possuir:

```text
contexts/

hooks/

utils/
```

---

# Camadas

A arquitetura foi dividida em responsabilidades bem definidas.

```text
Pages

↓

Components

↓

Hooks / Contexts

↓

Services

↓

Axios

↓

API
```

Cada camada possui uma responsabilidade específica.

---

# Pages

As páginas são responsáveis por:

- Construir a interface.
- Organizar os componentes.
- Capturar interações do usuário.
- Controlar estados visuais locais.
- Chamar Services.
- Exibir mensagens de erro e sucesso.
- Executar navegação.

As páginas não devem concentrar regras de negócio complexas.

Atualmente existem:

```text
LoginPage

RegisterPage

DashboardPage

WorkspacePage

AcceptWorkspaceInvitationPage
```

A `AcceptWorkspaceInvitationPage` permite aceitar convites utilizando o token presente na URL, enquanto o `DashboardPage` também permite aceitar convites diretamente através da listagem de convites pendentes.

---

# Components

Os componentes encapsulam partes específicas e reutilizáveis da interface.

Atualmente existe dentro da feature de Workspaces:

```text
WorkspaceMembersSection
```

Esse componente é responsável por:

- Buscar os membros do Workspace.
- Exibir nome e email.
- Exibir o cargo de cada participante.
- Identificar o usuário autenticado.
- Exibir estados de carregamento.
- Exibir estado vazio.
- Exibir estado de erro.
- Permitir nova tentativa após falha.
- Criar convites para novos membros.
- Exibir o link do convite gerado.
- Permitir copiar o link do convite.

Fluxo:

```text
WorkspacePage

↓

WorkspaceMembersSection

↓

listWorkspaceMembers()

↓

GET /workspaces/:id/members

↓

Lista de membros

↓

createWorkspaceInvitation()

↓

POST /workspaces/:id/invitations

↓

Link do convite
```

---

# Layouts

Os Layouts compartilham estruturas visuais entre múltiplas páginas.

Atualmente existe:

```text
AuthenticatedLayout
```

Responsabilidades:

- Renderizar a Sidebar.
- Renderizar o Header.
- Exibir informações do usuário.
- Disponibilizar Logout.
- Renderizar páginas privadas através do `Outlet`.

Estrutura:

```text
AuthenticatedLayout

├── Sidebar
├── Header
└── Outlet
```

Atualmente utilizam esse layout:

- DashboardPage.
- WorkspacePage.

---

# Hooks

Os Hooks encapsulam comportamentos reutilizáveis.

Atualmente existe:

```text
useAuth()
```

Responsabilidades:

- Acessar o AuthContext.
- Recuperar o usuário autenticado.
- Consultar o estado da sessão.
- Executar login.
- Executar logout.

Futuramente poderão existir:

```text
useWorkspace()

useBoard()

useNotification()
```

---

# Contexts

Os Contexts armazenam estados globais.

Atualmente existe:

```text
AuthContext
```

Responsabilidades:

- Armazenar o usuário autenticado.
- Armazenar o estado da sessão.
- Executar login.
- Executar logout.
- Restaurar a sessão.
- Validar o token através de `/auth/me`.

---

# Services

Os Services realizam a comunicação HTTP com o backend.

Atualmente existem:

```text
auth.service.ts

workspace.service.ts
```

O `auth.service.ts` disponibiliza:

```text
login()

registerUser()

getCurrentUser()
```

O `workspace.service.ts` disponibiliza:

```text
listWorkspaces()

createWorkspace()

getWorkspaceById()

updateWorkspace()

deleteWorkspace()

listWorkspaceMembers()

updateWorkspaceMemberRole()

createWorkspaceInvitation()

listPendingWorkspaceInvitations()

acceptWorkspaceInvitation()
```

Futuramente serão criados:

```text
board.service.ts

list.service.ts

card.service.ts

notification.service.ts
```

---

# Schemas

Os formulários utilizam Zod para validação.

Atualmente existem schemas para:

- Login.
- Cadastro.
- Criação de Workspace.
- Atualização de Workspace.

Exemplos:

```text
login.schema.ts

register.schema.ts

create-workspace.schema.ts

update-workspace.schema.ts
```

O Zod impede que dados inválidos sejam enviados para a API.

---

# Types

Os tipos TypeScript ficam centralizados dentro de cada feature.

Exemplos da autenticação:

```text
User

LoginRequest

LoginResponse

RegisterRequest

RegisterResponse
```

Exemplos de Workspaces:

```text
Workspace

WorkspaceMember

WorkspaceMemberUser

WorkspaceRole

WorkspaceInvitation

PendingWorkspaceInvitation

CreateWorkspaceRequest

CreateWorkspaceResponse

UpdateWorkspaceRequest

UpdateWorkspaceResponse

DeleteWorkspaceResponse

ListWorkspaceMembersResponse

CreateWorkspaceInvitationRequest

CreateWorkspaceInvitationResponse

AcceptWorkspaceInvitationResponse

ListPendingWorkspaceInvitationsResponse
```

---

# Rotas

As rotas são centralizadas em:

```text
src/routes/AppRoutes.tsx
```

Atualmente existem dois tipos de proteção.

---

## RequireAuthentication

Protege páginas privadas.

Exemplos:

```text
/dashboard

/workspaces/:id
```

---

## RequireGuest

Impede que usuários autenticados acessem páginas públicas.

Exemplos:

```text
/login

/register
```

---

# Layout Autenticado

As rotas privadas utilizam um layout compartilhado.

Fluxo:

```text
React Router

↓

RequireAuthentication

↓

AuthenticatedLayout

↓

Outlet

↓

Página
```

Essa abordagem garante que Sidebar e Header sejam reutilizados pelas páginas autenticadas.

---

# AuthProvider

O `AuthProvider` envolve toda a aplicação.

```text
BrowserRouter

↓

AuthProvider

↓

App
```

Responsabilidades:

- Recuperar sessão.
- Validar token.
- Armazenar usuário.
- Disponibilizar autenticação.
- Limpar sessão inválida.

---

# Fluxo da Autenticação

```text
Usuário

↓

LoginPage

↓

signIn()

↓

auth.service

↓

POST /auth/login

↓

JWT

↓

AuthContext

↓

RequireAuthentication

↓

AuthenticatedLayout

↓

Dashboard
```

---

# Recuperação da Sessão

Sempre que o frontend inicia:

```text
Aplicação

↓

AuthProvider

↓

Existe token?

├── Não
│   ↓
│   Visitante
│
└── Sim
    ↓
    GET /auth/me
    ↓
    Sessão válida?
    ├── Sim
    │   ↓
    │   Atualiza usuário
    │
    └── Não
        ↓
        Remove sessão
```

---

# Comunicação com a API

Toda comunicação passa pela instância compartilhada do Axios.

```text
Page ou Component

↓

Service

↓

Axios

↓

Interceptor

↓

Backend
```

O interceptor adiciona automaticamente:

```text
Authorization: Bearer TOKEN
```

---

# Variáveis de Ambiente

A URL da API é configurada por:

```env
VITE_API_URL
```

Exemplo:

```env
VITE_API_URL=http://localhost:3333
```

---

# Fluxo de uma Requisição

```text
Usuário

↓

Page

↓

Component, quando necessário

↓

Service

↓

Axios

↓

Backend

↓

Resposta

↓

Atualização da Interface
```

---

# Fluxo de Workspaces

## Listagem

```text
DashboardPage

↓

listWorkspaces()

↓

GET /workspaces

↓

Cards de Workspace
```

---

## Convites Pendentes

```text
DashboardPage

↓

listPendingWorkspaceInvitations()

↓

GET /workspace-invitations/pending

↓

Cards de convite

↓

acceptWorkspaceInvitation()

↓

POST /workspace-invitations/:token/accept

↓

Atualização automática da lista de Workspaces
```

---

## Criação

```text
DashboardPage

↓

Modal de criação

↓

createWorkspace()

↓

POST /workspaces

↓

Lista atualizada
```

---

## Visualização

```text
DashboardPage

↓

Abrir Workspace

↓

GET /workspaces/:id

↓

WorkspacePage
```

---

## Atualização

```text
WorkspacePage

↓

Modal de edição

↓

updateWorkspace()

↓

PATCH /workspaces/:id

↓

Interface atualizada
```

---

## Exclusão

```text
WorkspacePage

↓

Modal de confirmação

↓

deleteWorkspace()

↓

DELETE /workspaces/:id

↓

Dashboard
```

---

## Listagem de membros

```text
WorkspacePage

↓

WorkspaceMembersSection

↓

listWorkspaceMembers()

↓

GET /workspaces/:id/members

↓

Cards de membros
```

---

## Criação de Convites

```text
WorkspacePage

↓

WorkspaceMembersSection

↓

Modal de convite

↓

createWorkspaceInvitation()

↓

POST /workspaces/:id/invitations

↓

Link de convite
```

---

# Controle Visual de Permissões

O frontend utiliza a role do usuário para controlar quais ações são exibidas.

## OWNER

Pode visualizar:

- Editar Workspace.
- Excluir Workspace.
- Lista de membros.

## ADMIN

Pode visualizar:

- Editar Workspace.
- Lista de membros.

## MEMBER

Pode visualizar:

- Workspace.
- Lista de membros.

## VIEWER

Pode visualizar:

- Workspace.
- Lista de membros.

O controle visual melhora a experiência do usuário, mas a validação definitiva permanece no backend.

---

# Estrutura Atual

Atualmente o frontend possui:

```text
Auth

├── Login
├── Cadastro
├── Recuperação da sessão
└── AuthContext

Layout

├── AuthenticatedLayout
├── Sidebar
└── Header

Dashboard

├── Listagem de Workspaces
├── Criação de Workspaces
├── Listagem de convites pendentes
└── Aceitação de convites

Workspaces

├── WorkspacePage
├── Visualização de Workspace
├── Atualização de Workspace
├── Exclusão de Workspace
├── Controle visual de permissões
├── Listagem de membros
├── Criação de convites
└── Geração de links de convite
```

---

# Estrutura Planejada

```text
Auth

↓

Workspaces

↓

Boards

↓

Lists

↓

Cards

↓

Comentários

↓

Notificações

↓

Dashboard avançado
```

Cada módulo seguirá a mesma organização baseada em features.

---

# Princípios Utilizados

- Separação de responsabilidades.
- Baixo acoplamento.
- Alta coesão.
- Componentização.
- Organização por funcionalidades.
- Tipagem estática.
- Reutilização de código.
- Escalabilidade.
- Manutenção simplificada.
- Comunicação centralizada com a API.

---

# Estado Atual

## Implementado

- React.
- Vite.
- TypeScript.
- React Router.
- Axios.
- Context API.
- AuthContext.
- Login.
- Cadastro.
- Dashboard.
- Recuperação automática da sessão.
- Organização por Features.
- Services.
- Hooks.
- Schemas.
- Types.
- AuthenticatedLayout.
- Sidebar compartilhada.
- Header compartilhado.
- Listagem de Workspaces.
- Criação de Workspaces.
- Visualização de Workspace.
- Atualização de Workspace.
- Exclusão de Workspace.
- Navegação entre Dashboard e Workspace.
- Controle visual de permissões.
- WorkspaceMembersSection.
- Listagem de membros.
- Alteração de permissões.
- Criação de convites.
- Geração de links de convite.
- Listagem de convites pendentes.
- Aceitação de convites pelo Dashboard.
- AcceptWorkspaceInvitationPage.
- Estados de carregamento dos membros.
- Estado vazio dos membros.
- Tratamento de erros dos membros.
- Nova tentativa após falha.

## Em desenvolvimento

- Remoção de membros.
- Cancelamento de convites.
- Reenvio de convites.
- Componentes reutilizáveis.
- Interceptor global de respostas.
- Tratamento de sessão expirada.
- Página 404.
- Design System.
- Responsividade avançada.

---

# Próximas Evoluções

As próximas implementações serão:

1. Remoção de membros.
2. Cancelamento de convites.
3. Reenvio de convites.
4. Interceptor de respostas.
5. Tratamento de sessão expirada.
6. Página 404.
7. Componentes compartilhados.
8. Feature Boards.
9. Feature Lists.
10. Feature Cards.
11. Integração em tempo real com Socket.IO.

Todas as novas páginas autenticadas utilizarão o `AuthenticatedLayout`.

Cada nova feature deverá seguir a organização descrita neste documento.