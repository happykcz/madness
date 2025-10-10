# Quickstart Guide: Quarry Madness Scorekeeper

**Phase 1 Output** | **Date**: 2025-10-10 | **Research**: [research.md](./research.md)

## Overview

This guide walks you through setting up the Quarry Madness Scorekeeper application for local development. The application is a mobile-first web app built with Vite + vanilla JavaScript frontend and Supabase backend.

**Estimated Setup Time**: 30 minutes

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed ([download](https://nodejs.org/))
- **Git** installed
- **Supabase account** (free tier) - [sign up](https://supabase.com/)
- **Cloudflare account** (for Turnstile) - [sign up](https://cloudflare.com/)
- **Modern browser** (Chrome, Firefox, Safari, or Edge)
- **Code editor** (VS Code recommended)

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd 12qm25
```

## Step 2: Supabase Project Setup

### 2.1 Create Supabase Project

1. Visit [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in details:
   - **Name**: "Quarry Madness Scorekeeper"
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your location
4. Click "Create new project"
5. Wait ~2 minutes for provisioning

### 2.2 Get Supabase Credentials

1. In your Supabase project dashboard, click "Settings" (gear icon)
2. Go to "API" section
3. Copy the following values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### 2.3 Run Database Migrations

**Option A: Using Supabase SQL Editor (Recommended)**

1. In Supabase dashboard, click "SQL Editor"
2. Click "New query"
3. Copy contents of `specs/001-project-md/contracts/supabase-schema.sql`
4. Paste into SQL editor and click "Run"
5. Verify success (should show "Success. No rows returned")
6. Create another new query
7. Copy contents of `specs/001-project-md/contracts/rls-policies.sql`
8. Paste and run
9. Verify success

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Copy migration files
cp specs/001-project-md/contracts/supabase-schema.sql supabase/migrations/001_initial_schema.sql
cp specs/001-project-md/contracts/rls-policies.sql supabase/migrations/002_rls_policies.sql

# Push migrations
supabase db push
```

### 2.4 Create Admin User

1. In Supabase dashboard, go to "Authentication" → "Users"
2. Click "Add user" → "Create new user"
3. Fill in:
   - **Email**: `admin@quarrymadness.local`
   - **Password**: (choose a strong password)
   - **Auto Confirm User**: ✅ (checked)
4. Click "Create user"
5. Copy the user's UUID from the users table
6. Go back to SQL Editor and run:

```sql
INSERT INTO administrators (name, auth_user_id)
VALUES ('Admin User', '<paste-uuid-here>');
```

## Step 3: Cloudflare Turnstile Setup

### 3.1 Get Turnstile Site Key

1. Visit [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to "Turnstile" in the sidebar
3. Click "Add widget"
4. Fill in:
   - **Widget Name**: "Quarry Madness Login"
   - **Domain**: `localhost` (for development)
   - **Widget Mode**: "Managed"
5. Click "Create"
6. Copy the **Site Key** (starts with `0x...`)
7. Note: Secret key is not needed for frontend-only validation

## Step 4: Frontend Setup

### 4.1 Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- Vite (build tool)
- Tailwind CSS (styling)
- Supabase JS Client (backend integration)
- Vitest (unit testing)
- Playwright (E2E testing)

### 4.2 Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Create from example
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=0x...your-site-key-here

# Application Settings
VITE_APP_NAME=Quarry Madness Scorekeeper
VITE_APP_ENV=development
```

**Important**: Never commit `.env` to version control. It's already in `.gitignore`.

### 4.3 Start Development Server

```bash
npm run dev
```

This starts Vite dev server at `http://localhost:5173`

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4.4 Verify Setup

1. Open browser to `http://localhost:5173`
2. You should see the login page with Cloudflare Turnstile widget
3. Try logging in with admin credentials:
   - **Team ID / Email**: `admin@quarrymadness.local`
   - **Password**: (your admin password)
4. Complete Turnstile challenge
5. You should be redirected to admin dashboard

## Step 5: Development Workflow

### Project Structure

```
frontend/
├── src/
│   ├── main.js              # Application entry point
│   ├── router.js            # Client-side routing
│   ├── supabase.js          # Supabase client config
│   ├── auth/                # Authentication modules
│   ├── team/                # Team user features
│   ├── admin/               # Admin features
│   └── shared/              # Shared utilities
├── public/
│   └── index.html           # SPA entry HTML
├── tests/
│   ├── unit/                # Unit tests (Vitest)
│   └── e2e/                 # E2E tests (Playwright)
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR

# Build
npm run build            # Production build to /dist

# Testing
npm run test             # Run unit tests (Vitest)
npm run test:e2e         # Run E2E tests (Playwright)
npm run test:coverage    # Unit test coverage report

# Linting/Formatting
npm run lint             # Check code quality (ESLint)
npm run format           # Format code (Prettier)
```

### Hot Module Replacement (HMR)

Vite provides instant HMR during development:
- Edit any `.js` file → browser updates instantly
- Edit `main.css` → styles update without reload
- Add/modify Tailwind classes → CSS rebuilds automatically

### Development Tips

**1. Browser DevTools**
- Open Chrome/Firefox DevTools (F12)
- Use Console for JavaScript errors
- Use Network tab to inspect Supabase API calls
- Use Application tab to view localStorage/sessionStorage

**2. Supabase Dashboard**
- Use "Table Editor" to inspect database state
- Use "SQL Editor" to run queries for debugging
- Use "Logs" → "Postgres Logs" to see database errors
- Use "Auth" → "Users" to manage test users

**3. Testing Strategies**
- Unit test scoring logic: `npm run test src/shared/scoring-engine.test.js`
- E2E test login flow: `npm run test:e2e tests/e2e/team-login.spec.js`
- Manual test on mobile: Use Chrome DevTools device emulation

## Step 6: Create Test Data

### 6.1 Seed Routes (Admin)

1. Login as admin
2. Go to "Routes" section
3. Upload sample CSV:

```csv
sector,name,grade,gear_type
Cave Sector,Dark Side of the Moon,18,sport
Cave Sector,Lunar Eclipse,20,trad
Wall Sector,Vertical Limit,22,sport
Boulder Field,Crimp Master,V3,boulder
```

4. Click "Upload Routes"
5. Verify routes appear in table

### 6.2 Register Test Team

1. Stay logged in as admin
2. Go to "Teams" section
3. Click "Register Team"
4. Fill in:
   - **Team ID**: `team_001`
   - **Team Name**: "Test Crushers"
   - **Password**: `test123`
   - **Climber 1**: Alice, age 28, grade 25
   - **Climber 2**: Bob, age 32, grade 21
5. Click "Register"
6. Verify team category assigned (should be "Advanced")

### 6.3 Start Scoring Window

1. Go to "Competition Control"
2. Click "Start Scoring Window"
3. Verify status shows "Active"

### 6.4 Test Team Login

1. Logout from admin
2. Login as team:
   - **Team ID**: `team_001`
   - **Password**: `test123`
3. Complete Turnstile challenge
4. Verify redirect to team dashboard
5. Verify routes list appears

### 6.5 Log Test Ascent

1. In team dashboard, find a route (e.g., "Dark Side of the Moon")
2. Select climber (Alice or Bob)
3. Click "Log Ascent"
4. Verify:
   - Points calculated correctly (12 base for grade 18)
   - Score updates within 2 seconds
   - Ascent appears in history

## Step 7: Common Issues & Solutions

### Issue: "Invalid API key" error

**Cause**: Environment variables not loaded correctly

**Solution**:
1. Verify `.env` file exists in `frontend/` directory
2. Restart dev server (`npm run dev`)
3. Check browser console for actual error

### Issue: Turnstile widget not appearing

**Cause**: Site key incorrect or domain mismatch

**Solution**:
1. Verify `VITE_TURNSTILE_SITE_KEY` in `.env`
2. Check Cloudflare dashboard for correct domain (`localhost`)
3. Clear browser cache and reload

### Issue: "RLS policy violation" when logging ascent

**Cause**: Scoring window not active or team_id mismatch

**Solution**:
1. Login as admin and verify scoring window is active
2. Check Supabase logs for actual RLS error
3. Verify team_id in climbers table matches user's team

### Issue: Real-time score updates not working

**Cause**: Supabase Realtime not enabled

**Solution**:
1. Go to Supabase dashboard → "Database" → "Replication"
2. Enable replication for `ascents` table
3. Restart dev server

### Issue: Build fails with "Cannot find module"

**Cause**: Dependencies not installed or version mismatch

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Step 8: Next Steps

### Development Priorities (P1 User Stories)

1. **Complete Team Login UI** (`src/auth/login.js`)
   - Implement Turnstile widget integration
   - Add error handling for invalid credentials
   - Create session management

2. **Build Ascent Logger** (`src/team/ascent-logger.js`)
   - Route selection UI (grouped by sector)
   - Climber selection dropdown
   - Submit ascent with optimistic updates

3. **Create Score Display** (`src/team/score-display.js`)
   - Team total score
   - Individual climber scores
   - Real-time subscription to ascents table

4. **Admin Dashboard** (`src/admin/`)
   - Scoring window controls (start/stop)
   - Leaderboard views (by category)
   - Team management interface

### Testing Checklist

- [ ] Unit tests for scoring-engine.js (all grade calculations)
- [ ] Unit tests for category-classifier.js (team/climber categories)
- [ ] E2E test: Team login with Turnstile
- [ ] E2E test: Log ascent and verify score update
- [ ] E2E test: Admin start/stop scoring window
- [ ] Manual test: Mobile responsiveness (320px-768px)
- [ ] Manual test: 12-hour endurance (keep server running)

### Deployment Preparation

See [deployment.md](../../../docs/deployment.md) for:
- GitHub Pages configuration
- GitHub Actions workflow setup
- Environment variables for production
- Supabase production project setup

## Resources

### Documentation
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)

### Community
- [Supabase Discord](https://discord.supabase.com/)
- [Vite Discord](https://chat.vitejs.dev/)

### Project Contacts
- Technical questions: (add your contact)
- Bug reports: GitHub Issues
- Feature requests: GitHub Discussions

## Appendix: Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://abc.supabase.co` | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key | `eyJ...` | ✅ |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key | `0x...` | ✅ |
| `VITE_APP_NAME` | Application display name | `Quarry Madness` | ❌ |
| `VITE_APP_ENV` | Environment identifier | `development` | ❌ |

**Note**: All variables prefixed with `VITE_` are exposed to the browser. Never store secrets with this prefix.

## Appendix: Supabase Schema Verification

After running migrations, verify tables exist:

```sql
-- Run in Supabase SQL Editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output:
- administrators
- ascents
- bonus_entries
- bonus_games
- climbers
- routes
- scoring_windows
- team_overrides
- teams

Verify RLS enabled:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.
