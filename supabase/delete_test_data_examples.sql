-- ============================================
-- Test Data Cleanup Examples
-- ============================================
-- Copy the relevant sections to Supabase SQL Editor
-- Replace the WHERE conditions with your actual test data IDs/names

-- ============================================
-- Example 1: Delete a specific team and ALL related data
-- ============================================

-- Step 1: Find the team ID you want to delete
-- SELECT id, team_name FROM teams WHERE team_name LIKE '%test%';

-- Step 2: Delete in correct order (replace 'YOUR_TEAM_ID' with actual UUID)

-- Delete nudge dismissals for this team
DELETE FROM nudge_dismissals
WHERE team_id = 'YOUR_TEAM_ID';

-- Delete bonus entries for climbers in this team
DELETE FROM bonus_entries
WHERE climber_id IN (
  SELECT id FROM climbers WHERE team_id = 'YOUR_TEAM_ID'
);

-- Delete ascents for climbers in this team
DELETE FROM ascents
WHERE climber_id IN (
  SELECT id FROM climbers WHERE team_id = 'YOUR_TEAM_ID'
);

-- Delete climbers in this team
DELETE FROM climbers
WHERE team_id = 'YOUR_TEAM_ID';

-- Finally, delete the team itself
DELETE FROM teams
WHERE id = 'YOUR_TEAM_ID';


-- ============================================
-- Example 2: Delete multiple test teams by name pattern
-- ============================================

-- Delete nudge dismissals
DELETE FROM nudge_dismissals
WHERE team_id IN (
  SELECT id FROM teams WHERE team_name LIKE '%test%'
);

-- Delete bonus entries
DELETE FROM bonus_entries
WHERE climber_id IN (
  SELECT id FROM climbers
  WHERE team_id IN (
    SELECT id FROM teams WHERE team_name LIKE '%test%'
  )
);

-- Delete ascents
DELETE FROM ascents
WHERE climber_id IN (
  SELECT id FROM climbers
  WHERE team_id IN (
    SELECT id FROM teams WHERE team_name LIKE '%test%'
  )
);

-- Delete climbers
DELETE FROM climbers
WHERE team_id IN (
  SELECT id FROM teams WHERE team_name LIKE '%test%'
);

-- Delete teams
DELETE FROM teams
WHERE team_name LIKE '%test%';


-- ============================================
-- Example 3: Delete specific test routes
-- ============================================

-- Step 1: Find route IDs you want to delete
-- SELECT id, name, grade FROM routes WHERE name LIKE '%test%';

-- Step 2: Delete ascents for these routes first
DELETE FROM ascents
WHERE route_id IN (
  SELECT id FROM routes WHERE name LIKE '%test%'
);

-- Step 3: Delete the routes
DELETE FROM routes
WHERE name LIKE '%test%';

-- Or delete specific routes by ID
DELETE FROM ascents WHERE route_id = 'YOUR_ROUTE_ID';
DELETE FROM routes WHERE id = 'YOUR_ROUTE_ID';


-- ============================================
-- Example 4: Delete all test data (routes + teams)
-- ============================================

-- 1. Delete nudge dismissals for test teams
DELETE FROM nudge_dismissals
WHERE team_id IN (
  SELECT id FROM teams WHERE team_name LIKE '%test%'
);

-- 2. Delete bonus entries for test climbers
DELETE FROM bonus_entries
WHERE climber_id IN (
  SELECT id FROM climbers
  WHERE team_id IN (
    SELECT id FROM teams WHERE team_name LIKE '%test%'
  )
);

-- 3. Delete ascents (for both test routes and test climbers)
DELETE FROM ascents
WHERE route_id IN (SELECT id FROM routes WHERE name LIKE '%test%')
   OR climber_id IN (
     SELECT id FROM climbers
     WHERE team_id IN (
       SELECT id FROM teams WHERE team_name LIKE '%test%'
     )
   );

-- 4. Delete test climbers
DELETE FROM climbers
WHERE team_id IN (
  SELECT id FROM teams WHERE team_name LIKE '%test%'
);

-- 5. Delete test teams
DELETE FROM teams
WHERE team_name LIKE '%test%';

-- 6. Delete test routes
DELETE FROM routes
WHERE name LIKE '%test%';


-- ============================================
-- Example 5: Safe check before deletion (verify counts)
-- ============================================

-- Check what will be deleted for a specific team
SELECT
  (SELECT COUNT(*) FROM climbers WHERE team_id = 'YOUR_TEAM_ID') as climbers_count,
  (SELECT COUNT(*) FROM ascents WHERE climber_id IN (SELECT id FROM climbers WHERE team_id = 'YOUR_TEAM_ID')) as ascents_count,
  (SELECT COUNT(*) FROM bonus_entries WHERE climber_id IN (SELECT id FROM climbers WHERE team_id = 'YOUR_TEAM_ID')) as bonus_entries_count,
  (SELECT COUNT(*) FROM nudge_dismissals WHERE team_id = 'YOUR_TEAM_ID') as nudge_dismissals_count;

-- Check what will be deleted for test teams
SELECT
  (SELECT COUNT(*) FROM teams WHERE team_name LIKE '%test%') as teams_count,
  (SELECT COUNT(*) FROM climbers WHERE team_id IN (SELECT id FROM teams WHERE team_name LIKE '%test%')) as climbers_count,
  (SELECT COUNT(*) FROM ascents WHERE climber_id IN (SELECT id FROM climbers WHERE team_id IN (SELECT id FROM teams WHERE team_name LIKE '%test%'))) as ascents_count;


-- ============================================
-- Example 6: Delete specific team by name
-- ============================================

WITH team_to_delete AS (
  SELECT id FROM teams WHERE team_name = 'Test Team Name'
)
-- Delete in order
DELETE FROM nudge_dismissals WHERE team_id IN (SELECT id FROM team_to_delete);

WITH team_to_delete AS (
  SELECT id FROM teams WHERE team_name = 'Test Team Name'
)
DELETE FROM bonus_entries WHERE climber_id IN (
  SELECT id FROM climbers WHERE team_id IN (SELECT id FROM team_to_delete)
);

WITH team_to_delete AS (
  SELECT id FROM teams WHERE team_name = 'Test Team Name'
)
DELETE FROM ascents WHERE climber_id IN (
  SELECT id FROM climbers WHERE team_id IN (SELECT id FROM team_to_delete)
);

WITH team_to_delete AS (
  SELECT id FROM teams WHERE team_name = 'Test Team Name'
)
DELETE FROM climbers WHERE team_id IN (SELECT id FROM team_to_delete);

DELETE FROM teams WHERE team_name = 'Test Team Name';


-- ============================================
-- NOTES:
-- ============================================
-- 1. Always backup or verify before running DELETE statements
-- 2. Use SELECT first to check what will be deleted:
--    Change "DELETE FROM" to "SELECT * FROM" to preview
-- 3. Run deletions in a transaction for safety:
--    BEGIN;
--    -- your DELETE statements
--    ROLLBACK; -- to undo, or COMMIT; to confirm
-- 4. Replace LIKE '%test%' with more specific patterns:
--    - WHERE team_name = 'Exact Name'
--    - WHERE id = 'specific-uuid'
--    - WHERE team_name IN ('Team 1', 'Team 2')
