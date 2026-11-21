# API de Cards

As nove rotas usam JWT no cabeçalho `Authorization: Bearer <token>` e são registradas sem prefixo de versão. Os parâmetros `id`, `listId` e o campo `targetListId` são UUIDs.

| Método e rota | Operação | Sucesso |
|---|---|---|
| `POST /lists/:listId/cards` | Criar Card ativo com `{ "title": "Revisar tarefa" }` | `201` com `{ message, card }` |
| `GET /lists/:listId/cards` | Listar Cards ativos | `200` com `{ cards }` |
| `GET /lists/:listId/cards/archived` | Listar Cards arquivados | `200` com `{ cards }` |
| `GET /cards/:id` | Consultar Card, inclusive arquivado, com `list: { id, title, boardId }` | `200` com `{ card }` |
| `PATCH /cards/:id` | Atualizar título, descrição ou prazo | `200` com `{ message, card }` |
| `PATCH /cards/:id/archive` | Arquivar | `200` com `{ message }` |
| `PATCH /cards/:id/restore` | Restaurar | `200` com `{ message, card }` |
| `PATCH /cards/:id/move` | Reordenar ou mover com `{ targetListId, position }` | `200` com `{ message, card }` |
| `DELETE /cards/:id` | Excluir permanentemente | `200` com `{ message }` |

O Card contém `id`, `title`, `description`, `position`, `isArchived`, `dueDate`, `listId`, `createdAt` e `updatedAt`. As duas listagens ordenam por `position` e, em empate, por `id`. Criação aceita título de 1 a 100 caracteres após remover espaços nas extremidades e acrescenta o Card após a maior posição da List. A edição exige pelo menos um campo reconhecido. `title` segue a mesma regra, `description` aceita texto ou `null` e `dueDate` aceita data e hora ISO 8601 com fuso ou `null` para limpar o prazo.

## Permissões

A leitura exige vínculo com o Workspace e participação no Board, incluindo `VIEWER`. `OWNER` e `ADMIN` do Workspace também podem ler sem participação no Board. Qualquer mutação exige vínculo com o Workspace e papel `OWNER`, `ADMIN` ou `MEMBER` no Board.

## Posições

`position` representa o índice inteiro de inserção a partir de zero entre os Cards ativos. Na mesma List, calcule o índice após retirar o Card da sequência. Entre Lists, o tamanho da sequência de destino é válido para inserir ao final. Uma List vazia aceita posição zero.

A movimentação atualiza `listId` quando aplicável e renumera as posições ativas das Lists afetadas na mesma transação serializável. A exclusão de Card ativo também renumera os remanescentes. Criação, exclusão e movimentação tentam a transação até três vezes em caso de conflito reconhecido. Arquivar e restaurar alteram apenas `isArchived`, de modo que a sequência ativa pode ter lacunas ou empates. O índice de posição no banco é não único.

## Erros

| Status | Condição |
|---|---|
| `400` | Entrada inválida ou tentativa de mover um Card arquivado, para outro Board ou para uma posição fora do intervalo. Erros do Zod incluem `issues`. |
| `401` | Token Bearer ausente ou inválido. |
| `403` | Membro do Board com papel insuficiente para uma mutação. |
| `404` | Card, List ou Board inexistente, ou vínculo exigido para acesso ao Board ausente. |
| `409` | Conflito de escrita reconhecido que persiste após as retentativas. |
| `500` | Erro interno inesperado. |
