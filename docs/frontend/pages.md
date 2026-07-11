# Páginas do Frontend

## Visão Geral

Este documento descreve todas as páginas do frontend do Clone do Trello.

Cada página possui uma responsabilidade específica e deve conter apenas a lógica necessária para composição da interface e interação com o usuário. Toda regra de negócio permanece centralizada nos serviços e no contexto de autenticação.

---

# Organização

As páginas são organizadas por funcionalidade.

Atualmente:

```text
src/
├── features/
│   └── auth/
│       └── pages/
│           ├── LoginPage.tsx
│           └── RegisterPage.tsx
│
└── pages/
    └── DashboardPage.tsx
```

Conforme o projeto crescer, novas páginas serão adicionadas às suas respectivas features.

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

Caso exista uma sessão válida, o usuário é automaticamente redirecionado para:

```text
/dashboard
```

---

## Objetivos

Permitir que um usuário existente realize login na plataforma.

---

## Responsabilidades

- Exibir formulário de login.
- Validar email.
- Validar senha.
- Enviar credenciais para a API.
- Exibir erros de validação.
- Exibir erros retornados pelo backend.
- Executar `signIn()`.
- Redirecionar para o Dashboard.
- Exibir confirmação após cadastro concluído.

---

## Campos

| Campo | Obrigatório |
|--------|-------------|
| Email | Sim |
| Senha | Sim |

---

## Estados

A página pode assumir os seguintes estados:

### Inicial

Campos vazios.

---

### Carregando

Botão:

```text
Entrando...
```

---

### Erro de validação

Mensagens do Zod.

---

### Erro da API

Mensagem retornada pelo backend.

Exemplo:

```text
Email ou senha inválidos
```

---

### Cadastro concluído

Mensagem:

```text
Conta criada com sucesso. Agora você pode entrar.
```

---

## Fluxo

```text
Usuário acessa Login

↓

Preenche email

↓

Preenche senha

↓

React Hook Form

↓

Validação Zod

↓

signIn()

↓

POST /auth/login

↓

JWT recebido

↓

AuthContext atualizado

↓

Dashboard
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

Caso exista uma sessão válida:

```text
/dashboard
```

---

## Objetivos

Permitir criação de novos usuários.

---

## Responsabilidades

- Exibir formulário.
- Validar todos os campos.
- Confirmar senha.
- Enviar dados para API.
- Exibir erros.
- Redirecionar para Login.

---

## Campos

| Campo | Obrigatório |
|--------|-------------|
| Nome | Sim |
| Email | Sim |
| Senha | Sim |
| Confirmar senha | Sim |

---

## Estados

### Inicial

Formulário vazio.

---

### Carregando

Botão:

```text
Criando conta...
```

---

### Erros de validação

- Nome curto.
- Email inválido.
- Senha curta.
- Senhas diferentes.

---

### Erros da API

Exemplo:

```text
Email já está em uso
```

---

### Sucesso

Após cadastro:

```text
/login
```

com mensagem de sucesso.

---

## Fluxo

```text
Usuário

↓

Formulário

↓

React Hook Form

↓

Zod

↓

POST /auth/register

↓

Conta criada

↓

Login
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

Caso não exista uma sessão válida:

```text
/login
```

---

## Objetivos

Servir como página principal do usuário autenticado.

Inicialmente funciona como ponto de entrada para os futuros módulos do sistema.

---

## Responsabilidades

- Exibir boas-vindas.
- Exibir nome do usuário.
- Permitir logout.
- Servir como base para Workspaces.

---

## Informações exibidas

Atualmente:

- Nome da aplicação.
- Nome do usuário autenticado.
- Botão de logout.

---

## Próximas funcionalidades

Nesta página serão adicionados:

- Lista de Workspaces.
- Botão para criar Workspace.
- Convites pendentes.
- Atividades recentes.
- Dashboard inicial.

---

# Página de Carregamento

A autenticação possui um estado intermediário durante a recuperação da sessão.

Enquanto o frontend verifica:

```http
GET /auth/me
```

é exibida a tela:

```text
Carregando sessão...
```

Essa página evita que o usuário visualize rapidamente telas incorretas durante a restauração da autenticação.

---

# Páginas Planejadas

## WorkspacePage

```text
/workspaces/:id
```

Responsabilidades:

- Exibir informações do Workspace.
- Gerenciar membros.
- Gerenciar convites.
- Configurações.

---

## BoardPage

```text
/boards/:id
```

Responsabilidades:

- Exibir Lists.
- Exibir Cards.
- Drag and Drop.
- Atualização em tempo real.

---

## ProfilePage

```text
/profile
```

Responsabilidades:

- Dados do usuário.
- Avatar.
- Alteração de senha.

---

## NotificationPage

```text
/notifications
```

Responsabilidades:

- Listar notificações.
- Marcar notificações como lidas.

---

## NotFoundPage

```text
*
```

Responsabilidades:

- Página 404.
- Link para Dashboard.

---

# Estado Atual

## Implementado

- LoginPage.
- RegisterPage.
- DashboardPage.
- Tela de carregamento da sessão.

## Planejado

- WorkspacePage.
- BoardPage.
- NotificationPage.
- ProfilePage.
- NotFoundPage.
- Dashboard completo.