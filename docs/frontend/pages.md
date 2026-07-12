# Páginas do Frontend

## Visão Geral

Este documento descreve todas as páginas implementadas e planejadas do frontend do Clone do Trello.

As páginas possuem apenas responsabilidades relacionadas à interface do usuário. Toda regra de negócio permanece centralizada em Contexts, Hooks e Services.

---

# Organização

As páginas estão organizadas por domínio.

```
src/

├── features/
│
│   └── auth/
│       └── pages/
│           ├── LoginPage.tsx
│           └── RegisterPage.tsx
│
└── pages/
    └── DashboardPage.tsx
```

Conforme novas funcionalidades forem implementadas, novas páginas serão adicionadas às respectivas features.

---

# LoginPage

## Arquivo

```
src/features/auth/pages/LoginPage.tsx
```

## Rota

```
/login
```

## Acesso

Público.

Caso o usuário já esteja autenticado:

```
/dashboard
```

---

## Objetivos

Permitir autenticação utilizando email e senha.

---

## Responsabilidades

- Exibir formulário.
- Validar email.
- Validar senha.
- Executar login.
- Atualizar AuthContext.
- Exibir erros.
- Redirecionar para Dashboard.

---

## Campos

| Campo | Obrigatório |
|--------|-------------|
| Email | Sim |
| Senha | Sim |

---

## Estados

### Inicial

Campos vazios.

---

### Carregando

```
Entrando...
```

---

### Erro

Mensagens retornadas pelo backend.

Exemplo:

```
Email ou senha inválidos
```

---

### Cadastro concluído

```
Conta criada com sucesso. Agora você pode entrar.
```

---

## Fluxo

```
Usuário

↓

Formulário

↓

React Hook Form

↓

Zod

↓

signIn()

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

# RegisterPage

## Arquivo

```
src/features/auth/pages/RegisterPage.tsx
```

## Rota

```
/register
```

## Acesso

Público.

Usuários autenticados são redirecionados para:

```
/dashboard
```

---

## Objetivos

Permitir criação de novos usuários.

---

## Responsabilidades

- Exibir formulário.
- Validar dados.
- Confirmar senha.
- Executar cadastro.
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

```
Criando conta...
```

---

### Erros

- Nome inválido.
- Email inválido.
- Senha curta.
- Senhas diferentes.
- Email já cadastrado.

---

### Sucesso

Após cadastro:

```
/login
```

com mensagem de confirmação.

---

## Fluxo

```
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

Login
```

---

# DashboardPage

## Arquivo

```
src/pages/DashboardPage.tsx
```

## Rota

```
/dashboard
```

## Acesso

Somente usuários autenticados.

Caso não exista sessão válida:

```
/login
```

---

## Objetivos

Servir como página inicial do usuário autenticado.

Nesta etapa do projeto, o Dashboard também funciona como ponto de entrada para os Workspaces.

---

## Responsabilidades

- Exibir informações do usuário autenticado.
- Permitir logout.
- Listar Workspaces.
- Exibir estados de carregamento.
- Exibir estado vazio.
- Exibir erros da API.

---

## Dados Exibidos

Para cada Workspace são apresentados:

- Nome.
- Descrição.
- Quantidade de membros.

Também existe o botão:

```
Abrir
```

A navegação para a página do Workspace já está preparada, porém a rota será implementada em uma próxima milestone.

---

## Estados

### Recuperação da sessão

Enquanto o AuthProvider valida a sessão:

```
Carregando sessão...
```

---

### Carregando Workspaces

Após a autenticação:

```
Carregando Workspaces...
```

---

### Lista carregada

Exibição em formato de cards.

Cada card contém:

- Nome.
- Descrição.
- Quantidade de membros.
- Botão "Abrir".

---

### Lista vazia

Caso o usuário não participe de nenhum Workspace:

```
Nenhum Workspace encontrado

Você ainda não participa de nenhum Workspace.
```

---

### Erro

Caso a API não possa ser acessada:

```
Não foi possível carregar os Workspaces.
```

---

## Fluxo

```
Dashboard

↓

AuthContext

↓

listWorkspaces()

↓

GET /workspaces

↓

Resposta

↓

Renderização dos cards
```

---

# Página de Carregamento

Enquanto a aplicação executa:

```
GET /auth/me
```

é exibida:

```
Carregando sessão...
```

Essa tela impede que rotas protegidas sejam exibidas antes da validação do token.

---

# Páginas Planejadas

## WorkspacePage

```
/workspaces/:id
```

Responsabilidades:

- Informações do Workspace.
- Boards.
- Configurações.
- Membros.
- Convites.

---

## BoardPage

```
/boards/:id
```

Responsabilidades:

- Lists.
- Cards.
- Drag and Drop.
- Atualizações em tempo real.

---

## ProfilePage

```
/profile
```

Responsabilidades:

- Perfil.
- Avatar.
- Alteração de senha.

---

## NotificationPage

```
/notifications
```

Responsabilidades:

- Notificações.
- Marcar como lida.

---

## NotFoundPage

```
*
```

Responsabilidades:

- Página 404.
- Navegação para Dashboard.

---

# Estado Atual

## Implementado

- LoginPage.
- RegisterPage.
- DashboardPage.
- Recuperação automática da sessão.
- Listagem de Workspaces.
- Estados de carregamento.
- Estado vazio.
- Tratamento de erros.

## Planejado

- WorkspacePage.
- BoardPage.
- NotificationPage.
- ProfilePage.
- NotFoundPage.