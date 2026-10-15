# Auditoria da Milestone 5 — Lists

Data: 15/10/2026, America/Sao_Paulo.

## Escopo e critérios de evidência

Auditoria de criação, listagem, edição, exclusão e reordenação de Lists, incluindo autenticação, permissões, PostgreSQL, integração React/API, concorrência e acessibilidade. Alterações preexistentes foram preservadas. Nenhuma funcionalidade de Cards foi implementada; roadmap e changelog não foram atualizados. Sem commit ou push.

Classificação usada neste documento:

- **Execução real automatizada:** requests Fastify contra PostgreSQL real ou ações Playwright em navegador real. Não são mocks do CRUD.
- **Teste automatizado com falha induzida:** interceptação de rede no navegador ou exceção controlada no Prisma, explicitamente indicada.
- **Inspeção estática:** leitura do código, contratos, configuração, schema, migration e CSS; não equivale a teste funcional.
- **Não verificado:** cenário sem execução suficiente nesta auditoria.

## Ambiente e isolamento

Windows, PowerShell, Node.js 22.20.0, PostgreSQL 16 no contêiner existente `trello_clone_postgres`, porta do host 5433. Backend Fastify 5.8.5, Prisma/adapter-pg 7.8.0. Frontend React 19, Vite 8 e dnd-kit. Playwright 1.64.1 com Microsoft Edge 155.0.4283.45 em modo headless.

Não havia suíte automatizada: `backend` tinha apenas um placeholder em `npm test`; `frontend` tinha scripts de lint e build. Foram adicionados testes focados usando `node:test` e o `tsx` já instalado no backend. Playwright foi adicionado somente como dependência de desenvolvimento do frontend.

Cada execução cria um banco novo `lists_audit_<UUID sem hífens>`, aplica os SQLs das migrations existentes nesse banco e cria exclusivamente fixtures descartáveis. A conexão do aplicativo é redirecionada apenas no processo de teste. Não são alterados `.env`, credenciais ou dados de desenvolvimento. Não há reset, truncation ou seed no banco existente. JWTs são gerados para os usuários das fixtures; login e recuperação de senha não fazem parte desta suíte.

O backend da auditoria escuta em porta livre e o Vite é iniciado exclusivamente para os testes. As APIs são exercitadas por `app.inject` e, nos testes de UI, também por HTTP real pelo Axios do aplicativo.

Na inspeção final somente de leitura, o PostgreSQL informou versão 16.14 e a tabela `public.BoardList` estava presente no banco configurado de desenvolvimento. As portas locais 3333 e 5173 não estavam disponíveis após o encerramento dos serviços temporários da suíte. Portanto, a integração foi comprovada nos serviços isolados iniciados pela auditoria, sem alegar que uma sessão de desenvolvimento ficou executando. A verificação final encontrou **zero bancos `lists_audit_*` remanescentes**.

A limpeza normal fecha navegador, Vite, Fastify e Prisma e remove somente o banco gerado pela própria execução. Execuções interrompidas exigiram limpeza adicional: `tests/audit-cleanup.mjs` valida o padrão do nome, os cinco emails exclusivos das fixtures, o marcador de Workspace e a ausência de conexões antes de remover um banco. Bancos ativos são preservados. Sem `--remove-verified`, o script apenas inspeciona.

## Reprodução

Instalar as dependências a partir dos lockfiles nos dois projetos e ter Edge instalado. O usuário PostgreSQL configurado precisa conseguir criar bancos temporários. Nenhuma migration é aplicada ao banco de desenvolvimento por estes testes.

```powershell
cd backend
npm.cmd run test:lists

# Somente API:
node --import tsx --test --test-name-pattern="API" tests/lists.audit.test.ts

# Somente navegador:
node --import tsx --test --test-name-pattern="Browser audit" tests/lists.audit.test.ts

# Inspecionar bancos de execuções interrompidas:
node tests/audit-cleanup.mjs
```

## Resultados da API — execução real automatizada

A bateria final de API executou **27 testes: 27 aprovados e 0 reprovados**. Cada teste pode verificar mais de uma requisição/assertion; esses números não são contagens de endpoints ou assertions.

