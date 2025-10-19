-- Migration 020: Allow Climber Names Visibility When Results Open
-- Date: 2025-10-19
-- Purpose: Allow all teams to see climber names when results_open = true
--
-- Problem: Teams can only see their own climbers due to RLS policies,
-- causing team leaderboards to show "-" for other teams' climber names
--
-- Solution: Add RLS policy to allow reading climbers when results are open

-- =============================================================================
-- Add RLS policy for climber visibility when results are open
-- =============================================================================

-- All teams can read ALL climbers when results_open = true
CREATE POLICY "climbers_select_when_results_open"
ON climbers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM competition_settings
    WHERE results_open = true
  )
);

-- =============================================================================
-- Verification
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 020 complete: Climber names visible when results open';
  RAISE NOTICE '   - Added policy: climbers_select_when_results_open';
  RAISE NOTICE '   - Teams can now see all climber names when results_open = true';
END $$;
