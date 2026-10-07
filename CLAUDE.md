# Projeto: CRM B2B (cotações, rastreio, financeiro, bot) — Next.js + Supabase

## Regras de ouro
1. UMA tarefa por sessão. Comece lendo SOMENTE `.plan/state.json` e o card da tarefa em `.plan/tasks.md`. Não leia o repo inteiro.
2. Nunca invente: nomes de tabelas, colunas, funções, pacotes, versões ou endpoints. Se não estiver no código ou nos docs oficiais, PERGUNTE ou marque como `open_question` em state.json.
3. Antes de editar um arquivo, leia-o. Antes de usar uma biblioteca, confira a versão em package.json e a doc oficial (web_fetch) se a API for incerta.
4. Entregue em diffs pequenos. Não reescreva arquivos inteiros sem necessidade. Não refatore fora do escopo do card.
5. "Pronto" = todos os comandos do campo `done_when` passam e a saída está colada em `evidence`. Sem evidência, status continua `in_progress`.
6. Ao terminar (ou travar), atualize `.plan/state.json` e pare. Não comece a próxima tarefa.
7. Respostas curtas: sem recapitular o plano, sem explicar o óbvio. Reporte: arquivos alterados, comandos rodados, resultado, pendências.

## Segurança (inegociável)
- Toda tabela de negócio tem `organization_id uuid not null` + RLS ativa. Cliente do portal só vê linhas do seu `customer_id`.
- `organization_id` e `customer_id` vêm da SESSÃO/JWT, nunca do body nem do LLM.
- SQL: apenas queries parametrizadas/RPC tipada. Proibido concatenar string em SQL. `SECURITY DEFINER` sempre com `search_path` fixo.
- Service role só em servidor/workers. Nunca em código de navegador nem em `NEXT_PUBLIC_*`.
- Todo input externo passa por Zod. Webhooks: HMAC + timestamp + idempotência.
- LLM nunca recebe SQL livre nem service role: só ferramentas tipadas e com escopo. Ações irreversíveis exigem aprovação humana.
- Segredos nunca em logs, commits ou respostas.

## Stack fixa (não troque sem registrar decisão)
pnpm + turborepo · apps/admin · apps/portal · packages/{db,core,ai} · workers/ · Supabase (Postgres, Auth, Storage, Realtime) · Zod · Vitest · Playwright