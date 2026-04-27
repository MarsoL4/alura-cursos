# Plano: Pagina de Login

## Contexto

O projeto e um monorepo pnpm com `apps/web` (React 19 + Vite) e `apps/api` (NestJS). A app web esta com o template padrao do Vite, sem componentes, sem roteamento, sem Tailwind, sem testes. Precisamos criar a pagina de login seguindo Atomic Design, com layout reutilizavel para a futura pagina de cadastro.

---

## Step 1: Infraestrutura

### 1.1 Instalar dependencias

```bash
pnpm --filter web add react-router-dom
pnpm --filter web add -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 1.2 Configurar Tailwind CSS v4

**`apps/web/vite.config.ts`** — adicionar plugin Tailwind + config Vitest:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

**`apps/web/src/index.css`** — substituir conteudo por:

```css
@import 'tailwindcss';
```

Deletar `apps/web/src/App.css`.

### 1.3 Setup de testes

Criar `apps/web/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Adicionar `"test": "vitest run"` nos scripts de `apps/web/package.json`.

### 1.4 Roteamento

**`apps/web/src/main.tsx`** — envolver com `BrowserRouter`.

**`apps/web/src/App.tsx`** — substituir template Vite por `<Routes>` com rota `/login`.

### 1.5 Limpeza

- Deletar `apps/web/src/App.css`
- Deletar `apps/web/src/assets/` (hero.png, react.svg, vite.svg — nao serao mais usados)
- Atualizar title no `index.html` para "Code Connect"

---

## Step 2: Atoms

Todos em `src/components/atoms/`, cada um com teste co-localizado.

| Componente | Props principais | Descricao |
|---|---|---|
| **Input** | `type, placeholder, id, ...InputHTMLAttributes` | Input dark (`bg-[#2a2b35]`), rounded, texto claro |
| **Label** | `children, htmlFor` | Label com estilo consistente |
| **Button** | `children, variant('primary'\|'social'), type` | Primary: verde `bg-green-400`, full-width. Social: borda com icone |
| **Checkbox** | `label, checked, onChange, id` | Checkbox + label inline |
| **Link** | `to, children, variant('default'\|'highlight')` | Wrapper de react-router `Link` |
| **Divider** | `text` | Linha horizontal com texto centralizado |
| **SocialButton** | `icon, alt, onClick` | Botao com imagem (github.png, gmail.png) |

---

## Step 3: Molecules

| Componente | Compoe | Descricao |
|---|---|---|
| **FormField** | Label + Input | Stack vertical: label acima do input, conectados por htmlFor/id |

---

## Step 4: Organisms

| Componente | Compoe | Descricao |
|---|---|---|
| **AuthBanner** | img | Lado esquerdo do card: imagem banner com logo "code connect" sobreposto no canto inferior |
| **LoginForm** | FormField, Checkbox, Link, Button, Divider, SocialButton | Formulario completo: titulo, campos, botao, social login, link cadastro |

---

## Step 5: Template (camada de reuso)

**`AuthTemplate`** — `src/components/templates/AuthTemplate/`

- Props: `banner: ReactNode`, `form: ReactNode`
- Renderiza: fundo escuro full-page com watermark decorativo "C"
- Card centralizado com cantos arredondados, fundo `bg-[#1e1f26]`
- Duas colunas: slot esquerdo (banner) + slot direito (form)
- **Este e o ponto critico de reuso** — a pagina de cadastro passara um banner e form diferentes

---

## Step 6: Page

**`LoginPage`** — `src/components/pages/LoginPage/`

- Compoe: `AuthTemplate` + `AuthBanner` + `LoginForm`
- Passa `/banner-login.png` como banner
- Handler de submit como placeholder (console.log)

---

## Estrutura final de arquivos

```
src/
  test/
    setup.ts
  components/
    atoms/
      Input/Input.tsx + Input.test.tsx
      Label/Label.tsx + Label.test.tsx
      Button/Button.tsx + Button.test.tsx
      Checkbox/Checkbox.tsx + Checkbox.test.tsx
      Link/Link.tsx + Link.test.tsx
      Divider/Divider.tsx + Divider.test.tsx
      SocialButton/SocialButton.tsx + SocialButton.test.tsx
    molecules/
      FormField/FormField.tsx + FormField.test.tsx
    organisms/
      AuthBanner/AuthBanner.tsx + AuthBanner.test.tsx
      LoginForm/LoginForm.tsx + LoginForm.test.tsx
    templates/
      AuthTemplate/AuthTemplate.tsx + AuthTemplate.test.tsx
    pages/
      LoginPage/LoginPage.tsx + LoginPage.test.tsx
  App.tsx
  main.tsx
  index.css
```

---

## Cores (baseado no design)

| Uso | Valor |
|---|---|
| Fundo pagina | `#16171b` |
| Fundo card | `#1e1f26` |
| Fundo input | `#2a2b35` |
| Texto principal | `white` |
| Texto secundario | `gray-400` |
| Botao verde | `#4ADE80` / `green-400` |
| Bordas | `gray-700` |

---

## Verificacao

1. `pnpm web:test` — todos os testes passam
2. `pnpm web:dev` — pagina de login renderiza conforme o design
3. `pnpm web:build` — build compila sem erros
4. `pnpm web:lint` — sem erros de lint
