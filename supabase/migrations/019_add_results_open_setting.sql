-- Migration 019: Add results_open Setting
-- Date: 2025-10-19
-- Purpose: Add admin control for showing/hiding results page to teams

-- Add results_open column to competition_settings
ALTER TABLE competition_settings
ADD COLUMN IF NOT EXISTS results_open BOOLEAN DEFAULT false;

-- Add comment
COMMENT ON COLUMN competition_settings.results_open IS 'Admin control: allow teams to view results/leaderboard page';

-- Set default to false for existing row
UPDATE competition_settings
SET results_open = false
WHERE results_open IS NULL;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 019 complete: Added results_open setting';
  RAISE NOTICE '   - results_open column added to competition_settings';
  RAISE NOTICE '   - Default value: false (results hidden from teams)';
END $$;
