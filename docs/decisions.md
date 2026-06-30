# Architectural Decisions

Este documento registra as principais decisões arquiteturais tomadas durante o desenvolvimento do projeto.

---

# ADR-001 — Fastify

## Decisão

Utilizar Fastify como framework HTTP.

## Motivos

- Excelente desempenho.
- Baixo consumo de memória.
- Suporte nativo ao TypeScript.
- Ecossistema moderno.

---

# ADR-002 — Prisma ORM

## Decisão

Utilizar Prisma ORM.

## Motivos

- Excelente integração com TypeScript.
- Sistema de Migrations.
- Tipagem automática.
- Produtividade.

---

# ADR-003 — PostgreSQL

## Decisão

Utilizar PostgreSQL.

## Motivos

- Banco relacional robusto.
- Excelente integração com Prisma.
- Escalabilidade.
- Suporte a ambientes de produção.

---

# ADR-004 — Docker

## Decisão

Executar o banco de dados através do Docker.

## Motivos

- Ambiente padronizado.
- Facilidade de configuração.
- Portabilidade.

---

# ADR-005 — Arquitetura Modular

## Decisão

Organizar o backend por módulos.

Cada módulo possui:

- Controllers
- Routes
- Schemas
- Use Cases
- Types

## Motivos

- Organização.
- Escalabilidade.
- Baixo acoplamento.

---

# ADR-006 — Use Cases

## Decisão

Utilizar Use Cases em vez de Services genéricos.

## Motivos

Cada arquivo executa apenas uma responsabilidade.

Exemplo:

```
register.use-case.ts

login.use-case.ts

create-workspace.use-case.ts
```

Isso mantém o código pequeno e facilita manutenção e testes.

---

# ADR-007 — Zod

## Decisão

Utilizar Zod para validação.

## Motivos

- Tipagem integrada.
- Simplicidade.
- Excelente integração com TypeScript.

---

# ADR-008 — JWT

## Decisão

Utilizar JWT para autenticação.

## Motivos

- Stateless.
- Simples.
- Amplamente utilizado.

---

# ADR-009 — Estrutura da Documentação

## Decisão

Separar a documentação em múltiplos arquivos.

## Motivos

- Melhor organização.
- Facilidade de manutenção.
- Escalabilidade.
- Leitura mais agradável.

---

# Próximas ADRs

Conforme o projeto evoluir, novas decisões arquiteturais serão documentadas.

Exemplos:

- Socket.IO
- Upload de arquivos
- Sistema de permissões
- Cache
- Logs
- Deploy