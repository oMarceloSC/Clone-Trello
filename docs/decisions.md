# Architectural Decisions

Este documento registra todas as decisões arquiteturais tomadas durante o desenvolvimento do Clone do Trello.

Cada ADR (Architecture Decision Record) documenta uma decisão importante, seu contexto, os motivos da escolha e as consequências para o projeto.

---

# ADR-001 — Fastify como Framework HTTP

## Status

Aceita

## Contexto

Era necessário escolher um framework HTTP para construção da API.

## Decisão

Utilizar o Fastify.

## Motivos

- Excelente desempenho.
- Baixo consumo de memória.
- Ecossistema moderno.
- Suporte nativo ao TypeScript.
- Ótima integração com plugins.

## Consequências

Toda a API REST será construída utilizando Fastify.

---

# ADR-002 — Prisma ORM

## Status

Aceita

## Contexto

Era necessário escolher uma ferramenta para acesso ao banco de dados.

## Decisão

Utilizar Prisma ORM.

## Motivos

- Excelente integração com TypeScript.
- Tipagem automática.
- Sistema de migrations.
- Alta produtividade.
- Documentação excelente.

## Consequências

Todo acesso ao banco será realizado através do Prisma Client.

---

# ADR-003 — PostgreSQL

## Status

Aceita

## Contexto

O sistema precisava de um banco de dados relacional para suportar múltiplos relacionamentos.

## Decisão

Utilizar PostgreSQL.

## Motivos

- Banco robusto.
- Excelente integração com Prisma.
- Alta confiabilidade.
- Escalabilidade.
- Compatível com ambientes de produção.

## Consequências

Toda a persistência de dados será baseada em PostgreSQL.

---

# ADR-004 — Docker

## Status

Aceita

## Contexto

Era necessário padronizar o ambiente de desenvolvimento.

## Decisão

Executar o PostgreSQL através do Docker.

## Motivos

- Ambiente reproduzível.
- Facilidade de configuração.
- Portabilidade.
- Menor dependência do ambiente local.

## Consequências

O banco será iniciado através do Docker Compose.

---

# ADR-005 — Arquitetura Modular

## Status

Aceita

## Contexto

O projeto precisava de uma organização escalável.

## Decisão

Separar o backend por módulos.

Cada módulo possui:

- Controllers
- Routes
- Schemas
- Use Cases
- Types

## Motivos

- Baixo acoplamento.
- Organização.
- Escalabilidade.
- Fácil manutenção.

## Consequências

Novos módulos seguirão exatamente a mesma estrutura.

---

# ADR-006 — Use Cases

## Status

Aceita

## Contexto

Era necessário separar regras de negócio da camada HTTP.

## Decisão

Utilizar Use Cases ao invés de Services genéricos.

## Motivos

Cada arquivo executa apenas uma responsabilidade.

Exemplo:

```
register.use-case.ts

login.use-case.ts

create-workspace.use-case.ts

invite-workspace-member.use-case.ts
```

## Consequências

A lógica de negócio permanece desacoplada dos Controllers.

---

# ADR-007 — Zod

## Status

Aceita

## Contexto

Era necessário validar todas as entradas da API.

## Decisão

Utilizar Zod.

## Motivos

- Tipagem integrada.
- Simplicidade.
- Excelente integração com TypeScript.
- Alto desempenho.

## Consequências

Todos os Schemas serão implementados utilizando Zod.

---

# ADR-008 — JWT

## Status

Aceita

## Contexto

Era necessário implementar autenticação.

## Decisão

Utilizar JSON Web Token (JWT).

## Motivos

- Stateless.
- Amplamente utilizado.
- Fácil integração.
- Boa escalabilidade.

## Consequências

Todas as rotas protegidas utilizarão autenticação via Bearer Token.

---

# ADR-009 — Documentação Modular

## Status

Aceita

## Contexto

A documentação cresceria significativamente durante o desenvolvimento.

## Decisão

Separar a documentação em múltiplos arquivos.

