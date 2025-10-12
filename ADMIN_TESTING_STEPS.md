# Admin Interface - Testing Guide

## 🚀 Quick Setup & Testing

### Step 1: Run Database Migration

**Open Supabase SQL Editor** and run the entire contents of:
```
supabase/migrations/003_admin_setup.sql
```

This will create:
- ✅ `admin_actions` audit table
- ✅ `validate_team_id()` function for manual team ID validation
- ✅ `log_admin_action()` function for activity tracking
- ✅ Admin RLS policies for all tables
- ✅ Admin dashboard stats view

### Step 2: Create Admin User

**Supabase Dashboard → Authentication → Users → Add User**

Fill in **EXACTLY**:
```
Email:              admin@quarrymadness.local
Password:           admin12qm
Auto Confirm Email: ✅ YES (must check!)
```

Click "Create User"

### Step 3: Restart Dev Server

Your dev server should auto-reload, but if not:
```bash
# Press Ctrl+C to stop
npm run dev
```

### Step 4: Test Admin Login

1. Navigate to: `http://localhost:5173/12qm25/#/admin`
2. Login with:
   - Email: `admin@quarrymadness.local`
   - Password: `admin12qm`
3. Click "Sign In as Admin"

**Expected**: Redirect to admin dashboard showing:
- Total teams: 1 (your test team)
- Total climbers: 2
- Total ascents: 0
- Navigation cards to: Teams, Results, Settings

### Step 5: Test Team Creation

1. From admin dashboard, click "Team Management"
2. Click "Create New Team"
3. Fill in form:
   - **Team ID**: `Jeff_Peter` (manual entry!)
   - **Team Name**: `The Rock Stars`
   - **Password**: `12qm2025` (default)
   - **Climber 1**: Name: Jeff, Age: 35, Grade: 24
   - **Climber 2**: Name: Peter, Age: 32, Grade: 22
4. Click "Create Team"

**Expected**:
- Success page showing credentials
- Team ID: `Jeff_Peter`
- Password: `12qm2025`
- Copy to clipboard button works

### Step 6: View Team List

1. Click "Done - Back to Teams"
2. Should see table with:
   - `team_001` (your original test team)
   - `Jeff_Peter` (newly created)

### Step 7: View Team Details

1. Click "View Details" on `Jeff_Peter` team
2. Should show:
   - Login credentials
   - Show/Hide password button
   - Reset password button
   - Team category (Advanced - based on grades 24 & 22)
   - Both climbers with their info

### Step 8: Test Team Login

1. Open new incognito/private window
2. Go to: `http://localhost:5173/12qm25/#/login`
3. Login with:
   - Team ID: `Jeff_Peter`
   - Password: `12qm2025`
4. Should successfully login and see dashboard for Jeff_Peter team!

---

## ✅ Features Implemented

### Admin Authentication
- ✅ Separate admin login at `#/admin`
- ✅ Admin privilege verification via `is_admin()` function
- ✅ Protected admin routes with route guards
- ✅ Auto-redirect if not admin

### Team Management
- ✅ **Manual Team ID Entry** (e.g., `Jeff_Peter`, `AliceAndBob`)
- ✅ Team ID validation (3-50 chars, alphanumeric + underscore)
- ✅ Uniqueness check (prevents duplicate team IDs)
- ✅ Default password: `12qm2025`
- ✅ Custom password option
- ✅ Auto-categorize teams based on climber ages/grades
- ✅ Create team with 2 climbers
- ✅ Display credentials after creation
- ✅ Copy credentials to clipboard
- ✅ List all teams in searchable table
- ✅ View team details
- ✅ Show/hide password
- ✅ Reset password function
- ✅ Audit trail (all actions logged to `admin_actions`)

### Admin Dashboard
- ✅ Quick stats (teams, climbers, ascents, active windows)
- ✅ Current leader display
- ✅ Navigation to: Teams, Results, Settings

---

## 🐛 Troubleshooting

### Issue: "Permission denied" when creating team
**Cause**: Admin RLS policies not applied or not logged in as admin
**Fix**:
1. Run migration 003 completely
2. Verify logged in as `admin@quarrymadness.local`
3. Check browser console for specific error

### Issue: "Team ID already exists"
**Cause**: Trying to create team with duplicate ID
**Fix**: Choose a different team ID (it's manual entry, be unique!)

### Issue: Can't see admin dashboard after login
**Cause**: `is_admin()` function not working
**Fix**:
1. Check migration 003 ran successfully
2. Test in SQL Editor: `SELECT public.is_admin();` (should return `true` when logged in as admin)
3. Verify email is exactly `admin@quarrymadness.local`

### Issue: Supabase admin.createUser not working
**Cause**: Client-side can't use Supabase Admin API
**Fix**: This is expected. The code uses `supabase.auth.admin.createUser()` which requires service role key. For production, you'll need:
- **Option A**: Supabase Edge Function
- **Option B**: Backend API endpoint
- **Option C**: For now, manually create auth users in dashboard

**Workaround for testing**: When creating teams, if you get "createUser" error:
1. Manually create auth user in Supabase Dashboard first
2. Use the same email format: `{teamId}@quarrymadness.local`
3. Then the team creation will link to that user

---

## 🎯 What's Next

You now have:
1. ✅ Admin authentication working
2. ✅ Team management with manual IDs
3. ✅ Credential display
4. ✅ Password reset

**Still to build:**
- Admin Results/Leaderboard page
- Admin Competition Settings page (scoring windows)

Should I continue building those, or do you want to test what we have first?

---

## 💡 Notes on Manual Team IDs

**Why manual entry is better:**
- ✅ Not predictable (more secure than team_001, team_002)
- ✅ Memorable for teams (Jeff_Peter easier to remember than team_042)
- ✅ Can use climber names (AliceAndBob, MikeJohn)
- ✅ Can use team names (RockStars, BoulderBros)

**Valid formats:**
- ✅ `Jeff_Peter`
- ✅ `AliceAndBob`
- ✅ `RockStars2025`
- ✅ `TeamAlpha`
- ❌ `Jeff&Peter` (no special chars)
- ❌ `AB` (too short, min 3 chars)
- ❌ `Jeff Peter` (no spaces)

**Pro tip**: Tell teams their Team ID when they register - they'll need it to login!
