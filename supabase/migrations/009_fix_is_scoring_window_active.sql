-- Migration 009: Fix is_scoring_window_active to check competition_settings
-- Date: 2025-10-12
-- Purpose: Update function to respect competition_settings.is_open flag

-- Update the function to check competition_settings as well as scoring_windows
CREATE OR REPLACE FUNCTION public.is_scoring_window_active()
RETURNS BOOLEAN AS $$
DECLARE
  v_is_open BOOLEAN;
BEGIN
  -- First check if competition is manually opened
  SELECT is_open INTO v_is_open
  FROM competition_settings
  LIMIT 1;

  -- If competition is manually opened, allow scoring
  IF v_is_open = TRUE THEN
    RETURN TRUE;
  END IF;

  -- Otherwise check if there's an active scoring window
  RETURN EXISTS (
    SELECT 1 FROM scoring_windows
    WHERE started_at <= NOW()
      AND (ended_at IS NULL OR ended_at > NOW())
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Verify
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 009 complete: is_scoring_window_active() updated';
  RAISE NOTICE '   Function now checks competition_settings.is_open flag first';
  RAISE NOTICE '   Then falls back to checking scoring_windows table';
END $$;
