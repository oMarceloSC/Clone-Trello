# Páginas do Frontend

## Visão Geral

Este documento descreve todas as páginas implementadas e planejadas do frontend do Clone do Trello.

As páginas possuem apenas responsabilidades relacionadas à interface do usuário. Toda comunicação com a API é realizada por meio de Services, enquanto estados globais permanecem centralizados em Contexts e Hooks.

---

# Organização

As páginas estão organizadas por domínio.

```text
src/

├── features/
│
│   ├── auth/
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   │
│   └── workspaces/
│       ├── components/
│       │   └── WorkspaceMembersSection.tsx
│       │
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

```text
src/features/auth/pages/LoginPage.tsx
```

## Rota

```text
/login
```

## Acesso

Público.

Caso o usuário já esteja autenticado, será redirecionado para:

```text
/dashboard
```

---

## Objetivos

Permitir autenticação utilizando email e senha.

---

## Responsabilidades

- Exibir o formulário de autenticação.
- Validar email.
- Validar senha.
- Executar login.
- Atualizar o AuthContext.
- Exibir mensagens de erro.
- Redirecionar para o Dashboard após autenticação.

---

## Campos

| Campo | Obrigatório |
|---|---|
| Email | Sim |
| Senha | Sim |

---

## Estados

### Inicial

Os campos são exibidos vazios e disponíveis para preenchimento.

---

### Carregando

Durante a requisição:

```text
Entrando...
```

O botão de envio permanece desabilitado.

---

### Erro

São exibidas as mensagens retornadas pelo backend ou uma mensagem padrão.

Exemplo:

```text
Email ou senha inválidos
```

---

### Cadastro concluído

Quando o usuário chega à página após concluir o cadastro, é apresentada a mensagem:

```text
Conta criada com sucesso. Agora você pode entrar.
```

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

```text
src/features/auth/pages/RegisterPage.tsx
```

## Rota

```text
/register
```

## Acesso

Público.

Usuários autenticados são redirecionados para:

```text
/dashboard
```

---

## Objetivos

Permitir a criação de novos usuários.

---

## Responsabilidades

- Exibir o formulário.
- Validar os dados.
- Confirmar a senha.
- Executar o cadastro.
- Exibir mensagens de validação.
- Exibir erros retornados pela API.
- Redirecionar para o Login após sucesso.

---

## Campos

| Campo | Obrigatório |
|---|---|
| Nome | Sim |
| Email | Sim |
| Senha | Sim |
| Confirmar senha | Sim |

---

## Estados

### Inicial

O formulário é exibido vazio.

---

### Carregando

Durante a requisição:

```text
Criando conta...
```

O botão de envio permanece desabilitado.

---

### Erros

Podem ser exibidos:

- Nome inválido.
- Email inválido.
- Senha curta.
- Senhas diferentes.
- Email já cadastrado.
- Erro inesperado da API.

---

### Sucesso

Após o cadastro, o usuário é redirecionado para:

```text
/login
```

com uma mensagem de confirmação.

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

Somente usuários autenticados.

Caso não exista uma sessão válida:

```text
/login
```

---

## Objetivos

Servir como página inicial do usuário autenticado.

O Dashboard é renderizado dentro do `AuthenticatedLayout`, compartilhando Sidebar e Header com as demais páginas privadas.

Nesta etapa do projeto, também funciona como ponto de entrada para o gerenciamento dos Workspaces.

---

## Responsabilidades

- Exibir informações do usuário autenticado.
- Permitir logout.
- Listar Workspaces.
- Criar novos Workspaces.
- Validar o formulário de criação.
- Atualizar a lista sem recarregar a página.
- Navegar para a página de detalhes do Workspace.
- Exibir estados de carregamento.
- Exibir estado vazio.
- Exibir erros retornados pela API.
- Ser renderizado dentro do `AuthenticatedLayout`.

---

## Dados Exibidos

Para cada Workspace são apresentados:

- Nome.
- Descrição.
- Quantidade de membros.
- Botão `Abrir`.

Ao clicar em:

```text
Abrir
```

o usuário é redirecionado para:

```text
/workspaces/:id
```

Também existe o botão:

```text
Criar Workspace
```

que abre um modal para criação de novos Workspaces.

---

## Estados

### Recuperação da sessão

Enquanto o `AuthProvider` valida a sessão:

```text
Carregando sessão...
```

---

### Carregando Workspaces

Após a autenticação:

```text
Carregando Workspaces...
```

---

### Lista carregada

Os Workspaces são exibidos em formato de cards.

Cada card contém:

- Nome.
- Descrição.
- Quantidade de membros.
- Botão `Abrir`.

---

### Modal de criação

Ao clicar em:

```text
Criar Workspace
```

é exibido um modal contendo:

- Nome.
- Descrição.
- Botão `Cancelar`.
- Botão `Criar Workspace`.
- Botão de fechamento.

O formulário utiliza React Hook Form e validação com Zod.

---

### Lista vazia

Caso o usuário não participe de nenhum Workspace:

```text
Nenhum Workspace encontrado

