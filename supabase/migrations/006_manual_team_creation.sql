-- Manual Team Creation SQL Script
-- Use this to create teams manually while CORS issue is being debugged
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/cbcauybpyagrhrrrmirk/sql

-- HOW TO USE:
-- 1. First, create auth user in Supabase Dashboard:
--    Go to: Authentication → Users → Invite User
--    Email: <team_id>@quarrymadness.local (e.g., Jeff_Peter@quarrymadness.local)
--    Password: (your choice, e.g., 1234)
--    Confirm email: YES
-- 2. Copy the user ID from the created user
-- 3. Replace the values below and run this script

-- EXAMPLE: Create team "Jeff_Peter"

-- Step 1: Variables (REPLACE THESE)
DO $$
DECLARE
  v_team_id VARCHAR(50) := 'Jeff_Peter';  -- CHANGE THIS
  v_team_name VARCHAR(255) := 'Jeff and Peter';  -- CHANGE THIS
  v_auth_user_id UUID := 'PASTE_USER_ID_HERE';  -- CHANGE THIS (from step 1)
  v_climber1_name VARCHAR(255) := 'Jeff';  -- CHANGE THIS
  v_climber1_age INTEGER := 28;  -- CHANGE THIS
  v_climber1_grade INTEGER := 23;  -- CHANGE THIS (Ewbank grade)
  v_climber2_name VARCHAR(255) := 'Peter';  -- CHANGE THIS
  v_climber2_age INTEGER := 30;  -- CHANGE THIS
  v_climber2_grade INTEGER := 25;  -- CHANGE THIS (Ewbank grade)
  v_category VARCHAR(50);
  v_team_uuid UUID;
BEGIN
  -- Determine category based on climber grades
  IF (v_climber1_grade >= 24 OR v_climber2_grade >= 24) THEN
    v_category := 'elite';
  ELSIF (v_climber1_grade >= 21 OR v_climber2_grade >= 21) THEN
    v_category := 'advanced';
  ELSIF (v_climber1_grade >= 18 OR v_climber2_grade >= 18) THEN
    v_category := 'intermediate';
  ELSE
    v_category := 'recreational';
  END IF;

  -- Insert team record
  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES (v_team_id, v_team_name, v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  -- Insert climber 1
  INSERT INTO climbers (team_id, name, age, self_reported_grade, climber_number)
  VALUES (v_team_uuid, v_climber1_name, v_climber1_age, v_climber1_grade, 1);

  -- Insert climber 2
  INSERT INTO climbers (team_id, name, age, self_reported_grade, climber_number)
  VALUES (v_team_uuid, v_climber2_name, v_climber2_age, v_climber2_grade, 2);

  RAISE NOTICE 'Team created successfully!';
  RAISE NOTICE 'Team ID: %', v_team_id;
  RAISE NOTICE 'Category: %', v_category;
  RAISE NOTICE 'Login credentials: %@quarrymadness.local / (password you set)', v_team_id;
END $$;


-- ============================================================================
-- QUICK REFERENCE
-- ============================================================================

-- Category Classification:
-- - Elite: At least one climber with grade ≥ 24
-- - Advanced: At least one climber with grade ≥ 21
-- - Intermediate: At least one climber with grade ≥ 18
-- - Recreational: Both climbers with grade < 18

-- Ewbank Grading System:
-- 10-14: Beginner
-- 15-17: Easy
-- 18-20: Moderate
-- 21-23: Hard
-- 24-26: Very Hard
-- 27+: Elite

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all teams:
SELECT
  t.team_id,
  t.team_name,
  t.category,
  t.created_at,
  u.email,
  (SELECT COUNT(*) FROM climbers WHERE team_id = t.id) as climber_count
FROM teams t
JOIN auth.users u ON u.id = t.auth_user_id
ORDER BY t.created_at DESC;

-- Check specific team:
SELECT
  t.team_id,
  t.team_name,
  t.category,
  c.name as climber_name,
  c.age,
  c.self_reported_grade,
  c.climber_number
FROM teams t
JOIN climbers c ON c.team_id = t.id
WHERE t.team_id = 'Jeff_Peter'  -- CHANGE THIS
ORDER BY c.climber_number;

-- Check auth user:
SELECT
  id,
  email,
  created_at,
  last_sign_in_at,
  confirmed_at
FROM auth.users
WHERE email = 'Jeff_Peter@quarrymadness.local';  -- CHANGE THIS


-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- If team_id already exists:
-- DELETE FROM climbers WHERE team_id = (SELECT id FROM teams WHERE team_id = 'old_team_id');
-- DELETE FROM teams WHERE team_id = 'old_team_id';

-- If auth user doesn't exist:
-- Go to Supabase Dashboard → Authentication → Users → Invite User

-- To reset password:
-- Go to Supabase Dashboard → Authentication → Users → Find user → Reset Password
