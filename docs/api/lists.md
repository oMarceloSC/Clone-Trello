# Lists API — Milestone 5

CRUD e reordenação das colunas de um Board. Base de desenvolvimento: `http://localhost:3333`. Exemplos usam IDs fictícios e um placeholder de token.

## Autenticação e permissões

Todos os cinco endpoints exigem `Authorization: Bearer <TOKEN_JWT>` válido, com `sub` não vazio. Token ausente, inválido ou expirado, esquema diferente de Bearer e cabeçalho malformado resultam em 401.

| Operação | Acesso |
| --- | --- |
| Listar | Membro do Workspace e do Board, inclusive VIEWER. OWNER/ADMIN do Workspace também podem visualizar Boards desse Workspace sem associação direta ao Board. |
| Criar, editar, excluir, reordenar | Membro do Workspace e OWNER, ADMIN ou MEMBER do Board. A role do Workspace, isoladamente, não autoriza mutações de Lists. |

A autorização é verificada no backend. VIEWER do Board recebe 403 nas mutações. Ausência de vínculo necessário ou Board inexistente resulta em 404. Edição e exclusão determinam o Board a partir da List armazenada.

## Objeto List

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "title": "A fazer",
  "position": 0,
  "boardId": "11111111-1111-4111-8111-111111111111",
  "createdAt": "2026-10-15T12:00:00.000Z",
  "updatedAt": "2026-10-15T12:00:00.000Z"
}
```

`id` é gerado pelo servidor. `position` começa em zero. Timestamps são serializados em ISO 8601. Criação e edição aceitam título com 1 a 100 caracteres após `trim()`.

## 1. Criar List

**POST `/boards/:boardId/lists`** — cria uma List ao final do Board, calculando a próxima posição no servidor.

- Autenticação: Bearer JWT.
- Permissões: OWNER, ADMIN ou MEMBER do Board, com vínculo ao Workspace.
- Parâmetro de rota: `boardId`, UUID obrigatório.
- Body: `{ "title": "A fazer" }`.
- Validações: título deve ser string; espaços nas extremidades são removidos; vazio, somente espaços ou mais de 100 caracteres após normalização são rejeitados. Campos extras são descartados pelo schema de criação; não é possível definir posição pelo body.

Requisição:

```http
POST /boards/11111111-1111-4111-8111-111111111111/lists HTTP/1.1
Host: localhost:3333
Authorization: Bearer <TOKEN_JWT>
Content-Type: application/json

{ "title": "  A fazer  " }
```

Resposta **201**:

```json
{
  "message": "Lista criada com sucesso",
  "list": {
    "id": "22222222-2222-4222-8222-222222222222",
    "title": "A fazer",
    "position": 0,
    "boardId": "11111111-1111-4111-8111-111111111111",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  }
}
```

Códigos principais: **201** criada; **400** UUID/body inválido; **401** autenticação inválida; **403** role insuficiente; **404** Board inexistente ou sem acesso; **409** conflito de criação concorrente após esgotar as tentativas; **500** erro interno.

O cálculo da posição e a criação usam transação serializável, com até três tentativas para os conflitos reconhecidos pelo Prisma/adaptador PostgreSQL. A implementação não adiciona constraint única de posição ao banco.

## 2. Listar Lists

**GET `/boards/:boardId/lists`** — retorna as Lists do Board ordenadas por `position` crescente.

- Autenticação: Bearer JWT.
- Permissões: acesso de visualização conforme tabela acima, inclusive VIEWER.
- Parâmetro de rota: `boardId`, UUID obrigatório.
- Body: não utilizado. Não há paginação ou filtros implementados nesta rota.

Requisição:

```http
GET /boards/11111111-1111-4111-8111-111111111111/lists HTTP/1.1
Host: localhost:3333
Authorization: Bearer <TOKEN_JWT>
```

Resposta **200**:

```json
{
  "lists": [
    {
      "id": "22222222-2222-4222-8222-222222222222",
      "title": "A fazer",
      "position": 0,
      "boardId": "11111111-1111-4111-8111-111111111111",
      "createdAt": "2026-10-15T12:00:00.000Z",
      "updatedAt": "2026-10-15T12:00:00.000Z"
    }
  ]
}
```

Board sem Lists retorna **200** com `{ "lists": [] }`.

Códigos principais: **200** listagem; **400** UUID inválido; **401** autenticação inválida; **404** Board inexistente ou sem acesso; **500** erro interno.

## 3. Editar título

**PATCH `/lists/:id`** — altera somente o título da List, preservando sua posição e Board.

- Autenticação: Bearer JWT.
- Permissões: OWNER, ADMIN ou MEMBER do Board real da List, com vínculo ao Workspace.
- Parâmetro de rota: `id`, UUID obrigatório da List.
- Body: `{ "title": "Em andamento" }`.
- Validações: string obrigatória, `trim()`, comprimento entre 1 e 100; o schema é estrito e rejeita campos adicionais, como `position` e `boardId`.

Requisição:

```http
PATCH /lists/22222222-2222-4222-8222-222222222222 HTTP/1.1
Host: localhost:3333
Authorization: Bearer <TOKEN_JWT>
Content-Type: application/json

