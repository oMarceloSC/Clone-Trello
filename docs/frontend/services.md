# Serviços do Frontend

## Visão Geral

A camada de serviços é responsável pela comunicação entre o frontend e a API REST do backend.

Todos os serviços utilizam uma instância compartilhada do Axios, responsável por:

- Configuração da URL da API.
- Envio automático do JWT.
- Padronização das requisições.
- Centralização da comunicação HTTP.

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
    └── workspaces/
        └── services/
            └── workspace.service.ts
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

Interceptor

↓

localStorage

↓

Authorization

↓

Backend
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

Responsável por toda comunicação relacionada aos Workspaces.

Atualmente disponibiliza:

listWorkspaces()

getWorkspaceById()

createWorkspace()

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

---

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

---

## Responsabilidades

- Buscar todos os Workspaces do usuário autenticado.
- Retornar os dados dos Workspaces.
- Retornar os membros relacionados.
- Fornecer os dados necessários ao Dashboard.

---

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

# getWorkspaceById()

## Endpoint

```http
GET /workspaces/:id
```

## Headers

```text
Authorization: Bearer TOKEN
```

O JWT é enviado automaticamente pela instância compartilhada do Axios.

---

## Parâmetros

```ts
workspaceId: string
```

---

## Resposta

```ts
{
  workspace: Workspace;
}
```

O serviço retorna diretamente:

```ts
Workspace
```

para simplificar o consumo pelas páginas.

---

## Responsabilidades

- Buscar um Workspace específico.
- Validar o acesso do usuário através do backend.
- Retornar todas as informações necessárias para a WorkspacePage.
- Disponibilizar os membros do Workspace.
- Disponibilizar a permissão do usuário autenticado.

---

## Fluxo

```text
WorkspacePage

↓

getWorkspaceById()

↓

GET /workspaces/:id

↓

Workspace

↓

Renderização da página
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

---

## Entrada

```ts
type CreateWorkspaceRequest = {
  name: string;
  description?: string;
}
```

---

## Resposta

```ts
type CreateWorkspaceResponse = {
  message: string;
  workspace: Workspace;
}
```

---

## Responsabilidades

- Criar um novo Workspace.
- Associar automaticamente o usuário autenticado como OWNER.
- Retornar o Workspace criado.
- Atualizar imediatamente a interface sem necessidade de nova consulta à API.

---

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
Os serviços são reutilizados por múltiplas páginas.

Exemplo:

```text
DashboardPage

↓

listWorkspaces()

WorkspacePage

↓

getWorkspaceById()

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

# Tratamento de Erros

Os serviços apenas propagam os erros retornados pela API.

A responsabilidade pela exibição das mensagens pertence às páginas ou aos hooks responsáveis pelo fluxo.

Exemplo:

```text
API

↓

AxiosError

↓

DashboardPage

↓

Mensagem ao usuário
```

Na listagem de Workspaces, caso a API não retorne uma mensagem específica, é exibido:

```text
Não foi possível carregar os Workspaces.
```

Na criação de Workspaces, caso a API não retorne uma mensagem específica, é exibido:

```text
Não foi possível criar o Workspace.
```

Na visualização de um Workspace, caso a API não retorne uma mensagem específica, é exibido:

```text
Não foi possível abrir o Workspace.
´´´

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

updateWorkspace()

deleteWorkspace()

listWorkspaceMembers()

inviteWorkspaceMember()

updateWorkspaceMemberRole()

removeWorkspaceMember()

acceptWorkspaceInvitation()

board.service.ts

list.service.ts

card.service.ts

notification.service.ts
```

---

# Melhorias Futuras

- Criar interceptor global de respostas.
- Tratar respostas `401 Unauthorized`.
- Limpar automaticamente sessões inválidas.
- Padronizar os erros da API.
- Completar o CRUD de Workspaces.
- Adicionar cancelamento de requisições.
- Adicionar cache de consultas.
- Avaliar TanStack Query conforme a complexidade crescer.
- Implementar retry automático quando necessário.

---

# Estado Atual

## Implementado

- Instância compartilhada do Axios.
- Configuração por variável de ambiente.
- Interceptor JWT.
- login().
- registerUser().
- getCurrentUser().
- listWorkspaces().
- getWorkspaceById().
- createWorkspace().

## Planejado

- Atualização de Workspace.
- Exclusão de Workspace.
- Gerenciamento de membros.
- Gerenciamento de convites.
- Serviços de Boards.
- Serviços de Lists.
- Serviços de Cards.
- Interceptor de respostas.
- Refresh Token.
- Cache de requisições.