## Motivos

- Organização.
- Escalabilidade.
- Facilidade de manutenção.
- Melhor experiência de leitura.

## Consequências

Cada domínio da aplicação possui sua própria documentação.

---

# ADR-010 — React

## Status

Aceita

## Contexto

Era necessário escolher uma biblioteca para construção da interface.

## Decisão

Utilizar React.

## Motivos

- Grande adoção pelo mercado.
- Excelente integração com TypeScript.
- Ecossistema maduro.
- Componentização.
- Facilidade de manutenção.

## Consequências

Toda a interface será construída utilizando React.

---

# ADR-011 — Vite

## Status

Aceita

## Contexto

Era necessário escolher uma ferramenta moderna para desenvolvimento do frontend.

## Decisão

Utilizar Vite.

## Motivos

- Inicialização extremamente rápida.
- Build otimizado.
- Hot Reload eficiente.
- Configuração simples.
- Excelente integração com React.

## Consequências

O frontend utilizará toda a estrutura padrão do Vite.

---

# ADR-012 — Axios

## Status

Aceita

## Contexto

Era necessário definir uma biblioteca para comunicação HTTP.

## Decisão

Utilizar Axios.

## Motivos

- Interceptadores.
- Configuração global.
- Facilidade para autenticação JWT.
- Tratamento centralizado de erros.

## Consequências

Toda comunicação entre frontend e backend será realizada através de uma instância compartilhada do Axios.

---

# ADR-013 — React Hook Form + Zod

## Status

Aceita

## Contexto

Era necessário definir um padrão para formulários.

## Decisão

Utilizar React Hook Form integrado ao Zod.

## Motivos

- Excelente desempenho.
- Poucos re-renders.
- Código simples.
- Integração nativa com Zod.

## Consequências

Todos os formulários seguirão o mesmo padrão.

---

# ADR-014 — Context API

## Status

Aceita

## Contexto

Era necessário definir uma estratégia de gerenciamento de estado.

## Decisão

Utilizar Context API.

## Motivos

- Solução nativa.
- Simples.
- Pouca complexidade.
- Suficiente para a fase atual.

## Consequências

Caso a aplicação cresça significativamente, poderá ser adotado Zustand ou TanStack Query.

---

# ADR-015 — Feature-Based Architecture (Frontend)

## Status

Aceita

## Contexto

Era necessário definir a organização do frontend.

## Decisão

Organizar o frontend por funcionalidades.

Exemplo:

```
features

auth

workspaces

boards

lists

cards
```

## Motivos

- Melhor escalabilidade.
- Organização.
- Baixo acoplamento.
- Facilidade para manutenção.
- Estrutura semelhante ao backend.

## Consequências

Novas funcionalidades serão adicionadas seguindo essa arquitetura.

---

# ADR-016 — API First

## Status

Aceita

## Contexto

O projeto será desenvolvido simultaneamente entre backend e frontend.

## Decisão

Adotar a abordagem API First.

## Motivos

- Backend independente.
- Facilidade de testes.
- Reutilização da API.
- Possibilidade de múltiplos clientes (Web, Mobile, Desktop).

## Consequências

Toda funcionalidade será implementada primeiro na API e posteriormente consumida pelo frontend.

---

# ADR-017 — Desenvolvimento Incremental

## Status

Aceita

## Contexto

O projeto possui grande complexidade e múltiplos módulos.

## Decisão

Desenvolver o sistema por milestones.

## Ordem

```
Auth

↓

Workspaces

↓

Boards

↓

Lists

↓

Cards

↓

Comments

↓

Labels

↓

Attachments

↓

Notifications

↓

WebSocket
```

## Consequências

Cada módulo será completamente finalizado antes do início do próximo.

---

# Próximas ADRs

As próximas decisões arquiteturais previstas são:

- Socket.IO
- Upload de Arquivos
- Sistema de Notificações
- Cache
- Logs
- Observabilidade
- Deploy
- CI/CD
- Testes Automatizados
- Monitoramento