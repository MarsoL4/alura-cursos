# Plano: Correções WCAG 2 Level AA — Lighthouse

## Contexto

O Lighthouse reportou falhas de acessibilidade na página `/signup`. Os testes automatizados com jest-axe não detectaram esses problemas porque jsdom não computa CSS real (contraste) e o `region` rule estava desabilitado. Este plano corrige todas as violações encontradas.

---

## Correções

### 1. Idioma do documento (WCAG 3.1.1)

**Arquivo:** `apps/web/index.html` (linha 2)

- Alterar `lang="en"` → `lang="pt-BR"`

---

### 2. Landmark semântico — `<main>` (WCAG 2.4.1)

**Arquivo:** `apps/web/src/components/templates/AuthTemplate/AuthTemplate.tsx` (linha 10)

- Trocar o `<div>` externo por `<main>` (e o `</div>` correspondente por `</main>`)
- O className permanece idêntico — `<main>` aceita as mesmas classes CSS

**Arquivo:** `apps/web/src/test/setup.ts`
- Remover a regra `region: { enabled: false }` do `configureAxe`, já que agora o landmark existe

**Arquivo:** `apps/web/src/test/accessibility.test.tsx`
- Remover `region: { enabled: false }` do `configureAxe` local
- Testes de atoms/molecules/organisms isolados precisarão ser envolvidos em `<main>` para não disparar a regra `region`

---

### 3. Contraste de cores (WCAG 1.4.3 / 1.4.11)

| Componente | Arquivo | Antes | Depois | Fundo | Ratio | Req. |
|---|---|---|---|---|---|---|
| Divider texto | `atoms/Divider/Divider.tsx:9` | `text-gray-500` (#6B7280) | `text-gray-400` (#9CA3AF) | #171D1F | 5.2:1 | 4.5:1 |
| Input texto | `atoms/Input/Input.tsx:8` | `text-cinza-escuro` (#171D1F) | `text-grafite` (#00090E) | #888888 | 4.8:1 | 4.5:1 |
| Input placeholder | `atoms/Input/Input.tsx:8` | `placeholder-cinza-escuro` (#171D1F) | `placeholder-grafite` (#00090E) | #888888 | 4.8:1 | 4.5:1 |
| SocialButton borda | `atoms/SocialButton/SocialButton.tsx:13` | `border-gray-600` (#4B5563) | `border-gray-500` (#6B7280) | #171D1F | 3.4:1 | 3:1 (non-text) |

---

### 4. Associação form ↔ heading (WCAG 1.3.1)

**Arquivo:** `apps/web/src/components/organisms/LoginForm/LoginForm.tsx`
- Adicionar `id="login-heading"` no `<h1>` (linha 32)
- Adicionar `aria-labelledby="login-heading"` no `<form>` (linha 36)

**Arquivo:** `apps/web/src/components/organisms/SignupForm/SignupForm.tsx`
- Adicionar `id="signup-heading"` no `<h1>` (linha 34)
- Adicionar `aria-labelledby="signup-heading"` no `<form>` (linha 38)

---

## Ordem de implementação

1. `index.html` — lang
2. `AuthTemplate.tsx` — `<div>` → `<main>`
3. `setup.ts` e `accessibility.test.tsx` — re-habilitar regra `region`
4. `Divider.tsx` — contraste do texto
5. `Input.tsx` — contraste texto/placeholder
6. `SocialButton.tsx` — contraste da borda
7. `LoginForm.tsx` e `SignupForm.tsx` — aria-labelledby
8. Rodar `pnpm web:test` para validar tudo

---

## Verificação

- `pnpm web:test` — todos os testes (incluindo os 20 de acessibilidade) devem passar
- Re-rodar Lighthouse em `http://localhost:5173/signup` e `http://localhost:5173/login` para confirmar que as violações foram resolvidas
- Verificação visual rápida no browser para confirmar que o tema escuro continua consistente
