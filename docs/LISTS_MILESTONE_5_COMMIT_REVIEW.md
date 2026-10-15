# Milestone 5 — Documentação e revisão final para commit

Data: 15/10/2026, America/Sao_Paulo. Revisão do Passo 15, sem staging, commit ou push.

## Escopo documental

Nesta etapa foram modificados somente documentos. Foram comparados por SHA-256 os 30 arquivos não documentais que já estavam modificados/não rastreados no início: permaneceram idênticos, incluindo código, testes, migration e dependências. O build gerou apenas artefatos locais ignorados pelo Git.

O relatório [LISTS_MILESTONE_5_AUDIT.md](LISTS_MILESTONE_5_AUDIT.md) foi preservado integralmente. Seu SHA-256 antes e depois desta etapa é `6A80FB376B8C5AC21E242F13A20FF95C14354F14CC1ACD14A3DD4EF29D4D599E`. As evidências desta nova execução estão neste documento, sem substituir os resultados históricos da auditoria.

Não existem `API.md`, `CHANGELOG.md` ou `ROADMAP.md` na raiz. Foram utilizados os caminhos reais já adotados pelo repositório:

| Documento atualizado | Alteração |
| --- | --- |
| `docs/api/lists.md` | Cinco endpoints, autenticação, permissões, parâmetros, validações, exemplos HTTP/JSON, códigos de resposta e confirmação da reordenação por GET. O arquivo já era rastreado, mas estava vazio. |
| `docs/api/README.md` | Índice de Lists implementadas e substituição da referência de versão documental desatualizada. |
| `docs/changelog.md` | Entrada `0.5.0 — Lists`, seguindo a sequência documental `0.1.0` a `0.4.0`, sem remover entradas anteriores ou alterar versões de pacotes/tags. |
| `docs/roadmap.md` | Milestone 5 concluída no escopo implementado/auditado, com limitações; Cards continuam pendentes. |
| `README.md` | Funcionalidades de Lists, dnd-kit, testes, requisitos de PostgreSQL/Edge, comandos e links. As demais seções foram preservadas. |

Este documento é o único arquivo novo do Passo 15. Os demais arquivos novos listados abaixo já existiam ao iniciar esta etapa.

## Revisão técnica dos contratos

Foram inspecionados módulo de Lists, registro em `app.ts`, schema/migration, permissões, middleware, serviços/tipos/componentes de Lists, integração com `BoardPage`, CSS e scripts de testes.

- Criação: 201 com mensagem e `list`; título obrigatório após `trim()`, máximo 100; campos extras descartados. Conflitos de criação reconhecidos têm retentativas e podem resultar em 409 ao esgotar tentativas.
- Listagem: 200 com `lists`, ordenação por posição; OWNER/ADMIN do Workspace têm acesso de visualização mesmo sem BoardMember.
- Edição: 200 com mensagem e `list`; body estrito, somente título; posição preservada.
- Exclusão: 200 com mensagem; permanente, com renumeração transacional das posições restantes.
- Reordenação: 200 **somente com mensagem**. O controller não envia a coleção retornada pelo caso de uso. O serviço realiza GET quando ela não vem e reconcilia o estado confirmado. A documentação não promete `lists` no PATCH nem 409 garantido para essa rota.
- Mutações exigem OWNER, ADMIN ou MEMBER do Board e vínculo com Workspace; VIEWER é somente leitura. A autorização final continua no backend.

## Verificações realmente repetidas nesta etapa

| Diretório | Comando | Resultado |
| --- | --- | --- |
| `frontend` | `npx.cmd tsc -p tsconfig.app.json --noEmit` | Exit 0, sem erros |
| `frontend` | `npm.cmd run lint` | Exit 0, sem erros ou avisos |
| `frontend` | `npm.cmd run build` | Exit 0; 196 módulos, JS principal 505,99 kB / gzip 150,91 kB; permanece aviso de chunk acima de 500 kB |
| `backend` | `npx.cmd tsc --noEmit` | Exit 0, sem erros |
| `backend` | `npm.cmd run test:lists` | Exit 0; 44 registros aprovados, zero falhas, zero cancelamentos, zero skips; aproximadamente 54,4 s |
| raiz | `git diff --check` | Exit 0 para o diff rastreado; avisos de normalização LF/CRLF não representam falha. A revisão separada dos não rastreados encontrou as duas ocorrências descritas abaixo. |

Os 44 registros do runner correspondem a **27 testes de API + 16 cenários reais de navegador + 1 agrupador**. São 43 casos efetivos, e não 44 cenários independentes. PostgreSQL real e Edge headless foram utilizados novamente. Não se trata apenas de compilação ou análise estática.

Essa execução usou o banco descartável `lists_audit_955484d072da47a8aec9aff3a149b57d`; o teardown confirmou sua remoção. Não houve reset, seed ou exclusão no banco de desenvolvimento. Nenhuma credencial ou arquivo `.env` foi alterado. Não foi executada limpeza manual de bancos nesta etapa.

## Revisão de segurança e arquivos locais

Foi revisado o conjunto de arquivos modificados e não rastreados, além da situação dos arquivos de ambiente no índice. A varredura não imprimiu valores sensíveis.