| Funcionalidade | Evidência e comportamento HTTP |
| --- | --- |
| Criação | 201 com `list`; normaliza espaços; títulos vazios, somente espaços ou 101 caracteres retornam 400; aceita 100 caracteres. Campos extras da criação são descartados pelo Zod, e `position` enviado pelo cliente não é usado. |
| Listagem | 200 com `lists`; coleção vazia e várias Lists verificadas; ordenação por `position` confirmada. |
| Edição | 200 com `list`; preserva posição; título inválido retorna 400; List inexistente retorna 404. O schema de atualização é estrito por inspeção. |
| Exclusão | 200 com mensagem; remove a List; renumera as posições restantes a partir de zero; List inexistente retorna 404. |
| Reordenação | 200 com mensagem; GET posterior confirma persistência; ordem idêntica aceita; duplicação, omissão, ID de outro Board e ID inexistente retornam 400 sem alterar a ordem. |
| IDs inválidos | UUID inválido em GET, PATCH e DELETE retorna 400. |
| Board inexistente | GET/POST retornam 404. |
| Concorrência | Duas criações simultâneas resultam em posições 0 e 1 após correção. Duas reordenações simultâneas preservam coleção completa, posições contíguas e uma das ordens submetidas. Não é um teste de carga. |
| Erro interno induzido | Exceção controlada no acesso Prisma resulta em 500 com mensagem genérica; o texto sentinela da exceção não é exposto na resposta. Não representa indisponibilidade real do PostgreSQL. |

### Permissões — execução real automatizada

| Usuário | Leitura | Criar/editar/excluir/reordenar |
| --- | --- | --- |
| OWNER do Board | 200 | Permitido; ciclo completo executado |
| ADMIN do Board | 200 | Permitido; ciclo completo executado |
| MEMBER do Board | 200 | Permitido; ciclo completo executado |
| VIEWER do Board | 200 | 403 para as quatro mutações |
| Usuário externo ao Workspace/Board | 404 | 404; List original permanece intacta |
| Sem JWT, JWT inválido, expirado ou incompleto | 401 | 401 em todos os endpoints de Lists |

Também foi comprovada a rejeição de `Basic <JWT válido>` e de JWT assinado sem `sub` após a correção do middleware. A autorização considera o Board real da List, não um Board informado arbitrariamente no frontend. `BoardAccessService` verifica vínculo com Workspace e Board. Por inspeção, OWNER/ADMIN de Workspace podem ler Boards sem associação direta ao Board; essa exceção específica não foi exercitada como cenário separado.

## Resultados do navegador

Na execução final de `npm.cmd run test:lists`, os **16 cenários de navegador passaram**. O runner Node informou **44 registros aprovados e 0 reprovados**, sem cancelamentos ou skips: 27 testes de API + 16 cenários de navegador + 1 agrupador `Browser audit`. Há, portanto, **43 casos efetivos**, sem contar o agrupador como uma verificação adicional. Duração total: aproximadamente 54,6 segundos.

| Cenário real de navegador | Resultado |
| --- | --- |
| Estado vazio, validação, criação, edição/Enter/Escape, exclusão e ausência de reload | Aprovado |
| VIEWER sem controles e rolagem horizontal em viewport móvel | Aprovado |
| Reordenação por teclado com persistência | Aprovado |
| Reordenação por mouse e cancelamento do arraste por Escape | Aprovado |
| Erro induzido de edição preserva rascunho; erro de exclusão preserva modal | Aprovado |
| PATCH persistido, GETs bloqueados, mutações desabilitadas e recuperação por sincronização | Aprovado |
| Resposta antiga de carregamento do próprio Board | Aprovado |
| Resposta antiga de listagem das Lists após troca de Board | Aprovado |
| Resposta antiga de criação após troca de Board | Aprovado |
| Resposta antiga de edição após troca de Board | Aprovado |
| Resposta antiga de exclusão após troca de Board; Escape bloqueado durante DELETE | Aprovado |
| Resposta antiga de reordenação após troca de Board | Aprovado |
| Arraste por toque emulado com persistência | Aprovado |
| Permissão revogada durante edição: 403, rascunho preservado, controles ocultos após recarga | Aprovado |
| Tab/Shift+Tab contidos, Cancelar e × preservam List e restauram foco | Aprovado após correção |
| Título e posição inalterados não disparam PATCH | Aprovado |

Nos cenários de criação, edição e exclusão com resposta retida, dois cliques são enviados e a suíte confirma uma única requisição mutável. A espera de resposta é controlada por gates; os gates são liberados no teardown mesmo se uma assertion falhar.

O banco temporário da execução final, `lists_audit_09ba560313744620a9fe09901879d0f1`, foi removido pelo teardown, conforme saída explícita do runner. As execuções anteriores que falharam ou foram interrompidas não são somadas ao resultado final.

A suíte cobre: estado vazio, validação do formulário, criação, edição por Enter, cancelamento por Escape, modal, exclusão, ausência de reload, VIEWER, rolagem horizontal em viewport 375 × 812, teclado, mouse, toque, erros de edição/exclusão, falha de sincronização, respostas tardias, perda de permissão, contenção/restauração de foco e ações sem alteração.

