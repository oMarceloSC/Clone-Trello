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

ForgotPasswordPage

ResetPasswordPage

DashboardPage

WorkspacePage

AcceptWorkspaceInvitationPage

NotFoundPage
```

A `AcceptWorkspaceInvitationPage` permite aceitar convites utilizando o token presente na URL, enquanto o `DashboardPage` também permite aceitar convites diretamente através da listagem de convites pendentes.

A `NotFoundPage` é renderizada quando nenhuma rota corresponde ao endereço acessado, permitindo retornar à página anterior, ao Dashboard ou ao Login.

A `ForgotPasswordPage` é responsável por iniciar o fluxo de recuperação da senha, permitindo que o usuário solicite um token de redefinição.

A `ResetPasswordPage` permite informar uma nova senha utilizando um token válido recebido durante o processo de recuperação.

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
- Remover membros do Workspace.
- Exibir a confirmação antes da remoção.
- Atualizar a lista e os contadores sem recarregar a página.

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
- Escutar eventos globais de expiração da sessão.
- Limpar automaticamente a autenticação após respostas `401 Unauthorized`.
- Notificar a interface quando a sessão expirar.

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

forgotPassword()

resetPassword()

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

A comunicação HTTP é centralizada por uma instância compartilhada do Axios, responsável por:

- Adicionar automaticamente o JWT em todas as requisições autenticadas.
- Monitorar respostas da API através de um interceptor global.
- Encerrar automaticamente sessões inválidas ou expiradas.

---

# Schemas

Os formulários utilizam Zod para validação.

Atualmente existem schemas para:

- Login.
- Cadastro.
- Criação de Workspace.
- Atualização de Workspace.
- Recuperação de senha.
- Redefinição de senha.

Exemplos:

```text
login.schema.ts

register.schema.ts

forgot-password.schema.ts

reset-password.schema.ts

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

ForgotPasswordRequest

ForgotPasswordResponse

ResetPasswordRequest

ResetPasswordResponse
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

/forgot-password

/reset-password
```

---

## Rota Coringa

A rota coringa captura endereços que não correspondem a nenhuma rota existente.

```text
*
```

Ela renderiza:

```text
NotFoundPage
```

A página está disponível tanto para visitantes quanto para usuários autenticados.

Fluxo:

```text
Rota inexistente

↓

AppRoutes

↓

NotFoundPage

├── Voltar
├── Dashboard, quando autenticado
└── Login, quando visitante
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
- Escutar eventos globais disparados pelo interceptor do Axios.
- Encerrar automaticamente a sessão após respostas `401 Unauthorized`.
- Informar a interface quando uma sessão expirar.

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

# Fluxo da Recuperação de Senha

```text
Usuário

↓

ForgotPasswordPage

↓

forgotPassword()

↓

POST /auth/forgot-password

↓

Token temporário

↓

ResetPasswordPage

↓

resetPassword()

↓

POST /auth/reset-password

↓

Senha atualizada

↓

LoginPage
```

Durante o desenvolvimento, o backend retorna o link de redefinição para facilitar os testes locais.

Em ambiente de produção, esse link será enviado por email ao usuário.

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

# Fluxo de Expiração da Sessão

Durante toda a utilização da aplicação, o frontend monitora respostas `401 Unauthorized`.

Quando isso ocorre, o fluxo executado é:

```text
Requisição

↓

Backend

↓

401 Unauthorized

↓

Interceptor de Respostas

↓

Remoção do token

↓

SESSION_EXPIRED_EVENT

↓

AuthProvider

↓

RequireAuthentication

↓

LoginPage

↓

"Sua sessão expirou. Entre novamente."
```

As requisições de autenticação (`POST /auth/login`) são ignoradas por esse tratamento para que erros de credenciais continuem sendo apresentados normalmente ao usuário.

---

# Comunicação com a API

Toda comunicação passa pela instância compartilhada do Axios.

```text
A comunicação utiliza uma instância compartilhada do Axios contendo dois interceptores:

- **Interceptor de Requisição**, responsável por adicionar automaticamente o header:

```text
Authorization: Bearer TOKEN
```

- **Interceptor de Respostas**, responsável por detectar respostas `401 Unauthorized`, limpar automaticamente a sessão, disparar um evento global e permitir que a aplicação redirecione o usuário para a tela de Login.
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

# Fluxo da Página 404

Quando uma URL não corresponde a nenhuma rota registrada, o React Router utiliza a rota coringa.

```text
Usuário

↓

URL inexistente

↓

React Router

↓

Rota *

↓

NotFoundPage
```

A página consulta o estado atual da autenticação através do `useAuth()`.

Com base nesse estado, apresenta a ação principal adequada:

```text
Autenticado

↓

Ir para o Dashboard
```

ou:

```text
Visitante

↓

Ir para o Login
```

Também existe a ação `Voltar`, que utiliza o histórico de navegação do navegador.

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

## Remoção de membros

```text
WorkspacePage

↓

WorkspaceMembersSection

↓

Modal de confirmação

↓

removeWorkspaceMember()

↓

DELETE /workspaces/:workspaceId/members/:memberId

↓

Lista e contadores atualizados
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
├── Recuperação de senha
├── Redefinição de senha
├── Recuperação da sessão
├── Tratamento automático da sessão expirada
└── AuthContext

Layout

├── AuthenticatedLayout
├── Sidebar
└── Header

Navegação

├── AppRoutes
├── RequireAuthentication
├── RequireGuest
└── NotFoundPage

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
├── Remoção de membros
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
- Interceptor global de respostas.
- Tratamento automático de respostas `401 Unauthorized`.
- Limpeza automática da sessão expirada.
- Evento global de expiração da sessão.
- Redirecionamento automático para Login.
- Mensagem de sessão expirada.
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
- Remoção de membros.
- Modal de confirmação da remoção de membros.
- Atualização automática dos contadores após remoção.
- Criação de convites.
- Geração de links de convite.
- Listagem de convites pendentes.
- Aceitação de convites pelo Dashboard.
- AcceptWorkspaceInvitationPage.
- Estados de carregamento dos membros.
- Estado vazio dos membros.
- Tratamento de erros dos membros.
- Nova tentativa após falha.
- NotFoundPage.
- Rota coringa `*`.
- Página 404 personalizada.
- Navegação da Página 404 para Dashboard ou Login.
- Retorno à página anterior através do histórico.
- ForgotPasswordPage.
- ResetPasswordPage.
- Recuperação de senha.
- Redefinição de senha.
- Schemas de recuperação de senha.
- Schemas de redefinição de senha.
- Métodos `forgotPassword()`.
- Métodos `resetPassword()`.

## Em desenvolvimento

- Cancelamento de convites.
- Reenvio de convites.
- Componentes reutilizáveis.
- Design System.
- Responsividade avançada.

---

# Próximas Evoluções

As próximas implementações serão:

1. Cancelamento de convites.
2. Reenvio de convites.
3. Componentes compartilhados.
4. Feature Boards.
5. Feature Lists.
6. Feature Cards.
7. Integração em tempo real com Socket.IO.
8. Envio da recuperação de senha por email.

Todas as novas páginas autenticadas utilizarão o `AuthenticatedLayout`.

Cada nova feature deverá seguir a organização descrita neste documento.