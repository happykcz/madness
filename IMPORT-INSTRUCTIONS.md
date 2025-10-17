# Team Import Instructions for Supabase Dashboard

## Overview
This guide will help you import 17 teams (34 climbers) into your Quarry Madness competition database.

## Process Summary
1. **FIRST**: Create auth users in Supabase Auth
2. **SECOND**: Run SQL to create teams and climbers
3. **VERIFY**: Check the data was imported correctly

---

## PART 1: Create Auth Users (Do This First!)

You need to create 17 auth users in Supabase. Here are two methods:

### Method A: Using Supabase Dashboard (Recommended for bulk import)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** → **"Create new user"**
4. For each team, enter:
   - **Email**: (see list below)
   - **Password**: `qm2025`
   - **Auto Confirm User**: ✅ YES (check this box)
5. Click **"Create user"**

**List of 17 users to create:**

```
climbget@quarrymadness.local
climbcuca@quarrymadness.local
crackulas@quarrymadness.local
forearmed@quarrymadness.local
traindrg@quarrymadness.local
idkteam@quarrymadness.local
marioluigi@quarrymadness.local
monkleash@quarrymadness.local
mrwhippy@quarrymadness.local
scaredycat@quarrymadness.local
simonsays@quarrymadness.local
takenflake@quarrymadness.local
goodguides@quarrymadness.local
unexparr@quarrymadness.local
vertlife@quarrymadness.local
xtraone@quarrymadness.local
xtratwo@quarrymadness.local
```

### Method B: Using SQL (Advanced)

If you have access to run SQL commands with service role privileges:

```sql
-- Run this with service role key or via edge function
-- Create all auth users
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
VALUES
  -- Note: You'll need to generate proper password hashes
  -- It's easier to use the dashboard method above
```

**⚠️ Important**: Wait for all auth users to be created before proceeding to Part 2!

---

## PART 2: Create Teams and Climbers

After all 17 auth users exist:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **"New query"**
4. Open the file `import-competitors.sql` from your project
5. Copy the **PART 2** section (starts with "-- PART 2: TEAMS AND CLIMBERS CREATION")
6. Paste it into the SQL Editor
7. Click **"Run"**

The script will:
- Create 17 teams
- Link each team to its auth user
- Calculate team categories automatically
- Create 34 climber records (2 per team)
- Set appropriate climber categories

---

## PART 3: Verify Import

After running the SQL, verify the import:

1. In SQL Editor, run:

```sql
SELECT
  t.team_id,
  t.team_name,
  t.category as team_category,
  COUNT(c.id) as climber_count,
  STRING_AGG(c.name, ', ' ORDER BY c.name) as climbers
FROM teams t
LEFT JOIN climbers c ON c.team_id = t.id
GROUP BY t.id, t.team_id, t.team_name, t.category
ORDER BY t.team_name;
```

2. You should see:
   - **17 teams**
   - **2 climbers per team** (34 total)
   - Proper categories assigned

3. Check that auth users are linked:

```sql
SELECT
  t.team_id,
  t.team_name,
  u.email,
  CASE WHEN t.auth_user_id IS NOT NULL THEN '✓' ELSE '✗' END as linked
FROM teams t
LEFT JOIN auth.users u ON u.id = t.auth_user_id
ORDER BY t.team_name;
```

All teams should show '✓' in the linked column.

---

## Test Login

After import, test that teams can log in:

1. Go to your frontend application login page
2. Try logging in with one team's credentials:
   - **Username/Email**: `climbget@quarrymadness.local`
   - **Password**: `qm2025`
3. Verify the team can access their dashboard

---

## Troubleshooting

### Error: "cannot insert into teams: violates foreign key constraint"
**Solution**: Auth users weren't created first. Go back to Part 1.

### Error: "Team ID already exists"
**Solution**: Some teams were already created. Either:
- Delete existing teams first
- Modify the SQL to skip existing teams

### Error: "email already exists"
**Solution**: Auth user already exists. Either:
- Skip that user (if you created it earlier)
- Delete and recreate it

### Categories look wrong
**Solution**: Categories are auto-calculated based on the `assign_team_category()` function using:
- Masters: one climber 50+ OR both 45+
- Advanced: max grade ≥ 24
- Intermediate: max grade ≥ 20
- Recreational: max grade < 20

---

## Quick Reference

**All teams use the same password**: `qm2025`

**Total to create**:
- 17 auth users
- 17 teams
- 34 climbers

**Files**:
- `import-competitors.sql` - Main SQL import script
- `team-credentials.md` - Complete list of teams and credentials
- `IMPORT-INSTRUCTIONS.md` - This file

**Categories breakdown** (auto-calculated):
- Masters: 3 teams (Crackulas, How to train your dragon, Simon Says)
- Advanced: 2 teams (Scaredy Cats, Vertical life)
- Intermediate: 6 teams (idk, Monkey On Leash, The Good Guides, Unexpected arrival, xtra one, xtra two)
- Recreational: 6 teams (Climb-Get-Score, Climbing Cucarachas, Forearmageddon, Mario & Luigi, Mr Whippy, Take "n" Flake)
