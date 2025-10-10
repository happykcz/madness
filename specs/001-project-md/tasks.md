# Tasks: Quarry Madness Scorekeeper

**Input**: Design documents from `/specs/001-project-md/`
**Prerequisites**: plan.md (tech stack), spec.md (user stories), research.md (decisions), data-model.md (entities), contracts/ (API patterns)

**Tests**: Tests are included for critical scoring logic and E2E flows per quickstart.md recommendations.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Web app structure**: `frontend/src/`, `frontend/tests/`, `supabase/migrations/`
- All file paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure per plan.md (frontend/, supabase/, docs/)
- [ ] T002 Initialize frontend with Vite: `npm create vite@latest frontend -- --template vanilla`
- [ ] T003 [P] Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
- [ ] T004 [P] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] T005 [P] Install testing dependencies: `npm install -D vitest @vitest/ui playwright @playwright/test`
- [ ] T006 Configure Vite config at `frontend/vite.config.js` with proper base path for GitHub Pages
- [ ] T007 Configure Tailwind config at `frontend/tailwind.config.js` with mobile-first breakpoints
- [ ] T008 Create environment variables template at `frontend/.env.example` with Supabase and Turnstile placeholders
- [ ] T009 Create `.gitignore` to exclude `node_modules`, `.env`, `dist/`
- [ ] T010 [P] Create `frontend/src/main.css` with Tailwind imports
- [ ] T011 [P] Create `frontend/public/index.html` with Turnstile CDN script tag

**Checkpoint**: Project structure initialized, dependencies installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T012 Create Supabase schema migration at `supabase/migrations/001_initial_schema.sql` from contracts/supabase-schema.sql
- [ ] T013 Create RLS policies migration at `supabase/migrations/002_rls_policies.sql` from contracts/rls-policies.sql
- [ ] T014 Create Supabase client initialization module at `frontend/src/supabase.js` with URL and anon key from env vars
- [ ] T015 [P] Create base router at `frontend/src/router.js` with hash-based routing for GitHub Pages SPA support
- [ ] T016 [P] Create authentication manager at `frontend/src/auth/auth-manager.js` with session management and auth state change listener
- [ ] T017 [P] Create scoring engine utility at `frontend/src/shared/scoring-engine.js` implementing all point calculation rules from spec
- [ ] T018 [P] Create category classifier utility at `frontend/src/shared/category-classifier.js` implementing team/climber categorization logic
- [ ] T019 Create application entry point at `frontend/src/main.js` that initializes router and auth manager
- [ ] T020 Create shared UI utility at `frontend/src/shared/ui-helpers.js` for toast notifications, loading states, error display

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 2 - Team Authentication (Priority: P1) 🎯 MVP Foundation

**Goal**: Enable teams to securely log in with Cloudflare Turnstile human verification to access the scoring interface

**Independent Test**: Visit login page, complete Turnstile challenge, enter valid team credentials (team_001/password), verify redirect to team dashboard and session persists on refresh

### Tests for User Story 2

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T021 [P] [US2] Create E2E test for team login flow at `frontend/tests/e2e/team-login.spec.js` (verify Turnstile loads, login succeeds, redirect works)

### Implementation for User Story 2

- [ ] T022 [US2] Create login page HTML at `frontend/src/auth/login.html` with Turnstile widget container and team ID/password form
- [ ] T023 [US2] Implement login logic at `frontend/src/auth/login.js` that captures Turnstile token, calls Supabase signInWithPassword, stores session
- [ ] T024 [US2] Add login route to router at `frontend/src/router.js` mapping `/login` to login page
- [ ] T025 [US2] Create protected route guard in `frontend/src/router.js` that redirects to login if no session
- [ ] T026 [US2] Add logout functionality to `frontend/src/auth/auth-manager.js` with session cleanup
- [ ] T027 [US2] Style login page with Tailwind at `frontend/src/auth/login.html` for mobile-first responsive design (320px-768px)

**Checkpoint**: At this point, User Story 2 (Team Authentication) should be fully functional and testable independently

---

## Phase 4: User Story 1 - Team Climb Logging (Priority: P1) 🎯 MVP Core

**Goal**: Allow teams to select routes, log ascents, and see real-time score updates with proper grade calculations and repeat penalties

