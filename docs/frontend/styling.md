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
- Recuperação de senha.
- Redefinição de senha.
- Link `Esqueci minha senha`.
- Exibição e cópia do link de redefinição.
- Dashboard.
- AuthenticatedLayout.
- Sidebar.
- Header.
- Cards de Workspace.
- Cards de convites pendentes.
- Modal de criação de Workspace.
- Modal de edição de Workspace.
- Modal de confirmação de exclusão.
- Modal de criação de convite.
- Exibição e cópia do link de convite.
- Página de aceitação de convite.
- Página 404.
- Botão de ação destrutiva.
- Aviso visual de exclusão.
- WorkspacePage.
- Breadcrumb.
- Cards de resumo do Workspace.
- Área de Boards.
- Grid de Boards.
- Cards de Boards.
- Modal de criação de Board.
- Modal de edição de Board.
- BoardPage.
- Breadcrumb da BoardPage.
- Cards de resumo do Board.
- Área destinada às Lists.
- Estados de carregamento dos Boards.
- Estados vazios dos Boards.
- Feedback visual para erros de carregamento dos Boards.
- Estados de carregamento da BoardPage.
- Estado de erro da BoardPage.
- Seletor visual de cor do Board.
- Seção de membros.
- Controle visual de permissões.
- Botões.
- Inputs.
- Textareas.
- Formulários.
- Mensagens de erro.
- Mensagens de sucesso.
- Estados vazios.
- Telas de carregamento.
- Responsividade para convites e membros.

---

# Convenções

As classes possuem nomes descritivos.

Exemplos:

```text
auth-page

auth-card

auth-header

auth-form

forgot-password-link

password-reset-link-section

password-reset-link-control

password-reset-copy-message

password-reset-open-link

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

pending-invitations-section

pending-invitations-count

pending-invitations-list

pending-invitation-card

pending-invitation-icon

pending-invitation-content

pending-invitation-details

pending-invitation-actions

pending-invitations-empty

workspace-members-header-actions

invitation-link-section

invitation-link-control

invitation-copy-feedback

accept-invitation-page

accept-invitation-card

accept-invitation-actions

not-found-page

not-found-card

not-found-code

not-found-label

not-found-actions

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

Atualmente existe um layout compartilhado entre Login, Cadastro, Recuperação de Senha e Redefinição de Senha.

Características:

- Card centralizado.
- Formulários padronizados.
- Campos reutilizando as mesmas classes.
- Mensagens de erro.
- Mensagens de sucesso.
- Botões de ação.
- Links de navegação entre Login e Cadastro.
- Link para recuperação de senha.
- Exibição do link de redefinição durante o desenvolvimento.
- Botão para copiar o link.
- Navegação direta para a tela de redefinição.
- Formulário para nova senha e confirmação.

---

# Recuperação de Senha

A página de recuperação reutiliza o mesmo layout visual das páginas de Login e Cadastro.

Arquivo:

```text
ForgotPasswordPage.tsx
```

A página permite:

- Informar o email.
- Solicitar a recuperação da senha.
- Exibir mensagens de validação.
- Exibir mensagens retornadas pela API.
- Apresentar o link de redefinição durante o desenvolvimento.
- Copiar o link para a área de transferência.
- Abrir diretamente a página de redefinição.

O link `Esqueci minha senha` utiliza a classe:

```text
forgot-password-link
```

A área de exibição do link utiliza:

```text
password-reset-link-section

password-reset-link-control

password-reset-copy-message

