# Contributing

Thank you for helping build the Anti-Fascist Book Club platform! This document outlines the architectural conventions that keep
the Nx workspace healthy.

## Tooling basics

- Install dependencies once with `pnpm install`.
- Use `pnpm exec nx graph` to understand dependencies before introducing new ones.
- Prefer `pnpm exec nx g <generator>` to scaffold apps and libraries so tags and lint configuration stay consistent.

## Frontend (Next.js) conventions

- Organize UI by feature: `apps/frontend/src/features/<domain>/{components,hooks,api}`.
- **Components** render UI only. Move stateful logic into colocated hooks.
- **Hooks** wrap React Query/RTK Query or other stateful logic, and they import API clients instead of calling `fetch` directly.
- **API clients** live under `features/<domain>/api` and share types from `libs/api-types`.
- Keep public environment variables prefixed with `NEXT_PUBLIC_`. Never read server-only secrets in the browser bundle.
- Cross-cutting utilities belong in `libs/core/utils`; import them via the library entry point instead of relative paths.

## Backend (NestJS) layering

Every domain feature mirrors Nest’s provider layering. Place files in `apps/src/<domain>/<layer>` or in a dedicated library under
`libs/` when the feature is shared.

- `dto.ts` – validation classes and Swagger decorators only.
- `schema.ts` – Mongo schemas, indexes, and `toJSON` transforms that expose `id` instead of `_id`.
- `repository.ts` – database access using the schema. Always return lean objects when hydration is unnecessary.
- `service.ts` – domain logic. Throw domain-specific errors and let the global exception filter translate them.
- `controller.ts` – routing and request validation. No business logic.
- `module.ts` – wire up providers and exports.
- `utils.ts` – local helpers; promote to `libs/core/utils` if reused elsewhere.

Keep Mongo access centralized: only one connection per process, opened at bootstrap. Avoid calling repositories directly from
controllers—services should mediate all access.

## Library strategy

- `libs/api-types` holds shared DTOs and eventually OpenAPI/Zod contracts.
- `libs/config` owns environment parsing logic (Zod) for both frontend and backend.
- `libs/core/utils` is the home for framework-agnostic helpers.
- Create additional libraries for reusable domains and tag them with the appropriate `scope:*`, `domain:*`, and `layer:*` values.

## Tagging & module boundaries

All projects include tags that ESLint checks via `@nx/enforce-module-boundaries`. Follow these rules when introducing new
imports:

- Frontend code (`scope:frontend`) only depends on other frontend or shared libraries.
- Backend code (`scope:backend`) only depends on backend or shared libraries.
- Respect the layer rules: controllers → services → repositories → schemas/DTOs → utils.

Module-boundary violations fail lint locally and in CI. Run `pnpm exec nx lint <project>` before pushing.

## Testing & quality gate

- Write unit tests alongside the code they cover (`*.spec.ts`).
- Use React Testing Library for UI and Jest for backend providers.
- `pnpm exec nx affected -t lint,test,typecheck,build` mirrors the CI pipeline—run it locally before opening a pull request.

## Git workflow

- Branch from the default branch specified in `nx.json` (`work`).
- Keep commits focused and reference tickets/issues where possible.
- Use conventional commits if practical (e.g., `feat: add book search repository`).
