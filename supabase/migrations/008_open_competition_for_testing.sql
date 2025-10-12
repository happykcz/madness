-- Migration 008: Open competition for testing
-- Date: 2025-10-12
-- Purpose: Enable scoring during development by opening the competition

-- Set is_open to true to allow scoring during testing
UPDATE competition_settings
SET
  is_open = true,
  updated_at = now()
WHERE id IN (SELECT id FROM competition_settings LIMIT 1);

-- Verify
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 008 complete: Competition opened for testing';
  RAISE NOTICE '   Teams can now log sends regardless of competition window';
  RAISE NOTICE '   To close: UPDATE competition_settings SET is_open = false';
END $$;
