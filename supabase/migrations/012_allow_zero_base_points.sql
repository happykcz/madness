-- Migration: Allow base_points = 0 for non-scoreable routes
-- Date: 2025-10-14
-- Purpose: Enable navigation/warm-up routes that cannot be scored

-- Drop the old constraint
ALTER TABLE routes DROP CONSTRAINT IF EXISTS valid_base_points;

-- Add new constraint allowing 0
ALTER TABLE routes ADD CONSTRAINT valid_base_points CHECK (base_points IN (0, 5, 8, 12, 16, 20));
