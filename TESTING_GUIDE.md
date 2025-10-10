# Quarry Madness - Testing Guide

## 🧪 Phase 3 Testing: Team Authentication

### Prerequisites Checklist

- [ ] Supabase project created
- [ ] Database migrations run (001_initial_schema.sql ✅, 002_rls_policies.sql ✅)
- [ ] `.env` file configured with Supabase credentials
- [ ] Cloudflare Turnstile configured for your domains (happyk.au, madness.happyk.au)
- [ ] Test team account created in Supabase Auth

### Step 1: Create Test Team Account

1. **Create Auth User in Supabase Dashboard**:
   - Go to: Authentication → Users → Add User
   - Email: `team_001@quarrymadness.local`
   - Password: `TestPassword123!` (or your choice)
   - ✅ Auto Confirm Email: YES
   - Copy the UUID of created user

2. **Run Seed Data SQL**:
   - Open `supabase/seed_test_data.sql`
   - Replace `'YOUR_AUTH_USER_UUID'` with the copied UUID
   - Run in Supabase SQL Editor
   - Verify output shows: teams, climbers, routes, scoring window, bonus games created

### Step 2: Start Development Server

```bash
cd frontend
npm run dev
```

Server should start at: `http://localhost:5173/12qm25/`

### Step 3: Test Authentication Flow

#### Test 1: Home Page
- [ ] Navigate to `http://localhost:5173/12qm25/`
- [ ] CAWA logo displays correctly
- [ ] "Sign In" button visible in header
- [ ] Phase 2 completion status shows
- [ ] "Get Started" button works

#### Test 2: Login Page
- [ ] Click "Sign In" or navigate to `#/login`
- [ ] CAWA logo displays at top
- [ ] Team ID and Password fields visible
- [ ] Cloudflare Turnstile widget loads (or dev mode message)
- [ ] Form styling matches GitHub design

#### Test 3: Login Validation
- [ ] Try submitting empty form → Error: "Please enter both Team ID and Password"
- [ ] Enter invalid credentials → Error: "Login failed"
- [ ] Try without completing Turnstile → Error: "Please complete verification"

#### Test 4: Successful Login
1. Enter credentials:
   - Team ID: `team_001`
   - Password: `TestPassword123!` (or what you set)
2. Complete Turnstile challenge
3. Click "Sign In"
4. Expected results:
   - [ ] Loading overlay appears
   - [ ] Toast notification: "Successfully signed in!"
   - [ ] Redirects to `#/dashboard`
   - [ ] Dashboard loads team data

#### Test 5: Dashboard Display
- [ ] Header shows CAWA logo and "Quarry Madness"
- [ ] "Sign Out" button visible in header
- [ ] Team card displays:
  - Team name: "Test Team Alpha"
  - Team ID: "team_001"
  - Category: "Intermediate"
  - Total points: 0 (no ascents yet)
  - Total ascents: 0
  - Team members: 2
- [ ] Climber cards show:
  - Alice Climber (Age 30, Grade 22, Intermediate)
  - Bob Climber (Age 28, Grade 20, Intermediate)
  - Both with 0 points and 0 ascents
- [ ] Action buttons present (Log Ascent, View Routes)
- [ ] Info box shows Phase 3 complete message

#### Test 6: Protected Routes
1. Sign out using "Sign Out" button
2. Try to navigate directly to `#/dashboard`
3. Expected result:
   - [ ] Redirects to `#/login`
   - [ ] Toast: "Signed out"
   - [ ] Cannot access dashboard without auth

#### Test 7: Session Persistence
1. Sign in successfully
2. Refresh the page (F5 or Cmd+R)
3. Expected result:
   - [ ] Stays on dashboard
   - [ ] Session persists
   - [ ] Team data loads correctly

#### Test 8: Sign Out
1. From dashboard, click "Sign Out"
2. Expected results:
   - [ ] Toast: "Signed out"
   - [ ] Redirects to `/login`
   - [ ] Cannot go back to dashboard

### Step 4: Verify Database Integration

Open browser console (F12) and check:
- [ ] No JavaScript errors
- [ ] Supabase client initialized
- [ ] Auth manager initialized
- [ ] Router initialized

### Step 5: Test on Different Screens

#### Mobile (320px - 768px)
- [ ] Login form responsive
- [ ] Dashboard cards stack vertically
- [ ] Buttons full-width on mobile
- [ ] Text readable on small screens

#### Tablet (768px - 1024px)
- [ ] Layout adapts properly
- [ ] Cards maintain good spacing

#### Desktop (1024px+)
- [ ] Centered container (max-width: 1280px)
- [ ] Proper spacing and padding
- [ ] CAWA logo clear and sharp

## 🐛 Common Issues & Solutions

### Issue: Turnstile not loading
**Solution**: Check console for errors. Ensure script tag in `index.html` is correct. Verify site key in `.env` matches Cloudflare dashboard.

### Issue: "Permission denied" on login
**Solution**: Verify RLS policies are applied. Check that seed data script ran successfully with correct UUID.

### Issue: Dashboard shows "Failed to load"
**Solution**: Check browser console for Supabase errors. Verify team was created in database. Check network tab for failed requests.

### Issue: Routes 404 errors
**Solution**: Remember we're using hash routing. URLs should be `#/login` not `/login`. GitHub Pages requires hash routing.

### Issue: Styles not applying
**Solution**: Clear browser cache. Rebuild with `npm run build`. Check Tailwind config includes correct content paths.

## ✅ Success Criteria

Phase 3 is complete when:
- [x] User can sign in with team credentials
- [x] Cloudflare Turnstile integration works
- [x] Dashboard displays team and climber data
- [x] Protected routes enforce authentication
- [x] Session persists across page refreshes
- [x] Sign out functionality works correctly
- [x] GitHub-style design with CAWA branding
- [x] Mobile-responsive layout (320px+)
- [x] All database queries respect RLS policies

## 🚀 Next Steps

Once Phase 3 testing is complete and all checkboxes are ✅:

**Phase 4: User Story 1 - Team Climb Logging**
- Log ascents with route selection
- Real-time score calculation
- Repeat penalty enforcement
- Bonus game logging
- Live leaderboard updates (admin view)

## 📝 Test Results

Date: ______________
Tester: ______________

| Test | Status | Notes |
|------|--------|-------|
| Home Page | [ ] Pass / [ ] Fail | |
| Login Page | [ ] Pass / [ ] Fail | |
| Login Validation | [ ] Pass / [ ] Fail | |
| Successful Login | [ ] Pass / [ ] Fail | |
| Dashboard Display | [ ] Pass / [ ] Fail | |
| Protected Routes | [ ] Pass / [ ] Fail | |
| Session Persistence | [ ] Pass / [ ] Fail | |
| Sign Out | [ ] Pass / [ ] Fail | |
| Mobile Responsive | [ ] Pass / [ ] Fail | |

**Overall Result**: [ ] All Tests Pass [ ] Issues Found

**Issues Found**:
1. _______________________________________
2. _______________________________________
3. _______________________________________
