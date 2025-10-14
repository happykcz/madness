-- Migration 016: Database Cleanup - Remove Unused Tables and Constraints
-- Date: 2025-10-15
-- Purpose: Clean up duplicate/unused tables and outdated constraints

-- ============================================================================
-- 1. DROP UNUSED TABLES
-- ============================================================================

-- Drop scoring_windows table (replaced by competition_settings)
DROP TABLE IF EXISTS scoring_windows CASCADE;

-- Drop team_overrides table (not used - competition status is global)
DROP TABLE IF EXISTS team_overrides CASCADE;

-- ============================================================================
-- 2. UPDATE OUTDATED CONSTRAINTS
-- ============================================================================

-- Remove outdated base_points constraint (now allows 0 and any positive INTEGER)
ALTER TABLE routes
DROP CONSTRAINT IF EXISTS valid_base_points;

-- Add updated constraint allowing 0 and any positive value
ALTER TABLE routes
ADD CONSTRAINT valid_base_points CHECK (base_points >= 0);

-- ============================================================================
-- 3. FIX FUNCTION REFERENCES
-- ============================================================================

-- Fix get_next_tick_number function - remove reference to non-existent 'success' column
CREATE OR REPLACE FUNCTION get_next_tick_number(
  p_climber_id UUID,
  p_route_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_max_tick INTEGER;
BEGIN
  -- Get highest tick number for this climber on this route
  SELECT COALESCE(MAX(tick_number), 0) INTO v_max_tick
  FROM ascents
  WHERE climber_id = p_climber_id
    AND route_id = p_route_id;

  -- Return next tick number (max 10)
  RETURN LEAST(v_max_tick + 1, 10);
END;
$$;

COMMENT ON FUNCTION get_next_tick_number(UUID, UUID) IS 'Get next tick number for climber on route (max 10) - FIXED: removed success column reference';

-- ============================================================================
-- 4. ADD MISSING ADMIN HELPER FUNCTION
-- ============================================================================

-- Add is_admin helper function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM administrators
    WHERE auth_user_id = auth.uid()
  );
END;
$$;

COMMENT ON FUNCTION is_admin() IS 'Check if current user is an administrator';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ============================================================================
-- 5. VERIFICATION
-- ============================================================================

DO $$
BEGIN
  -- Verify scoring_windows is dropped
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scoring_windows') THEN
    RAISE NOTICE '✅ scoring_windows table dropped successfully';
  ELSE
    RAISE WARNING '⚠️  scoring_windows table still exists';
  END IF;

  -- Verify team_overrides is dropped
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_overrides') THEN
    RAISE NOTICE '✅ team_overrides table dropped successfully';
  ELSE
    RAISE WARNING '⚠️  team_overrides table still exists';
  END IF;

  RAISE NOTICE '✅ Migration 016 complete: Database cleanup applied';
  RAISE NOTICE '   - Removed unused tables: scoring_windows, team_overrides';
  RAISE NOTICE '   - Updated base_points constraint to allow 0';
  RAISE NOTICE '   - Fixed get_next_tick_number function';
  RAISE NOTICE '   - Added is_admin helper function';
END $$;
