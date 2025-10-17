-- ============================================================================
-- Quarry Madness 2025 - Competitor Import Script
-- ============================================================================
-- Password for all teams: qm2025
--
-- IMPORTANT: This script has TWO parts that must be run separately:
-- 1. PART 1: Create auth users (run this in Supabase Auth panel or via admin function)
-- 2. PART 2: Create teams and climbers (run this in SQL Editor after Part 1 completes)
-- ============================================================================

-- ============================================================================
-- PART 1: AUTH USER CREATION
-- ============================================================================
-- Run these commands via the admin-create-team edge function OR manually
-- create users in Supabase Dashboard > Authentication > Users
--
-- For each team, create a user with:
--   Email: {team_id}@quarrymadness.local
--   Password: qm2025
--   Email Confirm: Yes
--
-- Team IDs and emails:
--   climbget@quarrymadness.local (Climb-Get-Score)
--   climbcuca@quarrymadness.local (Climbing Cucarachas)
--   crackulas@quarrymadness.local (Crackulas)
--   forearmed@quarrymadness.local (Forearmageddon)
--   traindrg@quarrymadness.local (How to train your dragon)
--   idkteam@quarrymadness.local (idk)
--   marioluigi@quarrymadness.local (Mario & Luigi)
--   monkleash@quarrymadness.local (Monkey On Leash)
--   mrwhippy@quarrymadness.local (Mr Whippy)
--   scaredycat@quarrymadness.local (Scaredy Cats)
--   simonsays@quarrymadness.local (Simon Says)
--   takenflake@quarrymadness.local (Take "n" Flake)
--   goodguides@quarrymadness.local (The Good Guides)
--   unexparr@quarrymadness.local (Unexpected arrival)
--   vertlife@quarrymadness.local (Vertical life)
--   xtraone@quarrymadness.local (xtra one)
--   xtratwo@quarrymadness.local (xtra two)
--
-- After creating all auth users above, continue to PART 2 below
-- ============================================================================


-- ============================================================================
-- PART 2: TEAMS AND CLIMBERS CREATION
-- ============================================================================
-- Run this in Supabase Dashboard > SQL Editor
-- This assumes auth users from PART 1 have been created
-- ============================================================================

-- Create teams with auto-calculated categories
DO $$
DECLARE
  v_auth_user_id UUID;
  v_team_uuid UUID;
  v_category VARCHAR(20);
