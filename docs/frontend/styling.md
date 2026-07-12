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

# Botões

Atualmente existem três estilos principais de botões.

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

---

# Responsividade

Já existe uma adaptação inicial para telas menores.

Atualmente:

- Dashboard reorganiza os elementos.
- Cabeçalho passa para coluna.
- Cabeçalho da seção passa para coluna.
- Botões ocupam largura total.
- Modal adapta-se a telas menores.
- Modal passa a ocupar a parte inferior da tela.
- Ações do modal passam para coluna.
- Botão Cancelar aparece abaixo da ação principal visualmente.
- Espaçamento interno é reduzido.
- Grid de Workspaces ajusta automaticamente a quantidade de colunas.
- Sidebar passa para o topo em telas menores.
- Navegação da Sidebar torna-se horizontal.
- Header reorganiza seus elementos verticalmente quando necessário.

Outras melhorias serão implementadas futuramente.

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
- Dialogs de confirmação.
- Estados de hover e focus padronizados.

---

# Estado Atual

## Implementado

- CSS global.
- Layout de autenticação.
- Dashboard.
- Grid de Workspaces.
- Cards de Workspace.
- Modal de criação de Workspace.
- Formulário de criação.
- Estados de carregamento.
- Estado vazio.
- Estados de criação.
- Mensagens de erro.
- Mensagens de sucesso.
- Botões padrão.
- Botões primários.
- Botões secundários.
- Botão de fechamento do modal.
- Inputs.
- Textareas.
- Responsividade inicial.
- Práticas iniciais de acessibilidade.
- AuthenticatedLayout.
- Sidebar compartilhada.
- Header compartilhado.

## Planejado

- Design System.
- Componentes reutilizáveis.
- Dark Mode.
- Sistema de animações.
- Organização modular dos estilos.
- Tokens de design.
- Toasts.
- Skeleton Loading.
- Dialogs de confirmação.
- Colapso da Sidebar.
- Navegação móvel.
- Menu lateral retrátil.