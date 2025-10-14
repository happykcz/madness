-- Migration 015: Revert base_points to INTEGER
-- Date: 2025-10-14
-- Purpose: Simplify scoring by using whole numbers only

-- Change base_points from NUMERIC(5,2) back to INTEGER
ALTER TABLE routes ALTER COLUMN base_points TYPE INTEGER USING FLOOR(base_points);

-- Update the calculate_ascent_points function to use INTEGER
CREATE OR REPLACE FUNCTION calculate_ascent_points(
  p_climber_id UUID,
  p_route_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_base_points INTEGER;  -- Changed back to INTEGER
  v_gear_type VARCHAR(20);
  v_repeat_count INTEGER;
  v_trad_multiplier NUMERIC;
  v_repeat_multiplier NUMERIC;
  v_final_points INTEGER;
BEGIN
  -- Get route details
  SELECT base_points, gear_type
  INTO v_base_points, v_gear_type
  FROM routes
  WHERE id = p_route_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Route not found';
  END IF;

  -- Count existing ascents + 1 for this ascent
  SELECT COUNT(*) + 1
  INTO v_repeat_count
  FROM ascents
  WHERE climber_id = p_climber_id AND route_id = p_route_id;

  -- Calculate trad multiplier (1.5x for trad, 1.0x otherwise)
  v_trad_multiplier := CASE
    WHEN v_gear_type = 'trad' THEN 1.5
    ELSE 1.0
  END;

  -- Calculate repeat penalty multiplier (4 scoring attempts)
  v_repeat_multiplier := CASE
    WHEN v_repeat_count = 1 THEN 1.0   -- 100% for 1st attempt
    WHEN v_repeat_count = 2 THEN 0.75  -- 75% for 2nd attempt
    WHEN v_repeat_count = 3 THEN 0.50  -- 50% for 3rd attempt
    WHEN v_repeat_count = 4 THEN 0.25  -- 25% for 4th attempt
    ELSE 0.0                            -- 0% for 5th+ attempts
  END;

  -- Calculate final points (rounded down)
  v_final_points := FLOOR(v_base_points * v_trad_multiplier * v_repeat_multiplier);

  RETURN v_final_points;
END;
$$ LANGUAGE plpgsql STABLE;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 015 complete: Reverted base_points to INTEGER';
  RAISE NOTICE '   Simplified scoring system with whole numbers only';
  RAISE NOTICE '   Existing decimal values rounded down via FLOOR()';
  RAISE NOTICE '   calculate_ascent_points() updated to use INTEGER';
END $$;
