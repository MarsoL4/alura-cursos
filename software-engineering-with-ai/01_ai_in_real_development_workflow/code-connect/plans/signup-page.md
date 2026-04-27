# Plano: Página de Cadastro + Ajustes Figma

## Context

Precisamos criar a página de cadastro (signup) reutilizando os componentes já criados para a página de login. Além disso, ao comparar a implementação atual com o Figma, foram encontradas diferenças de cores que precisam de ajustes finos.

---

## Diferenças Figma vs Implementação Atual (ajustes finos)

| Elemento | Figma | Implementado | Arquivo |
|---|---|---|---|
| Fundo da página | `#00090E` | `#16171b` | AuthTemplate.tsx |
| Fundo do card | `#171D1F` | `#1e1f26` | AuthTemplate.tsx |
| Watermark "C" | `#171D1F` | `#1e1f26` | AuthTemplate.tsx |
| Border do card | `border border-black rounded-[32px]` | sem border, `rounded-2xl` | AuthTemplate.tsx |
| Fundo do input | `#888888` | `#2a2b35` | Input.tsx |
| Texto do input | `#171D1F` (escuro) | `text-white` | Input.tsx |
| Placeholder do input | `#171D1F` | `placeholder-gray-500` | Input.tsx |
| Border radius input | `rounded-[4px]` | `rounded-lg` | Input.tsx |
| Padding input | `px-4 py-2` | `px-4 py-3` | Input.tsx |
| Botão verde | `#81FE88` | `#4ADE80` | Button.tsx |
| Texto botão | `#132E35` | `text-black` | Button.tsx |
| Border radius botão | `rounded-[8px]` | `rounded-lg` (8px) | OK |
| Label texto | `text-[18px] text-[#e1e1e1]` | `text-sm text-gray-300` | Label.tsx |
| Título | `text-[31px] font-semibold` | `text-2xl font-bold` | LoginForm.tsx |
| Subtítulo | `text-[22px]` | `text-sm text-gray-400` | LoginForm.tsx |

---

## Etapas de Implementação

### 1. Ajustar cores/estilos dos átomos existentes para alinhar com Figma

**Arquivos a modificar:**

- `apps/web/src/components/templates/AuthTemplate/AuthTemplate.tsx`
  - Fundo: `bg-[#00090E]`
  - Card: `bg-[#171D1F]`, adicionar `border border-black rounded-[32px]`
  - Watermark "C": cor `text-[#171D1F]`

- `apps/web/src/components/atoms/Input/Input.tsx`
  - Fundo: `bg-[#888888]`
  - Texto: `text-[#171D1F]`
  - Placeholder: `placeholder-[#171D1F]`
  - Border radius: `rounded` (4px)
  - Padding: `px-4 py-2`

- `apps/web/src/components/atoms/Button/Button.tsx`
  - Verde: `bg-[#81FE88]` e hover ajustado
  - Texto: `text-[#132E35]`

- `apps/web/src/components/atoms/Label/Label.tsx`
  - Tamanho: `text-lg` (18px) em vez de `text-sm`
  - Cor: `text-[#E1E1E1]`

- `apps/web/src/components/organisms/LoginForm/LoginForm.tsx`
  - Título: `text-[31px] font-semibold` em vez de `text-2xl font-bold`
  - Subtítulo: `text-[22px] text-[#E1E1E1]` em vez de `text-sm text-gray-400`

### 2. Criar o organism `SignupForm`

**Novo arquivo:** `apps/web/src/components/organisms/SignupForm/SignupForm.tsx`

Estrutura baseada no Figma:
- Título: "Cadastro"
- Subtítulo: "Olá! Preencha seus dados."
- Campos (reutilizando `FormField`):
  - Nome (type="text", placeholder="Nome completo")
  - Email (type="email", placeholder="Digite seu email")
  - Senha (type="password", placeholder="••••••") com Checkbox "Lembrar-me" abaixo
- Botão: "Cadastrar →" (reutilizando `Button`)
- Divider: "ou entre com outras contas" (reutilizando `Divider`)
- Social buttons: Github, Gmail (reutilizando `SocialButton`)
- Link inferior: "Já tem conta? Faça seu login!" (reutilizando `Link`)

**Props:** `{ onSubmit?: (data: { name: string; email: string; password: string; rememberMe: boolean }) => void }`

### 3. Criar o test do `SignupForm`

**Novo arquivo:** `apps/web/src/components/organisms/SignupForm/SignupForm.test.tsx`

Seguir o mesmo padrão do LoginForm.test.tsx.

### 4. Criar a page `SignupPage`

**Novo arquivo:** `apps/web/src/components/pages/SignupPage/SignupPage.tsx`

Reutiliza `AuthTemplate` + `AuthBanner` (com imagem de cadastro) + `SignupForm`.

### 5. Criar o test do `SignupPage`

**Novo arquivo:** `apps/web/src/components/pages/SignupPage/SignupPage.test.tsx`

### 6. Adicionar rota no App.tsx

**Modificar:** `apps/web/src/App.tsx`
- Adicionar `<Route path="/signup" element={<SignupPage />} />`

### 7. Imagem do banner de cadastro

O Figma mostra uma imagem diferente no banner (mulher com óculos futuristas). Será necessário baixar essa imagem do Figma e salvar como `public/banner-cadastro.png`.

---

## Componentes reutilizados (sem criar novos)

- `AuthTemplate` — layout da página
- `AuthBanner` — banner com imagem
- `FormField` — campo label + input
- `Button` — botão de submit
- `Checkbox` — "Lembrar-me"
- `Divider` — separador "ou entre com outras contas"
- `SocialButton` — Github / Gmail
- `Link` — link para login

## Verificação

1. `pnpm web:dev` — verificar visualmente login e cadastro
2. `pnpm web:test` — todos os testes passando
3. `pnpm web:lint` — sem erros de lint
4. Comparar visualmente com o screenshot do Figma