password-reset-open-link
```

A seção possui:

- Fundo diferenciado.
- Borda visível.
- Campo somente leitura.
- Botão `Copiar`.
- Mensagem de confirmação da cópia.
- Botão para abrir a tela de redefinição.

---

# Redefinição de Senha

A página de redefinição utiliza o mesmo padrão visual do restante da autenticação.

Arquivo:

```text
ResetPasswordPage.tsx
```

A página contém:

- Campo de nova senha.
- Campo de confirmação da senha.
- Mensagens de validação.
- Mensagens de erro da API.
- Mensagem de sucesso.
- Botão `Redefinir senha`.
- Link para retornar ao Login.

Durante a requisição, o botão principal exibe:

```text
Redefinindo...
```

Após o sucesso, o usuário é redirecionado para o Login e recebe uma mensagem de confirmação.

---

# Dashboard

O Dashboard utiliza um layout próprio dentro do `AuthenticatedLayout`.

Possui:

- Cabeçalho da área de Workspaces.
- Botão para criação de Workspace.
- Grid responsivo de cards.
- Estados de carregamento, erro e lista vazia.
- Seção de convites pendentes.
- Cards de convites.
- Contador de convites.
- Botão `Aceitar convite`.
- Atualização visual automática após a aceitação.

A seção de convites pendentes é exibida antes da listagem de Workspaces.

Cada convite apresenta:

- Inicial do Workspace.
- Nome do Workspace.
- Descrição.
- Nome de quem enviou o convite.
- Data de expiração.
- Botão para aceitar o convite.
- Mensagem de erro individual.

Quando um convite é aceito:

- O card é removido da lista.
- A quantidade de convites é atualizada.
- O Workspace passa a aparecer na listagem.
- Não é necessário recarregar a página.

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
- Botão de edição, quando permitido.
- Botão de exclusão, quando permitido.
- Área de Boards.
- Grid responsivo de Boards.
- Cards dos Boards.
- Botão "Abrir".
- Botão "Criar Board".
- Modal de criação de Board.
- Seção de membros do Workspace.
- Botão `Convidar membro`, para `OWNER` e `ADMIN`.

A seção de membros é carregada de forma independente da página principal, permitindo atualização apenas dessa área quando necessário.

Cada card também possui um botão `Abrir`, responsável por navegar para a `BoardPage`, onde o usuário pode visualizar os detalhes do Board e, futuramente, gerenciar suas Lists e Cards.

Dentro dela também está disponível o modal de criação de convite, responsável por:

- Receber o email do convidado.
- Exibir erros de validação.
- Exibir mensagens retornadas pela API.
- Mostrar o link gerado após a criação.
- Permitir a cópia do link.

Essa estrutura permite a evolução contínua do Workspace, incluindo gerenciamento de Boards, convites, configurações e futuras funcionalidades da aplicação.

---

# Área de Boards

A WorkspacePage possui uma seção dedicada ao gerenciamento inicial dos Boards pertencentes ao Workspace.

Os Boards são apresentados em um grid responsivo.

Cada card pode exibir:

- Cor de fundo personalizada.
- Imagem de capa.
- Nome.
- Descrição.
- Cargo do usuário.
- Indicador de favorito.
- Botão `Abrir`.
- Botão `Editar`, quando permitido

Os Boards são carregados de forma independente das demais informações do Workspace, permitindo atualização apenas dessa área.

Usuários com permissão de visualização podem acessar o Board através do botão **"Abrir"**.

A navegação utiliza a rota:

```text
/boards/:id
```

---

## Modal de Criação

A criação é realizada através de um modal.

O formulário possui:

- Campo de título.
- Campo de descrição.
- Seletor de cor.
- URL da imagem de capa.
- Botão `Cancelar`.
- Botão `Criar Board`.

O formulário reutiliza:

- React Hook Form.
- Zod.
- Componentes visuais compartilhados.

Durante a criação:

```text
Criando...
```

Todos os controles permanecem desabilitados.

Após sucesso:

- O modal é fechado.
- O formulário é limpo.
- O Board aparece imediatamente na lista.

---

# BoardPage

A `BoardPage` utiliza o mesmo padrão visual adotado nas demais páginas autenticadas.

Seu objetivo é apresentar todas as informações relacionadas a um Board específico e servir como ponto de entrada para a futura implementação das Lists.

## Atualmente são exibidos

- Breadcrumb.
- Nome do Board.
- Descrição.
- Workspace de origem.
- Data de criação.
- Quantidade de membros.
- Cargo do usuário autenticado.
- Cards de resumo.
- Lista de membros.
- Área reservada para Lists.
- Botão destrutivo **Excluir Board**, exibido ao `OWNER` do Board.

A página reutiliza os mesmos padrões visuais utilizados na `WorkspacePage`, garantindo consistência em toda a aplicação.

---

## Estados

### Carregando

```text
Carregando Board...
```

---

### Erro

```text
Não foi possível abrir o Board.
```

São exibidos:

- Botão **Voltar**.
- Botão **Tentar novamente**.

---

### Sucesso

São exibidos:

- Informações gerais.
- Cards de resumo.
- Lista de membros.
- Área destinada às Lists.

---

## Modal de Exclusão do Board

O fluxo de exclusão reutiliza o padrão visual dos modais da aplicação e destaca o caráter destrutivo da ação.

São exibidos:

- Título **Excluir Board**.
- Aviso de que a ação não poderá ser desfeita.
- Warning destrutivo com o nome do Board e a remoção permanente dos dados vinculados.
- Botão secundário para cancelar.
- Botão destrutivo para confirmar.
- Mensagem de erro retornada pela API.
- Mensagem de sucesso após a exclusão.

Durante a exclusão, o fechamento e os botões do modal ficam desabilitados, e a ação principal apresenta o texto `Excluindo...`.

O modal acompanha a responsividade já aplicada aos diálogos da aplicação, mantendo ações e conteúdo acessíveis em telas menores.

---

## Favorito do Board

O favorito utiliza as classes:

```text
board-favorite-button
board-favorite-button-active
board-favorite-error
```

O botão possui fundo translúcido sobre o header do Board. Quando ativo, recebe destaque visual para indicar que o Board está nos favoritos do usuário.

### Não favoritado

```text
☆ Favoritar
```

### Favoritado

```text
★ Favoritado
```

### Salvando

```text
Salvando...
```

Durante a requisição, o botão permanece desabilitado e apresenta opacidade reduzida.

### Erro

A mensagem de erro é exibida dentro do header do Board por meio de `board-favorite-error`.

Em telas menores, o botão e a mensagem de erro ocupam toda a largura disponível.

---

## Modal de Arquivamento do Board

O modal de confirmação informa que o Board deixará a lista de ativos e poderá ser restaurado posteriormente. A classe `archive-board-warning` destaca o nome do Board e explica o efeito da ação.

O modal apresenta feedback de erro e sucesso. Durante a requisição, os controles ficam desabilitados e o botão principal exibe `Arquivando...`.

---

# Área de Boards Arquivados

A `WorkspacePage` utiliza uma seção visual separada para consultar e restaurar Boards arquivados.

Classes utilizadas:

```text
workspace-board-actions
workspace-archived-boards-section
workspace-archived-count
workspace-archived-boards-list
workspace-archived-board-card
workspace-archived-board-info
workspace-archived-board-label
workspace-archived-board-actions
workspace-archived-board-readonly
archive-board-warning
```

A seção apresenta:

- contador de Boards arquivados;
- cards próprios para os itens arquivados;
- badge **Arquivado**;
- botão **Restaurar**;
- texto **Somente leitura** quando a restauração não é permitida;
- feedback de carregamento, sucesso e erro;
- estados `Arquivando...` e `Restaurando...`.

Em telas menores, as ações passam a ocupar toda a largura, os cards são organizados verticalmente e o estado somente leitura é centralizado.

---

# Board Member Management

A seção permanente de membros reutiliza `board-members-section`, `board-members-list`, `board-member-card`, `board-member-avatar`, `board-member-info`, `board-member-name`, `board-role-badge` e `board-members-count`.

O gerenciamento acrescenta as classes reais:

```text
board-members-management-header
board-members-header-actions
board-member-management-actions
board-member-remove-button
board-member-processing
board-members-feedback
board-member-modal-content
board-member-field
board-member-candidates
board-member-candidate
board-member-candidate-selected
board-member-candidate-info
```

O modal de adição apresenta candidatos em cartões selecionáveis com avatar, nome e email. `board-member-candidate-selected` destaca a escolha; `board-member-field` estiliza a seleção de role.

As ações de gerenciamento incluem botão **Adicionar membro**, select de role, botão destrutivo **Remover** e modal de confirmação. Os estados visuais cobrem `Carregando membros...`, `Carregando candidatos...`, `Adicionando...`, `Salvando...`, `Removendo...`, mensagens de erro/sucesso e os estados vazios.

Em telas de até `760px`, cabeçalho e ações são empilhados, selects e botões ocupam toda a largura, cards permitem quebra de linha e badges ficam centralizados.

---

# AuthenticatedLayout

Dashboard, WorkspacePage e BoardPage compartilham o mesmo layout autenticado.

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

A WorkspacePage possui uma área dedicada à exibição e ao gerenciamento dos membros do Workspace.

Essa funcionalidade é implementada através do componente:

```text
WorkspaceMembersSection
```

Cada membro é exibido em um card contendo:

- Avatar simplificado.
- Nome.
- Email.
- Cargo.
- Identificação `Você`, quando aplicável.

Os cargos são apresentados visualmente para facilitar a identificação das permissões.

Atualmente podem ser exibidos:

- OWNER.
- ADMIN.
- MEMBER.
- VIEWER.

O `OWNER` pode alterar a permissão dos demais membros utilizando um seletor.

O botão destrutivo `Remover` também é exibido somente ao `OWNER`, para membros que não sejam proprietários nem o próprio usuário autenticado.

Durante a atualização, são utilizados estados visuais como:

```text
Salvando...
```

Também podem ser exibidas mensagens individuais de sucesso ou erro.

A remoção utiliza o mesmo padrão visual do modal de exclusão de Workspace, com `alertdialog`, botões desabilitados durante a requisição e o texto `Removendo...`.

A listagem possui carregamento independente da WorkspacePage.

A seção também contém o botão:

```text
Convidar membro
```

Esse botão é exibido apenas para:

- OWNER.
- ADMIN.

Ao clicar nesse botão é aberto um modal para criação de convites, permitindo informar o email do usuário que será convidado para participar do Workspace.

Após a criação do convite, o componente passa a exibir o link gerado, permitindo sua cópia para compartilhamento.

Isso permite atualizar somente o gerenciamento de membros sem recarregar toda a página.

---

# Modal de Criação de Convite

A criação de convites é realizada através de um modal presente no componente `WorkspaceMembersSection`.

Esse modal permite que usuários com permissão adequada convidem novos participantes para o Workspace.

O formulário contém:

- Campo de email.
- Botão `Enviar convite`.
- Botão `Fechar`.
- Botão de fechamento (`×`).
- Validação de email.
- Mensagens de erro.
- Mensagens de sucesso.

Durante o envio é exibido:

```text
Enviando...
```

Enquanto a requisição está em andamento:

- Os botões permanecem desabilitados.
- O modal não pode ser fechado acidentalmente.

Após o sucesso, o formulário deixa de ser exibido e passa a apresentar:

- Link do convite.
- Botão `Copiar`.
- Mensagem de confirmação da cópia.
- Botão `Concluir`.

O link utiliza a rota:

```text
/workspace-invitations/:token/accept
```

permitindo que o usuário convidado aceite o convite diretamente pela aplicação.

---

# Convites Pendentes no Dashboard

O Dashboard possui uma seção destinada aos convites pendentes do usuário autenticado.

Os convites são carregados automaticamente utilizando:

```text
GET /workspace-invitations/pending
```

Cada convite é exibido em um card contendo:

- Inicial do Workspace.
- Nome do Workspace.
- Descrição.
- Nome de quem enviou o convite.
- Data de expiração.
- Botão `Aceitar convite`.

Durante a aceitação é exibido:

```text
Aceitando...
```

Enquanto a operação é executada, o botão permanece desabilitado.

Caso ocorra algum erro, a mensagem é exibida apenas no card correspondente.

Quando não existem convites pendentes, é apresentado o estado:

```text
Nenhum convite pendente

