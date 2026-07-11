# Autenticação no Frontend

## Visão Geral

O frontend do Clone do Trello possui um fluxo inicial de autenticação integrado à API REST do backend.

Atualmente, o sistema permite:

* Cadastro de usuários.
* Login com email e senha.
* Armazenamento do token JWT.
* Armazenamento dos dados básicos do usuário.
* Proteção de rotas autenticadas.
* Logout.
* Redirecionamento após cadastro.
* Feedback visual de sucesso e erro.

A autenticação ainda utiliza o `localStorage` diretamente. Futuramente, essa responsabilidade será centralizada em um `AuthContext`.

---

# Tecnologias

| Tecnologia      | Responsabilidade                      |
| --------------- | ------------------------------------- |
| React           | Construção da interface               |
| React Router    | Navegação e proteção de rotas         |
| Axios           | Comunicação com a API                 |
| React Hook Form | Gerenciamento dos formulários         |
| Zod             | Validação dos dados                   |
| JWT             | Autenticação entre frontend e backend |
| localStorage    | Persistência inicial da sessão        |

---

# Endpoints Consumidos

| Método | Endpoint         | Finalidade                         |
| ------ | ---------------- | ---------------------------------- |
| POST   | `/auth/register` | Cadastro de usuário                |
| POST   | `/auth/login`    | Login                              |
| GET    | `/auth/me`       | Recuperação do usuário autenticado |

O endpoint `/auth/me` já existe no backend, mas sua integração completa ao carregamento da sessão será realizada quando o `AuthContext` for implementado.

---

# Cadastro

## Rota

```text
/register
```

## Objetivo

Permitir que um novo usuário crie uma conta informando:

* Nome.
* Email.
* Senha.
* Confirmação de senha.

---

## Funcionalidades

* Formulário de cadastro.
* Validação com React Hook Form e Zod.
* Validação mínima do nome.
* Validação do formato do email.
* Validação do tamanho mínimo da senha.
* Confirmação de senha.
* Tratamento de email duplicado.
* Feedback de carregamento.
* Exibição de erros retornados pela API.
* Redirecionamento para o login após cadastro.
* Mensagem de sucesso na página de login.

---

## Endpoint Consumido

```http
POST /auth/register
```

---

## Dados Enviados

```json
{
  "name": "Marcelo Cruz",
  "email": "marcelo@email.com",
  "password": "123456"
}
```

O campo `passwordConfirmation` existe apenas no frontend e não é enviado para a API.

---

## Resposta Esperada

```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "uuid",
    "name": "Marcelo Cruz",
    "email": "marcelo@email.com",
    "avatarUrl": null,
    "createdAt": "2026-07-11T18:00:00.000Z"
  }
}
```

---

## Fluxo

```text
Usuário acessa /register
        ↓
Preenche o formulário
        ↓
React Hook Form coleta os dados
        ↓
Zod valida os campos
        ↓
POST /auth/register
        ↓
Usuário criado no backend
        ↓
Redirecionamento para /login
        ↓
Mensagem de cadastro concluído
```

---

## Validações

### Nome

* Obrigatório.
* Espaços externos removidos.
* Mínimo de 3 caracteres.

Mensagem:

```text
O nome deve possuir pelo menos 3 caracteres
```

### Email

* Obrigatório.
* Deve possuir um formato válido.

Mensagem:

```text
Informe um email válido
```

### Senha

* Obrigatória.
* Mínimo de 6 caracteres.

Mensagem:

```text
A senha deve possuir pelo menos 6 caracteres
```

### Confirmação de senha

* Obrigatória.
* Deve ser igual à senha.

Mensagem:

```text
As senhas não coincidem
```

---

## Erros da API

### Email já utilizado

```text
Email já está em uso
```

### Erro inesperado

```text
Ocorreu um erro inesperado.
```

---

# Login

## Rota

```text
/login
```

## Objetivo

Autenticar um usuário já cadastrado utilizando email e senha.

---

## Funcionalidades

* Formulário de login.
* Validação com React Hook Form e Zod.
* Requisição ao backend.
* Armazenamento do JWT.
* Armazenamento dos dados do usuário.
* Redirecionamento para o dashboard.
* Tratamento de credenciais inválidas.
* Feedback durante o envio.
* Exibição de confirmação após cadastro concluído.

---

## Endpoint Consumido

```http
POST /auth/login
```

---

## Dados Enviados

```json
{
  "email": "marcelo@email.com",
  "password": "123456"
}
```

---

## Resposta Esperada

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "name": "Marcelo Cruz",
    "email": "marcelo@email.com",
    "avatarUrl": null
  }
}
```

---

## Fluxo

```text
Usuário acessa /login
        ↓
Preenche email e senha
        ↓
Validação com Zod
        ↓
POST /auth/login
        ↓
Token e usuário retornados
        ↓
Dados salvos no localStorage
        ↓
Redirecionamento para /dashboard
```

---

# Persistência da Sessão

A sessão é armazenada temporariamente no navegador através do `localStorage`.

## Chaves

```text
@clone-trello:token
@clone-trello:user
```

## Token

```ts
localStorage.setItem(
  "@clone-trello:token",
  response.token,
);
```

## Usuário

```ts
localStorage.setItem(
  "@clone-trello:user",
  JSON.stringify(response.user),
);
```

---

# Envio Automático do JWT

A instância do Axios possui um interceptor que adiciona o token às requisições autenticadas.

```text
Authorization: Bearer TOKEN
```

Fluxo:

```text
Requisição HTTP
      ↓