{ "title": "Em andamento" }
```

Resposta **200**:

```json
{
  "message": "Lista atualizada com sucesso",
  "list": {
    "id": "22222222-2222-4222-8222-222222222222",
    "title": "Em andamento",
    "position": 0,
    "boardId": "11111111-1111-4111-8111-111111111111",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:05:00.000Z"
  }
}
```

Códigos principais: **200** atualizada; **400** UUID/body inválido; **401** autenticação inválida; **403** role insuficiente; **404** List/Board inexistente ou sem acesso; **500** erro interno.

O frontend não envia PATCH quando o título normalizado permanece igual. Essa otimização é do cliente, não uma validação especial do endpoint.

## 4. Excluir List

**DELETE `/lists/:id`** — exclui permanentemente a List e renumera as posições restantes do mesmo Board a partir de zero, preservando a ordem.

- Autenticação: Bearer JWT.
- Permissões: OWNER, ADMIN ou MEMBER do Board real da List, com vínculo ao Workspace.
- Parâmetro de rota: `id`, UUID obrigatório da List.
- Body: não utilizado.
- Validações: List deve existir e o usuário deve ter acesso e role autorizada. Exclusão e ajuste de posições ocorrem em transação.

Requisição:

```http
DELETE /lists/22222222-2222-4222-8222-222222222222 HTTP/1.1
Host: localhost:3333
Authorization: Bearer <TOKEN_JWT>
```

Resposta **200**:

```json
{ "message": "Lista excluída com sucesso" }
```

Códigos principais: **200** excluída; **400** UUID inválido; **401** autenticação inválida; **403** role insuficiente; **404** List/Board inexistente ou sem acesso; **500** erro interno.

Não há restauração ou exclusão lógica. O modelo atual não possui Cards ou outros modelos filhos de List. A confirmação apresentada pelo frontend não é uma etapa adicional da API.

## 5. Reordenar Lists

**PATCH `/boards/:boardId/lists/reorder`** — define a ordem completa das Lists do Board, atribuindo posições consecutivas a partir de zero.

- Autenticação: Bearer JWT.
- Permissões: OWNER, ADMIN ou MEMBER do Board, com vínculo ao Workspace.
- Parâmetro de rota: `boardId`, UUID obrigatório.
- Body: `{ "listIds": ["UUID_DA_LIST_1", "UUID_DA_LIST_2"] }`.
- Validações: `listIds` deve ser um array de UUIDs contendo exatamente todas as Lists desse Board, sem repetições, IDs ausentes, inexistentes ou de outro Board. Campos adicionais do body são rejeitados. Para Board vazio, a coleção completa é `[]`. Ordem idêntica é aceita pelo backend.

Exemplo para um Board que contém exatamente as duas Lists indicadas:

```http
PATCH /boards/11111111-1111-4111-8111-111111111111/lists/reorder HTTP/1.1
Host: localhost:3333
Authorization: Bearer <TOKEN_JWT>
Content-Type: application/json

{
  "listIds": [
    "33333333-3333-4333-8333-333333333333",
    "22222222-2222-4222-8222-222222222222"
  ]
}
```

Resposta **200**, conforme o controller atual:

```json
{ "message": "Listas reordenadas com sucesso" }
```

**O PATCH não retorna `lists`.** Embora o caso de uso consulte e retorne a coleção internamente, o controller envia somente a mensagem. `listService.reorder()` consulta `GET /boards/:boardId/lists` após o PATCH quando a coleção não vem na resposta; esse GET confirma os objetos e a ordem persistida usados pelo frontend.

Códigos principais: **200** ordem persistida; **400** UUID/body inválido ou coleção incompleta/inválida; **401** autenticação inválida; **403** role insuficiente; **404** Board inexistente ou sem acesso; **500** erro interno, incluindo conflitos não resolvidos pelo tratamento atual. Não se deve depender de 409 como resposta garantida desta rota.

Exemplo de **400** para coleção incompatível com as Lists do Board:

```json
{
  "statusCode": 400,
  "message": "A ordem enviada deve conter todas as Lists do Board, sem IDs inválidos ou duplicados."
}
```

A atualização usa transação serializável e retenta conflitos Prisma `P2034` até três vezes. O frontend persiste somente no drop que muda a posição, bloqueia mutações conflitantes e não envia requisição a cada movimento do ponteiro. Se o GET posterior falhar, a ordem anterior pode ser restaurada **localmente**, seguida de reconciliação. Nenhum PATCH de rollback é enviado ao servidor. Se a consulta continuar falhando, a interface bloqueia mutações até a ação **Sincronizar Lists** recuperar o estado.

## Erros e cobertura

Erros de validação Zod retornam 400 com `statusCode`, `message: "Erro de validação"` e `issues`. Erros de autorização/recurso retornam a mensagem de `AppError`; erros inesperados retornam 500 com `message: "Erro interno do servidor"`. As respostas 401 do middleware possuem `message` e não garantem um campo `statusCode` no JSON.

A auditoria verificou 27 testes de API e 16 cenários reais de navegador, com zero falhas finais. Consulte [a auditoria](../LISTS_MILESTONE_5_AUDIT.md) para cenários, evidências e limitações. Não representa homologação de produção ou teste de carga.
