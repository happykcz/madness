-- Quick Auth Check - Run this NOW to see what's in your database
-- Copy the output and share it with me

-- 1. Check what auth users exist
SELECT
  '🔐 AUTH USERS' AS section,
  email,
  id,
  email_confirmed_at IS NOT NULL AS email_confirmed,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 2. Check what teams exist
SELECT
  '📋 TEAMS' AS section,
  team_id,
  team_name,
  auth_user_id,
  created_at
FROM teams
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check if team_001 exists and is properly linked
SELECT
  '🔍 TEAM_001 STATUS' AS section,
  t.team_id,
  t.team_name,
  t.auth_user_id AS team_auth_id,
  u.id AS user_id,
  u.email AS user_email,
  CASE
    WHEN u.id IS NULL THEN '❌ NO AUTH USER LINKED'
    WHEN u.email != 'team_001@quarrymadness.local' THEN '❌ WRONG EMAIL: ' || u.email
    WHEN u.email_confirmed_at IS NULL THEN '⚠️ EMAIL NOT CONFIRMED'
    ELSE '✅ LOOKS GOOD'
  END AS status
FROM teams t
LEFT JOIN auth.users u ON u.id = t.auth_user_id
WHERE t.team_id = 'team_001';

-- 4. If no results above, check if auth user exists without team
SELECT
  '🔍 ORPHAN AUTH USERS' AS section,
  u.email,
  u.id,
  'No team record found - need to create team with this auth_user_id' AS issue
FROM auth.users u
WHERE u.email LIKE '%team_%'
  AND NOT EXISTS (
    SELECT 1 FROM teams t WHERE t.auth_user_id = u.id
  );