- Não foram encontrados JWTs literais, chaves privadas, credenciais de produção, dumps, backups ou logs nos arquivos pendentes para este commit. Referências a `JWT_SECRET`/`DATABASE_URL` usam variáveis de ambiente; exemplos usam placeholders; fixtures usam nomes de roles e domínio `.invalid`.
- `backend/.env` é ignorado e não está destinado ao commit.
- `frontend/.env` já está rastreado em commit anterior. Contém somente `VITE_API_URL` apontando para loopback, sem credenciais na URL. Não foi alterado ou removido; não há um segredo novo nesse arquivo. Não deve receber segredos de backend.
- `backend/node_modules`, `frontend/node_modules` e `frontend/dist` são ignorados. Nenhum artefato desses diretórios aparece nos candidatos do Git.
- A migration pendente é SQL de estrutura de `BoardList`, sem dump ou dados pessoais. O nome existente `20261007003215_create_board_listt` foi preservado.
- Os testes criam um banco de nome aleatório, comprovam que o criaram antes do teardown e só o aplicativo no processo de teste recebe essa conexão. Tokens das fixtures são gerados em memória, sem gravação de tokens ou credenciais nos arquivos versionáveis.
- `audit-cleanup.mjs` apenas inspeciona por padrão. A remoção exige `--remove-verified`, nome `lists_audit_` com 32 caracteres hexadecimais, ausência de conexões, os cinco emails exclusivos das fixtures e o marcador do Workspace. Não usa `FORCE`; uma conexão nova faz a exclusão falhar. O banco da conexão administrativa está ativo e, portanto, é preservado. O script não foi modificado ou usado para remover bancos nesta etapa.

Essas verificações não constituem uma auditoria de todo o histórico Git ou garantia de ausência de qualquer segredo antigo. Não foi identificado impedimento de segurança no conjunto pendente da Milestone 5.

## Inventário do Git

Foram executados `git status --short`, `git diff --stat`, `git diff --check`, `git diff --name-only` e `git ls-files --others --exclude-standard`. Os arquivos não rastreados foram considerados; o diff simples não contém sua implementação integral.

A verificação separada encontrou **dois espaços de fim de linha preexistentes** em `backend/src/modules/lists/controller/list.controller.ts`, linhas 13 e 38. Eles não aparecem no `git diff --check` atual porque o arquivo é não rastreado. São uma pendência cosmética, sem falha funcional; foram preservados porque o Passo 15 proíbe alterar código de produção sem nova autorização. Caso se exija um patch completo sem whitespace antes do commit, essa correção precisa ser autorizada ou realizada pelo responsável. Nenhuma outra ocorrência foi encontrada nos 24 arquivos não rastreados. Os links Markdown locais dos seis documentos editados/criados foram conferidos: zero links quebrados.

Arquivos rastreados modificados, incluindo alterações anteriores da Milestone 5:

```text
README.md
backend/package.json
backend/prisma/schema.prisma
backend/src/app.ts
backend/src/middlewares/auth.middleware.ts
docs/api/README.md
docs/api/lists.md
docs/changelog.md
docs/roadmap.md
frontend/package-lock.json
frontend/package.json
frontend/src/features/boards/pages/BoardPage.tsx
frontend/src/index.css
```

Arquivos não rastreados a considerar explicitamente na revisão do futuro commit:

```text
backend/prisma/migrations/20261007003215_create_board_listt/migration.sql
backend/src/modules/lists/controller/list.controller.ts
backend/src/modules/lists/routes/list.routes.ts
backend/src/modules/lists/schemas/create-list.schema.ts
backend/src/modules/lists/schemas/delete-list.schema.ts
backend/src/modules/lists/schemas/list-lists.schema.ts
backend/src/modules/lists/schemas/reorder-lists.schema.ts
backend/src/modules/lists/schemas/update-list.schema.ts
backend/src/modules/lists/use-cases/create-list.use-case.ts
backend/src/modules/lists/use-cases/delete-list.use-case.ts
backend/src/modules/lists/use-cases/list-lists.use-case.ts
backend/src/modules/lists/use-cases/reorder-lists.use-case.ts
backend/src/modules/lists/use-cases/update-list.use-case.ts
backend/tests/audit-cleanup.mjs
backend/tests/lists.audit.test.ts
docs/LISTS_MILESTONE_5_AUDIT.md
docs/LISTS_MILESTONE_5_COMMIT_REVIEW.md
frontend/src/features/lists/components/BoardLists.tsx
frontend/src/features/lists/components/CreateListForm.tsx
frontend/src/features/lists/components/DeleteListModal.tsx
frontend/src/features/lists/components/ListColumn.tsx
frontend/src/features/lists/components/SortableListColumn.tsx
frontend/src/features/lists/services/list.service.ts
frontend/src/features/lists/types/list.types.ts
```

Total esperado: 13 arquivos rastreados modificados e 24 não rastreados. Não foram executados `git add`, `git commit` ou `git push`; nenhum arquivo está preparado no staging por esta etapa.

## Preparação do commit e próxima milestone

**Conjunto funcionalmente pronto para revisão e autorização do commit da Milestone 5, com a ressalva de formatação das duas linhas do controller não rastreado.** Não há teste reprovado ou segredo identificado no conjunto pendente. Mantêm-se as limitações do relatório de auditoria: sem homologação de produção, teste de carga, outros navegadores, dispositivo físico ou leitor de tela. O GET após o PATCH de reordenação e o aviso de bundle permanecem conhecidos e documentados. Não há implementação de Cards.

O histórico recente usa descrições curtas em inglês, como `complete board management milestone`; o README declara Conventional Commits. Sugestão conciliando a redação recente e a convenção documentada:

```text
feat(lists): complete list management milestone
```

Essa mensagem descreve o conjunto completo pendente (implementação, correções, testes e documentação), não apenas as alterações documentais do Passo 15. A próxima etapa funcional do roadmap é **Milestone 6 — Cards**, que não foi iniciada.