Quando alguém convidar você para um Workspace, o convite aparecerá aqui.
```

Após aceitar um convite:

- O card é removido automaticamente.
- A quantidade de convites é atualizada.
- O Workspace passa a aparecer imediatamente na listagem do Dashboard.

---

# Página de Aceitação de Convite

A aplicação possui uma página dedicada para aceitação de convites através do token presente na URL.

Arquivo:

```text
AcceptWorkspaceInvitationPage.tsx
```

A página utiliza as classes:

```text
accept-invitation-page

accept-invitation-card

accept-invitation-icon

accept-invitation-label

accept-invitation-actions
```

O objetivo dessa página é permitir que um usuário aceite um convite utilizando o link compartilhado.

O card central apresenta:

- Ícone.
- Identificação da funcionalidade.
- Mensagem explicativa.
- Estado de carregamento.
- Mensagem de erro.
- Mensagem de sucesso.
- Botão `Aceitar convite`.
- Botão para voltar ao Dashboard.

Após a aceitação bem-sucedida, o usuário é redirecionado para o Dashboard, onde o Workspace já estará disponível.

---

# Página 404

A aplicação possui uma página personalizada para rotas inexistentes.

Arquivo:

```text
NotFoundPage.tsx
```

A página utiliza as classes:

```text
not-found-page

