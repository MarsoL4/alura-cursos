# ✅ EXEMPLO BOM de AGENTS.md
# Regras boas vs. regras que a IA ignora
# Context Engineering e workflows complexos

> **Como usar este arquivo:** Leia os comentários em `<!-- -->` para entender
> POR QUE cada decisão foi tomada. Use em comparação com o arquivo
> `AGENTS_md_RUIM.md`.

---

# AGENTS.md

<!-- ✅ BOA PRÁTICA: O arquivo começa com o essencial: o que é o projeto,
com qual stack, em qual versão. O agent não precisa adivinhar nada. -->

## ✅ Stack e contexto do projeto

API REST em **Node.js 20 + TypeScript 5.4** com Express.
Banco de dados: PostgreSQL 16 via Prisma ORM.
Frontend separado em `/web` — React 18, Vite 5, Tailwind CSS 3.
Gerenciador de pacotes: `pnpm` (não usar npm ou yarn).

<!-- ✅ POR QUÊ: Stack específica com versões. O agent sabe exatamente qual
ecosystem usar, qual gerenciador de pacotes preferir e onde fica cada parte.
Sem ambiguidade, sem adivinhação entre sessões. -->

## ✅ Comandos essenciais

```bash
# Desenvolvimento
pnpm dev              # sobe API + worker em watch mode
pnpm test             # Jest — roda tudo em paralelo
pnpm test:watch       # modo interativo
pnpm lint             # ESLint + Prettier (não commitar com erros)
pnpm db:migrate       # aplica migrations pendentes
pnpm db:studio        # abre Prisma Studio no browser
```

<!-- ✅ POR QUÊ: Comandos concretos eliminam a principal fonte de erro de
onboarding. O agent não vai inventar "npm run dev" ou "yarn test" porque o
correto está explícito. Essa é exatamente a categoria de informação que
NÃO pode ser inferida pelo agent só lendo o código. -->

## ✅ Estrutura de pastas relevante

```
src/
  routes/       ← controllers Express (sem lógica de negócio)
  services/     ← regras de negócio (testar aqui)
  repositories/ ← acesso ao banco via Prisma
  jobs/         ← workers BullMQ (um arquivo por job)
  middlewares/  ← auth, rate-limit, error handler
prisma/
  schema.prisma ← fonte da verdade do schema
  migrations/   ← nunca editar manualmente
web/            ← app React (AGENTS.md próprio em /web/AGENTS.md)
```

<!-- ✅ POR QUÊ: O agent entende a arquitetura sem precisar explorar o
repositório inteiro. Ele sabe onde criar um novo endpoint, onde colocar
lógica de negócio e onde NÃO mexer (migrations). O path-scoping do /web
aponta para um AGENTS.md específico, evitando inflar o contexto global
com regras que só valem para o frontend. -->

## ✅ Restrições absolutas — nunca fazer

- **Nunca** commitar `.env`, `.env.local` ou qualquer arquivo em `secrets/`
- **Nunca** editar arquivos em `prisma/migrations/` manualmente
- **Nunca** rodar `prisma migrate reset` sem confirmar com o dev primeiro
- **Nunca** instalar dependências com `npm install` ou `yarn add`

<!-- ✅ POR QUÊ: Restrições absolutas são o tipo de instrução mais eficaz em
AGENTS.md. São verificáveis ("eu fiz ou não fiz"), binárias e sem exceção.
Pesquisa do GitHub com 2.500+ repos mostra que "nunca commitar secrets" é
a instrução mais frequente e mais útil. Aqui vai além: especifica os arquivos
exatos, não só "dados sensíveis". -->

## ✅ Padrão de commits

Usamos Conventional Commits. Formato obrigatório:

```
<tipo>(<escopo>): <descrição em inglês, imperativo, max 72 chars>

Tipos aceitos: feat, fix, chore, docs, refactor, test, perf
Escopo: nome do módulo ou rota afetada (ex: auth, jobs, prisma)
```

Exemplos válidos:
```
feat(auth): add refresh token rotation
fix(jobs): prevent duplicate email dispatch on retry
refactor(repositories): extract pagination helper
```

<!-- ✅ POR QUÊ: Em vez de "use mensagens descritivas", há o formato exato,
os tipos aceitos, o campo de escopo e três exemplos reais. O agent pode
verificar se gerou um commit válido. Não há ambiguidade sobre o que é
"descritivo" para este projeto. -->

## ✅ Testes

Framework: **Jest + Supertest**. Testes ficam em `src/**/__tests__/`.
Nomes de arquivo: `<módulo>.test.ts`.

Rodar antes de qualquer PR:
```bash
pnpm test
pnpm lint
```

Para serviços, mockar o repositório. Para rotas, usar Supertest com DB
de teste (`TEST_DATABASE_URL` no `.env.test`).

<!-- ✅ POR QUÊ: Especifica framework, localização dos arquivos, nome
convencional e estratégia de mock. O agent não vai criar um arquivo
`__specs__/` ou usar Vitest por engano. "Rodar antes de qualquer PR" é
uma instrução acionável e verificável. -->

## ✅ Contexto adicional — leia quando precisar

Para lógica de autenticação:          `docs/auth-flow.md`
Para regras de negócio de cobrança:   `docs/billing-rules.md`
Para variáveis de ambiente:           `docs/env-reference.md`
Para o schema completo do banco:      `prisma/schema.prisma`

<!-- ✅ POR QUÊ: Progressive disclosure em ação. Em vez de copiar toda a
documentação para dentro do AGENTS.md (inflando o contexto em toda sessão),
o arquivo aponta para onde buscar quando necessário. O agent só carrega
esse conteúdo extra quando a tarefa exige. Reduz tokens por padrão. -->

---

<!-- ✅ O que este AGENTS.md NÃO tem (e por quê):
- Roleplay ("você é um especialista") → desnecessário, o model já sabe
- "Escreva código limpo" → o agent infere pela base de código existente
- DRY, SOLID, KISS listados → princípios sem aplicação concreta ao projeto
- Instruções de performance genéricas → não acionáveis sem contexto real
- Seção "Outros / use o bom senso" → contradiz o propósito de ter regras
-->

## ✅ Resumo das boas práticas deste exemplo

| Boa prática | Por que funciona |
|---|---|
| Stack com versões exatas | Agent não adivinha ecosystem |
| Comandos executáveis no arquivo | Informação não-inferível do código |
| Estrutura de pastas comentada | Onboarding sem exploração cega |
| Restrições absolutas e binárias | Verificável, sem ambiguidade |
| Formato de commit com exemplos reais | Agent pode validar o próprio output |
| Framework de testes + localização | Sem adivinhação de padrão |
| Progressive disclosure com ponteiros | Contexto sob demanda, não sempre |
| Path-scoping para /web | Regras locais não poluem contexto global |
| Ausência de roleplay e platitudes | Tokens economizados em toda sessão |
| Informações não-inferíveis apenas | Segue recomendação do ETH Zurich 2026 |
