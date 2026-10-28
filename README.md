# frontend-crm-v2

Frontend for CRM v2 (agent interface for customers, offers and credit applications), built from the CHECK24 React template.

## Project layout

- `crm-v2/` – React/TypeScript frontend application (see `crm-v2/README.md` for the template conventions)
- `nginx/` – Nginx configuration for serving the application (`/healthz` is the k8s probe)
- `k8s/` – Kubernetes deployment manifests
- `Dockerfile`, `Dockerfile-Test`, `Jenkinsfile`, `version.ts` – build and deployment (Jenkins `genericReleasedBuild`)
- `gradlew`, `gradle/` – Gradle wrapper used by the shared pipeline (same as the other frontend repos)
- `.vscode/`, `.idea/` – editor setup for Oxlint and Oxfmt

## Tech stack

React 19, TypeScript 7, Vite 8, Tailwind 4 + Base UI + shadcn, React Router 8, TanStack Query 5,
hey-api openapi-ts (generated types) with a small typed fetch helper, Vitest 5, Oxlint + Oxfmt. Versions live in `crm-v2/package.json`.

## Getting started

Requires Node 24 and pnpm 12 (the version is pinned in `package.json`). A global pnpm older than 12 cannot
switch to it (`ENOEXEC`); update it with `npm install -g pnpm@12` or use Corepack (`corepack enable`).

```bash
cd crm-v2
pnpm install
cp .env.dist .env
pnpm dev   # http://localhost:3002 (fixed port, the Keycloak localhost redirect URI depends on it)
```

Quality gate before pushing: `pnpm check` (typecheck, Oxlint, Oxfmt check, tests).

## Deployment

Jenkins builds the `Dockerfile` with `CUSTOM_ENVIRONMENT` (`develop`, `staging`, `production`), which selects
`crm-v2/.env.<mode>`. The image serves the static build with nginx on port 8080.
