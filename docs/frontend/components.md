# Componentes Compartilhados

## Visão Geral

O frontend do Clone do Trello foi planejado para utilizar componentes reutilizáveis conforme a aplicação evoluir.

Nesta etapa inicial, os componentes ainda estão implementados diretamente nas páginas de autenticação.

À medida que novas funcionalidades forem desenvolvidas, esses elementos serão extraídos para uma biblioteca própria de componentes.

---

# Estrutura Planejada

Os componentes compartilhados serão organizados em:

```text
src/

components/

├── Button/

├── Input/

├── TextArea/

├── Select/

├── Checkbox/

├── Modal/

├── Avatar/

├── Badge/

├── Dropdown/

layouts/

├── AuthenticatedLayout/

│   ├── AuthenticatedLayout.tsx

│   └── index.ts

├── Sidebar/

├── Navbar/

├── Card/

├── Spinner/

├── EmptyState/

└── ConfirmDialog/
```

Cada componente possuirá sua própria estrutura.

Exemplo:

```text
Button/

Button.tsx

Button.css

index.ts
```

---

# Princípios

Todos os componentes deverão:

- Ser reutilizáveis.
- Possuir tipagem completa.
- Ser independentes.
- Receber dados via Props.
- Não conter regras de negócio.
- Possuir responsabilidade única.

---

# Layout Compartilhado

Embora ainda não exista uma biblioteca de componentes reutilizáveis, a aplicação já possui um Layout compartilhado.

```
AuthenticatedLayout
```

Esse layout é utilizado por todas as páginas autenticadas.

Sua responsabilidade é centralizar elementos comuns da interface, evitando duplicação de código.

Atualmente ele contém:

- Sidebar.
- Header.
- Área de conteúdo (`Outlet`).
- Informações do usuário autenticado.
- Logout.

Essa abordagem prepara a aplicação para futuras páginas como:

- Workspace.
- Board.
- Perfil.
- Notificações.

---

# Estado Atual

Atualmente a maior parte dos elementos da interface permanece dentro das páginas:

- LoginPage.
- RegisterPage.
- DashboardPage.

Entretanto, a aplicação já possui um Layout compartilhado (`AuthenticatedLayout`) responsável por reutilizar a estrutura das páginas autenticadas.

Essa decisão reduz duplicação de código e prepara a arquitetura para as próximas funcionalidades.

---

# Próximas Implementações

Os próximos componentes compartilhados serão:

- Button.
- Input.
- TextArea.
- FormField.
- Card.
- Spinner.
- EmptyState.
- Modal.
- Avatar.
- Badge.
- Dropdown.

Após isso, novas páginas poderão reutilizar esses componentes mantendo uma interface consistente.

---

# Evolução

Após a implementação do Design System, este documento será atualizado contendo:

- API de cada componente.
- Propriedades.
- Exemplos de uso.
- Padrões visuais.
- Boas práticas.
- Regras de composição.
- Convenções de nomenclatura.
- Diretrizes de acessibilidade.