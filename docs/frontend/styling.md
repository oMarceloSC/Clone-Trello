# Estilização do Frontend

## Visão Geral

O frontend do Clone do Trello utiliza atualmente **CSS puro** para estilização da interface.

O objetivo desta abordagem é manter a configuração inicial simples durante a integração entre frontend e backend, permitindo total controle sobre os estilos sem adicionar dependências extras.

Conforme o projeto evoluir, a estrutura de estilos continuará organizada e preparada para uma possível migração para um Design System mais robusto.

---

# Tecnologias

| Tecnologia | Finalidade |
|------------|------------|
| CSS | Estilização da aplicação |
| Vite | Processamento dos arquivos CSS |

---

# Estrutura Atual

```text
src/

├── index.css

└── styles/
```

Atualmente todos os estilos globais encontram-se em:

```text
src/index.css
```

No futuro os estilos serão separados por responsabilidade.

---

# Organização

Os estilos seguem uma organização baseada em responsabilidades.

Atualmente existem estilos para:

- Layout de autenticação.
- Login.
- Cadastro.
- Dashboard.
- AuthenticatedLayout.
- Sidebar.
- Header.
- Cards de Workspace.
- Modal de criação de Workspace.
- Modal de edição de Workspace.
- Modal de confirmação de exclusão.
- Botão de ação destrutiva.
- Aviso visual de exclusão.
- WorkspacePage.
- Breadcrumb.
- Cards de resumo do Workspace.
- Área de Boards.
- Botões.
- Inputs.
- Textareas.
- Formulários.
- Mensagens de erro.
- Mensagens de sucesso.
- Estado vazio.
- Tela de carregamento.

---

# Convenções

As classes possuem nomes descritivos.

Exemplos:

```text
auth-page

auth-card

auth-header

auth-form

form-field

field-error

api-error

success-message

dashboard-page

dashboard-header

dashboard-content

dashboard-section-header

workspace-grid

workspace-card

workspace-card-content

workspace-card-footer

workspace-feedback

workspace-empty-state

primary-button

secondary-button

danger-button

delete-workspace-content

delete-workspace-warning

modal-backdrop

modal-card

modal-header

modal-close-button

modal-actions

workspace-form

loading-page
```

A nomenclatura busca facilitar leitura e manutenção.

---

# Estilos Globais

O arquivo `index.css` também define:

- Reset básico.
- Tipografia.
- Espaçamentos.
- Layout principal.
- Comportamento padrão de botões.
- Comportamento padrão de inputs.
- Comportamento padrão de textareas.
- Cores iniciais da aplicação.

Todos os componentes e páginas reutilizam essas definições.

---

# Layout de Autenticação

Atualmente existe um layout compartilhado entre Login e Cadastro.

Características:

- Card centralizado.
- Formulários padronizados.
- Campos reutilizando as mesmas classes.
- Mensagens de erro.
- Mensagens de sucesso.
- Botões de ação.
- Links de navegação entre Login e Cadastro.

---

# Dashboard

O Dashboard utiliza um layout próprio.

Possui:

- Cabeçalho.
- Informações do usuário.
- Botão de logout.
- Área principal.
- Seção de Workspaces.
- Botão para criação de Workspace.
- Grid responsivo de cards.

---

# WorkspacePage

A WorkspacePage segue o mesmo padrão visual adotado pelo Dashboard, utilizando o `AuthenticatedLayout` como estrutura principal.

A página possui como objetivo apresentar informações gerais do Workspace e servir como ponto de entrada para todas as funcionalidades relacionadas ao ambiente de trabalho.

Atualmente são exibidos:

- Breadcrumb.
- Nome.
- Descrição.
- Data de criação.
- Quantidade de membros.
- Cargo do usuário autenticado.
- Botão de edição (quando permitido).
- Botão de exclusão (quando permitido).
- Área destinada aos Boards.
- Seção de membros do Workspace.