not-found-card

not-found-code

not-found-label

not-found-actions
```

Ela segue o mesmo padrão visual adotado nas demais telas da aplicação.

O card central apresenta:

- Código 404.
- Identificação da página.
- Mensagem explicativa.
- Botão `Voltar`.
- Botão `Ir para o Dashboard` ou `Ir para o Login`, conforme o estado da autenticação.

A interface é totalmente responsiva e reutiliza os estilos globais dos botões principais e secundários.

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

Atualmente são utilizadas nos formulários de criação e edição de Workspaces, além da criação de Boards.

---

# Estados Visuais

A aplicação possui diferentes estados visuais relacionados à autenticação, Workspaces, membros e convites.

---

## Carregamento da Sessão

Durante a recuperação da autenticação:

```text
Carregando sessão...
```

Esse estado impede que páginas privadas sejam exibidas antes da validação do token.

---

## Solicitação de Recuperação

Durante a solicitação é exibido:

```text
Enviando...
```

O botão permanece desabilitado até a conclusão da requisição.

---

## Recuperação Solicitada

Após o sucesso:

- A mensagem retornada pela API é exibida.
- O link de redefinição passa a ser apresentado.
- O botão de cópia fica disponível.
- O usuário pode abrir diretamente a página de redefinição.

---

## Redefinindo Senha

Durante a redefinição é exibido:

```text
Redefinindo...
```

O botão permanece desabilitado enquanto a requisição está em andamento.

---

## Senha Redefinida

Após o sucesso:

- A mensagem retornada pela API é exibida.
- O botão permanece desabilitado.
- O usuário é redirecionado automaticamente para o Login.
- A LoginPage exibe uma mensagem de confirmação.

---

## Carregamento dos Workspaces

Enquanto os Workspaces são carregados:

```text
Carregando Workspaces...
```

---

## Carregamento dos Convites

Enquanto a aplicação consulta os convites pendentes:

```text
Carregando convites...
```

---

## Lista Vazia de Workspaces

Quando o usuário não participa de nenhum Workspace:

```text
Nenhum Workspace encontrado

