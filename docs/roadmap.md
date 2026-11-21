# Roadmap

## Visão Geral

Este documento apresenta o planejamento de desenvolvimento do Clone do Trello.

O projeto é desenvolvido por milestones, permitindo evolução contínua da aplicação enquanto mantém estabilidade, qualidade e organização da base de código.

Cada milestone representa um conjunto de funcionalidades relacionadas.

---

# Milestone 1 — Foundation ✅

## Infraestrutura

* [x] Configuração inicial do projeto
* [x] Docker
* [x] PostgreSQL
* [x] Prisma ORM
* [x] Adapter PostgreSQL para Prisma 7
* [x] Sistema de Migrations
* [x] Fastify
* [x] TypeScript

## Arquitetura

* [x] Estrutura modular
* [x] Controllers
* [x] Use Cases
* [x] Schemas
* [x] Middlewares
* [x] Tratamento global de erros
* [x] Validação de ambiente
* [x] Documentação modular

## Autenticação do Backend

* [x] Cadastro
* [x] Login
* [x] JWT
* [x] Hash de senha
* [x] Middleware de autenticação
* [x] Endpoint `/auth/me`

---

# Milestone 2 — Workspaces ✅

## CRUD

* [x] Criar Workspace
* [x] Listar Workspaces
* [x] Buscar Workspace por ID
* [x] Atualizar Workspace
* [x] Excluir Workspace

## Convites

* [x] Criar convite
* [x] Gerar token único
* [x] Definir expiração
* [x] Aceitar convite
* [x] Validar email do convidado
* [x] Atualizar convite para `ACCEPTED`
* [x] Marcar convite expirado

## Membros

* [x] Criar membro automaticamente após aceitar convite
* [x] Listar membros
* [x] Atualizar permissão
* [x] Remover membro

## Permissões

* [x] OWNER
* [x] ADMIN
* [x] MEMBER
* [x] VIEWER
* [x] Proteger atualização
* [x] Proteger exclusão
* [x] Proteger convites
* [x] Proteger gerenciamento de membros

---

# Milestone 3 — Frontend de Integração ✅

## Infraestrutura

* [x] Inicializar React com Vite
* [x] Configurar TypeScript
* [x] Configurar ESLint
* [x] Criar estrutura inicial
* [x] Configurar variáveis de ambiente

## Navegação

* [x] Configurar React Router
* [x] Criar rota de login
* [x] Criar rota de cadastro
* [x] Criar rota protegida
* [x] Configurar redirecionamentos
* [x] Criar página 404
* [x] Criar layout autenticado

## Comunicação

- [x] Configurar Axios
- [x] Configurar URL da API
- [x] Criar interceptor JWT
- [x] Criar serviço de autenticação
- [x] Implementar serviço de recuperação de senha
- [x] Implementar serviço de redefinição de senha
- [x] Criar interceptor de respostas
- [x] Tratar sessão expirada

## Autenticação

- [x] Implementar Login
- [x] Implementar Cadastro
- [x] Implementar Logout
- [x] Persistir token no localStorage
- [x] Persistir usuário no localStorage
- [x] Validar formulários com Zod
- [x] Integrar React Hook Form
- [x] Implementar AuthContext
- [x] Recuperar sessão com `/auth/me`
- [x] Bloquear páginas públicas para usuários autenticados
- [x] Implementar recuperação de senha
- [x] Implementar redefinição de senha

## Workspaces

* [x] Listar Workspaces no Dashboard
* [x] Criar Workspace
* [x] Visualizar Workspace
* [x] Atualizar Workspace
* [x] Excluir Workspace
* [x] Listar membros
* [x] Alterar permissões
* [x] Remover membro
* [x] Criar convite
* [x] Aceitar convite

## Interface

- [x] Criar estilos globais iniciais
- [x] Criar layout de autenticação
- [x] Criar feedback de erro
- [x] Criar feedback de sucesso
- [x] Estado de carregamento de Workspaces
- [x] Estado vazio de Workspaces
- [x] Modal de criação de Workspace
- [x] Formulário de criação de Workspace
- [x] Atualização automática da lista após criação
- [x] Sidebar compartilhada
- [x] Header compartilhado
- [x] WorkspacePage
- [x] Página 404 personalizada
- [x] Página de recuperação de senha
- [x] Página de redefinição de senha
- [x] Link "Esqueci minha senha"
- [x] Exibição do link de redefinição durante o desenvolvimento
- [x] Botão para copiar o link de redefinição
- [x] Redirecionamento automático para Login após redefinição da senha
- [x] Mensagem de confirmação após redefinição da senha
- [x] Breadcrumb de navegação
- [x] Cards de resumo do Workspace
- [x] Modal de edição de Workspace
- [x] Atualização automática da interface após edição
- [x] Controle de permissões para edição
- [x] Botão destrutivo para exclusão
- [x] Modal de confirmação de exclusão
- [x] Controle de permissão para exclusão
- [x] Redirecionamento após exclusão