Você ainda não participa de nenhum Workspace.
```

Também é apresentada a ação:

```text
Criar primeiro Workspace
```

---

### Erro

Caso a API não possa ser acessada:

```text
Não foi possível carregar os Workspaces.
```

---

### Criação concluída

Após a criação com sucesso:

- O modal é fechado automaticamente.
- O formulário é limpo.
- O novo Workspace é adicionado ao início da lista.
- Não é necessário recarregar a página.

---

## Fluxo

```text
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
```

---

# WorkspacePage

## Arquivo

```text
src/features/workspaces/pages/WorkspacePage.tsx
```

## Rota

```text
/workspaces/:id
```

## Acesso

Somente usuários autenticados.

O usuário também deve ser membro do Workspace solicitado.

A autorização definitiva é validada pelo backend.

---

## Objetivos

Exibir e permitir o gerenciamento básico de um Workspace.

Além da visualização das informações gerais, a página permite:

- Atualizar o Workspace.
- Excluir o Workspace.
- Visualizar os membros.
- Consultar as permissões de cada participante.
- Preparar o espaço para os futuros Boards.

---

## Responsabilidades

- Buscar o Workspace pelo ID.
- Exibir informações gerais.
- Exibir a quantidade de membros.
- Exibir a permissão do usuário autenticado.
- Exibir a data de criação.
- Listar todos os membros do Workspace.
- Exibir nome, email e cargo de cada membro.
- Identificar o usuário autenticado na lista.
- Permitir edição do Workspace.
- Validar o formulário de edição.
- Atualizar a interface sem recarregar a página.
- Controlar permissões de edição.
- Permitir exclusão do Workspace.
- Solicitar confirmação antes da exclusão.
- Controlar a permissão de exclusão.
- Redirecionar para o Dashboard após exclusão.
- Exibir estados de carregamento.
- Exibir mensagens de erro.
- Permitir nova tentativa em caso de falha.
- Preparar a área destinada aos Boards.

---

## Dados Exibidos

A página apresenta:

- Nome.
- Descrição.
- Quantidade de membros.
- Permissão do usuário autenticado.
- Data de criação.
- Breadcrumb.
- Botão `Voltar`.
- Área reservada para Boards.

Também é exibida uma seção de membros contendo:

- Avatar simplificado.
- Nome.
- Email.
- Cargo.
- Identificação `Você` para o usuário autenticado.
- Contador total de membros.

---

## Controle de Permissões

### OWNER

Pode:

- Visualizar o Workspace.
- Atualizar o nome.
- Atualizar a descrição.
- Excluir o Workspace.
- Visualizar membros.

---

### ADMIN

Pode:

- Visualizar o Workspace.
- Atualizar o nome.
- Atualizar a descrição.
- Visualizar membros.

O botão de exclusão não é exibido.

---

### MEMBER

Pode:

- Visualizar o Workspace.
- Visualizar membros.

Os botões de edição e exclusão não são exibidos.

---

### VIEWER

Pode:

- Visualizar o Workspace.
- Visualizar membros.

Os botões de edição e exclusão não são exibidos.

---

# Estados da WorkspacePage

## Carregando

Enquanto a página consulta:

```http
GET /workspaces/:id
```

é exibido:

```text
Carregando Workspace...
```

---

## Workspace encontrado

Quando o Workspace é encontrado, são exibidos:

- Informações gerais.
- Cards de resumo.
- Lista de membros.
- Área destinada aos Boards.

---

## Workspace não encontrado

Caso o backend retorne erro:

```text
Não foi possível abrir o Workspace.
```

São exibidos:

- Botão `Voltar ao Dashboard`.
- Botão `Tentar novamente`.

---

# Atualização do Workspace

Ao clicar em:

```text
Editar Workspace
```

é exibido um modal contendo:

- Nome.
- Descrição.
- Botão `Cancelar`.
- Botão `Salvar alterações`.
- Botão de fechamento.
- Mensagens de erro.
- Mensagem de sucesso.

O formulário utiliza:

- React Hook Form.
- Zod.

---

## Permissões

O botão de edição é exibido apenas para:

```text
OWNER

