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
│   │       ├── RegisterPage.tsx
│   │       ├── ForgotPasswordPage.tsx
│   │       └── ResetPasswordPage.tsx
│   │
│   ├── workspaces/
│   │   ├── components/
│   │   │   └── WorkspaceMembersSection.tsx
│   │   │
│   │   └── pages/
│   │       ├── WorkspacePage.tsx
│   │       └── AcceptWorkspaceInvitationPage.tsx
│   │
│   └── boards/
│       └── pages/
│           └── BoardPage.tsx
│
└── pages/
    ├── DashboardPage.tsx
    └── NotFoundPage.tsx
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
- Exibir link para recuperação de senha.
- Exibir mensagem de sucesso após redefinição da senha.

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

### Senha redefinida

Quando o usuário conclui a redefinição da senha, é exibida a mensagem:

```text
Senha redefinida com sucesso. Agora você pode entrar.
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

ou

Esqueci minha senha

↓

ForgotPasswordPage
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

# ForgotPasswordPage

## Arquivo

```text
src/features/auth/pages/ForgotPasswordPage.tsx
```

## Rota

```text
/forgot-password
```

## Acesso

Público.

Usuários autenticados são redirecionados automaticamente para:

```text
/dashboard
```

---

## Objetivos

Permitir que um usuário solicite a recuperação da senha.

---

## Responsabilidades

- Exibir formulário de recuperação.
- Validar o email.
- Solicitar recuperação da senha.
- Exibir o link de redefinição durante o desenvolvimento.
- Permitir copiar o link.
- Permitir abrir diretamente a página de redefinição.

---

## Fluxo

```text
Usuário

↓

ForgotPasswordPage

↓

POST /auth/forgot-password

↓

Link de redefinição

↓

ResetPasswordPage
```

---

# ResetPasswordPage

## Arquivo

```text
src/features/auth/pages/ResetPasswordPage.tsx
```

## Rota

```text
/reset-password
```

## Acesso

Público.

Usuários autenticados são redirecionados automaticamente para:

```text
/dashboard
```

---

## Objetivos

Permitir que o usuário informe uma nova senha utilizando um token válido.

---

## Responsabilidades

- Ler o token presente na URL.
- Validar a nova senha.
- Confirmar a senha.
- Executar a redefinição.
- Exibir mensagens de erro.
- Redirecionar para o Login após sucesso.

---

## Fluxo

```text
Usuário

↓

ResetPasswordPage

↓

POST /auth/reset-password

↓

Senha redefinida

↓

LoginPage
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
- Listar convites pendentes do usuário autenticado.
- Permitir aceitar convites diretamente pelo Dashboard.
- Atualizar automaticamente os Workspaces após aceitar um convite.
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

Além dos Workspaces, o Dashboard também apresenta uma seção de convites pendentes.

Para cada convite são exibidos:

- Nome do Workspace.
- Descrição.
- Nome do usuário que enviou o convite.
- Data de expiração.
- Botão `Aceitar convite`.

Ao aceitar um convite:

- O convite é removido automaticamente da lista.
- O Workspace passa a aparecer imediatamente na lista de Workspaces.
- Não é necessário recarregar a página.

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

### Carregando Convites

Enquanto a aplicação consulta:

```text
GET /workspace-invitations/pending
```

é exibido:

```text
Carregando convites...
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

### Convites carregados

Quando existem convites pendentes, cada convite é exibido em um card contendo:

- Workspace.
- Descrição.
- Usuário que enviou o convite.
- Data de expiração.
- Botão `Aceitar convite`.

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

### Nenhum convite pendente

Caso não existam convites:

```text
Nenhum convite pendente

Quando alguém convidar você para um Workspace, o convite aparecerá aqui.
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

### Convite aceito

Após aceitar um convite:

- O convite desaparece da lista.
- O Workspace é adicionado automaticamente à listagem.
- A interface é atualizada sem recarregar a página.

---

## Fluxo

```text
AuthenticatedLayout

↓

Dashboard

├── GET /workspace-invitations/pending
│
├── Renderização dos convites
│
├── Aceitar convite
│        │
│        ▼
│ POST /workspace-invitations/:token/accept
│        │
│        ▼
│ Atualização automática dos Workspaces
│
└── GET /workspaces
         │
         ▼
Renderização da lista

ou

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

# NotFoundPage

## Arquivo

```text
src/pages/NotFoundPage.tsx
```

## Rota

```text
*
```

## Acesso

Público.

A página pode ser acessada tanto por visitantes quanto por usuários autenticados.

---

## Objetivos

Informar que a rota solicitada não existe e oferecer uma forma simples de continuar navegando na aplicação.

---

## Responsabilidades

- Exibir uma página de erro 404 personalizada.
- Informar que a rota não foi encontrada.
- Permitir retornar para a página anterior.
- Redirecionar usuários autenticados para o Dashboard.
- Redirecionar visitantes para a tela de Login.

---

## Estados

### Página encontrada

A página não é exibida.

---

### Página inexistente

São apresentados:

- Código 404.
- Mensagem explicativa.
- Botão `Voltar`.
- Botão `Ir para o Dashboard` ou `Ir para o Login`, dependendo da autenticação.

---

## Fluxo

```text
Usuário