---

# Milestone 4 — Boards ✅

## Backend

* [x] Model Board
* [x] Model BoardMember
* [x] Criar Board
* [x] Listar Boards
* [x] Buscar Board por ID
* [x] Atualizar Board
* [x] Controle de acesso aos Boards
* [x] Excluir Board
* [x] Favoritar Board
* [x] Arquivar e restaurar Board
* [x] Listar Boards arquivados
* [x] Gerenciamento de membros do Board
* [x] Sistema de permissões do Board

## Frontend

* [x] Listar Boards
* [x] Criar Board
* [x] Visualizar Board
* [x] BoardPage
* [x] Atualizar Board
* [x] Navegação workspace → Board
* [x] Excluir Board
* [x] Favoritar Board
* [x] Arquivar e restaurar Board
* [x] Listar Boards arquivados
* [x] Gerenciamento de membros do Board

---

# Milestone 5 — Lists ✅

## Backend

* [x] Model BoardList
* [x] Migration de BoardList
* [x] Criar List
* [x] Listar Lists
* [x] Atualizar List
* [x] Excluir List
* [x] Reordenar Lists
* [x] Permissões de leitura e mutação por Board e Workspace
* [x] Proteção da criação concorrente

## Frontend

* [x] Exibir Lists
* [x] Criar List
* [x] Atualizar List
* [x] Excluir List
* [x] Reordenar Lists
* [x] Drag-and-drop horizontal por mouse e toque emulado
* [x] Reordenação por teclado e feedback acessível
* [x] Controles por permissão e confirmação de exclusão
* [x] Integração frontend/backend na BoardPage sem reload
* [x] Proteções contra respostas obsoletas e operações conflitantes
* [x] Reconciliação e recuperação da sincronização da ordem

## Validação e documentação

* [x] Testes automatizados de Lists: 27 testes de API e 16 cenários reais no Edge headless, zero falhas finais na auditoria
* [x] Auditoria técnica e funcional documentada
* [x] Documentação da API, README e changelog

Concluída no escopo da [auditoria](LISTS_MILESTONE_5_AUDIT.md), sem homologação de produção. Permanecem validação em outros navegadores, leitor de tela e dispositivo físico, testes de carga/concorrência ampliada e avaliação do aviso de bundle acima de 500 kB. O PATCH de reordenação retorna somente mensagem, e o frontend confirma a coleção por GET. Essas limitações não são marcadas como funcionalidades aprovadas. Cards continuam na Milestone 6.

---

# Milestone 6 — Cards

Em andamento. O fluxo básico está disponível na BoardPage. Consulte a [API de Cards](api/cards.md).

## Backend

* [x] Model Card e migration no PostgreSQL
* [ ] Model CardMember
* [x] Criar Card
* [x] Listar Cards ativos e arquivados por List e buscar Card por ID
* [x] Atualizar Card
* [x] Excluir Card
* [x] Arquivar e restaurar Card
* [x] Reordenar na mesma List e mover entre Lists do mesmo Board
* [x] Persistir posições dos Cards ativos em transação serializável com retentativas de conflito
* [x] Validar entradas com Zod e proteger rotas com JWT e permissões do Board
* [x] Data de entrega opcional por Card
* [ ] Membros
* [ ] Comentários
* [ ] Etiquetas
* [ ] Checklist
* [ ] Upload de anexos

## Frontend

* [x] Exibir Cards
* [x] Criar Card
* [x] Atualizar Card
* [x] Excluir Card
* [x] Modal de detalhes e edição do Card
* [x] Arquivar, listar arquivados e restaurar na List
* [x] Drag-and-drop com dnd-kit e feedback de operação
* [x] Data de entrega opcional por Card
* [ ] Membros
* [ ] Comentários
* [ ] Etiquetas
* [ ] Checklist
* [ ] Uploads

## Validação funcional

* [x] Reordenar Cards dentro da mesma List
* [x] Movimentar Cards entre Lists diferentes
* [x] Movimentar Cards para Lists vazias
* [x] Movimentar o último Card de uma List
* [x] Persistir movimentações após atualização da página
* [x] Preservar a reordenação das Lists
* [x] Cancelar movimentação com Escape
* [x] Soltar fora das Lists sem alterar a posição no cenário manual
* [x] Tratar falhas de conexão durante a movimentação
* [x] Restringir controles de movimentação conforme permissões na interface

