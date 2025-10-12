# Quarry Madness - Project Status

**Last Updated**: 2025-10-10
**Current Phase**: Phase 3 - Team Authentication (Ready for Testing)

---

## ✅ Completed Work

### Phase 1: Project Setup
- ✅ Vite 7.1.9 + Vanilla JS + Tailwind CSS 4.1.14
- ✅ GitHub Pages deployment configuration
- ✅ CAWA branding (#ff0046 pink + logo integration)
- ✅ GitHub-style design system

### Phase 2: Foundational Infrastructure
- ✅ Supabase client setup
- ✅ Hash-based router for GitHub Pages
- ✅ Auth manager with session handling
- ✅ Scoring engine (points calculation + repeat penalties)
- ✅ Category classifier (team categorization logic)
- ✅ UI helpers (toast notifications, loading overlays)

### Phase 3: Authentication System
- ✅ Database schema (001_initial_schema.sql)
- ✅ RLS policies (002_rls_policies.sql)
- ✅ Test data seed script (seed_test_data.sql) - ALL FIXED ✅
- ✅ Login page with Cloudflare Turnstile integration
- ✅ Dashboard displaying team and climber data
- ✅ Protected route guards

---

## 🔧 Current Issues & Solutions

### Issue 1: Cloudflare Turnstile Domain Validation ⚠️

**Problem**: Turnstile shows "invalid domain" error on localhost

**Root Cause**: Your Turnstile site key (`0x4AAAAAAB5xR2YjqecWsKNH`) is configured for `happyk.au` and `madness.happyk.au` domains only. Localhost is not in the allowed domains list.

**Solutions** (choose one):

#### Option A: Add localhost to Turnstile (Recommended for Testing)
1. Go to: https://dash.cloudflare.com → Turnstile
2. Select your site key
3. Add these domains to allowed list:
   - `localhost`
   - `127.0.0.1`
   - `happyk.au`
   - `madness.happyk.au`
4. Save changes
5. Refresh your app - Turnstile will now work on localhost

#### Option B: Use Turnstile Test Keys for Development
1. Update `.env` with Cloudflare's always-passing test keys:
   ```bash
   # For development/testing - always passes
   VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
   ```
2. This will work on ANY domain including localhost
3. Switch back to your real key before production deployment

#### Option C: Disable Turnstile for Local Testing (Quick Fix)
1. Comment out site key in `.env`:
   ```bash
   # VITE_TURNSTILE_SITE_KEY=0x4AAAAAAB5xR2YjqecWsKNH
   ```
2. The app will show "⚠️ Turnstile not configured. Using development mode."
3. Login will work without verification challenge
4. Good for quick testing, but not secure

**My Recommendation**: Use Option B (test keys) for local development, then switch to your real key when deploying.

---

### Issue 2: Password Requirement & Team-Only Login 🔑

**Current Implementation**: Login requires BOTH Team ID + Password
- Team ID: `team_001`
- Password: Whatever you set in Supabase (default in guide: `TestPassword123!`)

**Your Request**: "I'd prefer to only use a team id if possible"

**Options**:

#### Option 1: Single Team ID Login (Simplified)
Change auth to use Team ID as both username AND password:
- User enters only: `team_001`
- Backend converts to email: `team_001@quarrymadness.local`
- Password is set to same value: `team_001`
- **Security Note**: Less secure, but acceptable for internal competition use

#### Option 2: Keep Current (Team ID + Password)
- More secure approach
- Teams can't guess other team credentials
- Recommended if competition is public/competitive

**Which would you prefer?**

---

### Issue 3: Finding Your Test Team Password 🔐

**Where is the password?**

You set it when you created the auth user in Supabase. Here's how to find/reset it:

#### Method 1: Check the Seed Script Comment
Look at [supabase/seed_test_data.sql:18](supabase/seed_test_data.sql#L18)
- Default suggested password: `TestPassword123!`
- If you used a different one, you'll need to reset it

#### Method 2: Reset Password in Supabase
1. Go to: Supabase Dashboard → Authentication → Users
2. Find user: `team_001@quarrymadness.local`
3. Click on the user
4. Click "Send Password Recovery" OR "Reset Password"
5. Set new password (e.g., `TestPassword123!`)
6. Use that password to login

#### Method 3: Create New Test User
If easier, delete the old one and create fresh:
```sql
-- In Supabase SQL Editor
DELETE FROM teams WHERE team_id = 'team_001';
-- Then go to Auth → Users → Delete user: team_001@quarrymadness.local
-- Create new user with known password
-- Re-run seed_test_data.sql with new UUID
```

---

## 🧪 How to Test Login Now

### Step 1: Fix Turnstile Issue
Choose Option B (quickest):
```bash
# Edit frontend/.env
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

### Step 2: Restart Dev Server
```bash
cd frontend
npm run dev
```

### Step 3: Navigate to Login
Open: http://localhost:5173/12qm25/#/login

### Step 4: Login Credentials
- **Team ID**: `team_001`
- **Password**: Check Method 1-3 above to find/reset

### Step 5: Expected Behavior
1. ✅ Turnstile widget loads (will auto-pass with test key)
2. ✅ Enter credentials
3. ✅ Click "Sign In"
4. ✅ Toast: "Successfully signed in!"
5. ✅ Redirects to dashboard showing:
   - Team: Test Team Alpha
   - Climbers: Alice Climber & Bob Climber
   - 0 points (no ascents logged yet)

---

## 📂 Project Structure Overview

```
12qm25/
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth-manager.js    # Session management
│   │   │   └── login.js            # Login page with Turnstile
│   │   ├── dashboard/
│   │   │   └── dashboard.js        # Team dashboard
│   │   ├── lib/
│   │   │   ├── router.js           # Hash-based routing
│   │   │   └── supabase.js         # DB client
│   │   ├── shared/
│   │   │   ├── scoring-engine.js   # Points calculation
│   │   │   ├── category-classifier.js
│   │   │   └── ui-helpers.js       # Toast, loading
│   │   └── main.js                 # App entry point
│   ├── .env                        # Supabase + Turnstile keys
│   └── package.json
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # ✅ Database tables
│       ├── 002_rls_policies.sql    # ✅ Security policies
│       └── seed_test_data.sql      # ✅ Test team data (ALL FIXED)
└── project.md                      # Full specification
```

---

## 🚀 Next Steps

### Immediate (Testing Phase 3)
1. **Fix Turnstile**: Update .env with test key OR add localhost to your Turnstile domain list
2. **Find Password**: Check seed script default OR reset in Supabase dashboard
3. **Test Login**: Follow testing steps above
4. **Verify Dashboard**: Confirm team data displays correctly

### After Successful Login Testing
**Phase 4: User Story 1 - Team Climb Logging**
- Route selection interface
- Log ascent functionality
- Real-time score calculation with repeat penalties
- Display updated team scores
- Bonus game logging

---

## 🛟 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Turnstile "invalid domain" | Use test key `1x00000000000000000000AA` in .env |
| "Permission denied" error | Check RLS policies applied, verify seed script ran |
| Dashboard shows empty | Check browser console, verify Supabase connection |
| Can't remember password | Reset in Supabase Auth dashboard |
| Routes show 404 | Use hash routes: `#/login` not `/login` |
| Styles not loading | Clear cache, rebuild with `npm run dev` |

---

## 💬 Questions for You

1. **Turnstile Fix**: Which option do you prefer?
   - [ ] Option A: Add localhost to your Turnstile domain list
   - [ ] Option B: Use test key `1x00000000000000000000AA` (recommended)
   - [ ] Option C: Disable for now

2. **Authentication Approach**:
   - [ ] Keep current (Team ID + Password) - more secure
   - [ ] Switch to Team ID only (simpler but less secure)

3. **Password**:
   - [ ] I know the password (will test now)
   - [ ] Need to reset it in Supabase
   - [ ] Want to create new test user with known password

---

## ✅ What's Working

- ✅ Database schema and RLS policies
- ✅ All seed data scripts fixed and validated
- ✅ Supabase connection configured
- ✅ Frontend routing system
- ✅ Auth manager and session handling
- ✅ GitHub-style UI with CAWA branding
- ✅ Scoring engine logic implemented
- ✅ Dashboard page ready to display data

**We're 95% there!** Just need to resolve Turnstile for localhost and you'll be able to login and see your team dashboard. 🎉
