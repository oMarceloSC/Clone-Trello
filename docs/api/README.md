# API Documentation

## Visão Geral

Esta pasta contém toda a documentação da API REST do Clone do Trello.

A documentação foi organizada por módulos para facilitar manutenção e consulta, seguindo um padrão semelhante ao utilizado em projetos profissionais.

Todas as rotas da API utilizam o padrão REST e retornam respostas em formato JSON.

---

# Base URL

## Desenvolvimento

```
http://localhost:3333
```

## Produção

```
Em definição
```

---

# Autenticação

A autenticação da API é realizada utilizando **JWT (JSON Web Token)**.

Após efetuar login, o cliente deve enviar o token em todas as rotas protegidas.

Exemplo:

```
Authorization: Bearer TOKEN
```

---

# Módulos

## Auth

Documentação referente à autenticação.

Arquivo:

```
auth.md
```

Endpoints:

- POST /auth/register
- POST /auth/login
- GET /auth/me

---

## Workspaces

Gerenciamento de Workspaces.

Arquivo:

```
workspace.md
```

Endpoints atuais: CRUD de Workspaces, listagem/alteração/remoção de membros, criação de convites e aceitação/listagem de convites pendentes. Consulte [Workspaces](workspace.md).

---

## Boards

Arquivo:

```
boards.md
```

Milestone 4 implementada: CRUD, favoritos, arquivamento/restauração, listagem de arquivados e quatro endpoints de membros. Contratos e permissões em [Boards API](boards.md).

---

## Lists

Arquivo:

```
lists.md
```

Milestone 5 implementada. Contratos e permissões em [Lists API](lists.md):

- `POST /boards/:boardId/lists`
- `GET /boards/:boardId/lists`
- `PATCH /lists/:id`
- `DELETE /lists/:id`
- `PATCH /boards/:boardId/lists/reorder`

O PATCH de reordenação retorna somente uma mensagem; o frontend consulta novamente a coleção por GET para confirmar a ordem.

---

## Cards

A Milestone 6 já disponibiliza CRUD, reordenação, movimentação entre Lists do mesmo Board, arquivamento e restauração. Consulte as nove rotas e suas permissões na [API de Cards](cards.md).

---

## Comments

Arquivo:

```
comments.md
```

---

## Labels

Arquivo:

```
labels.md
```

---

## Attachments

Arquivo:

```
attachments.md
```

---

## Notifications

Arquivo:

```
notifications.md
```

---

## Search

Arquivo:

```
search.md
```

---

# Códigos HTTP

| Código | Descrição |
|---------|-----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# Versionamento

O histórico funcional segue as versões documentadas por milestone no [Changelog](../changelog.md), incluindo a Milestone 5 — Lists em `0.5.0`. As rotas atuais não possuem prefixo de versão. Essa referência documental não altera a versão dos pacotes nem o campo `version` do endpoint raiz.