**Independent Test**: Login as team, select "Dark Side of the Moon" route (grade 18, sport), choose Alice climber, log ascent, verify 12 points awarded, log same route again, verify 9 points (75% penalty), team total updates within 2 seconds

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T028 [P] [US1] Unit test for scoring engine at `frontend/tests/unit/scoring-engine.test.js` covering all grade brackets, trad bonus (1.5x), repeat penalties (100%/75%/25%/0%)
- [ ] T029 [P] [US1] Unit test for category classifier at `frontend/tests/unit/category-classifier.test.js` covering Masters (50+, both 45+), grade-based categories
- [ ] T030 [P] [US1] E2E test for ascent logging flow at `frontend/tests/e2e/ascent-logging.spec.js` (select route, log ascent, verify score update)

### Implementation for User Story 1

- [ ] T031 [P] [US1] Create route selector component at `frontend/src/shared/route-selector.js` that fetches routes grouped by sector from Supabase
- [ ] T032 [P] [US1] Create score display component at `frontend/src/team/score-display.js` that fetches and displays team/climber scores
- [ ] T033 [US1] Create ascent logger module at `frontend/src/team/ascent-logger.js` with route selection UI, climber dropdown, submit logic
- [ ] T034 [US1] Implement optimistic UI updates in `frontend/src/team/ascent-logger.js` (show points immediately, revert on error)
- [ ] T035 [US1] Implement real-time score subscription at `frontend/src/team/score-display.js` using Supabase realtime for ascents table
- [ ] T036 [US1] Create team dashboard page at `frontend/src/team/dashboard.html` combining route selector, ascent logger, and score display
- [ ] T037 [US1] Add team dashboard route to `frontend/src/router.js` mapping `/team` to dashboard (requires authentication)
- [ ] T038 [US1] Style team dashboard with Tailwind at `frontend/src/team/dashboard.html` optimizing for <30s ascent logging (3 taps max)
- [ ] T039 [US1] Add error handling in `frontend/src/team/ascent-logger.js` for RLS policy violations (scoring window closed)

**Checkpoint**: At this point, User Story 1 (Team Climb Logging) should be fully functional - teams can log ascents and see scores update. This is the CORE MVP.

---

## Phase 5: User Story 3 - Administrator Competition Control (Priority: P1) 🎯 MVP Admin

**Goal**: Enable admin to start/stop scoring window, view real-time leaderboards by category, and access hardest send results

**Independent Test**: Login as admin, start scoring window, verify teams can now log ascents, stop window, verify teams see read-only interface, view leaderboards showing all categories with correct rankings

### Tests for User Story 3

- [ ] T040 [P] [US3] E2E test for admin workflows at `frontend/tests/e2e/admin-workflows.spec.js` (start/stop window, verify team access changes, view leaderboards)

### Implementation for User Story 3

- [ ] T041 [P] [US3] Create competition control module at `frontend/src/admin/competition-control.js` with start/stop scoring window buttons and status display
- [ ] T042 [P] [US3] Create leaderboards module at `frontend/src/admin/leaderboards.js` fetching team_scores view filtered by category and hardest_send_leaderboard view
- [ ] T043 [US3] Create admin dashboard page at `frontend/src/admin/dashboard.html` with competition control section and leaderboard tabs
- [ ] T044 [US3] Add admin dashboard route to `frontend/src/router.js` mapping `/admin` to admin dashboard (requires admin role)
- [ ] T045 [US3] Implement role-based routing in `frontend/src/router.js` checking user metadata for 'team' vs 'admin' role
- [ ] T046 [US3] Style admin dashboard with Tailwind at `frontend/src/admin/dashboard.html` with clear category separation and data tables
- [ ] T047 [US3] Add polling or realtime subscription to `frontend/src/admin/leaderboards.js` for live leaderboard updates (<10s refresh)
- [ ] T048 [US3] Implement admin login at `frontend/src/auth/login.js` with role verification against administrators table

**Checkpoint**: At this point, all P1 user stories (US1, US2, US3) are complete. This is the FULL MVP - competition can run end-to-end.

---

## Phase 6: User Story 5 - Pre-Competition Setup (Priority: P2)

**Goal**: Allow admin to upload route data from CSV/JSON and register teams with automatic category assignment

**Independent Test**: Login as admin, upload routes CSV with 10 routes across 3 sectors, verify routes appear grouped by sector, register team with two climbers (ages 28/32, grades 25/21), verify team assigned to "Advanced" category, verify team can login

### Implementation for User Story 5