As falhas de rede são induzidas por Playwright. Os cenários normais utilizam o backend e o PostgreSQL reais. O cenário de perda de permissão altera apenas a associação da fixture MEMBER para VIEWER imediatamente antes da requisição de edição: o backend deve responder 403, o rascunho deve ser preservado e, após atualizar os dados do Board, os controles devem desaparecer.

## Defeitos encontrados e correções

1. **Criação concorrente duplicava `position`:** duas requisições reais criavam Lists nas posições `[0, 0]`. O cálculo e a criação agora ocorrem na mesma transação serializável, com até três tentativas. Foi comprovado que o adaptador também emite `DriverAdapterError`/`TransactionWriteConflict` durante commit; a retentativa reconhece esse caso e o código Prisma `P2034`. Ao esgotar tentativas, responde 409 em vez de confirmar uma criação inconsistente.
2. **Autenticação aceitava esquema incorreto:** `Basic <JWT válido>` retornava 200. O middleware compartilhado passou a validar Bearer, ausência de segmentos adicionais e presença de `sub` não vazio. Não altera credenciais nem o formato dos tokens legítimos. A correção se aplica também às outras rotas que reutilizam esse middleware; os fluxos completos de login não foram retestados.
3. **Resposta antiga em `BoardPage`:** o carregamento original podia aplicar uma resposta de outro ID após navegação. Foram adicionados geração, descarte de resposta obsoleta, proteção da tentativa de recarga e bloqueio da renderização do Board cujo ID difere da rota. A proteção interna de `BoardLists` foi preservada.
4. **Lint de Lists:** atualização síncrona de estado no efeito de perda de permissão e rethrow sem `cause` geravam dois erros. A mudança de permissão agora é tratada condicionalmente no render, o efeito apenas ajusta a referência de arraste e o erro preserva a causa. Referências de cleanup foram ajustadas sem alterar as regras de lint.
5. **Foco no modal:** em teste real do Edge, Tab no último botão não retornava ao primeiro. Foi adicionada contenção explícita de Tab/Shift+Tab nos botões habilitados, mantendo o foco no diálogo quando todos estão desabilitados durante a exclusão. O diálogo nativo, Escape, foco inicial e restauração continuam sendo utilizados.

As primeiras execuções também encontraram erros nos próprios testes: expectativa equivocada de schema estrito na criação, contagem de navegação durante HMR, GETs duplicados por StrictMode, nome do botão durante carregamento, sincronização de ativação do sensor e coordenadas de toque fora da viewport. Esses ajustes não são registrados como defeitos do aplicativo.

## Reordenação: contrato, falhas e recuperação

**Execução real e inspeção concordam:** o caso de uso retorna a coleção, mas o controller descarta essa variável e responde apenas `{ message }`. O contrato público não foi alterado. `ReorderListsResponse.lists` permanece opcional e o serviço usa GET após o PATCH quando não recebe a coleção.

O frontend aplica a ordem otimista somente no drop válido, envia a coleção completa de IDs, bloqueia operações conflitantes e usa a coleção retornada ou consultada como confirmação. Uma falha do GET posterior não dispara PATCH de rollback. O rollback é apenas local; em seguida ocorre reconciliação com o servidor. Se a reconciliação falhar, `needsSync` bloqueia mutações e expõe a ação para sincronizar. Isso permite recuperar uma ordem que já foi persistida, sem sobrescrevê-la no servidor.

As respostas de criação, edição, exclusão, reordenação e sincronização são protegidas pela geração do Board. O componente interno é remontado com chave `boardId`. A exclusão aguarda criação/edição pendentes; a reordenação não inicia com essas operações em andamento. Durante persistência/reconciliação, novas mutações são bloqueadas. Rascunhos de edição permanecem no componente.

## Schema, migration e CSS — inspeção estática e execução isolada

- Model `BoardList` e migration correspondem: UUID, título, posição, timestamps, índices de Board/posição e FK para Board com cascade. Os SQLs de todas as migrations foram executados com sucesso nos bancos temporários.
- Não há Cards ou modelos filhos de List no schema atual. A exclusão não anuncia perda de dados associados inexistentes. A cascata existente vai do Board para suas Lists.
- Rotas de Lists estão registradas em `app.ts` e passam pelo middleware de autenticação.
- O CSS preserva colunas com largura fixa, overflow horizontal, indicadores de arraste/destino, controles desabilitados e foco visível. A revisão visual completa de todos os tamanhos e temas não foi realizada.
- O diálogo usa `showModal()` e os estilos tradicionais existentes; acessibilidade não foi aprovada por ferramenta de leitor de tela humano.

## Verificações estáticas e builds