Interceptor Axios
      ↓
Leitura do token no localStorage
      ↓
Header Authorization
      ↓
Backend
```

---

# Rotas Protegidas

A rota `/dashboard` utiliza o componente `RequireAuthentication`.

Caso o token não exista, o usuário é redirecionado para:

```text
/login
```

Atualmente a proteção verifica apenas a existência do token.

Futuramente, o frontend também validará a sessão através do endpoint:

```http
GET /auth/me
```

---

# Logout

O logout remove as informações da sessão:

```ts
localStorage.removeItem("@clone-trello:token");
localStorage.removeItem("@clone-trello:user");
```

Depois disso, o usuário é redirecionado para:

```text
/login
```

---

# Estado Atual

## Implementado

* Cadastro.
* Login.
* Logout.
* Validação de formulários.
* Armazenamento do token.
* Armazenamento do usuário.
* Interceptor JWT.
* Rota protegida.
* Redirecionamento após cadastro.
* Mensagem de sucesso no login.

## Planejado

* AuthContext.
* Carregamento automático da sessão.
* Validação pelo endpoint `/auth/me`.
* Recuperação de senha.
* Redefinição de senha.
* Tratamento global de sessão expirada.
* Redirecionamento automático após respostas `401`.
* Persistência centralizada da autenticação.

---

# `docs/frontend/pages.md`

# Páginas do Frontend

## Visão Geral

Este documento descreve as páginas implementadas e planejadas no frontend do Clone do Trello.

As páginas são responsáveis por compor componentes, executar fluxos de interface e integrar as funcionalidades do usuário aos serviços da aplicação.

---

# Páginas Implementadas

```text
LoginPage

RegisterPage

DashboardPage
```

---

# LoginPage

## Arquivo

```text
src/features/auth/pages/LoginPage.tsx
```

## Rota

```text
/login
```

## Acesso

Público.

## Responsabilidades

* Exibir o formulário de login.
* Validar email e senha.
* Enviar as credenciais para a API.
* Exibir erros de validação.
* Exibir erros do backend.
* Armazenar o token JWT.
* Armazenar os dados do usuário.
* Redirecionar para o dashboard.
* Exibir confirmação após cadastro concluído.
* Disponibilizar acesso à página de cadastro.

## Campos

* Email.
* Senha.

## Estados da Interface

* Formulário padrão.
* Campos inválidos.
* Requisição em andamento.
* Credenciais inválidas.
* Erro inesperado.
* Cadastro concluído com sucesso.

## Navegação

Após login:

```text
/dashboard
```

Link secundário:

```text
/register
```

---

# RegisterPage

## Arquivo

```text
src/features/auth/pages/RegisterPage.tsx
```

## Rota

```text
/register
```

## Acesso

Público.

## Responsabilidades

* Exibir o formulário de cadastro.
* Validar os campos.
* Verificar a confirmação da senha.
* Enviar os dados para a API.
* Exibir erros de validação.
* Exibir erros retornados pelo backend.
* Redirecionar para o login após sucesso.
* Disponibilizar acesso à página de login.

## Campos

* Nome.
* Email.
* Senha.
* Confirmação de senha.

## Estados da Interface

* Formulário padrão.
* Nome inválido.
* Email inválido.
* Senha curta.
* Senhas diferentes.
* Email já cadastrado.
* Requisição em andamento.
* Erro inesperado.

## Navegação

Após cadastro:

```text
/login
```

O redirecionamento envia um estado indicando que o cadastro foi concluído.

Link secundário:

```text
/login
```

---

# DashboardPage

## Arquivo

```text
src/pages/DashboardPage.tsx
```

## Rota

```text
/dashboard
```

## Acesso

Autenticado.

## Responsabilidades Atuais

* Exibir o nome da aplicação.
* Exibir uma mensagem de boas-vindas.
* Ler os dados do usuário no `localStorage`.
* Permitir logout.
* Servir como base para a futura listagem de Workspaces.

## Estado Atual

A página ainda possui conteúdo inicial de integração.

A listagem real dos Workspaces será implementada na próxima etapa.

---

# Páginas Planejadas

## WorkspacePage

Rota planejada:

```text
/workspaces/:id
```

Responsabilidades:

* Exibir informações do Workspace.
* Exibir membros.
* Exibir convites.
* Permitir atualização.
* Permitir exclusão.
* Gerenciar permissões.

---

## BoardPage

Rota planejada:

```text
/boards/:id
```

Responsabilidades:

* Exibir o Board.
* Exibir Lists.
* Exibir Cards.
* Suportar Drag and Drop.
* Sincronizar alterações em tempo real.

---

## NotFoundPage

Rota planejada:

```text
*
```

Responsabilidades:

* Informar que a página não foi encontrada.
* Disponibilizar navegação de retorno.

---

# Organização das Páginas

Páginas relacionadas diretamente a uma funcionalidade podem permanecer dentro de sua feature.

Exemplo:

```text
features/
└── auth/
    └── pages/
        ├── LoginPage.tsx
        └── RegisterPage.tsx
```

Páginas de nível geral podem permanecer em:

```text
src/pages/
```

Exemplo:

```text
DashboardPage.tsx
```

---

# Próximas Atualizações

* Listagem de Workspaces no Dashboard.
* Formulário de criação de Workspace.
* Página de detalhes do Workspace.
* Gerenciamento de membros.
* Gerenciamento de convites.
* Estados de carregamento.
* Empty states.
* Página de erro.