- [ ] T049 [P] [US5] Create route upload module at `frontend/src/admin/route-upload.js` with file input, CSV/JSON parser, batch Supabase insert
- [ ] T050 [P] [US5] Create team registration module at `frontend/src/admin/team-registration.js` with form for team details and two climbers
- [ ] T051 [US5] Implement CSV parsing logic at `frontend/src/admin/route-upload.js` converting grade strings to numeric, calculating base points
- [ ] T052 [US5] Implement team category calculation at `frontend/src/admin/team-registration.js` using category-classifier utility
- [ ] T053 [US5] Add Supabase Auth admin user creation to `frontend/src/admin/team-registration.js` (create auth user, insert team, insert climbers)
- [ ] T054 [US5] Add route upload UI to admin dashboard at `frontend/src/admin/dashboard.html` with file drop zone and upload progress
- [ ] T055 [US5] Add team registration UI to admin dashboard at `frontend/src/admin/dashboard.html` with form validation
- [ ] T056 [US5] Style upload/registration forms with Tailwind for usability and clear feedback on success/error

**Checkpoint**: At this point, User Story 5 (Pre-Competition Setup) is complete. Admin can prepare competition data before event day.

---

## Phase 7: User Story 4 - Bonus Games Tracking (Priority: P2)

**Goal**: Allow teams to log bonus game points separately from route ascents with one-per-climber-per-game enforcement

**Independent Test**: Login as admin, create bonus game "Most Creative Sequence" worth 10 points, login as team, view active bonus games, log bonus for Alice, verify 10 points added to bonus_points, attempt to log again, verify error "already earned points for this game"

### Implementation for User Story 4

- [ ] T057 [P] [US4] Create bonus game management module at `frontend/src/admin/bonus-games.js` with create/deactivate game UI
- [ ] T058 [P] [US4] Create bonus logger component at `frontend/src/team/bonus-logger.js` with active games list and submit functionality
- [ ] T059 [US4] Add bonus games section to admin dashboard at `frontend/src/admin/dashboard.html` showing active games list
- [ ] T060 [US4] Add bonus games section to team dashboard at `frontend/src/team/dashboard.html` below ascent logger
- [ ] T061 [US4] Implement duplicate prevention in `frontend/src/team/bonus-logger.js` checking existing bonus_entries before submission
- [ ] T062 [US4] Update score display at `frontend/src/team/score-display.js` to show separate route_points and bonus_points breakdown
- [ ] T063 [US4] Style bonus games UI with Tailwind distinguishing bonus points from route points visually

**Checkpoint**: At this point, User Story 4 (Bonus Games Tracking) is complete. Competition can include bonus games for engagement.

---

## Phase 8: User Story 6 - Admin Override Capabilities (Priority: P3)

**Goal**: Allow admin to grant specific teams write access outside scoring window for late corrections

**Independent Test**: Login as admin, stop scoring window, login as team, verify read-only interface, admin grants override for team_001, team refreshes and can now log ascents, admin revokes override, team back to read-only

### Implementation for User Story 6

- [ ] T064 [P] [US6] Create override manager module at `frontend/src/admin/override-manager.js` with team selector, grant/revoke buttons, reason text input
- [ ] T065 [US6] Add override management section to admin dashboard at `frontend/src/admin/dashboard.html` showing active overrides list
- [ ] T066 [US6] Implement grant logic at `frontend/src/admin/override-manager.js` inserting team_overrides record with reason
- [ ] T067 [US6] Implement revoke logic at `frontend/src/admin/override-manager.js` updating is_active to false
- [ ] T068 [US6] Update team dashboard at `frontend/src/team/dashboard.html` to check override status and enable/disable ascent logging accordingly
- [ ] T069 [US6] Style override UI with Tailwind showing visual indicator when team has active override

**Checkpoint**: At this point, User Story 6 (Admin Override Capabilities) is complete. Admin can handle exceptional cases during competition.

---

## Phase 9: User Story 7 - Score Privacy During Competition (Priority: P3)

**Goal**: Prevent teams from viewing other teams' scores during active competition period

**Independent Test**: Login as team_001 while scoring window active, attempt to access leaderboards or other teams' scores, verify access denied, admin stops competition, team refreshes, verify leaderboards now visible with all teams

### Implementation for User Story 7