Crie seu primeiro Workspace para começar.
```

---

## Lista Vazia de Convites

Quando não existem convites pendentes:

```text
Nenhum convite pendente

Quando alguém convidar você para um Workspace, o convite aparecerá aqui.
```

---

## Lista Carregada

Quando existem Workspaces ou convites pendentes, ambos são exibidos em cards responsivos.

---

## Erro de Listagem

Caso ocorra algum erro durante o carregamento das informações, a interface utiliza o componente visual:

```text
api-error
```

As áreas de Workspaces e Convites são independentes, permitindo que uma continue funcionando mesmo que a outra apresente falhas.

---

# Estados de Convite

O fluxo de convites possui estados específicos para melhorar a experiência do usuário.

## Enviando Convite

Durante a criação de um convite é exibido:

```text
Enviando...
```

O formulário permanece desabilitado até a conclusão da operação.

---

## Convite Criado

Após o sucesso:

- A mensagem retornada pela API é exibida.
- O link do convite passa a ser apresentado.
- O botão de cópia fica disponível.
- O formulário deixa de ser exibido.

---

## Copiando Link

Ao clicar em:

```text
Copiar
```

é apresentada uma mensagem confirmando que o link foi copiado para a área de transferência.

---

## Aceitando Convite

Durante a aceitação:

```text
Aceitando...
```

O botão permanece desabilitado até o término da operação.

---

## Convite Aceito

Após a conclusão:

- O convite desaparece da lista.
- O Workspace é adicionado automaticamente ao Dashboard.
- A interface é atualizada sem necessidade de recarregar a página.

---

## Erro

Caso ocorra qualquer erro durante a criação ou aceitação do convite, a mensagem é exibida mantendo todas as informações já carregadas na tela.

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

## Carregando Boards

Durante a consulta:

```text
Carregando Boards...
```

---

## Nenhum Board

Quando o Workspace ainda não possui Boards:

```text
Nenhum Board disponível