**Resultado reportado: 10/10 cenários manuais aprovados.** O cenário de permissões exercitou os controles da interface. A regra de autorização do endpoint foi conferida no código.

* [ ] Validar diretamente na API a autorização do endpoint de movimentação
* [ ] Automatizar os cenários específicos de movimentação de Cards em uma etapa futura de qualidade

O adiamento da automação foi uma decisão de planejamento e permite avançar nas funcionalidades restantes.

---

# Milestone 7 — Colaboração em Tempo Real

## WebSocket

* [ ] Configurar Socket.IO no backend
* [ ] Configurar Socket.IO Client
* [ ] Autenticar conexões
* [ ] Criar Rooms por Workspace
* [ ] Criar Rooms por Board
* [ ] Sincronizar Boards
* [ ] Sincronizar Lists
* [ ] Sincronizar Cards
* [ ] Sincronizar comentários
* [ ] Exibir usuários online

---

# Milestone 8 — Dashboard, Atividades e Notificações

## Dashboard

* [ ] Estatísticas
* [ ] Métricas
* [ ] Atividades recentes
* [ ] Cards concluídos
* [ ] Prazos próximos

## Atividades

* [ ] Model Activity
* [ ] Histórico do Workspace
* [ ] Histórico do Board
* [ ] Histórico do Card

## Notificações

* [ ] Model Notification
* [ ] Central de notificações
* [ ] Marcar notificação como lida
* [ ] Notificações em tempo real

## Busca

* [ ] Busca global
* [ ] Busca de Workspaces
* [ ] Busca de Boards
* [ ] Busca de Cards

---

# Milestone 9 — Refinamento do Frontend

A aplicação já tem modais, estados de carregamento e vazio, página 404, confirmações e feedback visual em fluxos específicos. Os itens abaixo acompanham o refinamento desses padrões no conjunto da interface.

## Interface

* [ ] Responsividade
* [ ] Tema escuro
* [ ] Design System
* [ ] Animações
* [ ] Skeleton loading
* [ ] Empty states
* [ ] Error pages
* [ ] Modais
* [ ] Toasts
- [ ] Criar componentes reutilizáveis
- [ ] Criar estados de carregamento
- [ ] Criar empty states
- [ ] Criar sistema de mensagens ou toasts

## Experiência do Usuário

* [ ] Confirmações para ações destrutivas
* [ ] Feedback visual
* [ ] Navegação por teclado
* [ ] Acessibilidade
* [ ] Otimização para dispositivos móveis

---

# Milestone 10 — Qualidade e Produção

A auditoria de Lists já inclui testes automatizados de API e navegador. As tarefas abaixo abrangem a ampliação da cobertura do projeto.

## Testes

* [ ] Testes unitários
* [ ] Testes de integração
* [ ] Testes E2E
* [ ] Testes de permissões
* [ ] Testes do WebSocket

## Segurança

* [ ] Rate limiting
* [ ] Helmet
* [ ] Refresh tokens
* [ ] Revogação de sessão
* [ ] Auditoria de segurança

## DevOps

* [ ] GitHub Actions
* [ ] CI
* [ ] CD
* [ ] Deploy do backend
* [ ] Deploy do frontend
* [ ] Banco de produção
* [ ] Monitoramento
* [ ] Logs estruturados

---

# Milestone 11 — Assistente Inteligente

## Backend

- [ ] Criar módulo Assistant
- [ ] Integrar API de IA
- [ ] Criar contexto por Workspace
- [ ] Criar contexto por Board
- [ ] Implementar ferramentas internas
- [ ] Validar permissões
- [ ] Registrar ações do assistente

## Frontend

- [ ] Criar painel do assistente
- [ ] Criar histórico de mensagens
- [ ] Exibir carregamento das respostas
- [ ] Permitir resumo de Boards
- [ ] Permitir sugestão de tarefas
- [ ] Confirmar ações antes da execução

---

# Objetivo Final

Construir um Clone do Trello completo utilizando tecnologias modernas e arquitetura escalável, simulando um ambiente profissional de desenvolvimento.

Ao final, a aplicação deverá possuir:

* Backend modular.
* Frontend moderno em React.
* Autenticação completa.
* Recuperação de senha.
* Redefinição de senha.
* Workspaces, Boards, Lists e Cards.
* Sistema de membros e permissões.
* Convites.
* Comunicação em tempo real.
* Notificações.
* Busca global.
* Interface responsiva.
* Tema escuro.
* Documentação completa.
* Testes automatizados.
* Pipeline de CI/CD.
* Estrutura pronta para produção.
