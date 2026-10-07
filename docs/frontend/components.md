# Componentes Compartilhados

## Visão Geral

O frontend do Clone do Trello foi planejado para utilizar componentes reutilizáveis conforme a aplicação evoluir.

Os componentes de domínio incluem WorkspaceMembersSection e BoardMembersSection. Formulários e modais ainda permanecem nas páginas/seções; componentes genéricos adicionais são planejados.

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

Essa abordagem já é utilizada pelas seguintes páginas:

- Dashboard.
- Workspace.
- Board.

Também prepara a aplicação para futuras páginas como:
- Perfil.
- Notificações.

---

# Estado Atual

Atualmente a maior parte dos elementos da interface permanece dentro das páginas:

- LoginPage.
- RegisterPage.
- DashboardPage.
- WorkspacePage.
- BoardPage.
- AcceptWorkspaceInvitationPage.
- Modal de edição de Workspace (implementado na WorkspacePage).
- Modal de confirmação de exclusão (implementado na WorkspacePage).
- Modal de criação de convites (implementado na WorkspaceMembersSection).
- Modal de confirmação de remoção de membros (implementado na WorkspaceMembersSection).
- Gerenciamento de membros (implementado através do WorkspaceMembersSection).

Entretanto, a aplicação já possui um Layout compartilhado (`AuthenticatedLayout`) responsável por reutilizar a estrutura das páginas autenticadas.

Atualmente esse layout já é compartilhado entre:

- DashboardPage.
- WorkspacePage.
- BoardPage.
- AcceptWorkspaceInvitationPage.

Atualmente os modais de edição, exclusão, criação de convites e remoção de membros ainda fazem parte da própria WorkspacePage e do WorkspaceMembersSection.

O gerenciamento dos participantes do Workspace já foi extraído para o componente `WorkspaceMembersSection`, responsável por:

- Carregar os membros.
- Exibir os participantes.
- Atualizar permissões.
- Remover membros com confirmação.
- Sincronizar a lista e os contadores após a remoção.
- Criar convites para novos membros.
- Gerar links de convite para compartilhamento.

Os modais ainda deverão ser extraídos para componentes reutilizáveis conforme novas funcionalidades forem adicionadas ao sistema.

Essa decisão reduz duplicação de código e prepara a arquitetura para as próximas funcionalidades.

---

# BoardMembersSection

Arquivo: `src/features/boards/components/BoardMembersSection.tsx`.

Componente controlado por `BoardPage.board.members`, recebido na prop `members`. Recebe também boardId, workspaceId, currentUserId e `onMembersChange`, que aceita uma função de atualização. Não mantém outra lista de BoardMembers nem executa uma segunda busca de membros ao montar.

Exibe avatar, nome, email, role, contador e indicação do usuário atual. OWNER/ADMIN do Board podem adicionar usuários já pertencentes ao Workspace; apenas OWNER altera roles e remove membros. OWNER e o próprio usuário não são alvos editáveis/removíveis. Roles atribuíveis: ADMIN, MEMBER e VIEWER.

A seleção de candidatos consulta WorkspaceMembers ao abrir o modal. Operações exibem loading/erro/sucesso e atualizam o pai funcionalmente, preservando membros não afetados e o favorito atual. A remoção não exclui conta ou participação no Workspace; seus proprietários/administradores podem continuar visualizando o Board.

O carregamento inicial dos membros pertence à BoardPage. Os modais reutilizam classes globais existentes, sem componente Modal genérico.

---

# Próximas Implementações

Além do `AuthenticatedLayout`, os próximos componentes compartilhados planejados são:

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

Também está prevista a criação de componentes reutilizáveis para:

- ConfirmDialog.
- DeleteModal.
- InvitationModal.
- LoadingButton.
- PermissionSelect.
- MemberCard.
- InvitationCard.

Esses componentes substituirão gradualmente as implementações atualmente existentes na `WorkspacePage`, `WorkspaceMembersSection` e `DashboardPage`.

O objetivo é reutilizar a mesma interface para gerenciamento de membros, convites e permissões em qualquer Workspace da aplicação.

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
- Componentes específicos para confirmação de ações destrutivas.
- Padronização dos modais de edição.
- Padronização dos modais de convite.
- Padronização dos botões de carregamento.
- Componentes reutilizáveis para gerenciamento de membros.
- Componentes reutilizáveis para gerenciamento de convites.
- Componentes reutilizáveis para permissões de usuários.
