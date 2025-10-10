# Implementation Plan: Quarry Madness Scorekeeper

**Branch**: `001-project-md` | **Date**: 2025-10-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-project-md/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a mobile-first web application for managing a 12-hour climbing competition where teams of two climbers log ascents and earn points based on route grades, gear types (sport/trad/boulder), and repeat penalties. The system provides real-time scoring, time-gated access control, admin management capabilities, and category-based leaderboards. Technical approach: Vite + vanilla JavaScript frontend with Tailwind CSS for styling, Supabase backend for authentication and data persistence, GitHub Pages for static hosting, and Cloudflare Turnstile for bot protection.

## Technical Context

**Language/Version**: JavaScript ES2022 (Vite 5.x build tool)
**Primary Dependencies**:
- Frontend: Vite 5.x, Tailwind CSS 3.x, Cloudflare Turnstile (via CDN)
- Backend: Supabase JS Client 2.x (authentication, database, real-time subscriptions)
**Storage**: Supabase PostgreSQL (managed cloud database with Row Level Security policies)
**Testing**: Vitest (unit tests), Playwright (E2E tests for critical flows)
**Target Platform**: Modern mobile browsers (iOS Safari 15+, Chrome Android 100+), desktop browsers for admin
**Project Type**: Web (single-page application with static hosting)
**Deployment**: GitHub Pages (static site), Supabase Cloud (backend as a service)
**Performance Goals**:
- <2s score update latency after ascent submission
- <30s ascent logging flow (3 taps maximum)
- Support 50 concurrent users with 5-minute logging frequency
- 12-hour continuous availability
**Constraints**:
- Mobile-first responsive design (320px-768px screens)
- Zero data loss on page refresh or brief connectivity loss
- Read-only interface enforcement outside scoring window
- Score privacy: teams cannot view other teams' scores during competition
**Scale/Scope**:
- ~50 teams (100 climbers)
- ~200-300 routes across 10+ sectors
- Expected 50-150 ascents per team over 12 hours
- 3-4 bonus games per competition
- Single admin user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ⚠️ Constitution template is blank (no principles defined)

**Analysis**: The project constitution file at `.specify/memory/constitution.md` contains only placeholder content with no actual project principles defined. This means there are no constitutional gates to evaluate at this time.

**Recommendation**: This feature can proceed without constitutional violations since no principles exist to violate. However, the project should consider establishing a constitution to guide future development standards (e.g., testing requirements, architectural patterns, security policies).

## Project Structure

### Documentation (this feature)

```
specs/001-project-md/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── supabase-schema.sql     # Database schema DDL
│   ├── rls-policies.sql        # Row Level Security policies
│   └── api-contracts.md        # Supabase client API usage patterns
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
# Web application structure
frontend/
├── src/
│   ├── main.js                  # Application entry point
│   ├── router.js                # Client-side routing
│   ├── supabase.js              # Supabase client configuration
│   ├── auth/
│   │   ├── login.js             # Team/admin login with Turnstile
│   │   └── auth-manager.js      # Session management
│   ├── team/
│   │   ├── ascent-logger.js     # Ascent submission UI and logic
│   │   ├── score-display.js     # Team/climber score visualization
│   │   └── bonus-logger.js      # Bonus game points submission
│   ├── admin/
│   │   ├── route-upload.js      # CSV/JSON route data import
│   │   ├── team-registration.js # Team and climber registration
│   │   ├── competition-control.js # Scoring window management
│   │   ├── leaderboards.js      # Category-based results display
│   │   └── override-manager.js  # Team access override controls
│   ├── shared/
│   │   ├── scoring-engine.js    # Point calculation logic
│   │   ├── category-classifier.js # Team/climber category assignment
│   │   └── route-selector.js    # Sector-organized route list UI
│   └── styles/
│       └── main.css             # Tailwind imports and custom styles
├── public/
│   └── index.html               # SPA entry HTML
├── tests/
│   ├── unit/
│   │   ├── scoring-engine.test.js
│   │   └── category-classifier.test.js
│   └── e2e/
│       ├── team-login.spec.js
│       ├── ascent-logging.spec.js
│       └── admin-workflows.spec.js
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example                 # Supabase credentials template

supabase/
├── migrations/
│   └── 001_initial_schema.sql   # Database tables and RLS policies
└── seed.sql                     # Development test data (optional)

docs/
├── setup.md                     # Local development setup guide
└── deployment.md                # GitHub Pages + Supabase deployment
```

**Structure Decision**: Selected **Web application** structure due to the frontend-only nature of the project (static hosting on GitHub Pages) combined with Supabase as a managed backend service. The `frontend/` directory contains all application code organized by feature (team, admin, auth, shared). The `supabase/` directory contains database migrations for reproducibility. This structure supports clear separation between team-facing and admin-facing features while maintaining shared logic for scoring and categorization.

## Complexity Tracking

*No constitutional violations exist since no constitution has been defined for this project.*
