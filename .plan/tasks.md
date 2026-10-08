# T001

- deps: []
- ler: []
- criar/alterar: package.json, pnpm-workspace.yaml, turbo.json, tsconfig.base.json, apps/admin, apps/portal, packages/db, packages/core, packages/ai, workers/
- fazer:
  - Criar pnpm workspace + turborepo com os 2 apps Next.js (TypeScript estrito) e os 3 pacotes + workers.
  - Configurar scripts raiz: build, typecheck, lint, test.
  - Fixar versões de Node (.nvmrc) e pnpm (packageManager).
- done_when: `pnpm install && pnpm build && pnpm typecheck && pnpm lint`
- fora_de_escopo: qualquer feature, tela, tabela ou autenticação.

# T002

- deps: [T001]
- ler: [package.json]
- criar/alterar: .github/workflows/ci.yml, .gitleaks.toml
- fazer:
  - Pipeline com typecheck, lint, test, gitleaks e `pnpm audit --prod`.
  - Rodar em PR e em push na main; cache do pnpm.
- done_when: workflow válido (`actionlint` se disponível) e gitleaks local sem achados: `gitleaks detect --no-git -v`
- fora_de_escopo: deploy, proteção de branch (anotar como pendência manual).

# T003

- deps: [T002]
- ler: [packages/core/src/env.ts, packages/core/src/env.test.ts, .env.example, .eslintrc.cjs]
- criar/alterar: packages/core/src/env.ts, packages/core/src/env.test.ts, .env.example, .eslintrc.cjs, apps/admin/.eslintrc.cjs, apps/portal/.eslintrc.cjs, packages/core/.eslintrc.cjs, packages/core/eslint-env-security.mjs
- fazer:
  - Criar parser Zod para variáveis públicas e servidores.
  - Separar `NEXT_PUBLIC_` da variável de servidor e rejeitar chaves sensíveis expostas ao cliente.
  - Fornecer contrato de ambiente seguro para os apps e packages.
- done_when: `pnpm --filter @crm/core test && pnpm --filter @crm/core lint` e `pnpm typecheck && pnpm lint`
- fora_de_escopo: qualquer alteração de schema de banco, autenticação ou rotas.

# T004

- deps: [T003]
- ler: [package.json, package-lock.json, pnpm-lock.yaml, pnpm-workspace.yaml, turbo.json, apps/admin/package.json, apps/portal/package.json, packages/core/src/env.ts]
- criar/alterar: configuração Vercel (`vercel.json`) e configuração do workspace/instalação/build; lockfiles somente se necessário
- fazer:
  - Investigar por que o deploy executa instalação com npm e não encontra `pnpm-lock.yaml` nem `next`.
  - Ajustar a configuração versionada para instalar as dependências do workspace com pnpm e executar os builds dos apps.
  - Corrigir a propagação das variáveis de ambiente do Turbo sem expor segredos ao cliente nem adicioná-los ao cache.
- done_when: `pnpm install --frozen-lockfile && pnpm build`; validar configuração de output e conteúdo renderizado nos projetos Vercel de admin e portal; adicionar saída sanitizada ao evidence em `.plan/state.json`.
- fora_de_escopo: mudanças em credenciais do Supabase ou configurações exclusivas do painel Vercel não versionadas.

# T005

- deps: [T004]
- ler: [apps/admin/src/app/page.tsx, apps/admin/src/app/layout.tsx, apps/admin/package.json, supabase/schema.sql]
- criar/alterar: apps/admin/src/app/page.tsx, apps/admin/src/app/globals.css, apps/admin/src/app/layout.tsx, apps/admin/src/app/page.test.tsx, dependências do app admin somente se necessário
- fazer:
  - Criar a interface inicial do painel administrativo do CRM B2B inspirada em plataformas modernas de atendimento WhatsApp, usando o exemplo fornecido como referência visual sem copiar sua implementação.
  - Entregar navegação lateral, cabeçalho, visão geral com indicadores operacionais, conversas recentes e estado de atendimento responsivo.
  - Usar conteúdo demonstrativo explícito; não simular integração real, dados de negócio persistidos ou ações que não estejam implementadas.
  - Manter a página do portal inalterada.
- done_when: `pnpm --filter @crm/admin test && pnpm --filter @crm/admin lint && pnpm --filter @crm/admin typecheck && pnpm --filter @crm/admin build`
- fora_de_escopo: persistência, autenticação, integração WhatsApp/Supabase, fluxos funcionais de envio, telas completas do portal.

# T006

- deps: [T005]
- ler: [apps/admin/src/app/page.tsx, apps/admin/src/app/globals.css, apps/admin/src/app/layout.tsx, apps/admin/src/app/page.test.tsx]
- criar/alterar: arquivos versionados da interface admin e evidências em .plan/state.json
- fazer:
  - Revisar o diff da interface para erros críticos, dados/segredos expostos e comportamentos apresentados incorretamente como integrações reais.
  - Rodar verificações de qualidade do app admin.
  - Se aprovado, criar commit apenas com os arquivos da interface e evidência, enviar para origin/main e verificar o deploy do projeto admin.
- done_when: checks do app admin aprovados; commit e push confirmados; deployment admin contém a nova interface ou registrar claramente falha externa de deploy.
- fora_de_escopo: publicar o portal, alterações no painel Vercel, adicionar integrações reais ou incluir arquivos alheios ao admin.

# T007

- deps: [T006]
- ler: [apps/portal/src/app/page.tsx, apps/portal/src/app/layout.tsx, apps/portal/package.json, supabase/schema.sql]
- criar/alterar: UI do portal em apps/portal/src/app e testes relacionados; .plan/state.json
- fazer:
  - Definir e implementar a primeira interface do portal B2B voltada ao cliente, independente do painel admin.
  - Confirmar o escopo funcional antes de tratar cotações, pedidos/rastreio e financeiro como telas ou fluxos implementados.
  - Usar dados demonstrativos explicitamente identificados enquanto não houver autenticação e integração real; não expor dados de outras organizações/clientes.
- done_when: escopo confirmado; `pnpm --filter @crm/portal test && pnpm --filter @crm/portal lint && pnpm --filter @crm/portal typecheck && pnpm --filter @crm/portal build`.
- fora_de_escopo: integrações reais, autenticação, persistência e qualquer alteração no painel admin.

# T008

- deps: [T007]
- ler: [apps/portal/src/app/page.tsx, apps/portal/src/app/globals.css, apps/portal/src/app/layout.tsx, apps/portal/src/app/page.test.tsx, .plan/state.json]
- criar/alterar: somente interface versionada do portal e evidências de commit/deploy em .plan/state.json
- fazer:
  - Confirmar checks e ausência de segredos/dados reais na interface.
  - Fazer commit e push autorizados à main para acionar o deploy conectado do portal.
  - Verificar que o portal publicado apresenta a nova interface.
- done_when: commit e push confirmados e URL do portal retorna conteúdo da interface, ou registrar falha externa de deploy.
- fora_de_escopo: admin, arquivos gerados ou locais não relacionados, integrações reais.