Crie o primeiro Board para organizar as tarefas deste Workspace.
```

---

## Criando Board

Durante a criação:

```text
Criando...
```

Após sucesso:

- O modal é fechado.
- O formulário é limpo.
- O Board é adicionado automaticamente à lista.

---

## Erro ao carregar Boards

Quando ocorre alguma falha durante a consulta, é exibida uma mensagem utilizando a classe:

```text
api-error
```

mantendo o restante da WorkspacePage disponível para uso.

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
- Recuperação de senha solicitada.
- Senha redefinida.

---

# Responsividade

Toda a interface segue uma abordagem responsiva.

Atualmente possuem adaptações para diferentes tamanhos de tela:

- Login.
- Cadastro.
- ForgotPasswordPage.
- ResetPasswordPage.
- Dashboard.
- WorkspacePage.
- AcceptWorkspaceInvitationPage.
- NotFoundPage.
- Sidebar.
- Header.
- Modal de criação.
- Modal de edição.
- Modal de exclusão.
- Modal de convite.
- Lista de membros.
- Lista de convites pendentes.
- Campo do link do convite.
- Botão de cópia.
- Botão de aceitação de convite.
- Grid de Boards.
- Cards de Boards.
- Modal de criação de Board.
- Modal de edição de Board.
- BoardPage.

Em dispositivos menores:

- Os cards passam a ocupar toda a largura disponível.
- A lista de membros é reorganizada.
- Os cards de convite assumem um layout vertical.
- O botão de aceitação ocupa toda a largura disponível.
- O campo do link e o botão de cópia são empilhados.
- Os modais ajustam automaticamente sua largura.
- Os botões da Página 404 passam a ser exibidos em coluna.
- O card da Página 404 reduz automaticamente sua largura.
- Os botões permanecem acessíveis em telas móveis.
- O campo do link de redefinição e o botão de cópia são empilhados.
- O botão para abrir a redefinição ocupa toda a largura disponível.

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
- Campo do link de redefinição com `aria-label`.
- Mensagem de cópia utilizando `role="status"`.
- Mensagem de sucesso da redefinição utilizando `role="status"`.
- Mensagens de erro da recuperação utilizando `role="alert"`.

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
- ForgotPasswordPage.
- ResetPasswordPage.
- Link `Esqueci minha senha`.
- Estilos do fluxo de recuperação de senha.
- Exibição do link de redefinição.
- Botão para copiar o link.
- Mensagem de confirmação da cópia.
- Responsividade do fluxo de recuperação de senha.
- Dashboard.
- Sidebar.
- Header.
- AuthenticatedLayout.
- WorkspacePage.
- AcceptWorkspaceInvitationPage.
- NotFoundPage.
- Cards de resumo.
- Breadcrumb.
- Área inicial para Boards.
- WorkspaceMembersSection.
- Cards de membros.
- Lista de membros.
- Seletor de permissões.
- Botão de remoção de membros.
- Modal de confirmação de remoção de membros.
- Modal de criação.
- Modal de edição.
- Modal de exclusão.
- Modal de criação de convite.
- Exibição do link do convite.
- Botão para copiar o link.
- Seção de convites pendentes.
- Cards de convites.
- Botão de aceitação.
- Estados de carregamento.
- Estados vazios.
- Tratamento visual de erros.
- Mensagens de sucesso.
- Controle visual de permissões.
- Botões destrutivos.
- Redirecionamento após exclusão.
- Responsividade das páginas autenticadas.
- Responsividade do fluxo de convites.
- Grid responsivo de Boards.
- Cards de Boards.
- Modal de criação de Board.
- BoardPage.
- Breadcrumb da BoardPage.
- Cards de resumo do Board.
- Lista de membros do Board.
- Navegação Workspace → Board.
- Modal de edição de Board.
- Visualização individual de Boards.
- Seletor visual de cor.
- Suporte visual para imagem de capa.
- Estados de carregamento dos Boards.
- Estado vazio dos Boards.
- Feedback visual para erros dos Boards.
- Botão Excluir Board.
- Modal de exclusão do Board.
- Warning destrutivo da exclusão do Board.
- Estado visual de exclusão do Board.
- Mensagens de erro e sucesso da exclusão do Board.
- Responsividade do modal de exclusão do Board.
- Estilos `board-favorite-button`, `board-favorite-button-active` e `board-favorite-error`.
- Estados visuais de Board não favoritado, favoritado e salvando.
- Botão de favorito translúcido e estado ativo destacado.
- Estado desabilitado durante a atualização do favorito.
- Responsividade do botão e do erro de favorito.
- Estilos da área separada de Boards arquivados.
- Badge visual `Arquivado` e contador de arquivados.
- Estilos do botão Restaurar e do estado `Restaurando...`.
- Estado visual `Somente leitura`.
- Modal de confirmação de arquivamento e `archive-board-warning`.
- Estado `Arquivando...` e feedback de sucesso e erro.
- Responsividade da área e dos cards de Boards arquivados.
- Estilos completos do Board Member Management.
- Lista, avatares, roles e ações dos membros do Board.
- Candidatos selecionáveis do Workspace.
- Formulário de adição e controles de role.
- Modal de confirmação de remoção.
- Estados visuais e responsividade da seção de membros.

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
- Componente reutilizável de convite.
- Colapso da Sidebar.
- Navegação móvel.
- Menu lateral retrátil.
