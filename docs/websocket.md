# WebSocket

## Visão Geral

O Clone do Trello utilizará **Socket.IO** para fornecer comunicação em tempo real entre clientes conectados.

O objetivo é sincronizar alterações instantaneamente, permitindo colaboração entre múltiplos usuários dentro de um mesmo Workspace ou Board.

Atualmente esta funcionalidade **ainda não foi implementada**.

---

# Tecnologias

- Socket.IO
- Fastify
- JWT
- React
- TypeScript

---

# Objetivos

Implementar sincronização em tempo real para:

- Movimentação de cartões
- Criação de cartões
- Atualização de cartões
- Exclusão de cartões
- Comentários
- Checklist
- Etiquetas
- Notificações
- Presença de usuários

---

# Arquitetura

```
Cliente A

↓

Socket.IO

↓

Servidor

↓

Socket.IO

↓

Cliente B
```

---

# Fluxo

```
Usuário move um cartão

↓

Evento emitido

↓

Servidor recebe

↓

Banco é atualizado

↓

Servidor emite evento

↓

Todos os usuários conectados recebem atualização
```

---

# Salas (Rooms)

O Socket.IO utilizará Rooms para organizar as conexões.

Planejamento:

```
Workspace

↓

Board

↓

Users
```

Cada usuário receberá apenas eventos relacionados aos Boards em que participa.

---

# Eventos Planejados

## Cliente → Servidor

```
board:join

board:leave

card:create

card:update

card:move

card:delete

comment:create

notification:read
```

---

## Servidor → Cliente

```
board:updated

card:created

card:updated

card:moved

card:deleted

comment:created

notification:new

user:online

user:offline
```

---

# Autenticação

A conexão WebSocket utilizará JWT.

Fluxo:

```
Cliente

↓

JWT

↓

Socket.IO

↓

Middleware

↓

Conexão autorizada
```

---

# Estado Atual

## Implementado

Nenhuma funcionalidade.

---

## Planejado

- Configuração do Socket.IO
- Middleware de autenticação
- Rooms
- Eventos
- Atualização em tempo real
- Notificações
- Indicador de usuários online

---

# Próximos Passos

Após a conclusão dos módulos de:

- Workspaces
- Boards
- Lists
- Cards

será iniciada a implementação da camada de comunicação em tempo real utilizando Socket.IO.