# AGENTS.md

Clean Next.js app. No backend, database, auth, or E2E in this repo.

## Stack

- Next.js 16 App Router (`src/app`), React 19, TypeScript strict
- Tailwind CSS v4 via `@tailwindcss/postcss`, styles in `src/app/globals.css`
- shadcn/ui (new-york). Aliases in `components.json`: UI in `@/shared/components/ui`, `cn` in `@/shared/lib/utils`
- React Compiler is on: `reactCompiler: true` in `next.config.ts`
- Lint is oxlint, format is oxfmt. No ESLint or Prettier
- Package manager is pnpm

## Commands

| Task         | Command                |
| ------------ | ---------------------- |
| Install      | `pnpm install`         |
| Dev server   | `pnpm dev` (port 3000) |
| Lint (fix)   | `pnpm lint`            |
| Lint check   | `pnpm lint:check`      |
| Format       | `pnpm format`          |
| Format check | `pnpm format:check`    |
| Unused code  | `pnpm knip`            |
| Build        | `pnpm build`           |
| Start        | `pnpm start`           |

No env is required for `dev` or `build`. `NODE_ENV` overrides and `SKIP_ENV_VALIDATION` are not used.

## Conventions

- Alias `@/*` → `src/*`
- Server Components by default. `use client` only for Web APIs and interactivity
- Put new shadcn components on the aliases from `components.json`, not in `src/components`
- Do not use `any`
- Do not add ESLint, Prettier, Jest, or Playwright until they are in `package.json`

`pnpm knip` currently fails: the shadcn dependencies and `src/shared/lib/utils.ts` are not imported yet. That is the starter kit, not dead code. Do not delete it just to make knip pass unless asked.