ADMIN
```

A proteção também é validada pelo backend.

---

## Estado de atualização

Durante a requisição:

```text
Salvando...
```

Os controles permanecem desabilitados.

---

## Atualização concluída

Após o sucesso:

- O nome é atualizado.
- A descrição é atualizada.
- O Breadcrumb reflete o novo nome.
- O modal é fechado automaticamente.
- A lista de membros carregada é preservada.
- Não é necessário recarregar a página.

---

## Erro de atualização

Caso a API não forneça uma mensagem específica:

```text
Não foi possível atualizar o Workspace.
```

O modal permanece aberto para permitir uma nova tentativa.

---

# Exclusão do Workspace

Ao clicar em:

```text
Excluir Workspace
```

é exibido um modal de confirmação.

O modal informa:

- Nome do Workspace.
- Que a ação não poderá ser desfeita.
- Que os dados vinculados serão removidos permanentemente.

---

## Permissões

O botão de exclusão é exibido somente para:

```text
OWNER
```

A proteção definitiva também é realizada pelo backend.

---

## Estado de exclusão

Durante a requisição:

```text
Excluindo...
```

Os controles do modal permanecem desabilitados.

---

## Exclusão concluída

Após o sucesso:

- A mensagem retornada pela API é exibida.
- O usuário é redirecionado para `/dashboard`.
- O Workspace deixa de aparecer na listagem.

---

## Erro de exclusão

Caso a API não forneça uma mensagem específica:

```text
Não foi possível excluir o Workspace.
```

O modal permanece aberto.

---

# Listagem de Membros

A seção de membros é implementada por:

```text
src/features/workspaces/components/WorkspaceMembersSection.tsx
```

Ela é renderizada dentro da `WorkspacePage`.

---

## Objetivos

Exibir todos os usuários que participam do Workspace.

---

## Dados Exibidos

Para cada membro são apresentados:

- Avatar simplificado.
- Nome.
- Email.
- Cargo.
- Identificação do usuário autenticado.

---

## Cargos

Os cargos são apresentados com nomes amigáveis:

| Role | Exibição |
|---|---|
| OWNER | Proprietário |
| ADMIN | Administrador |
| MEMBER | Membro |
| VIEWER | Visualizador |

---

## Estado de carregamento

Enquanto a aplicação consulta:

```http
GET /workspaces/:id/members
```

é exibido:

```text
Carregando membros...
```

---

## Estado de sucesso

Quando existem participantes:

- Cada membro é exibido em um card.
- O contador apresenta a quantidade total.
- O usuário autenticado recebe o badge `Você`.
- Cada cargo possui um badge visual próprio.

---

## Estado vazio

Caso a API retorne uma lista vazia:

```text
Nenhum membro encontrado

