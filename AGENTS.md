# Repository Guidelines

## Project Structure & Module Organization
- Frontend app: `frontend/` (Vite + Tailwind). Entry: `frontend/src/main.js`; views under `frontend/src/{auth,admin,dashboard,shared}`; utilities in `frontend/src/lib`.
- Database & functions: `supabase/` with SQL in `supabase/migrations/` and Edge Functions in `supabase/functions/`.
- Tests: `frontend/tests/{unit,e2e}`.
- Specs & docs: `specs/`, `docs/`. Static assets: `frontend/public/`.

## Build, Test, and Development Commands
- Frontend dev server: `cd frontend && npm install && npm run dev` (serves via Vite).
- Frontend build: `npm run build` → output in `frontend/dist/`. Preview: `npm run preview`.
- Unit tests: `npm run test` (Vitest UI available via `vitest --ui`).
- E2E tests: `npm run test:e2e` (Playwright).
- Supabase local: `supabase start` then `supabase db reset` to apply `supabase/migrations/`.
- Edge Functions: `supabase functions serve` (local) or `supabase functions deploy <name>`.

## Coding Style & Naming Conventions
- JavaScript: ES modules, 2‑space indent, no semicolons, kebab‑case filenames (e.g., `admin-leaderboards.js`). Keep functions small and pure; place shared helpers in `frontend/src/shared` or `frontend/src/lib`.
- CSS: Tailwind utility classes; custom styles in `frontend/src/main.css`.
- SQL: One migration per change; prefix with zero‑padded sequence (e.g., `014_fix_...sql`).

## Testing Guidelines
- Frameworks: Vitest (unit) and Playwright (e2e).
- Naming: place unit tests under `frontend/tests/unit` using `*.test.js`.
- Running: use `npm run test` for unit; `npm run test:e2e` for end‑to‑end flows (login, scoring, admin).
- Aim for coverage of routing guards, Supabase RPC calls (`is_admin`), and scoring logic UX.

## Commit & Pull Request Guidelines
- Commits: imperative, concise, scoped prefix where useful (e.g., `admin:`, `db:`, `ui:`) and phase tags when relevant (see history: “Phase B/C/D”). Example: `admin: add nudge scheduler display`.
- PRs: clear summary, linked issue (if any), screenshots for UI changes, test plan (commands + results), and notes on migrations/functions affecting environments.

## Security & Configuration Tips
- Do not commit secrets. Use `frontend/.env` (see `frontend/.env.example`). Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TURNSTILE_SITE_KEY`.
- Edge Functions require `SUPABASE_SERVICE_ROLE_KEY`; deploy only from secure environments.