A seção de membros é carregada de forma independente da página principal, permitindo atualização apenas dessa área quando necessário.

Essa estrutura prepara a página para futuras funcionalidades como:

- Boards.
- Convites.
- Configurações.
- Gerenciamento de permissões.

---

# AuthenticatedLayout

Todas as páginas autenticadas compartilham um mesmo layout.

Esse layout é composto por:

- Sidebar.
- Header.
- Área de conteúdo.

Seu objetivo é manter uma navegação consistente em toda a aplicação.

---

## Sidebar

A Sidebar possui uma largura fixa e ocupa toda a altura da janela.

Atualmente contém:

- Logo da aplicação.
- Navegação principal.
- Informações do usuário autenticado.

Os links disponíveis são:

- Dashboard.
- Boards (placeholder).
- Notificações (placeholder).

No rodapé da Sidebar são exibidos:

- Avatar simplificado.
- Nome do usuário.
- Email.

---

## Header

O Header permanece fixo no topo da área principal.

Atualmente apresenta:

- Identificação da área autenticada.
- Saudação ao usuário.
- Botão Logout.

No futuro também exibirá:

- Pesquisa.
- Notificações.
- Perfil.

---

# Cards de Workspace

Os Workspaces são exibidos em formato de cards.

Cada card apresenta:

- Nome.
- Descrição.
- Quantidade de membros.
- Botão `Abrir`.

Os cards são organizados utilizando CSS Grid.

```text
Workspace Grid

┌─────────────┐ ┌─────────────┐
│ Workspace A │ │ Workspace B │
└─────────────┘ └─────────────┘

┌─────────────┐
│ Workspace C │
└─────────────┘
```

A quantidade de colunas se adapta automaticamente ao espaço disponível.

---

# Cards de Resumo do Workspace

As principais informações do Workspace são exibidas através de cards informativos.

Atualmente são apresentados:

- Nome.
- Descrição.
- Quantidade de membros.
- Cargo do usuário autenticado.
- Data de criação.

Esses cards possuem espaçamento consistente, responsividade e seguem o mesmo padrão visual utilizado nas demais páginas autenticadas.

Novos indicadores poderão ser adicionados futuramente, como:

- Quantidade de Boards.
- Cards ativos.
- Atividades recentes.
- Convites pendentes.

---

# Seção de Membros

A WorkspacePage possui uma área dedicada à exibição dos membros do Workspace.

Essa funcionalidade é implementada através do componente:

```text
WorkspaceMembersSection
```

Cada membro é exibido em um card contendo:

- Nome.
- Email.
- Cargo.

Os cargos são apresentados visualmente para facilitar a identificação das permissões.

Atualmente podem ser exibidos:

- OWNER
- ADMIN
- MEMBER
- VIEWER

A listagem possui carregamento independente da WorkspacePage.

Isso permite atualizar apenas a lista de membros sem recarregar toda a página.

Essa seção servirá de base para futuras funcionalidades como:

- Alteração de permissões.
- Remoção de membros.
- Convites.
- Busca de membros.

---

# Modal de Criação de Workspace

A criação de novos Workspaces é realizada através de um modal centralizado.

O modal contém:

- Campo de nome.
- Campo de descrição.
- Botão `Cancelar`.
- Botão `Criar Workspace`.
- Botão de fechamento `×`.
- Mensagens de erro.
- Mensagem de sucesso.

Enquanto o Workspace está sendo criado, o botão principal exibe:

```text
Criando...
```

Durante a requisição:

- O botão de fechar fica desabilitado.
- O botão Cancelar fica desabilitado.
- O botão de criação fica desabilitado.
- O modal não pode ser fechado acidentalmente.

O modal pode ser fechado através de:

- Botão Cancelar.
- Botão `×`.
- Clique fora do modal.

---

# Modal de Edição de Workspace

A atualização de Workspaces utiliza o mesmo padrão visual do modal de criação.

