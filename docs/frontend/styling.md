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

```
src/

├── index.css

└── styles/
```

Atualmente todos os estilos globais encontram-se em:

```
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
- Cards de Workspace.
- Botões.
- Inputs.
- Formulários.
- Mensagens de erro.
- Mensagens de sucesso.
- Estado vazio.
- Tela de carregamento.

---

# Convenções

As classes possuem nomes descritivos.

Exemplos:

```
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

loading-page
```

A nomenclatura busca facilitar leitura e manutenção.

---

# Layout de Autenticação

Atualmente existe um layout compartilhado entre Login e Cadastro.

Características:

- Card centralizado.
- Formulários padronizados.
- Campos reutilizando as mesmas classes.
- Mensagens de erro.
- Mensagens de sucesso.

---

# Dashboard

O Dashboard utiliza um layout próprio.

Possui:

- Cabeçalho.
- Informações do usuário.
- Botão de logout.
- Área principal.
- Seção de Workspaces.

---

# Cards de Workspace

Os Workspaces são exibidos em formato de cards.

Cada card apresenta:

- Nome.
- Descrição.
- Quantidade de membros.
- Botão "Abrir".

Os cards são organizados utilizando CSS Grid.

```
Workspace Grid

┌─────────────┐ ┌─────────────┐
│ Workspace A │ │ Workspace B │
└─────────────┘ └─────────────┘

┌─────────────┐
│ Workspace C │
└─────────────┘
```

---

# Estados Visuais

O Dashboard possui três estados distintos.

## Carregamento

```
Carregando Workspaces...
```

---

## Lista vazia

```
Nenhum Workspace encontrado.
```

---

## Erro

```
Não foi possível carregar os Workspaces.
```

Todos utilizam estilos padronizados.

---

# Botões

Atualmente existem dois estilos principais.

## Botão padrão

Utilizado em Login e Cadastro.

---

## Primary Button

Classe:

```
primary-button
```

Utilizado para ações principais.

Exemplo:

```
Criar Workspace
```

---

# Responsividade

Já existe uma adaptação inicial para telas menores.

Atualmente:

- Dashboard reorganiza os elementos.
- Cabeçalho passa para coluna.
- Botões ocupam largura total.
- Ajuste do espaçamento interno.

Outras melhorias serão implementadas futuramente.

---

# Estilos Globais

O arquivo `index.css` também define:

- Reset básico.
- Tipografia.
- Espaçamentos.
- Layout principal.

Todos os componentes reutilizam essas definições.

---

# Organização Futura

Com o crescimento da aplicação os estilos serão divididos.

Exemplo:

```
styles/

base.css

variables.css

layout.css

forms.css

buttons.css

dashboard.css

workspace.css

animations.css

utilities.css
```

Essa separação reduzirá o tamanho do arquivo principal e facilitará a manutenção.

---

# Design System

O projeto ainda não possui um Design System.

Entretanto, todos os componentes estão sendo desenvolvidos pensando em reutilização.

Os primeiros componentes serão:

- Button.
- Input.
- FormField.
- Card.
- Spinner.
- EmptyState.
- Modal.
- Avatar.
- Badge.
- Dropdown.

---

# Tema Escuro

Ainda não implementado.

Está previsto para uma milestone futura.

A estratégia planejada consiste em utilizar variáveis CSS para permitir alternância entre temas.

```
Light Theme

↓

CSS Variables

↓

Dark Theme
```

---

# Acessibilidade

Os estilos atuais seguem as seguintes práticas:

- Labels associadas aos inputs.
- Estados visuais de erro.
- Contraste adequado.
- Estrutura semântica.
- Navegação por teclado.

Novas melhorias serão adicionadas conforme a evolução da interface.

---

# Próximas Melhorias

- Responsividade completa.
- Design System.
- Tema escuro.
- Sistema de variáveis.
- Animações.
- Skeleton Loading.
- Componentes reutilizáveis.
- Tokens de design.
- Sistema de espaçamento.

---

# Estado Atual

## Implementado

- CSS global.
- Layout de autenticação.
- Dashboard.
- Grid de Workspaces.
- Cards de Workspace.
- Estados de carregamento.
- Estado vazio.
- Mensagens de erro.
- Mensagens de sucesso.
- Botões.
- Inputs.
- Responsividade inicial.

## Planejado

- Design System.
- Componentes reutilizáveis.
- Dark Mode.
- Sistema de animações.
- Organização modular dos estilos.