Este Workspace ainda não possui membros cadastrados.
```

---

## Estado de erro

Caso a listagem falhe:

```text
Não foi possível carregar os membros
```

Também é exibido o botão:

```text
Tentar novamente
```

---

## Fluxo

```text
WorkspacePage

↓

WorkspaceMembersSection

↓

listWorkspaceMembers()

↓

GET /workspaces/:id/members

↓

WorkspaceMember[]

↓

Renderização da lista
```

---

# Fluxo Completo da WorkspacePage

```text
Dashboard

↓

Abrir

↓

GET /workspaces/:id

↓

WorkspacePage

├── Informações gerais
├── Cards de resumo
├── GET /workspaces/:id/members
├── Lista de membros
└── Área de Boards
```

Fluxo de atualização:

```text
WorkspacePage

↓

Editar Workspace

↓

PATCH /workspaces/:id

↓

Interface atualizada
```

Fluxo de exclusão:

```text
WorkspacePage

↓

Excluir Workspace

↓

Confirmação

↓

DELETE /workspaces/:id

↓

Dashboard
```

---

## Próximas Evoluções

A página será expandida para suportar:

- Alteração de permissões dos membros.
- Remoção de membros.
- Criação de convites.
- Gerenciamento de convites.
- Aceitação de convites.
- Listagem de Boards.
- Criação de Boards.
- Configurações avançadas.

---

# AuthenticatedLayout

## Arquivo

```text
src/layouts/AuthenticatedLayout.tsx
```

## Utilização

Todas as páginas autenticadas são renderizadas dentro deste layout.

Atualmente:

```text
DashboardPage

WorkspacePage
```

No futuro:

```text
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
- Boards como placeholder.
- Notificações como placeholder.
- Nome do usuário.
- Email do usuário.
- Avatar simplificado.

---

## Header

Atualmente apresenta:

- Identificação da área autenticada.
- Saudação ao usuário.
- Botão de logout.

No futuro também conterá:

- Pesquisa.
- Notificações.
- Perfil.
- Configurações.

---

# Página de Carregamento

Enquanto a aplicação executa:

```http
GET /auth/me
```

é exibido:

```text
Carregando sessão...
```

Essa tela impede que rotas protegidas sejam exibidas antes da validação do token.

---

# Páginas Planejadas

## BoardPage

```text
/boards/:id
```

Responsabilidades planejadas:

- Lists.
- Cards.
- Drag and Drop.
- Atualizações em tempo real.

---

## ProfilePage

```text
/profile
```

Responsabilidades planejadas:

- Perfil.
- Avatar.
- Alteração de senha.

---

## NotificationPage

```text
/notifications
```

Responsabilidades planejadas:

- Exibir notificações.
- Marcar notificações como lidas.

---

## NotFoundPage

```text
*
```

Responsabilidades planejadas:

- Exibir página 404.
- Permitir navegação de volta ao Dashboard.

---

# Estado Atual

## Implementado

- LoginPage.
- RegisterPage.
- DashboardPage.
- WorkspacePage.
- AuthenticatedLayout.
- Sidebar compartilhada.
- Header compartilhado.
- Recuperação automática da sessão.
- Listagem de Workspaces.
- Criação de Workspaces.
- Visualização de Workspace.
- Atualização de Workspace.
- Exclusão de Workspace.
- Modal de criação.
- Modal de edição.
- Modal de confirmação de exclusão.
- Validação com React Hook Form.
- Validação com Zod.
- Atualização automática da interface.
- Controle visual de permissões.
- Breadcrumb.
- Cards de resumo do Workspace.
- Área inicial para Boards.
- Listagem de membros.
- Contador de membros.
- Exibição das permissões dos membros.
- Identificação do usuário autenticado.
- Estados de carregamento.
- Estados vazios.
- Tratamento de erros.
- Nova tentativa após falhas.

## Planejado

- Alteração de permissões.
- Remoção de membros.
- Criação de convites.
- Aceitação de convites.
- BoardPage.
- NotificationPage.
- ProfilePage.
- NotFoundPage.