↓

Rota inexistente

↓

NotFoundPage

├── Voltar
└── Dashboard/Login
```

---

# AcceptWorkspaceInvitationPage

## Arquivo

```text
src/features/workspaces/pages/AcceptWorkspaceInvitationPage.tsx
```

## Rota

```text
/workspace-invitations/:token/accept
```

## Acesso

Somente usuários autenticados.

## Objetivos

Permitir a aceitação de um convite utilizando o token presente na URL.

Essa página continua disponível para compatibilidade e para acesso direto por links de convite.

## Responsabilidades

- Ler o token da URL.
- Executar a aceitação do convite.
- Exibir estados de carregamento.
- Exibir mensagens de erro.
- Redirecionar o usuário após sucesso.

## Fluxo

```text
Usuário

↓

Link do convite

↓

AcceptWorkspaceInvitationPage

↓

POST /workspace-invitations/:token/accept

↓

Dashboard
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
- Listar Boards do Workspace.
- Criar novos Boards.
- Exibir estados de carregamento e estado vazio dos Boards.
- Criar convites para novos membros.
- Compartilhar links de convite.
- Navegar para um board especifico

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
- Listar os Boards do Workspace.
- Criar novos Boards.
- Atualizar automaticamente a lista após a criação.
- Exibir estado vazio quando não existirem Boards.
- Exibir estado de carregamento durante a consulta dos Boards.
- Criar convites para novos membros.
- Gerar links de convite.
- Copiar automaticamente o link do convite.
- Permitir abrir um board.

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
- Área de Boards.
- Cards dos Boards.
- Cor de fundo do Board.
- Imagem de capa (quando existir).
- Cargo do usuário no Board.
- Indicador de favorito.
- Botão "Abrir".

Ao clicar em "Abrir", o usúario é redirecionado para:
```text
/boards/:id
```

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

# Remoção de Membros

O botão `Remover` é exibido somente quando:

- O usuário autenticado possui o cargo `OWNER`.
- O membro selecionado não possui o cargo `OWNER`.
- O membro selecionado não é o próprio usuário autenticado.

Ao clicar no botão, é exibido um modal de confirmação com os botões `Cancelar` e `Remover`.

Durante a requisição, os controles do modal permanecem desabilitados e o botão apresenta:

```text
Removendo...
```

Após o sucesso:

- O modal é fechado.
- O membro é removido da lista sem recarregar a página.
- O contador da seção e o card de resumo são atualizados automaticamente.
- A mensagem retornada pela API é exibida.

Em caso de erro, o modal permanece aberto e apresenta a mensagem retornada pela API.

## Fluxo

```text
WorkspaceMembersSection

↓

Modal de confirmação

↓

DELETE /workspaces/:workspaceId/members/:memberId

↓

Lista e contadores atualizados
```

---

# Boards

A `WorkspacePage` também é responsável pelo gerenciamento inicial dos Boards pertencentes ao Workspace.

## Objetivos

- Listar Boards.
- Criar novos Boards.
- Exibir estados de carregamento.
- Exibir estado vazio.
- Atualizar automaticamente a interface após a criação.

---

## Dados Exibidos

Cada Board apresenta:

- Cor de fundo.
- Imagem de capa (quando configurada).
- Nome.
- Descrição.
- Cargo do usuário.
- Indicador de favorito.
- Botão `Abrir`.

---

## Permissões

Podem criar Boards:

```text
OWNER

ADMIN

MEMBER
```

Usuários `VIEWER` possuem acesso somente para visualização.

---

## Estados

### Carregando

Durante:

```http
GET /workspaces/:workspaceId/boards
```

é exibido:

```text
Carregando Boards...
```

---

### Lista vazia

Caso não existam Boards:

```text
Nenhum Board disponível

Crie o primeiro Board para organizar as tarefas deste Workspace.
```

---

### Criação

Ao clicar em:

```text
Criar Board
```

é exibido um modal contendo:

- Título.
- Descrição.
- Cor de fundo.
- URL da imagem de capa.
- Botão `Cancelar`.
- Botão `Criar Board`.

O formulário utiliza:

- React Hook Form.
- Zod.

---

### Criação concluída

Após sucesso:

- O modal é fechado automaticamente.
- O formulário é limpo.
- O novo Board é adicionado ao início da lista.
- Não é necessário recarregar a página.

---

## Fluxo

```text
WorkspacePage

↓

GET /workspaces/:workspaceId/boards

↓

Lista de Boards

├── Criar Board
│        │
│        ▼
│ POST /workspaces/:workspaceId/boards
│        │
│        ▼
│ Atualização automática
│
└── Abrir Board
         │
         ▼
GET /boards/:id
         │
         ▼
BoardPage
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

↓

Informações gerais

├── Cards de resumo
├── GET /workspaces/:id/members
├── Lista de membros
├── GET /workspaces/:workspaceId/boards
├── Lista de Boards
└── Modal de criação de Board
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
- Cancelamento de convites.
- Reenvio de convites.
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

DashboardPage

WorkspacePage

BoardPage

No futuro:

```text
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

