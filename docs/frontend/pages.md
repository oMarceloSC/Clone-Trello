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
│   ├── auth/
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   │
│   └── workspaces/
│       └── pages/
│           └── WorkspacePage.tsx
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

O Dashboard agora é renderizado dentro do `AuthenticatedLayout`, compartilhando a Sidebar e o Header com todas as páginas privadas.

Nesta etapa do projeto, ele também funciona como ponto de entrada para os Workspaces.

---

## Responsabilidades

- Exibir informações do usuário autenticado.
- Permitir logout.
- Listar Workspaces.
- Criar novos Workspaces.
- Validar formulário de criação.
- Atualizar a lista sem recarregar a página.
- Navegar para a página de detalhes do Workspace.
- Exibir estados de carregamento.
- Exibir estado vazio.
- Exibir erros da API.
- Ser renderizado dentro do AuthenticatedLayout.

---

## Dados Exibidos

Para cada Workspace são apresentados:

- Nome.
- Descrição.
- Quantidade de membros.

Também existe o botão:

Abrir

Ao clicar no botão, o usuário é redirecionado para a página de detalhes do Workspace.

Essa página apresenta informações gerais do Workspace, estatísticas básicas e prepara a navegação para os Boards que serão implementados nas próximas milestones.

Também existe o botão:

```
Criar Workspace
```

que abre um modal para criação de novos Workspaces.
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

### Modal de criação

Ao clicar em:

```
Criar Workspace
```

é exibido um modal contendo:

- Nome.
- Descrição.
- Botão Cancelar.
- Botão Criar Workspace.

O formulário utiliza React Hook Form e validação com Zod.

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

### Criação concluída

Após a criação com sucesso:

- O modal é fechado automaticamente.
- O novo Workspace é adicionado ao início da lista.
- Não é necessário recarregar a página.

---

## Fluxo

AuthenticatedLayout

↓

Dashboard

↓

GET /workspaces

↓

Renderização da lista

↓

Usuário cria Workspace
          │
          ▼
POST /workspaces
          │
          ▼
Workspace criado
          │
          ▼
Atualização automática da lista

ou

Usuário abre Workspace
          │
          ▼
GET /workspaces/:id
          │
          ▼
WorkspacePage

---

# WorkspacePage

## Arquivo

```
src/features/workspaces/pages/WorkspacePage.tsx
```

## Rota

```
/workspaces/:id
```

## Acesso

Somente usuários autenticados.

O usuário também deve ser membro do Workspace solicitado.

---

## Objetivos

Exibir e permitir o gerenciamento básico de um Workspace.

Além da visualização das informações gerais, a página permite que usuários com permissão de `OWNER` ou `ADMIN` atualizem o nome e a descrição do Workspace.

Esta página continuará sendo o ponto de entrada para todas as funcionalidades futuras relacionadas ao Workspace.

---

## Responsabilidades

- Buscar o Workspace pelo ID.
- Exibir informações gerais.
- Exibir a quantidade de membros.
- Exibir a permissão do usuário autenticado.
- Exibir a data de criação.
- Exibir estados de carregamento.
- Exibir mensagens de erro.
- Permitir edição do Workspace.
- Validar formulário de edição.
- Atualizar a interface sem recarregar a página.
- Controlar permissões de edição.
- Permitir nova tentativa.
- Preparar a área destinada aos Boards.

---

## Dados Exibidos

- Nome.
- Descrição.
- Quantidade de membros.
- Permissão atual.
- Data de criação.

Também apresenta:

- Botão "Editar Workspace" (OWNER e ADMIN).
- Modal de edição.

Também apresenta:

- Breadcrumb.
- Botão "Voltar".
- Área reservada para os Boards.

---

## Estados

### Carregando

```
Carregando Workspace...
```

---

### Workspace encontrado

Também é disponibilizada a edição do Workspace para usuários autorizados.

São exibidos:

- Informações gerais.
- Cards de resumo.
- Área de Boards.

---

### Atualização do Workspace

Ao clicar em:

```
Editar Workspace
```

é exibido um modal contendo:

- Nome.
- Descrição.
- Botão Cancelar.
- Botão Salvar alterações.

O formulário utiliza React Hook Form e validação com Zod.

Após a atualização com sucesso:

- O modal é fechado automaticamente.
- Os dados da página são atualizados sem recarregar.
- O Breadcrumb também reflete o novo nome do Workspace.

---

### Workspace não encontrado

Caso o backend retorne erro:

```
Não foi possível abrir o Workspace.
```

São exibidos:

- Botão "Voltar ao Dashboard".
- Botão "Tentar novamente".

---

## Fluxo

```
Dashboard

↓

Abrir

↓

GET /workspaces/:id

↓

WorkspacePage

↓

Editar Workspace

↓

PATCH /workspaces/:id

↓

Atualização automática da interface
```

---

## Próximas Evoluções

Esta página será expandida para suportar:

- Exclusão do Workspace.
- Boards.
- Convites.
- Gerenciamento de membros.
- Configurações.

---

# AuthenticatedLayout

## Arquivo

```
src/layouts/AuthenticatedLayout.tsx
```

## Utilização

Todas as páginas autenticadas são renderizadas dentro deste layout.

Atualmente:

```
DashboardPage
```

No futuro:

```
WorkspacePage

BoardPage

NotificationPage

ProfilePage
```

---

## Responsabilidades

- Renderizar a Sidebar.
- Renderizar o Header.
- Exibir informações do usuário autenticado.
- Permitir logout.
- Centralizar a navegação da aplicação.
- Renderizar as páginas através do `Outlet`.

---

## Sidebar

Atualmente apresenta:

- Dashboard.
- Boards (placeholder).
- Notificações (placeholder).
- Nome do usuário.
- Email do usuário.
- Avatar simplificado.

---

## Header

Atualmente apresenta:

- Área autenticada.
- Saudação ao usuário.
- Botão Logout.

No futuro também conterá:

- Pesquisa.
- Notificações.
- Perfil.
- Configurações.

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
- AuthenticatedLayout.
- Sidebar compartilhada.
- Header compartilhado.
- Recuperação automática da sessão.
- Listagem de Workspaces.
- Criação de Workspaces.
- Modal de criação.
- Validação com React Hook Form.
- Validação com Zod.
- Atualização automática da lista.
- Estados de carregamento.
- Estado vazio.
- Tratamento de erros.
- WorkspacePage.
- Visualização de Workspace.
- Breadcrumb.
- Cards de resumo do Workspace.
- Área inicial para Boards.
- Atualização de Workspace.
- Modal de edição.
- Atualização automática da interface após edição.
- Controle de edição baseado em permissões (OWNER e ADMIN).

## Planejado

- BoardPage.
- NotificationPage.
- ProfilePage.
- NotFoundPage.