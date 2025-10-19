# Repository Guidelines & Agent Rules
*(Codex is primary chat/agent in VS Code; Copilot used for inline; Claude MCP servers available)*

## Project Structure & Module Organization
- **Frontend app**: `frontend/` (Vite + Tailwind). Entry: `frontend/src/main.js`; views under `frontend/src/{auth,admin,dashboard,shared}`; utilities in `frontend/src/lib`.
- **Database & functions**: `supabase/` with SQL in `supabase/migrations/` and Edge Functions in `supabase/functions/`.
- **Tests**: `frontend/tests/{unit,e2e}`.
- **Specs & docs**: `specs/`, `docs/`.
- **Static assets**: `frontend/public/`.

## Build, Test & Development Commands
- **Dev (frontend)**: `cd frontend && npm install && npm run dev`  
  *(If using pnpm: `cd frontend && pnpm install && pnpm dev`)*
- **Build (frontend)**: `npm run build` → outputs to `frontend/dist/`  
  Preview: `npm run preview`
- **Unit tests**: `npm run test` *(Vitest; UI via `vitest --ui`)*
- **E2E tests**: `npm run test:e2e` *(Playwright)*
- **Supabase local**: `supabase start` then `supabase db reset` to apply `supabase/migrations/`
- **Edge Functions**: `supabase functions serve` (local) / `supabase functions deploy <name>` (remote)

> **Agent convention**: Before proposing large edits or PRs, run `npm run build && npm test` (or pnpm equivalents). Provide a brief plan of files to change.

## Coding Style & Conventions
- **JavaScript**: ES modules, 2-space indent, **no semicolons** (standard/Prettier style), kebab-case filenames (e.g., `admin-leaderboards.js`).
- Keep functions small and pure; shared helpers in `frontend/src/shared` or `frontend/src/lib`.
- **CSS**: Tailwind utility classes; custom styles live in `frontend/src/main.css`.
- **SQL**: One migration per change; prefix with zero-padded sequence (e.g., `014_fix_...sql`).

## Testing Guidelines
- **Frameworks**: Vitest (unit), Playwright (e2e).
- **Layout**: Unit tests in `frontend/tests/unit` using `*.test.js`.
- **Coverage focus**: routing guards, Supabase RPC (`is_admin`), scoring logic UX, and any security-relevant flows.
- **Agents**: Prefer creating/fixing minimal tests colocated with changed modules.

## Commit & Pull Request Guidelines
- **Commits**: imperative, concise. Optional scoped prefixes (e.g., `admin:`, `db:`, `ui:`). Phase tags allowed (e.g., “Phase C”).
  - Example: `admin: add nudge scheduler display`
- **PRs**: include summary, linked issue (if any), screenshots for UI changes, **test plan** (commands + results), and notes on migrations/functions affecting environments.
- Split very large PRs (schema → API → UI).

## Security & Configuration
- **No secrets in git**. Use `frontend/.env` (see `frontend/.env.example`).
  - Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TURNSTILE_SITE_KEY`.
- Edge Functions that need elevated perms use `SUPABASE_SERVICE_ROLE_KEY` — deploy only from trusted environments.
- Validate/sanitise user input; never log or echo secrets.

---

## MCP Tools (Always Allowed When Applicable)
> Agents should leverage these tools to act, not just chat. Prefer targeted diffs over bulk rewrites.

- **Context7**  
  - Use to explore the repo, search, and apply precise refactors/edits.
  - Keep changes atomic; include a short change summary.
- **Playwright MCP**  
  - Create/fix e2e tests (`frontend/tests/e2e`) for critical paths (auth, scoring, admin flows).
  - May run tests locally and report failures with line/file pointers.
- **Chrome DevTools (CDP)**  
  - Inspect runtime issues (console, network, performance). Provide actionable traces and suggested fixes.
- **GitHub MCP**  
  - Open branches & PRs when changes span multiple files; follow commit/PR guidelines above.
  - Add checklists to PRs; request reviews when tests pass.
- **Sentry MCP**  
  - Pull production error traces if available; reference event IDs, stack frames, and suspected commit ranges. Propose fixes with linked PRs.

> **Privacy**: Do not exfiltrate code or secrets. Only operate within the workspace/repo and configured services.

---

## Agent Planning Rules
1. **Plan first**: outline the files to touch and why.  
2. **Minimise blast radius**: prefer surgical changes over wide rewrites.  
3. **Keep the app running**: build/test locally before proposing merge.  
4. **Document**: update README/docs or inline JSDoc when adding public APIs or env vars.  
5. **Accessibility**: interactive components must be keyboard accessible with visible focus; maintain WCAG AA contrast.

## Acceptance Criteria (Default)
- Build passes locally (and in CI where present).
- Lint/test pass; coverage does not regress.
- No secrets committed; `.env.example` updated if new vars are required.
- For UI changes: include screenshots/GIF in PR.

## Typical Layout
frontend/
src/
auth/ admin/ dashboard/ shared/ lib/
main.css main.js
public/
tests/
unit/ e2e/
supabase/
migrations/
functions/
specs/
docs/
AGENTS.md