BEGIN
  -- ==================================================
  -- Team 1: Climb-Get-Score (climbget)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'climbget@quarrymadness.local';
  v_category := assign_team_category(26, 19, 35, 17);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('climbget', 'Climb-Get-Score', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Penny Hao', 26, 19, 'recreational'),
    (v_team_uuid, 'Danielle Blackwell', 35, 17, 'recreational');

  -- ==================================================
  -- Team 2: Climbing Cucarachas (climbcuca)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'climbcuca@quarrymadness.local';
  v_category := assign_team_category(10, 16, 49, 10);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('climbcuca', 'Climbing Cucarachas', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Olllie Paplinski', 10, 16, 'recreational'),
    (v_team_uuid, 'Andrew Paplinski', 49, 10, 'recreational');

  -- ==================================================
  -- Team 3: Crackulas (crackulas)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'crackulas@quarrymadness.local';
  v_category := assign_team_category(53, 24, 48, 22);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('crackulas', 'Crackulas', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Sebastian Menzies', 53, 24, 'advanced'),
    (v_team_uuid, 'Christopher Young', 48, 22, 'intermediate');

  -- ==================================================
  -- Team 4: Forearmageddon (forearmed)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'forearmed@quarrymadness.local';
  v_category := assign_team_category(30, 19, 28, 18);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('forearmed', 'Forearmageddon', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Matt Warlow', 30, 19, 'recreational'),
    (v_team_uuid, 'Shirley-Rose Field', 28, 18, 'recreational');

  -- ==================================================
  -- Team 5: How to train your dragon (traindrg)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'traindrg@quarrymadness.local';
  v_category := assign_team_category(56, 23, 41, 18);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('traindrg', 'How to train your dragon', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Lily Wall', 56, 23, 'intermediate'),
    (v_team_uuid, 'Eric Winkler', 41, 18, 'recreational');

  -- ==================================================
  -- Team 6: idk (idkteam)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'idkteam@quarrymadness.local';
  v_category := assign_team_category(24, 22, 35, 22);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('idkteam', 'idk', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Isaac Barden', 24, 22, 'intermediate'),
    (v_team_uuid, 'Tim Geoghegan', 35, 22, 'intermediate');

  -- ==================================================
  -- Team 7: Mario & Luigi (marioluigi)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'marioluigi@quarrymadness.local';
  v_category := assign_team_category(31, 19, 28, 19);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('marioluigi', 'Mario & Luigi', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Felix Fischer', 31, 19, 'recreational'),
    (v_team_uuid, 'Ana Carvalho', 28, 19, 'recreational');

  -- ==================================================
  -- Team 8: Monkey On Leash (monkleash)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'monkleash@quarrymadness.local';
  v_category := assign_team_category(37, 23, 32, 23);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('monkleash', 'Monkey On Leash', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Lara Morlacchi', 37, 23, 'intermediate'),
    (v_team_uuid, 'Adrian Lechel', 32, 23, 'intermediate');

  -- ==================================================
  -- Team 9: Mr Whippy (mrwhippy)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'mrwhippy@quarrymadness.local';
  v_category := assign_team_category(49, 17, 41, 22);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('mrwhippy', 'Mr Whippy', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Novak Elliott', 49, 17, 'recreational'),
    (v_team_uuid, 'John Saunders', 41, 22, 'intermediate');

  -- ==================================================
  -- Team 10: Scaredy Cats (scaredycat)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'scaredycat@quarrymadness.local';
  v_category := assign_team_category(20, 25, 21, 19);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('scaredycat', 'Scaredy Cats', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Harry Menzies', 20, 25, 'advanced'),
    (v_team_uuid, 'Riley Currie', 21, 19, 'recreational');

  -- ==================================================
  -- Team 11: Simon Says (simonsays)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'simonsays@quarrymadness.local';
  v_category := assign_team_category(54, 26, 52, 24);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('simonsays', 'Simon Says', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Jeff Robson', 54, 26, 'advanced'),
    (v_team_uuid, 'Simon Landrie', 52, 24, 'advanced');

  -- ==================================================
  -- Team 12: Take "n" Flake (takenflake)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'takenflake@quarrymadness.local';
  v_category := assign_team_category(46, 19, 42, 20);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('takenflake', 'Take "n" Flake', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Michael Elder', 46, 19, 'recreational'),
    (v_team_uuid, 'Michael Watt', 42, 20, 'intermediate');

  -- ==================================================
  -- Team 13: The Good Guides (goodguides)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'goodguides@quarrymadness.local';
  v_category := assign_team_category(29, 23, 46, 22);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('goodguides', 'The Good Guides', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Matthew Gray', 29, 23, 'intermediate'),
    (v_team_uuid, 'Greg Ireland', 46, 22, 'intermediate');

  -- ==================================================
  -- Team 14: Unexpected arrival (unexparr)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'unexparr@quarrymadness.local';
  v_category := assign_team_category(30, 23, 31, 21);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('unexparr', 'Unexpected arrival', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Lachlan Short', 30, 23, 'intermediate'),
    (v_team_uuid, 'Simon Kermode', 31, 21, 'intermediate');

  -- ==================================================
  -- Team 15: Vertical life (vertlife)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'vertlife@quarrymadness.local';
  v_category := assign_team_category(35, 27, 41, 27);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('vertlife', 'Vertical life', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'Virginia Garsia', 35, 27, 'advanced'),
    (v_team_uuid, 'Cedric Puig', 41, 27, 'advanced');

  -- ==================================================
  -- Team 16: xtra one (xtraone)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'xtraone@quarrymadness.local';
  v_category := assign_team_category(20, 20, 21, 21);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('xtraone', 'xtra one', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'extra one A', 20, 20, 'intermediate'),
    (v_team_uuid, 'extra one B', 21, 21, 'intermediate');

  -- ==================================================
  -- Team 17: xtra two (xtratwo)
  -- ==================================================
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = 'xtratwo@quarrymadness.local';
  v_category := assign_team_category(22, 22, 23, 23);

  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('xtratwo', 'xtra two', v_category, v_auth_user_id)
  RETURNING id INTO v_team_uuid;

  INSERT INTO climbers (team_id, name, age, redpoint_grade, category)
  VALUES
    (v_team_uuid, 'extra two A', 22, 22, 'intermediate'),
    (v_team_uuid, 'extra two B', 23, 23, 'intermediate');

END $$;

-- Verify the import
SELECT
  t.team_id,
  t.team_name,
  t.category,
  c.name as climber_name,
  c.age,
  c.redpoint_grade
FROM teams t
JOIN climbers c ON c.team_id = t.id
ORDER BY t.team_name, c.name;
