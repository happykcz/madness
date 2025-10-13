-- Migration: Remove base_points constraint and change to decimal
-- Date: 2025-10-14
-- Purpose: Allow flexible point values including 0 (non-scoreable) and decimals (e.g., 12.50)

-- Drop the constraint entirely
ALTER TABLE routes DROP CONSTRAINT IF EXISTS valid_base_points;

-- Change base_points from INTEGER to NUMERIC(5,2) to allow decimal values
ALTER TABLE routes ALTER COLUMN base_points TYPE NUMERIC(5,2);

-- Update the calculate_ascent_points function to handle NUMERIC base_points
CREATE OR REPLACE FUNCTION calculate_ascent_points(
  p_climber_id UUID,
  p_route_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_base_points NUMERIC(5,2);  -- Changed from INTEGER to NUMERIC
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

  -- Calculate repeat penalty multiplier
  v_repeat_multiplier := CASE
    WHEN v_repeat_count = 1 THEN 1.0   -- 100%
    WHEN v_repeat_count = 2 THEN 0.75  -- 75%
    WHEN v_repeat_count = 3 THEN 0.25  -- 25%
    ELSE 0.0                            -- 0% for 4th+
  END;

  -- Calculate final points (rounded down)
  v_final_points := FLOOR(v_base_points * v_trad_multiplier * v_repeat_multiplier);

  RETURN v_final_points;
END;
$$ LANGUAGE plpgsql STABLE;
