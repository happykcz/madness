-- Diagnostic Script: Verify Test Team Setup
-- Run this in Supabase SQL Editor to check your test team configuration

-- =============================================================================
-- STEP 1: Check Auth User Exists
-- =============================================================================
SELECT
  'Auth User Check' AS check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE
    WHEN email = 'team_001@quarrymadness.local' THEN '✅ Correct email format'
    ELSE '❌ Wrong email format - should be team_001@quarrymadness.local'
  END AS email_status
FROM auth.users
WHERE email LIKE '%team_001%';

-- Expected: One row with email = 'team_001@quarrymadness.local'
-- If no results: User doesn't exist, create it
-- If wrong email: Delete and recreate with correct email format

-- =============================================================================
-- STEP 2: Check Team Record Exists and Links to Auth User
-- =============================================================================
SELECT
  'Team Check' AS check_type,
  t.id,
  t.team_id,
  t.team_name,
  t.category,
  t.auth_user_id,
  u.email AS linked_email,
  CASE
    WHEN t.auth_user_id IS NULL THEN '❌ No auth_user_id set'
    WHEN u.id IS NULL THEN '❌ auth_user_id points to non-existent user'
    WHEN u.email = 'team_001@quarrymadness.local' THEN '✅ Correctly linked'
    ELSE '⚠️ Linked to wrong user'
  END AS link_status
FROM teams t
LEFT JOIN auth.users u ON u.id = t.auth_user_id
WHERE t.team_id = 'team_001';

-- Expected: One row with link_status = '✅ Correctly linked'
-- If no results: Team record doesn't exist, run seed script
-- If link_status shows error: Run fix script below

-- =============================================================================
-- STEP 3: Check Climbers Exist for Team
-- =============================================================================
SELECT
  'Climbers Check' AS check_type,
  c.id,
  c.name,
  c.age,
  c.redpoint_grade,
  c.category,
  t.team_id
FROM climbers c
JOIN teams t ON t.id = c.team_id
WHERE t.team_id = 'team_001';

-- Expected: Two rows (Alice Climber and Bob Climber)

-- =============================================================================
-- STEP 4: Test RLS Policy Access
-- =============================================================================
-- This simulates what happens when the user logs in
DO $$
DECLARE
  v_auth_user_id UUID;
BEGIN
  -- Get the auth user ID
  SELECT id INTO v_auth_user_id
  FROM auth.users
  WHERE email = 'team_001@quarrymadness.local';

  IF v_auth_user_id IS NULL THEN
    RAISE NOTICE '❌ Auth user not found - create user with email: team_001@quarrymadness.local';
  ELSE
    RAISE NOTICE '✅ Auth user found: %', v_auth_user_id;

    -- Check if team can be accessed
    PERFORM 1 FROM teams WHERE auth_user_id = v_auth_user_id;
    IF FOUND THEN
      RAISE NOTICE '✅ Team accessible via RLS';
    ELSE
      RAISE NOTICE '❌ Team not accessible - auth_user_id mismatch or RLS issue';
    END IF;
  END IF;
END $$;

-- =============================================================================
-- FIX SCRIPT: If auth_user_id is wrong or missing
-- =============================================================================

/*
-- Uncomment and run this if your team exists but isn't linked to auth user

DO $$
DECLARE
  v_auth_user_id UUID;
  v_team_id UUID;
BEGIN
  -- Get the auth user ID
  SELECT id INTO v_auth_user_id
  FROM auth.users
  WHERE email = 'team_001@quarrymadness.local';

  IF v_auth_user_id IS NULL THEN
    RAISE EXCEPTION 'Auth user not found! Create user with email: team_001@quarrymadness.local';
  END IF;

  -- Update team to link to auth user
  UPDATE teams
  SET auth_user_id = v_auth_user_id
  WHERE team_id = 'team_001'
  RETURNING id INTO v_team_id;

  -- Update climbers to link to auth user
  UPDATE climbers
  SET auth_user_id = v_auth_user_id
  WHERE team_id = v_team_id;

  RAISE NOTICE '✅ Fixed! Team and climbers now linked to auth user: %', v_auth_user_id;
END $$;
*/

-- =============================================================================
-- COMPLETE RESET: Delete everything and start fresh
-- =============================================================================

/*
-- Uncomment and run this to completely reset test team

DO $$
DECLARE
  v_auth_user_id UUID;
BEGIN
  -- Get auth user ID
  SELECT id INTO v_auth_user_id
  FROM auth.users
  WHERE email = 'team_001@quarrymadness.local';

  -- Delete team and related data (cascades to climbers, ascents, etc.)
  DELETE FROM teams WHERE team_id = 'team_001';

  -- Delete auth user (requires admin access)
  -- You'll need to do this manually in Supabase Dashboard → Auth → Users

  RAISE NOTICE '✅ Team data deleted. Now delete auth user in dashboard and recreate both.';
END $$;
*/

-- =============================================================================
-- SUMMARY OF REQUIRED SETUP
-- =============================================================================

/*
For login to work, you need:

1. Auth User in Supabase:
   - Email: team_001@quarrymadness.local (EXACT format)
   - Password: 1234 (or whatever you choose)
   - Email confirmed: YES

2. Team Record:
   - team_id: 'team_001'
   - auth_user_id: Must match the UUID of auth user above

3. Login Form:
   - Team ID: team_001 (NOT the full email)
   - Password: 1234 (must match auth user password)

The app converts team_001 → team_001@quarrymadness.local for auth.

To test password reset in Supabase dashboard, you can:
- Go to Auth → Users → team_001@quarrymadness.local
- Click "..." menu → Send Password Recovery
- Or manually set password in dashboard
*/