O modal contém:

- Campo de nome.
- Campo de descrição.
- Botão `Cancelar`.
- Botão `Salvar alterações`.
- Botão de fechamento `×`.
- Mensagens de erro.
- Mensagem de sucesso.

Durante a atualização, o botão principal exibe:

```text
Salvando...
```

Os controles permanecem desabilitados até a conclusão da requisição.

---

# Modal de Exclusão de Workspace

A exclusão utiliza um modal de confirmação com destaque visual para a ação destrutiva.

O modal contém:

- Nome do Workspace.
- Aviso de que a ação não pode ser desfeita.
- Informação sobre a remoção permanente dos dados relacionados.
- Botão `Cancelar`.
- Botão `Excluir definitivamente`.
- Botão de fechamento `×`.
- Mensagens de erro e sucesso.

Durante a exclusão, o botão destrutivo exibe:

```text
Excluindo...
```

Enquanto a requisição está em andamento:

- O botão Cancelar fica desabilitado.
- O botão de fechamento fica desabilitado.
- O botão de exclusão fica desabilitado.
- O modal não pode ser fechado acidentalmente.

---

# Formulários

Os formulários utilizam estilos compartilhados.

Atualmente são estilizados:

- Labels.
- Inputs.
- Textareas.
- Mensagens de validação.
- Mensagens da API.
- Botões de envio.
- Estados de carregamento.

Os campos possuem:

- Bordas visíveis.
- Estado de foco.
- Espaçamento interno.
- Tipografia consistente.
- Mensagens associadas ao campo.

---

# Inputs

Os inputs possuem:

- Largura total.
- Bordas arredondadas.
- Espaçamento interno.
- Estado de foco.
- Destaque visual ao receber foco.
- Herança da tipografia global.

---

# Textareas

As textareas seguem o mesmo padrão visual dos inputs.

Características:

- Largura total.
- Redimensionamento vertical.
- Estado de foco.
- Bordas arredondadas.
- Espaçamento interno.
- Integração com mensagens de erro.

Atualmente são utilizadas no formulário de criação de Workspace.

---

# Estados Visuais

O Dashboard possui diferentes estados visuais relacionados à listagem e criação de Workspaces.

---

## Carregamento da Sessão

Durante a recuperação da autenticação:

```text
Carregando sessão...
```

Esse estado impede que rotas incorretas sejam exibidas antes da validação do token.

---

## Carregamento dos Workspaces

Enquanto a listagem é carregada:

```text
Carregando Workspaces...
```

---

## Lista Vazia

Quando o usuário não participa de nenhum Workspace:

```text
Nenhum Workspace encontrado

Crie seu primeiro Workspace para começar.
```

Nesse estado também é exibido o botão:

```text
Criar primeiro Workspace
```

---

## Lista Carregada

Quando existem Workspaces, eles são exibidos em cards dentro de um grid responsivo.

---

## Erro de Listagem

Caso a API não possa carregar os Workspaces:

```text
Não foi possível carregar os Workspaces.
```

A mensagem é exibida utilizando o estilo de erro da aplicação.

---

# Estados de Criação

Durante a criação de um Workspace existem três estados principais.

## Criando

```text
Criando...
```

Os controles ficam temporariamente desabilitados.

---

## Sucesso

A mensagem retornada pela API é exibida.

Exemplo:

```text
Workspace criado com sucesso
```

Após alguns instantes:

- O modal é fechado.
- O formulário é limpo.
- A mensagem de sucesso é removida.
- O novo Workspace aparece automaticamente no início da lista.

---

## Erro

Caso a API retorne algum problema, a mensagem é exibida dentro do modal sem fechá-lo.

Exemplo:

```text
Não foi possível criar o Workspace.
```

---

# Estados de Atualização

A atualização do Workspace possui três estados.

## Salvando

```text
Salvando...
```

Os controles ficam temporariamente desabilitados.

