# Debug Steps - Login Issue

## 🔍 Step 1: Run Diagnostic Query

**Copy and run this in Supabase SQL Editor:**

File: [supabase/quick_auth_check.sql](supabase/quick_auth_check.sql)

This will show you:
1. All auth users in your system
2. All teams in your system
3. Whether team_001 is properly linked
4. If there are orphan auth users

**After running, copy the ENTIRE output and share it with me.**

---

## 🧪 Step 2: Test Login with Debug Logging

I've added debug logging to the auth manager. Now when you try to login, you'll see:

```javascript
🔐 Attempting login with: { email: 'team_001@quarrymadness.local', passwordLength: 4 }
```

**Try logging in again with:**
- Team ID: `team_001`
- Password: `1234`

**Then check browser console (F12) and look for the line that says:**
```
🔐 Attempting login with: ...
```

**Share what it says!** This will confirm:
- ✅ The app is sending the right email format
- ✅ The password length is correct (should be 4 for "1234")

---

## 🎯 Step 3: Create Fresh Auth User (Correct Way)

Based on the console error, I suspect the auth user either:
- Has the wrong email format
- Doesn't exist at all
- Password doesn't match

**Let's create it correctly:**

### 3a. Delete Old User (if exists)
1. Supabase Dashboard → Authentication → Users
2. Search for "team"
3. If you find any users, delete them all
4. Also run in SQL Editor:
   ```sql
   DELETE FROM teams WHERE team_id = 'team_001';
   DELETE FROM climbers WHERE team_id IN (SELECT id FROM teams WHERE team_id = 'team_001');
   ```

### 3b. Create New Auth User
Supabase Dashboard → Authentication → Users → **Add User**

**Fill in EXACTLY (copy/paste to avoid typos):**
```
Email:              team_001@quarrymadness.local
Password:           1234
Auto Confirm Email: ✅ (CHECK THIS BOX!)
```

Click **Create User**

### 3c. Copy the UUID
After creating, you'll see a UUID like: `12345678-abcd-1234-abcd-123456789abc`

**COPY THIS UUID!**

### 3d. Create Team Record
Run this in Supabase SQL Editor (replace YOUR_UUID_HERE):

```sql
DO $$
DECLARE
  v_auth_user_id UUID := 'YOUR_UUID_HERE';  -- ← PASTE UUID HERE
  v_team_id UUID;
  v_climber1_id UUID;
  v_climber2_id UUID;
BEGIN

  -- Insert test team
  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('team_001', 'Test Team Alpha', 'intermediate', v_auth_user_id)
  RETURNING id INTO v_team_id;

  RAISE NOTICE 'Created team with ID: %', v_team_id;

  -- Insert first climber
  INSERT INTO climbers (team_id, name, age, redpoint_grade, category, auth_user_id)
  VALUES (v_team_id, 'Alice Climber', 30, 22, 'intermediate', v_auth_user_id)
  RETURNING id INTO v_climber1_id;

  RAISE NOTICE 'Created climber 1 with ID: %', v_climber1_id;

  -- Insert second climber
  INSERT INTO climbers (team_id, name, age, redpoint_grade, category, auth_user_id)
  VALUES (v_team_id, 'Bob Climber', 28, 20, 'intermediate', v_auth_user_id)
  RETURNING id INTO v_climber2_id;

  RAISE NOTICE 'Created climber 2 with ID: %', v_climber2_id;

END $$;
```

### 3e. Verify Setup
Run [quick_auth_check.sql](supabase/quick_auth_check.sql) again.

Expected output:
```
🔐 AUTH USERS
email: team_001@quarrymadness.local
email_confirmed: true

📋 TEAMS
team_id: team_001

🔍 TEAM_001 STATUS
status: ✅ LOOKS GOOD
```

### 3f. Test Login
- Refresh browser: http://localhost:5173/12qm25/#/login
- Team ID: `team_001`
- Password: `1234`
- Sign In

Should work! 🎉

---

## 🐛 Common Mistakes to Avoid

### ❌ WRONG: Creating user with just "team_001"
```
Email: team_001  ← WRONG!
```

### ✅ CORRECT: Full email format
```
Email: team_001@quarrymadness.local  ← CORRECT!
```

### ❌ WRONG: Not confirming email
```
Auto Confirm Email: [ ]  ← WRONG! Unchecked
```

### ✅ CORRECT: Confirm email checked
```
Auto Confirm Email: [✓]  ← CORRECT! Checked
```

### ❌ WRONG: Team record with NULL auth_user_id
```sql
INSERT INTO teams (team_id, team_name, category)
VALUES ('team_001', 'Test', 'intermediate');
-- Missing auth_user_id!
```

### ✅ CORRECT: Team with auth_user_id
```sql
INSERT INTO teams (team_id, team_name, category, auth_user_id)
VALUES ('team_001', 'Test', 'intermediate', 'uuid-here');
```

---

## 📊 What to Share With Me

After running Step 1 (quick_auth_check.sql), copy and paste the output showing:

1. **Auth Users section** - What emails exist?
2. **Teams section** - What teams exist?
3. **Team_001 Status** - What does the status say?
4. **Browser console** - What does the debug log show when you try to login?

With this info, I can tell you exactly what's wrong and how to fix it!

---

## 🚀 After Login Works

Once you can successfully login, we'll build:

1. **Admin Registration Page** - Create teams easily
2. **Admin Results Page** - View leaderboards and scores
3. **Admin Comp Settings** - Manage scoring windows

Sound good? Let's get that login working first! 🎯
