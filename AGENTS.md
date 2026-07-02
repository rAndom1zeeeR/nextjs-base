# AGENTS.md

## Cursor Cloud specific instructions

### Product scope

This repo is **ArrayTON frontend only** (Next.js 16 on port **3010**). The NestJS backend lives in a **sibling** repo (`../backend`, not bundled here). Full local Playwright E2E expects both repos.

### Dependency install

- Package manager: **pnpm 11** (matches CI; `corepack prepare pnpm@11.2.2 --activate`).
- Node: **24** (CI; Dockerfile тоже на Node 24).
- Install: `pnpm install --frozen-lockfile` from repo root.

### Environment variables (important)

Cloud VMs may inject API URL env vars pointing at a local backend port (e.g. `:3001`). Without a local backend, **override both public and internal API URL vars** to a reachable staging/production API host when starting dev:

```bash
export NEXT_PUBLIC_API_URL="<reachable-api-host>"
export INTERNAL_API_URL="<reachable-api-host>"
export NEXT_PUBLIC_SEND_LOGS_IN_DEV=false
pnpm dev
```

Copy `.env.local.example` patterns from `e2e/README.md` when running E2E with a local backend (`NEXTAUTH_SECRET`, test user creds).

### Build gotcha

The VM may set a non-standard `NODE_ENV`. For production builds use:

```bash
NODE_ENV=production SKIP_ENV_VALIDATION=1 pnpm build
```

### Standard commands

| Task         | Command                                                 |
| ------------ | ------------------------------------------------------- |
| Dev server   | `pnpm dev` (default port 3010)                          |
| Lint         | `pnpm lint`                                             |
| Format check | `pnpm format:check`                                     |
| Unit tests   | CI: `pnpm run test` (Jest)                              |
| E2E          | CI: Playwright local stack (postgres + redis + backend) |
| Build        | `NODE_ENV=production SKIP_ENV_VALIDATION=1 pnpm build`  |
| E2E (full)   | Clone `../backend`, configure env, then `pnpm test`     |
| Health       | Hit `/api/health` on the dev server port                |

### E2E without backend

Playwright `webServer` in `playwright.config.ts` starts `../backend` + `pnpm dev`. Without the backend repo, use **remote E2E** (`PLAYWRIGHT_E2E_REMOTE=1`) against deployed URLs, or limit verification to lint/build/dev + API proxy smoke (`/api/proxy/protocols?limit=1`).

### Services

| Service                | Required for frontend dev | Notes                                                           |
| ---------------------- | ------------------------- | --------------------------------------------------------------- |
| Next.js (`pnpm dev`)   | Yes                       | Port 3010                                                       |
| NestJS backend         | Optional\*                | \*Required for localhost API; use production API override above |
| PostgreSQL/Redis/MinIO | No (backend)              | Only when running local backend                                 |
| Playwright Chromium    | E2E only                  | `pnpm exec playwright install chromium`                         |
