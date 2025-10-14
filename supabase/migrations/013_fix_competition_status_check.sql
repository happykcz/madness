-- Migration 013: Fix competition status check to use competition_settings times
-- Date: 2025-10-14
-- Purpose: Update is_scoring_window_active() to check competition_settings.competition_start/end
--          instead of relying on scoring_windows table

-- Update the function to check competition_settings times
CREATE OR REPLACE FUNCTION public.is_scoring_window_active()
RETURNS BOOLEAN AS $$
DECLARE
  v_settings RECORD;
  v_now TIMESTAMPTZ;
BEGIN
  -- Get competition settings
  SELECT is_open, competition_start, competition_end
  INTO v_settings
  FROM competition_settings
  LIMIT 1;

  -- If no settings found, deny access
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- If manually opened, allow scoring
  IF v_settings.is_open = TRUE THEN
    RETURN TRUE;
  END IF;

  -- Check if current time is within scheduled competition window
  v_now := NOW();

  RETURN (v_now >= v_settings.competition_start AND v_now <= v_settings.competition_end);
END;
$$ LANGUAGE plpgsql STABLE;

-- Add comment
COMMENT ON FUNCTION public.is_scoring_window_active() IS
'Check if competition is active based on is_open flag or scheduled competition_start/end times';

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 013 complete: Fixed is_scoring_window_active()';
  RAISE NOTICE '   Function now checks:';
  RAISE NOTICE '   1. competition_settings.is_open (manual override)';
  RAISE NOTICE '   2. Current time within competition_start/competition_end window';
  RAISE NOTICE '   No longer uses scoring_windows table';
END $$;
