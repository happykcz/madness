# Login Troubleshooting Guide

## 🚨 Common Issue: "Invalid Login Credentials"

### Root Cause
The app expects auth user email in format: `{teamId}@quarrymadness.local`

When you enter:
- Team ID: `team_001`
- Password: `1234`

The app converts this to:
- Email: `team_001@quarrymadness.local`
- Password: `1234`

**Then calls Supabase Auth with these credentials.**

### Most Common Mistakes

#### ❌ Wrong Email Format When Creating User
```
Created user with email: team_001          ← WRONG
Should be:                team_001@quarrymadness.local  ← CORRECT
```

#### ❌ Team Record Not Linked to Auth User
Even if auth user exists, the `teams` table record must have `auth_user_id` set to match.

#### ❌ Password Doesn't Match
The password in Supabase Auth must exactly match what you type in login form.

---

## 🔍 Diagnostic Steps

### Step 1: Run Verification Script
I've created [supabase/verify_test_team.sql](supabase/verify_test_team.sql)

**Run this in Supabase SQL Editor** to check:
1. ✅ Auth user exists with correct email format
2. ✅ Team record exists and links to auth user
3. ✅ Climbers exist for the team
4. ✅ RLS policies allow access

### Step 2: Check Results

#### Expected Output (Everything Working):
```sql
-- Auth User Check
✅ Correct email format

-- Team Check
✅ Correctly linked

-- Climbers Check
Alice Climber
Bob Climber

-- RLS Test
✅ Auth user found: [UUID]
✅ Team accessible via RLS
```

#### Problem Output Examples:

**Problem 1: Wrong Email Format**
```sql
-- Auth User Check
❌ Wrong email format - should be team_001@quarrymadness.local
```
**Fix**: Delete user, create new one with email: `team_001@quarrymadness.local`

**Problem 2: Team Not Linked**
```sql
-- Team Check
❌ No auth_user_id set
```
**Fix**: Uncomment and run the FIX SCRIPT in verify_test_team.sql

**Problem 3: Auth User Missing**
```sql
-- Auth User Check
(no rows)
```
**Fix**: Create auth user in Supabase Dashboard

---

## ✅ Correct Setup Procedure

### Method 1: Fresh Start (Recommended)

#### 1. Delete Old Data
In Supabase SQL Editor:
```sql
-- Delete team record
DELETE FROM teams WHERE team_id = 'team_001';
```

In Supabase Dashboard → Authentication → Users:
- Find user (search for "team_001")
- Click "..." → Delete User

#### 2. Create New Auth User
Supabase Dashboard → Authentication → Users → **Add User**

**IMPORTANT - Fill in exactly:**
```
Email:              team_001@quarrymadness.local
Password:           1234
Auto Confirm Email: ✅ YES (check this box!)
```

Click "Create User"

**Copy the UUID** that appears (looks like: `12345678-1234-1234-1234-123456789abc`)

#### 3. Update Seed Script
Edit [supabase/seed_test_data.sql](supabase/seed_test_data.sql) line 29:

```sql
v_auth_user_id UUID := 'PASTE-YOUR-UUID-HERE';
```

#### 4. Run Seed Script
Copy entire contents of `seed_test_data.sql` and run in Supabase SQL Editor.

Expected output:
```
Created team with ID: [UUID]
Created climber 1 with ID: [UUID]
Created climber 2 with ID: [UUID]
```

#### 5. Test Login
- Navigate to: http://localhost:5173/12qm25/#/login
- Team ID: `team_001`
- Password: `1234`
- Click Sign In

Should redirect to dashboard! 🎉

---

## 🔐 Password Management

### Current Password for test_001
The password is whatever you set when creating the auth user in step 2 above.

### Reset Password
1. Supabase Dashboard → Authentication → Users
2. Find `team_001@quarrymadness.local`
3. Click "..." menu → **Send Password Recovery**
   - OR -
4. Manually update password in the dashboard UI

### Test Password Locally
You can test auth directly in SQL:
```sql
-- This tests if Supabase Auth recognizes the credentials
SELECT auth.email() AS current_user_email;
```

---

## 🎯 Quick Checklist Before Login

- [ ] Auth user exists with email: `team_001@quarrymadness.local`
- [ ] Auto Confirm Email was checked when creating user
- [ ] Team record exists in `teams` table
- [ ] Team record has `auth_user_id` matching auth user's UUID
- [ ] Password in auth user matches what you're typing
- [ ] Turnstile is configured (test key: `1x00000000000000000000AA`)
- [ ] Dev server is running: `npm run dev`
- [ ] Navigating to correct URL: `http://localhost:5173/12qm25/#/login`

---

## 💡 Pro Tips

### View Browser Console for Errors
Open Developer Tools (F12) → Console tab

Look for errors like:
- `Sign in error: Invalid login credentials` ← Email or password wrong
- `Permission denied` ← RLS policy issue
- `Team not found` ← Team record missing or not linked

### Check Network Tab
F12 → Network tab → Filter: Fetch/XHR

When you click "Sign In", watch for:
- Request to `supabase.co/auth/v1/token?grant_type=password`
- Status 200 = success
- Status 400 = bad credentials
- Status 422 = validation error

### Enable Supabase Logging
In browser console, run:
```javascript
localStorage.setItem('supabase.auth.debug', 'true')
```
Then refresh page and try login again. More detailed logs will appear.

---

## 🚀 Next: Admin Interface

Once login works, I'll build an admin interface that:

✅ Lists all teams with credentials
✅ Create new teams with auto-generated IDs
✅ Reset passwords to default (`12qm2025`)
✅ Bulk upload teams via CSV
✅ View/edit team details
✅ Deactivate teams without deleting data

Would you like me to start on this after we fix the login issue?
