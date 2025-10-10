-- Quarry Madness Scorekeeper - Test Data Seed
-- Run this in Supabase SQL Editor to create test accounts and sample data

-- =============================================================================
-- STEP 1: Create Test Team User in Supabase Auth
-- =============================================================================

/*
IMPORTANT: You need to create the auth user first through Supabase Dashboard!

Go to: Authentication → Users → Add User

Create user with:
- Email: team_001@quarrymadness.local
- Password: TestPassword123! (or your choice)
- Auto Confirm Email: YES

Copy the UUID of the created user, then replace 'YOUR_AUTH_USER_UUID' below
*/

-- =============================================================================
-- STEP 2: Create Test Team and Climbers
-- =============================================================================

-- Replace this with the actual UUID from the auth user you created
-- Example: '12345678-1234-1234-1234-123456789abc'
DO $$
DECLARE
  v_auth_user_id UUID := 'ae9642de-5e87-4bc1-af31-56315b0ca254'; -- REPLACE THIS!
  v_team_id UUID;
  v_climber1_id UUID;
  v_climber2_id UUID;
BEGIN

  -- Insert test team
  INSERT INTO teams (team_id, team_name, category, auth_user_id)
  VALUES ('team_001', 'Test Team Alpha', 'intermediate', v_auth_user_id)
  RETURNING id INTO v_team_id;

  RAISE NOTICE 'Created team with ID: %', v_team_id;

  -- Insert first climber (intermediate category, age 30, grade 22)
  INSERT INTO climbers (team_id, name, age, redpoint_grade, category, auth_user_id)
  VALUES (v_team_id, 'Alice Climber', 30, 22, 'intermediate', v_auth_user_id)
  RETURNING id INTO v_climber1_id;

  RAISE NOTICE 'Created climber 1 with ID: %', v_climber1_id;

  -- Insert second climber (intermediate category, age 28, grade 20)
  INSERT INTO climbers (team_id, name, age, redpoint_grade, category, auth_user_id)
  VALUES (v_team_id, 'Bob Climber', 28, 20, 'intermediate', v_auth_user_id)
  RETURNING id INTO v_climber2_id;

  RAISE NOTICE 'Created climber 2 with ID: %', v_climber2_id;

END $$;

-- =============================================================================
-- STEP 3: Create Sample Routes
-- =============================================================================

INSERT INTO routes (route_name, sector, grade, grade_numeric, gear_type, base_points)
VALUES
  -- Sport routes at The Quarry
  ('Easy Street', 'Main Wall', '15', 15, 'sport', 8),
  ('Moderate Challenge', 'Main Wall', '18', 18, 'sport', 12),
  ('Hard Times', 'Main Wall', '21', 21, 'sport', 16),
  ('Project X', 'Main Wall', '24', 24, 'sport', 20),

  -- Trad routes (with 50% bonus in base_points)
  ('Traditional Crack', 'Trad Area', '16', 16, 'trad', 12),  -- 8 * 1.5
  ('Classic Line', 'Trad Area', '20', 20, 'trad', 18),       -- 12 * 1.5

  -- Boulder problems
  ('Easy Boulder', 'Boulder Field', 'V1', 1, 'boulder', 8),
  ('Mid Boulder', 'Boulder Field', 'V3', 3, 'boulder', 16),
  ('Hard Boulder', 'Boulder Field', 'V5', 5, 'boulder', 20);

-- =============================================================================
-- STEP 4: Create Scoring Window (Competition is ACTIVE)
-- =============================================================================

INSERT INTO scoring_windows (name, started_at, ended_at, is_default)
VALUES (
  'Test Competition - Active',
  NOW() - INTERVAL '1 hour',  -- Started 1 hour ago
  NOW() + INTERVAL '5 hours', -- Ends in 5 hours
  TRUE
);

-- =============================================================================
-- STEP 5: Create Sample Bonus Games
-- =============================================================================

INSERT INTO bonus_games (game_name, description, points_awarded)
VALUES
  ('Dyno Challenge', 'Successfully complete the dynamic move challenge', 10),
  ('Speed Climb', 'Complete the speed route under 60 seconds', 10),
  ('Endurance Wall', 'Complete 10 routes without rest', 15);

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify teams created
SELECT 'Teams created:' AS info, team_id, team_name, category FROM teams;

-- Verify climbers created
SELECT 'Climbers created:' AS info, name, age, redpoint_grade, category FROM climbers;

-- Verify routes created
SELECT 'Routes created:' AS info, route_name, grade, gear_type, base_points FROM routes;

-- Verify scoring window
SELECT 'Scoring window:' AS info, name, started_at, ended_at,
       CASE
         WHEN started_at <= NOW() AND (ended_at IS NULL OR ended_at > NOW())
         THEN 'ACTIVE ✅'
         ELSE 'INACTIVE'
       END AS status
FROM scoring_windows;

-- Verify bonus games
SELECT 'Bonus games:' AS info, game_name, points_awarded FROM bonus_games;

-- =============================================================================
-- LOGIN CREDENTIALS FOR TESTING
-- =============================================================================

/*
🔑 TEST LOGIN CREDENTIALS:

Email/Username: team_001@quarrymadness.local
Password: (whatever you set when creating the auth user)
Team ID: team_001

Use these credentials to test the login functionality in Phase 3!

📋 WHAT'S BEEN CREATED:
- ✅ 1 test team (Team Alpha - Intermediate category)
- ✅ 2 climbers (Alice: grade 22, Bob: grade 20)
- ✅ 9 sample routes (sport, trad, boulder)
- ✅ 1 active scoring window (competition is LIVE)
- ✅ 3 bonus games

🧪 NEXT STEPS:
1. Update your .env file with Turnstile site key
2. Test login at: http://localhost:5173/12qm25/#/login
3. Start logging ascents!
*/