Essa tela é utilizada pelos componentes `RequireAuthentication` e `RequireGuest`, evitando que as páginas sejam renderizadas antes da conclusão da validação da sessão.

Essa tela impede que rotas protegidas sejam exibidas antes da validação do token.

# BoardPage

## Arquivo

```text
src/features/boards/pages/BoardPage.tsx
```

## Rota

```text
/boards/:id
```

## Acesso

Somente usuários autenticados.

O acesso é validado pelo backend de acordo com as regras do Workspace e do Board.

---

## Objetivos

Permitir a visualização, a edição e a exclusão de um Board específico.

Nesta etapa do projeto a página apresenta as informações gerais do Board e prepara a estrutura para a futura implementação das Lists.

---

## Responsabilidades

- Buscar o Board pelo ID.
- Exibir informações gerais.
- Exibir Workspace de origem.
- Exibir membros do Board.
- Exibir o cargo do usuário autenticado.
- Exibir estados de carregamento.
- Exibir estado de erro.
- Permitir nova tentativa.
- Navegar de volta ao Workspace.
- Exibir o botão **Excluir Board** somente ao `OWNER` do Board.
- Solicitar confirmação em modal antes da exclusão.
- Exibir o estado de carregamento durante a exclusão.
- Exibir mensagens de erro e sucesso da exclusão.
- Redirecionar para o Workspace após a exclusão.
- Preparar a área destinada às Lists.

---

## Dados Exibidos

A página apresenta:

- Nome.
- Descrição.
- Workspace.
- Quantidade de membros.
- Cargo do usuário.
- Data de criação.
- Breadcrumb.
- Cor de fundo.
- Imagem de capa.
- Lista de membros.
- Área destinada às Lists.

---

## Estados

### Carregando

Durante:

```http
GET /boards/:id
```

é exibido:

```text
Carregando Board...
```

---

### Board encontrado

São exibidos:

- Informações gerais.
- Cards de resumo.
- Lista de membros.
- Área destinada às Lists.

---

### Board não encontrado

Caso a API retorne erro:

```text
Não foi possível abrir o Board.
```

São exibidos:

- Botão Voltar.
- Botão Tentar novamente.

---

### Exclusão do Board

O botão **Excluir Board** é exibido somente ao usuário com role `OWNER` no próprio Board.

Ao acioná-lo, a página abre um modal de confirmação com aviso de que a ação é permanente. Durante a requisição, os controles do modal são desabilitados e o botão apresenta o texto `Excluindo...`.

A página exibe a mensagem de erro retornada pela API quando a operação falha. Após o sucesso, exibe a mensagem de confirmação e redireciona automaticamente para a `WorkspacePage` do Board.

---

## Fluxo

```text
WorkspacePage

↓

Abrir

↓

GET /boards/:id

↓

BoardPage
```

### Fluxo de exclusão

```text
BoardPage

↓

Botão Excluir Board

↓

Modal de confirmação

↓

DELETE /boards/:id

↓

Mensagem de sucesso

↓

WorkspacePage
```

---

# Páginas Planejadas

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

# Estado Atual

## Implementado

- LoginPage.
- RegisterPage.
- DashboardPage.
- NotFoundPage.
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
- Criação de convites.
- Geração de links de convite.
- Página de aceitação por token.
- Página 404 personalizada.
- Listagem de convites pendentes.
- Aceitação de convites pelo Dashboard.
- Atualização automática da lista de Workspaces após aceitar convite.
- Remoção de membros pelo `OWNER`.
- Modal de confirmação para remoção de membros.
- Atualização automática da lista e dos contadores de membros.
- ForgotPasswordPage.
- ResetPasswordPage.
- Recuperação de senha.
- Redefinição de senha.
- Link para recuperação de senha na LoginPage.
- Mensagem de confirmação após redefinição da senha.
- Listagem de Boards.
- Criação de Boards.
- Modal de criação de Board.
- Atualização automática da lista após criação.
- Estado vazio dos Boards.
- Estado de carregamento dos Boards.
- Exibição de cores de fundo dos Boards.
- Suporte à imagem de capa dos Boards.
- Controle de permissão para criação de Boards.
- BoardPage.
- Navegação entre Workspace e Board.
- Visualização individual de Boards.
- Breadcrumb da BoardPage.
- Cards de resumo do Board.
- Exibição de membros do Board.
- Área inicial destinada às Lists.
- Exclusão de Board pelo `OWNER` do Board.
- Botão Excluir Board.
- Modal de confirmação da exclusão do Board.
- Estado de carregamento durante a exclusão do Board.
- Mensagens de erro e sucesso da exclusão do Board.
- Redirecionamento automático para o Workspace após excluir o Board.

## Planejado

- Alteração de permissões.
- Cancelamento de convites.
- Reenvio de convites.
- Envio de email para recuperação de senha.
- NotificationPage.
- ProfilePage.