## Sucesso

A mensagem retornada pela API é exibida.

Após alguns instantes:

- O modal é fechado.
- O nome e a descrição são atualizados.
- O Breadcrumb reflete o novo nome.
- A página permanece aberta.

## Erro

Caso a API retorne um problema, a mensagem é exibida dentro do modal sem fechá-lo.

---

# Estados de Exclusão

A exclusão do Workspace possui três estados.

## Confirmação

Antes da exclusão, é exibido um aviso visual contendo o nome do Workspace e a irreversibilidade da ação.

## Excluindo

```text
Excluindo...
```

Os controles ficam temporariamente desabilitados.

## Sucesso

A mensagem retornada pela API é exibida.

Após alguns instantes:

- O usuário é redirecionado ao Dashboard.
- O Workspace deixa de aparecer na listagem.

## Erro

Caso a exclusão falhe, a mensagem é exibida dentro do modal e o usuário permanece na WorkspacePage.

---

# Estados da WorkspacePage

A WorkspacePage possui estados independentes para cada área da interface.

## Carregando Workspace

Enquanto o Workspace é carregado:

```text
Carregando Workspace...
```

---

## Workspace carregado

São exibidos:

- Cards de resumo.
- Botões de ação.
- Área de Boards.
- Lista de membros.

---

## Workspace não encontrado

Caso ocorra algum erro:

```text
Não foi possível abrir o Workspace.
```

São apresentados:

- Botão para voltar ao Dashboard.
- Botão para tentar novamente.

---

## Atualização

Durante a edição do Workspace:

```text
Atualizando Workspace...
```

Após sucesso:

```text
Workspace atualizado com sucesso.
```

---

## Exclusão

Antes da exclusão é exibido um modal de confirmação.

Durante a operação:

```text
Excluindo Workspace...
```

Após sucesso:

- O usuário é redirecionado para o Dashboard.
- A lista de Workspaces é atualizada automaticamente.

---

# Botões

Atualmente existem quatro estilos principais de botões.

---

## Botão Padrão

Utilizado principalmente em Login, Cadastro e Logout.

Características:

- Fundo azul.
- Texto branco.
- Peso de fonte elevado.
- Bordas arredondadas.

---

## Primary Button

Classe:

```text
primary-button
```

Utilizado para ações principais.

Exemplos:

```text
Criar Workspace

Criar primeiro Workspace
```

Características:

- Fundo azul.
- Texto branco.
- Destaque visual.
- Estado desabilitado.

---

## Secondary Button

Classe:

```text
secondary-button
```

Utilizado para ações secundárias.

Exemplo:

```text
Cancelar
```

Características:

- Fundo branco.
- Borda visível.
- Texto escuro.
- Estado de hover.
- Estado desabilitado.

---

## Danger Button

Classe:

```text
danger-button
```

Utilizado em ações destrutivas.

Exemplos:

```text
Excluir Workspace

Excluir definitivamente
```

Características:

- Fundo vermelho.
- Texto branco.
- Destaque visual de risco.
- Estado de hover.
- Estado desabilitado.
- Uso restrito a ações irreversíveis.

---

## Botão de Fechamento do Modal

Classe:

```text
modal-close-button
```

Responsável pelo fechamento do modal.

Características:

- Fundo transparente.
- Ícone `×`.
- Estado de hover.
- Estado desabilitado durante a criação.

---

# Mensagens

A interface possui estilos específicos para feedback ao usuário.

---

## Mensagem de Erro de Campo

Classe:

```text
field-error
```

Utilizada para erros do Zod associados a campos específicos.

---

## Mensagem de Erro da API

Classe:

```text
api-error
```

Utilizada para erros retornados pelo backend ou falhas inesperadas.

---

## Mensagem de Sucesso

Classe:

```text
success-message
```

Utilizada após ações concluídas com sucesso.

Exemplos:

