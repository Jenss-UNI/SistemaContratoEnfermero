# AGENTS.md – SistemaContratoEnfermero

Frontend-only React 19 + TypeScript 6 SPA (Vite 8). Backend-Sistema is **not** in this repo. Neither is a `frontend/` directory, despite what README says.

## Quick start

```bash
cd Frontend-Sistema
npm install         # already installed in node_modules/
npm run dev         # Vite dev server
npm run build       # tsc -b && vite build (two steps, order matters)
npm run lint        # ESLint (flat config)
npm run preview     # Vite preview of built output
```

No tests, no CI workflows, no typecheck-only script.

## Stack

| What | How |
|------|-----|
| Auth + DB | Supabase (singleton at `src/app/core/services/supabase.ts`) |
| Server state | TanStack React Query 5 |
| Routing | React Router v7 (`src/app/app.routes.tsx`) |
| CSS | Tailwind 4 via `@tailwindcss/postcss` + Remixicon CDN in `index.html` |
| Font | "Plus Jakarta Sans" (Tailwind `font-sans`) |

## Architecture

```
src/app/
  core/               → shared services (supabase, api, reniec), AuthContext, ProtectedRoute guard
  features/
    auth/             → login, register (multi-step), forgot-password
    public/           → landing, directorio, nurse profile, planes
    private/client/   → /panel-cliente (7 pages, role=cliente)
    private/enfermero/ → /panel-enfermero (9 pages, role=enfermero)
    private/admin/    → /admin (7 pages, role=admin)
  shared/             → layout components, reusable UI
```

Entry: `src/main.tsx` → `App.tsx` (QueryClientProvider + AuthProvider + BrowserRouter) → `app.routes.tsx`.

Private panels use `ProtectedRoute` with `allowedRoles={["cliente"|"enfermero"|"admin"]}`. Unauthenticated users redirect to `/login`.

## Supabase

- Credentials in `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — **checked into git** despite `.gitignore` listing `.env`.
- Auth: Supabase Auth with session persisted in localStorage.
- DB schema reference at `database/script.sql` (informational only, not meant to be run).
- Storage buckets: `foto_perfil` (public read), `nurse_documents` (owner-only).

## Git conventions

- **Branching**: Git Flow — `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`.
- **Commits**: Conventional — `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `test:`, `chore:`.

## Gotchas

- README says `cd frontend` — correct path is `Frontend-Sistema/`.
- Build runs `tsc -b && vite build` sequentially (type errors block the build).
- TypeScript `~6.0.2` with `verbatimModuleSyntax`; use `import type` for type-only imports.
- `erasableSyntaxOnly: true` — no enums, no namespaces, no parameter properties.
- `noUnusedLocals` and `noUnusedParameters` are on.
- `src/app/features/private/` has a `PrivateDashboardPlaceholder.tsx` used for unimplemented pages.
