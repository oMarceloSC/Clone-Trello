# Frontend — Clone do Trello

React, TypeScript e Vite, com React Router, Axios, React Hook Form e Zod. Estilos globais em `src/index.css`.

## Executar

```bash
npm install
npm run dev
```

Configure `VITE_API_URL=http://localhost:3333` em `.env`. Para verificar:

```bash
npm run lint
npm run build
```

## Estado atual

Autenticação, Workspaces e Milestone 4 — Boards implementados. WorkspacePage lista Boards ativos/arquivados e permite criar, editar e restaurar conforme permissão. BoardPage oferece favorito, arquivamento, exclusão e gerenciamento de membros. A BoardPage também integra Lists com CRUD e reordenação, além de Cards com CRUD, prazo opcional, arquivamento, restauração e drag-and-drop dentro da List ou entre Lists do Board.

BoardMembersSection é controlado pelos membros da BoardPage. Permissões administrativas e favorito dependem de BoardMember; administradores/proprietários do Workspace podem visualizar sem receber uma role artificial no Board.

## Documentação

- [Execução do projeto](../README.md)
- [Arquitetura](../docs/frontend/architecture.md)
- [Páginas](../docs/frontend/pages.md)
- [Rotas](../docs/frontend/routing.md)
- [Componentes](../docs/frontend/components.md)
- [Serviços](../docs/frontend/services.md)
- [Estado](../docs/frontend/state-management.md)
- [Estilos](../docs/frontend/styling.md)
- [API de Boards](../docs/api/boards.md)
- [API de Lists](../docs/api/lists.md)
- [API de Cards](../docs/api/cards.md)