| Comando | Resultado |
| --- | --- |
| Frontend: `npx.cmd tsc -p tsconfig.app.json --noEmit` | Aprovado |
| Frontend: `npm.cmd run build` | Aprovado; bundle principal 505,99 kB minificado, com aviso de chunk acima de 500 kB |
| Frontend: `npm.cmd run lint` | Aprovado na verificação final, sem alterar configuração de lint |
| Backend: `npx.cmd tsc --noEmit` | Aprovado |
| Backend: build/lint | Não há scripts de build ou lint configurados; não são apresentados como executados |
| Raiz: `git diff --check` | Aprovado, exit code 0; apenas avisos de normalização LF/CRLF |

Compilação e lint não são testes funcionais de navegador. A suíte TypeScript de testes roda via tsx; o tsconfig de produção do backend verifica `src` e não inclui os arquivos em `tests`.

## Limitações e riscos remanescentes

- Execuções locais no Edge headless, sem cobertura de Firefox, Safari, dispositivo móvel físico ou leitor de tela. Toque é emulação por eventos reais do protocolo do Chromium.
- A interface foi exercitada como OWNER e VIEWER, e como MEMBER no cenário de perda de permissão. ADMIN foi exercitado no ciclo completo de API, sem uma execução separada do mesmo ciclo de UI.
- Sem teste de carga ou cobertura exaustiva de criação/exclusão/reordenação simultâneas por muitos clientes. A coordenação do frontend cobre uma instância; não substitui a consistência transacional do servidor.
- Não há notificações de permissão em tempo real. Uma alteração remota pode permanecer visualmente antiga até a atualização dos dados, mas o backend rejeita mutações sem permissão.
- Alterações de terceiros entre PATCH e GET podem aparecer na coleção reconciliada; isso é o estado consultado do servidor, não garantia de que nenhuma outra pessoa editou o Board.
- O controller de reordenação continua sem devolver a coleção. O GET adicional é compatível, mas tem custo e possibilidade de falha próprios.
- As posições não possuem constraint única no banco. A transação de criação corrige a corrida comprovada; combinações de concorrência não exercitadas continuam exigindo cuidado.
- O aviso de bundle foi mantido. Não houve refatoração de carregamento ou alteração de configuração para escondê-lo.
- Algumas execuções foram interrompidas após falta de progresso do runner de navegador; resultados incompletos não contam como aprovações.

## Estado da milestone e recomendação

**Auditoria concluída e recomendada a passagem para documentação e revisão do commit**, considerando os 27 testes de API e os 16 cenários reais de navegador aprovados após as correções. CRUD e reordenação estão integrados no ambiente isolado utilizado. Os cinco defeitos de implementação identificados foram corrigidos; não há teste reprovado na execução final.

A recomendação não equivale a homologação de produção, teste de carga ou garantia de todas as combinações de concorrência. Permanecem as limitações descritas acima, o custo do GET após reordenação e o aviso de bundle. Leitor de tela, outros navegadores e dispositivo físico exigem validação complementar. Nenhum commit ou push foi realizado.

## Arquivos desta etapa

Criados:

- `backend/tests/lists.audit.test.ts`: fixtures isoladas, testes de API e navegador.
- `backend/tests/audit-cleanup.mjs`: inspeção e recuperação restrita de bancos temporários de auditorias interrompidas.
- `docs/LISTS_MILESTONE_5_AUDIT.md`: este relatório.

Modificados nesta etapa:

- `backend/package.json`: script `test:lists`; o placeholder `test` anterior foi preservado.
- `backend/src/modules/lists/use-cases/create-list.use-case.ts`: consistência da criação concorrente.
- `backend/src/middlewares/auth.middleware.ts`: validação do esquema Bearer e do subject.
- `frontend/package.json` e `frontend/package-lock.json`: Playwright como dependência de desenvolvimento.
- `frontend/src/features/boards/pages/BoardPage.tsx`: proteção do carregamento que alimenta Lists na troca de Board.
- `frontend/src/features/lists/components/BoardLists.tsx`: correções de lint e cleanup de geração.
- `frontend/src/features/lists/components/DeleteListModal.tsx`: referência de fallback de foco e contenção de Tab.

Schema, migrations, `app.ts`, CSS e os demais arquivos de Lists tinham alterações anteriores e foram inspecionados, sem novas modificações de implementação nesta etapa.

## Estado do Git ao finalizar

`git status --short` inclui as alterações desta etapa e as preexistentes:

```text
 M backend/package.json
 M backend/prisma/schema.prisma
 M backend/src/app.ts
 M backend/src/middlewares/auth.middleware.ts
 M frontend/package-lock.json
 M frontend/package.json
 M frontend/src/features/boards/pages/BoardPage.tsx
 M frontend/src/index.css
?? backend/prisma/migrations/20261007003215_create_board_listt/
?? backend/src/modules/lists/
?? backend/tests/
?? docs/LISTS_MILESTONE_5_AUDIT.md
?? frontend/src/features/lists/
```
