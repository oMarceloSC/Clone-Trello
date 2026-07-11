# Estilização do Frontend

## Visão Geral

O frontend do Clone do Trello utiliza atualmente **CSS puro** para estilização da interface.

O objetivo desta abordagem é manter a configuração inicial simples durante a integração entre frontend e backend.

Conforme o projeto evoluir, a estrutura de estilos continuará organizada e preparada para migração gradual para um Design System mais robusto.

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

Atualmente, os estilos globais estão concentrados no arquivo:

```
src/index.css
```

No futuro, novos arquivos poderão ser adicionados dentro da pasta `styles`.

---

# Organização

Os estilos seguem uma organização baseada em responsabilidades.

Atualmente existem estilos para:

- Layout de autenticação.
- Dashboard inicial.
- Campos de formulário.
- Botões.
- Mensagens de erro.
- Mensagens de sucesso.
- Tela de carregamento.

---

# Estilos Globais

O arquivo `index.css` é responsável por definir:

- Reset básico.
- Tipografia.
- Layout principal.
- Componentes utilizados pelas páginas atuais.

Todos os componentes reutilizam essas classes.

---

# Convenções

As classes utilizam nomes descritivos.

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

loading-page
```

A nomenclatura busca facilitar a leitura e manutenção do código.

---

# Responsividade

A responsividade completa ainda não foi implementada.

Atualmente os layouts foram desenvolvidos priorizando a visualização em desktop.

A adaptação para dispositivos móveis será realizada em uma milestone futura.

---

# Componentes Estilizados

Atualmente existem estilos para:

## Login

- Página.
- Card.
- Formulário.
- Inputs.
- Botões.
- Mensagens.

---

## Cadastro

- Página.
- Card.
- Formulário.
- Inputs.
- Botões.
- Mensagens.

---

## Dashboard

- Cabeçalho.
- Conteúdo principal.
- Botão de logout.

---

## Loading

Tela exibida durante a recuperação da sessão.

```
Carregando sessão...
```

---

# Organização Futura

Com o crescimento da aplicação, os estilos serão divididos por responsabilidade.

Exemplo:

```
styles/

base.css

variables.css

layout.css

forms.css

buttons.css

animations.css

utilities.css
```

Essa separação reduzirá o tamanho do arquivo principal e facilitará a manutenção.

---

# Design System

O projeto ainda não possui um Design System.

Entretanto, todos os componentes serão desenvolvidos pensando em reutilização.

Exemplos futuros:

- Button.
- Input.
- TextArea.
- Select.
- Modal.
- Avatar.
- Badge.
- Tooltip.
- Dropdown.
- Sidebar.
- Navbar.
- Dialog.

---

# Tema Escuro

O suporte a Dark Mode ainda não foi implementado.

Está previsto para uma milestone futura.

A estratégia planejada consiste em utilizar variáveis CSS para facilitar a troca entre temas.

Exemplo:

```
Light Theme

↓

CSS Variables

↓

Dark Theme
```

---

# Acessibilidade

Durante o desenvolvimento dos componentes serão considerados:

- Contraste adequado.
- Navegação por teclado.
- Labels em formulários.
- Estados de foco.
- Mensagens acessíveis.
- Compatibilidade com leitores de tela.

---

# Próximas Melhorias

As próximas evoluções previstas para a camada de estilos são:

- Responsividade completa.
- Design System.
- Tema escuro.
- Animações.
- Skeleton Loading.
- Componentes reutilizáveis.
- Sistema de espaçamento.
- Tokens de design.
- Variáveis globais.

---

# Estado Atual

## Implementado

- CSS global.
- Layout de autenticação.
- Dashboard inicial.
- Inputs.
- Botões.
- Mensagens de erro.
- Mensagens de sucesso.
- Tela de carregamento.

## Planejado

- Design System.
- Componentes reutilizáveis.
- Responsividade.
- Dark Mode.
- Animações.
- Sistema de variáveis.
- Organização modular dos estilos.