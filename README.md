# Anti-Fascist Book Club Workspace

A full-stack Nx monorepo that powers the Anti-Fascist Book Club experience. The workspace hosts a NestJS API, a Next.js
frontend, and a growing catalog of shared libraries so both applications stay in sync.

## 🧭 Workspace layout

```text
apps/
  backend/         # NestJS container build context (app sources live in apps/src)
  frontend/        # Next.js application
  frontend-e2e/    # Playwright smoke tests
  src/             # Backend source tree mounted by webpack
libs/
  api-types/       # Shared DTO contracts and OpenAPI helpers
  config/          # Runtime configuration parsing (Zod powered)
  core/            # Cross-cutting utilities
```

Each project is tagged with `scope:*`, `domain:*`, and `layer:*` metadata so Nx can enforce module boundaries through ESLint.
Use `pnpm exec nx graph` to visualize dependencies.

## 🚀 Quick start

Install dependencies once per clone:

```bash
pnpm install
```

Run the backend (NestJS) with file watching on port **3000**:

```bash
pnpm exec nx serve backend
```

Run the frontend (Next.js) with Hot Module Reloading on port **3000** (ensure the backend is available on
`NEXT_PUBLIC_API_URL` before logging in):

```bash
pnpm exec nx serve frontend
```

Other helpful commands:

- `pnpm exec nx lint <project>` – ESLint with module-boundary enforcement.
- `pnpm exec nx test <project>` – Jest unit tests for backend or frontend packages.
- `pnpm exec nx typecheck <project>` – TypeScript project references.
- `pnpm exec nx build <project>` – Production builds (Next.js, NestJS bundle).

## 🔧 Environment configuration

Three `.env` files keep configuration explicit:

- `.env` (workspace root) – defaults consumed by Docker Compose and Nx tasks.
- `apps/backend/.env` – NestJS service settings (`PORT`, Mongo connection, credentials).
- `apps/frontend/.env.local` – Next.js runtime configuration (always prefix public values with `NEXT_PUBLIC_`).

Sample values live next to each file as `*.env.example`. Copy them when setting up a new environment:

```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

The backend uses Zod-based validation (see `libs/config`) so startup fails fast when variables are missing.

## 🐳 Docker workflows

The repository includes Dockerfiles for both applications and a Compose stack to orchestrate them:

```bash
# Build and start both services with Docker Compose
pnpm exec nx run backend:docker-up
```

This command runs `docker compose up backend frontend` using the images declared in `apps/backend/Dockerfile` and
`apps/frontend/Dockerfile`. Environment overrides:

- `FRONTEND_PORT` – host port that serves the Next.js container (default `3000`).
- `BACKEND_PORT` – internal NestJS port (default `3000`).
- `BACKEND_PORT_HOST` – host port published for the API (default `3001`).
- `NEXT_PUBLIC_API_URL` – URL the frontend calls from inside or outside Docker (default `http://backend:3000/api`).
- `MONGODB_URI` – connection string injected into the backend container.

Stop the stack with `docker compose down`. For iterative development outside Docker, prefer the Nx `serve` targets above to
avoid rebuild cycles.

## 🧱 Shared libraries

- **`libs/api-types`** – shared DTO contracts and (future) OpenAPI schema helpers.
- **`libs/config`** – Zod schemas and helpers that load environment variables for frontend and backend projects.
- **`libs/core/utils`** – framework-agnostic utilities that can be consumed by either side of the stack.

When adding new features, create domain-specific libraries and tag them appropriately so they pass module-boundary checks.

## ✅ Quality gates

Module boundary violations are lint errors, and CI runs `nx affected -t lint,test,typecheck,build` on every pull request. Make
sure local changes pass the same pipeline before opening a PR.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for coding standards (feature folder layout, NestJS layering, and tagging
conventions).
