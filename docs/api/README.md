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
workspaces.md
```

Endpoints atuais:

- POST /workspaces
- GET /workspaces

---

## Boards

Arquivo:

```
boards.md
```

Endpoints planejados.

---

## Lists

Arquivo:

```
lists.md
```

Endpoints planejados.

---

## Cards

Arquivo:

```
cards.md
```

Endpoints planejados.

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

Versão atual:

```
v0.2.0
```

Consulte também:

```
docs/changelog.md
```