- [ ] T070 [US7] Add scoring window status check to team dashboard at `frontend/src/team/dashboard.html` hiding leaderboard link during active competition
- [ ] T071 [US7] Create post-competition results page at `frontend/src/team/results.html` showing full leaderboards after competition ends
- [ ] T072 [US7] Update router at `frontend/src/router.js` blocking `/team/results` route during active scoring window
- [ ] T073 [US7] Add "View Results" link to team dashboard that only appears after competition ends
- [ ] T074 [US7] Verify RLS policies in Supabase enforce privacy (teams cannot query other teams' ascents during window)
- [ ] T075 [US7] Style results page with Tailwind showing category leaderboards and hardest send in clear tables

**Checkpoint**: At this point, User Story 7 (Score Privacy) is complete. Competition integrity preserved through access control.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T076 [P] Create setup guide at `docs/setup.md` documenting Supabase project creation, environment variables, local development
- [ ] T077 [P] Create deployment guide at `docs/deployment.md` documenting GitHub Pages setup, GitHub Actions workflow, Supabase production config
- [ ] T078 Create GitHub Actions workflow at `.github/workflows/deploy.yml` for automatic deployment to GitHub Pages on push to main
- [ ] T079 [P] Add loading states to all async operations (ascent submission, score fetching, route loading)
- [ ] T080 [P] Add comprehensive error messages throughout application with user-friendly text
- [ ] T081 Optimize mobile performance: lazy load routes, minimize re-renders, test on actual devices
- [ ] T082 [P] Add accessibility improvements: ARIA labels, keyboard navigation, focus management
- [ ] T083 Create seed data script at `supabase/seed.sql` for development testing (sample admin, teams, routes)
- [ ] T084 Validate all functionality from quickstart.md guide end-to-end
- [ ] T085 [P] Code cleanup: remove console.logs, add JSDoc comments, organize imports
- [ ] T086 Run Lighthouse audit and fix performance/accessibility issues for mobile score (target >90)
- [ ] T087 Create competition day checklist at `docs/competition-checklist.md` for organizer (start window, monitor, troubleshoot)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 2 - Authentication (Phase 3)**: Depends on Foundational (Phase 2) - Foundation for all other stories
- **User Story 1 - Climb Logging (Phase 4)**: Depends on US2 (authentication) - CORE MVP
- **User Story 3 - Admin Control (Phase 5)**: Depends on US2 (authentication) - Completes P1 MVP
- **User Story 5 - Setup (Phase 6)**: Depends on US3 (admin framework) - P2 feature
- **User Story 4 - Bonus Games (Phase 7)**: Depends on US1 (scoring system) - P2 feature
- **User Story 6 - Overrides (Phase 8)**: Depends on US3 (admin framework) - P3 feature
- **User Story 7 - Privacy (Phase 9)**: Depends on US1 (scoring) and US3 (competition control) - P3 feature
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 2 (P1 - Authentication)**: FOUNDATION - No dependencies, but required by ALL other stories
- **User Story 1 (P1 - Climb Logging)**: Depends on US2 only - Can start immediately after authentication
- **User Story 3 (P1 - Admin Control)**: Depends on US2 only - Can work in parallel with US1
- **User Story 5 (P2 - Setup)**: Depends on US3 (needs admin framework)
- **User Story 4 (P2 - Bonus Games)**: Depends on US1 (extends scoring)
- **User Story 6 (P3 - Overrides)**: Depends on US3 (admin feature)
- **User Story 7 (P3 - Privacy)**: Depends on US1 and US3 (enforces competition rules)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Utilities (scoring-engine, category-classifier) before components that use them
- Data fetching modules before UI components
- Core functionality before styling/polish
- Error handling after happy path works

### Parallel Opportunities

**Phase 1 (Setup)**:
- T003, T004, T005 can run in parallel (independent npm installs)
- T010, T011 can run in parallel (independent file creation)

**Phase 2 (Foundational)**:
- T015, T016, T017, T018 can run in parallel after T012-T014 complete (database first, then modules)

**Phase 3 (US2 - Authentication)**:
- T021 (test) runs first and alone
- T022, T023 implement login (sequential, same feature)

**Phase 4 (US1 - Climb Logging)**:
- T028, T029, T030 all tests can run in parallel
- T031, T032 can run in parallel (independent components)

**Phase 5 (US3 - Admin Control)**:
- T040 (test) runs first
- T041, T042 can run in parallel (independent admin modules)

**Between User Stories** (if team has capacity):
- After Foundational complete, US2, US1, and US3 can start in parallel if assigned to different developers
- US5 and US4 can run in parallel (P2 features are independent)
- US6 and US7 can run in parallel (P3 features are independent)

**Phase 10 (Polish)**:
- T076, T077, T079, T080, T082, T085 can all run in parallel (independent documentation and code improvements)

---

## Parallel Example: Foundational Phase

```bash
# After database migrations (T012, T013, T014) complete, launch together:
Task: "Create base router at frontend/src/router.js"
Task: "Create authentication manager at frontend/src/auth/auth-manager.js"
Task: "Create scoring engine utility at frontend/src/shared/scoring-engine.js"
Task: "Create category classifier utility at frontend/src/shared/category-classifier.js"
```

## Parallel Example: User Story 1 (Climb Logging)

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for scoring engine at frontend/tests/unit/scoring-engine.test.js"
Task: "Unit test for category classifier at frontend/tests/unit/category-classifier.test.js"
Task: "E2E test for ascent logging at frontend/tests/e2e/ascent-logging.spec.js"

# After utilities exist, launch these components in parallel:
Task: "Create route selector component at frontend/src/shared/route-selector.js"
Task: "Create score display component at frontend/src/team/score-display.js"
```

## Parallel Example: Multiple User Stories

```bash
# If team has 3 developers, after Foundational phase complete:
Developer A: User Story 2 (Authentication) - T021-T027
Developer B: User Story 1 (Climb Logging) - T028-T039 (depends on US2 completion)
Developer C: User Story 3 (Admin Control) - T040-T048 (depends on US2 completion)

# Strategy: Dev A completes US2 first, then B and C proceed in parallel
```

---

## Implementation Strategy

### MVP First (User Stories 2, 1, 3 - All P1)

1. Complete Phase 1: Setup (T001-T011)
2. Complete Phase 2: Foundational (T012-T020) - CRITICAL BLOCKING PHASE
3. Complete Phase 3: User Story 2 - Authentication (T021-T027)
4. Complete Phase 4: User Story 1 - Climb Logging (T028-T039)
5. Complete Phase 5: User Story 3 - Admin Control (T040-T048)
6. **STOP and VALIDATE**: Run full E2E test - admin creates window, team logs ascents, scores update, admin views leaderboards
7. Deploy to staging for validation
8. **This is the FULL MVP - competition can run**

### Incremental Delivery

1. Setup + Foundational → Foundation ready (T001-T020)
2. Add US2 (Authentication) → Test logins work → Checkpoint (T021-T027)
3. Add US1 (Climb Logging) → Test ascent logging independently → **CORE MVP** (T028-T039)
4. Add US3 (Admin Control) → Test full competition flow → **FULL MVP** (T040-T048)
5. Add US5 (Pre-Competition Setup) → Test data import → **P2 Enhancement** (T049-T056)
6. Add US4 (Bonus Games) → Test bonus tracking → **P2 Enhancement** (T057-T063)
7. Add US6 (Admin Overrides) → Test exception handling → **P3 Enhancement** (T064-T069)
8. Add US7 (Score Privacy) → Test access control → **P3 Enhancement** (T070-T075)
9. Polish → Production ready (T076-T087)

### Parallel Team Strategy

With 2 developers:

1. Both complete Setup + Foundational together (T001-T020)
2. Dev A: US2 Authentication (T021-T027)
3. Once US2 done:
   - Dev A: US1 Climb Logging (T028-T039)
   - Dev B: US3 Admin Control (T040-T048)
4. Once P1 complete:
   - Dev A: US5 Pre-Competition Setup (T049-T056)
   - Dev B: US4 Bonus Games (T057-T063)
5. Both work on Polish together (T076-T087)

---

## Task Summary

**Total Tasks**: 87
- **Phase 1 (Setup)**: 11 tasks
- **Phase 2 (Foundational)**: 9 tasks (CRITICAL BLOCKING)
- **Phase 3 (US2 - Authentication)**: 7 tasks (P1 - MVP Foundation)
- **Phase 4 (US1 - Climb Logging)**: 12 tasks (P1 - MVP Core)
- **Phase 5 (US3 - Admin Control)**: 9 tasks (P1 - MVP Complete)
- **Phase 6 (US5 - Pre-Competition Setup)**: 8 tasks (P2)
- **Phase 7 (US4 - Bonus Games)**: 7 tasks (P2)
- **Phase 8 (US6 - Admin Overrides)**: 6 tasks (P3)
- **Phase 9 (US7 - Score Privacy)**: 6 tasks (P3)
- **Phase 10 (Polish)**: 12 tasks

**Parallel Opportunities**: 32 tasks marked [P] for concurrent execution
**Test Tasks**: 5 E2E tests, 2 unit test suites (scoring logic critical to competition integrity)
**MVP Scope**: Phases 1-5 (T001-T048) = 48 tasks for full P1 MVP

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Database schema and RLS policies (Phase 2) are CRITICAL - all user stories depend on them
- Authentication (US2) is FOUNDATION - all other stories require it
- US1 (Climb Logging) is CORE VALUE - the heart of the MVP
- US3 (Admin Control) COMPLETES MVP - enables competition lifecycle
- US5-US7 are ENHANCEMENTS - valuable but not required for first competition
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