- Cadastro concluído.
- Workspace criado.
- Workspace atualizado.
- Workspace excluído.

---

# Responsividade

Toda a interface segue abordagem Mobile First.

Atualmente são responsivos:

- Login.
- Cadastro.
- Dashboard.
- WorkspacePage.
- Sidebar.
- Header.
- Modal de criação.
- Modal de edição.
- Modal de exclusão.
- Lista de membros.

Em telas menores:

- Os cards passam a ocupar toda a largura disponível.
- A lista de membros é reorganizada em coluna única.
- Os modais ajustam automaticamente seu tamanho.
- Os botões permanecem acessíveis em dispositivos móveis.

---

# Acessibilidade

Os estilos e componentes atuais seguem práticas iniciais de acessibilidade.

Entre elas:

- Labels associadas aos inputs.
- Estados visuais de erro.
- Estados visuais de foco.
- Contraste entre texto e fundo.
- Estrutura semântica.
- Uso de `role="alert"`.
- Uso de `role="status"`.
- Uso de `role="dialog"`.
- Uso de `role="alertdialog"` para confirmação de exclusão.
- Uso de `aria-describedby` no aviso de exclusão.
- Uso de `aria-modal`.
- Uso de `aria-labelledby`.
- Botão de fechamento com `aria-label`.
- Navegação por teclado nos formulários.

---

# Organização Futura

Com o crescimento da aplicação, os estilos serão divididos por responsabilidade.

Exemplo:

```text
styles/

├── base.css
├── variables.css
├── layout.css
├── sidebar.css
├── header.css
├── forms.css
├── buttons.css
├── modal.css
├── dashboard.css
├── workspace.css
├── animations.css
└── utilities.css
```

Essa separação reduzirá o tamanho do arquivo principal e facilitará a manutenção.

---

# Design System

O projeto ainda não possui um Design System completo.

Entretanto, todos os elementos estão sendo desenvolvidos pensando em reutilização.

Os primeiros componentes compartilhados planejados são:

- Button.
- Input.
- TextArea.
- FormField.
- Modal.
- Card.
- Spinner.
- EmptyState.
- Avatar.
- Badge.
- Dropdown.
- ConfirmDialog.

---

# Tema Escuro

O tema escuro ainda não foi implementado.

Está previsto para uma milestone futura.

A estratégia planejada consiste em utilizar variáveis CSS para permitir alternância entre temas.

```text
Light Theme

↓

CSS Variables

↓

Dark Theme
```

---

# Próximas Melhorias

As próximas evoluções previstas para a camada de estilos são:

- Separação do `index.css`.
- Responsividade completa.
- Design System.
- Componentes reutilizáveis.
- Tema escuro.
- Sistema de variáveis.
- Tokens de design.
- Animações.
- Skeleton Loading.
- Sistema de espaçamento.
- Toasts.
- Extração do modal de confirmação para componente reutilizável.
- Estados de hover e focus padronizados.

---

# Estado Atual

## Implementado

- Estilos globais.
- Login.
- Cadastro.
- Dashboard.
- Sidebar.
- Header.
- AuthenticatedLayout.
- WorkspacePage.
- Cards de resumo.
- Breadcrumb.
- Área inicial para Boards.
- WorkspaceMembersSection.
- Cards de membros.
- Lista de membros.
- Modal de criação.
- Modal de edição.
- Modal de exclusão.
- Estados de carregamento.
- Estados vazios.
- Tratamento visual de erros.
- Controle visual de permissões.
- Botões destrutivos.
- Redirecionamento após exclusão.
- Responsividade das páginas autenticadas.

## Planejado

- Design System.
- Componentes reutilizáveis.
- Dark Mode.
- Sistema de animações.
- Organização modular dos estilos.
- Tokens de design.
- Toasts.
- Skeleton Loading.
- Componente reutilizável de confirmação.
- Colapso da Sidebar.
- Navegação móvel.
- Menu lateral retrátil.