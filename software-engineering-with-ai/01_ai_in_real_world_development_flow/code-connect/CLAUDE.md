# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **pnpm monorepo** with two apps:
- `apps/web` — React 19 + TypeScript + Vite frontend
- `apps/api` — NestJS 11 + TypeScript backend

## Commands

All commands can be run from the repo root using pnpm filters.

### Development

```bash
pnpm dev              # Run both apps in parallel
pnpm web:dev          # Frontend only (Vite dev server)
pnpm api:dev          # Backend only (NestJS watch mode)
```

### Build

```bash
pnpm web:build        # Build frontend
pnpm api:build        # Build backend
pnpm web:preview      # Preview production frontend build
```

### Lint

```bash
pnpm web:lint         # Lint frontend
pnpm api:lint         # Lint backend
```

### Testing

```bash
pnpm web:test                                        # Run frontend tests
pnpm api:test                                        # Run all API unit tests
pnpm --filter api test -- --testPathPattern=app      # Run a single API test file
pnpm --filter api test:e2e                           # Run e2e tests
```

## Architecture

### Frontend (`apps/web`)

- Entry: `src/main.tsx` → `src/App.tsx`
- Vite + React 19, strict TypeScript (`tsconfig.app.json`)
- ESLint with React hooks and refresh plugins
- Styling with **Tailwind CSS** (v4, config via `@theme` em `src/index.css`)

#### Component Structure — Atomic Design

All components live under `src/components/` and follow Atomic Design:

```
src/components/
  atoms/        # Smallest units: Button, Input, Label, Icon…
  molecules/    # Composed atoms: FormField, SearchBar…
  organisms/    # Complex sections: Header, PostCard, Sidebar…
  templates/    # Page-level layouts (no real data)
  pages/        # Full pages wired to real data/routes
```

#### Design Tokens — Cores

A paleta do projeto é definida via `@theme` em `src/index.css` e deve ser usada em todos os componentes. **Nunca use hexadecimais diretamente em classes Tailwind.**

| Token | Uso |
|---|---|
| `grafite` | Fundo da página |
| `cinza-escuro` | Fundo de cards/modais |
| `cinza-medio` | Fundo de inputs, checkboxes |
| `offwhite` | Texto principal |
| `verde-destaque` | Acento primário (botões, links, focus rings) |
| `verde-petroleo` | Texto sobre fundo verde (ex: label do botão primário) |

Exemplos: `bg-grafite`, `text-offwhite`, `bg-verde-destaque`, `text-verde-petroleo`, `focus:ring-verde-destaque`.

#### Design Tokens — Tamanhos de Fonte

Use sempre os tokens padrão do Tailwind mais próximos ao valor do design. **Nunca use tamanhos arbitrários como `text-[31px]`.**

| Token Tailwind | Tamanho | Uso (Figma) |
|---|---|---|
| `text-3xl` | 30px | Títulos de página (Subtitle Large) |
| `text-2xl` | 24px | Subtítulos (Paragraph Large ~22px) |
| `text-lg` | 18px | Texto de corpo / labels (Paragraph) |
| `text-base` | 16px | Texto secundário (Paragraph Small ~15px) |
| `text-sm` | 14px | Texto auxiliar pequeno |
| `text-xs` | 12px | Labels menores (Label ~12.5px) |

Rules:
- A component **must not** import from a higher-level category (atoms cannot import molecules).
- Every component **must have a co-located test** file (`ComponentName.test.tsx`) covering its essential usage (render, key interactions, accessibility where applicable).
- Use Vitest + React Testing Library for all frontend tests.

### Backend (`apps/api`)

- Entry: `src/main.ts` bootstraps the NestJS app on port 3000 (configurable via `PORT` env var)
- Follows NestJS module/controller/service pattern
- Decorators enabled in TypeScript config (`experimentalDecorators`, `emitDecoratorMetadata`)
- Prettier enforced: single quotes, trailing commas
- Unit tests use Jest + `@nestjs/testing`; e2e tests use supertest (in `test/`)

#### REST Principles

All API endpoints must be strictly REST-compliant:

- **Resources as nouns** in the URL — never verbs (`/posts`, not `/getPosts`).
- **HTTP verbs** map to actions: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove).
- **Status codes** must be semantically correct: `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`, `500 Internal Server Error`.
- **Plural resource names** for collections (`/users`, `/posts`).
- **Nested routes** only for true ownership relationships (`/users/:id/posts`); avoid deep nesting beyond two levels.
- **Pagination** via query params (`?page=1&limit=20`) for collection endpoints.
- **Response envelope**: always return consistent JSON shapes; errors must include `statusCode`, `message`, and optionally `errors`.

## Git — Conventional Commits

Every commit in this repository **must** follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

Allowed types:

| Type       | When to use                                      |
|------------|--------------------------------------------------|
| `feat`     | New feature                                      |
| `fix`      | Bug fix                                          |
| `chore`    | Maintenance, tooling, dependencies               |
| `docs`     | Documentation only                               |
| `style`    | Formatting, no logic change                      |
| `refactor` | Code change that is neither a fix nor a feature  |
| `test`     | Adding or updating tests                         |
| `perf`     | Performance improvement                          |
| `ci`       | CI/CD configuration                              |
| `build`    | Build system or external dependency changes      |
| `revert`   | Reverts a previous commit                        |

Scopes (optional but recommended): `web`, `api`, `root`.

Examples:
```
feat(api): add pagination to GET /posts
fix(web): correct button focus style on Safari
chore(root): update pnpm to v10
test(web): add unit tests for Button atom
```
