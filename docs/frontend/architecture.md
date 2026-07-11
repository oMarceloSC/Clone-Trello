# Arquitetura do Frontend

## Visão Geral

O frontend do Clone do Trello foi desenvolvido utilizando **React** e **TypeScript**, seguindo uma arquitetura baseada em funcionalidades (*Feature-Based Architecture*).

O principal objetivo é manter o código organizado, desacoplado e escalável, permitindo que novas funcionalidades sejam adicionadas sem impactar módulos existentes.

Toda comunicação com o backend é realizada através da API REST.

---

# Tecnologias

| Tecnologia | Finalidade |
|------------|------------|
| React | Interface |
| TypeScript | Tipagem |
| Vite | Build Tool |
| React Router | Navegação |
| Axios | Comunicação HTTP |
| React Hook Form | Formulários |
| Zod | Validação |
| Context API | Estado Global |
| CSS | Estilização |

---

# Arquitetura Geral

```
Browser

↓

React

↓

React Router

↓

AuthProvider

↓

Pages

↓

Services

↓

Axios

↓

Backend API
```

---

# Estrutura do Projeto

```
frontend/

├── public/

├── src/

│   ├── assets/

│   ├── features/

│   ├── pages/

│   ├── routes/

│   ├── services/

│   ├── styles/

│   ├── App.tsx

│   ├── index.css

│   └── main.tsx

├── .env

├── .env.example

└── vite.config.ts
```

---

# Organização por Features

Cada domínio da aplicação possui sua própria estrutura.

Exemplo:

```
features/

auth/

workspaces/

boards/

lists/

cards/
```

Cada feature possui autonomia para organizar seus próprios arquivos.

---

# Estrutura de uma Feature

Todas seguem o mesmo padrão.

```
auth/

controllers (quando necessário)

contexts

hooks

pages

schemas

services

types
```

Novas funcionalidades deverão manter essa organização.

---

# Camadas

A arquitetura foi dividida em responsabilidades bem definidas.

```
Pages

↓

Hooks

↓

Services

↓

Axios

↓

API
```

Cada camada possui apenas uma responsabilidade.

---

# Pages

Responsáveis por:

- Construir a interface.
- Capturar interação do usuário.
- Chamar hooks.
- Chamar serviços.
- Exibir mensagens.

As páginas **não possuem regras de negócio complexas**.

---

# Hooks

Os hooks encapsulam comportamentos reutilizáveis.

Atualmente:

```
useAuth()
```

No futuro existirão:

```
useWorkspace()

useBoard()

useNotification()
```

---

# Contexts

Os Contexts armazenam estados globais.

Atualmente:

```
AuthContext
```

Responsável por:

- usuário
- login
- logout
- recuperação da sessão

---

# Services

Os Services realizam toda comunicação HTTP.

Exemplo:

```
auth.service.ts
```

Futuramente:

```
workspace.service.ts

board.service.ts

card.service.ts
```

---

# Schemas

Todos os formulários utilizam validação através do Zod.

Exemplo:

```
login.schema.ts

register.schema.ts
```

Isso garante que dados inválidos não sejam enviados para a API.

---

# Types

Todos os tipos TypeScript ficam centralizados dentro da feature.

Exemplo:

```
User

LoginRequest

LoginResponse

RegisterRequest

RegisterResponse
```

---

# Rotas

As rotas são centralizadas em:

```
src/routes/AppRoutes.tsx
```

Atualmente existem dois tipos de proteção.

## RequireAuthentication

Protege páginas privadas.

Exemplo:

```
Dashboard
```

---

## RequireGuest

Impede acesso de usuários autenticados às páginas públicas.

Exemplo:

```
Login

Cadastro
```

---

# AuthProvider

O AuthProvider envolve toda a aplicação.

```
BrowserRouter

↓

AuthProvider

↓

App
```

Ele é responsável por:

- recuperar sessão
- validar token
- armazenar usuário
- disponibilizar autenticação

---

# Fluxo da Autenticação

```
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

Dashboard
```

---

# Recuperação da Sessão

Sempre que o frontend inicia:

```
App

↓

AuthProvider

↓

Existe Token?

↓

GET /auth/me

↓

Sessão válida?

↓

Atualiza usuário

↓

Renderiza aplicação
```

Caso o token seja inválido:

```
Remove Token

↓

Remove Usuário

↓

Login
```

---

# Comunicação com a API

Toda comunicação passa pela instância compartilhada do Axios.

```
Page

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

```
Authorization: Bearer TOKEN
```

---

# Variáveis de Ambiente

A URL da API é configurada através de:

```
VITE_API_URL
```

Exemplo:

```
VITE_API_URL=http://localhost:3333
```

---

# Fluxo de uma Requisição

```
Usuário

↓

Page

↓

Hook (quando necessário)

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

# Estrutura Atual

Atualmente o frontend possui:

```
Auth

├── Login

├── Cadastro

├── Recuperação da Sessão

├── AuthContext

└── Dashboard Inicial
```

---

# Estrutura Planejada

```
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

Dashboard
```

Cada módulo seguirá exatamente a mesma arquitetura.

---

# Princípios Utilizados

- Separação de responsabilidades.
- Baixo acoplamento.
- Alta coesão.
- Componentização.
- Organização por funcionalidades.
- Código reutilizável.
- Escalabilidade.
- Manutenção simplificada.

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
- Serviços.
- Hooks.
- Schemas.
- Types.

## Em desenvolvimento

- Workspaces.
- Componentes reutilizáveis.
- Sistema de Layout.
- Design System.
- Tema escuro.
- Responsividade.

---

# Próximas Evoluções

A arquitetura continuará crescendo mantendo o mesmo padrão.

As próximas implementações serão:

1. Feature Workspaces.
2. Feature Boards.
3. Feature Lists.
4. Feature Cards.
5. Componentes compartilhados.
6. Sistema de Layout.
7. Integração em tempo real com Socket.IO.

Cada nova feature deverá seguir exatamente a organização descrita neste documento.