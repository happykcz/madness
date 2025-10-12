-- Migration 007: Scoring System Updates for Sprint 1
-- Date: 2025-10-12
-- Purpose: Add route organization fields, tick multipliers, and competition settings

-- ============================================================================
-- 1. ROUTES TABLE UPDATES
-- ============================================================================

-- Add sector and ordering fields to routes table
ALTER TABLE routes
ADD COLUMN IF NOT EXISTS sector VARCHAR(100),
ADD COLUMN IF NOT EXISTS sector_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS route_order INTEGER DEFAULT 0;

-- Add comment for sector field
COMMENT ON COLUMN routes.sector IS 'Route group/sector name (e.g., "Main Wall", "Cave Sector")';
COMMENT ON COLUMN routes.sector_order IS 'Display order of sector (0-99)';
COMMENT ON COLUMN routes.route_order IS 'Display order within sector (0-999)';

-- Create index for efficient ordering queries
CREATE INDEX IF NOT EXISTS idx_routes_ordering
ON routes(sector_order, route_order);

-- ============================================================================
-- 2. ASCENTS TABLE UPDATES
-- ============================================================================

-- Add tick tracking and scoring fields to ascents table
ALTER TABLE ascents
ADD COLUMN IF NOT EXISTS tick_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS tick_multiplier DECIMAL(3,2) DEFAULT 1.00,
ADD COLUMN IF NOT EXISTS trad_bonus_applied BOOLEAN DEFAULT false;

-- Add constraints
ALTER TABLE ascents
ADD CONSTRAINT tick_number_positive CHECK (tick_number >= 1 AND tick_number <= 10),
ADD CONSTRAINT tick_multiplier_valid CHECK (tick_multiplier >= 0 AND tick_multiplier <= 1.00);

-- Add comments
COMMENT ON COLUMN ascents.tick_number IS 'Which tick this is for this climber on this route (1-10)';
COMMENT ON COLUMN ascents.tick_multiplier IS 'Scoring multiplier: 1st=1.00, 2nd=0.75, 3rd=0.50, 4th=0.25, 5th+=0.00';
COMMENT ON COLUMN ascents.trad_bonus_applied IS 'Whether 50% trad bonus was applied to this attempt';

-- Create index for efficient tick counting
CREATE INDEX IF NOT EXISTS idx_ascents_tick_tracking
ON ascents(climber_id, route_id, tick_number);

-- ============================================================================
-- 3. COMPETITION SETTINGS TABLE
-- ============================================================================

-- Create competition settings table
CREATE TABLE IF NOT EXISTS competition_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Competition window
  competition_start TIMESTAMPTZ NOT NULL DEFAULT '2025-10-18 06:00:00+08'::timestamptz,
  competition_end TIMESTAMPTZ NOT NULL DEFAULT '2025-10-18 18:00:00+08'::timestamptz,

  -- Admin overrides
  is_open BOOLEAN DEFAULT false,
  is_extended BOOLEAN DEFAULT false,
  manual_close BOOLEAN DEFAULT false,

  -- Leaderboard nudge settings
  nudge_interval_hours INTEGER DEFAULT 3,
  last_nudge_time TIMESTAMPTZ,
  nudge_enabled BOOLEAN DEFAULT true,

  -- Scoring rules (for reference/display)
  tick_multipliers JSONB DEFAULT '[
    {"tick": 1, "multiplier": 1.00},
    {"tick": 2, "multiplier": 0.75},
    {"tick": 3, "multiplier": 0.50},
    {"tick": 4, "multiplier": 0.25},
    {"tick": 5, "multiplier": 0.00}
  ]'::jsonb,
  trad_bonus_percentage INTEGER DEFAULT 50,

  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Add comments
COMMENT ON TABLE competition_settings IS 'Global competition configuration and timing';
COMMENT ON COLUMN competition_settings.competition_start IS 'Competition start time (AWST UTC+8)';
COMMENT ON COLUMN competition_settings.competition_end IS 'Competition end time (AWST UTC+8)';
COMMENT ON COLUMN competition_settings.is_open IS 'Admin override: open early';
COMMENT ON COLUMN competition_settings.is_extended IS 'Admin override: extend beyond end time';
COMMENT ON COLUMN competition_settings.manual_close IS 'Admin override: close manually';
COMMENT ON COLUMN competition_settings.nudge_interval_hours IS 'Hours between automatic leaderboard nudges';
COMMENT ON COLUMN competition_settings.tick_multipliers IS 'Scoring multipliers by tick number (JSON array)';
COMMENT ON COLUMN competition_settings.trad_bonus_percentage IS 'Bonus percentage for trad routes (default 50%)';

-- Insert default competition settings
INSERT INTO competition_settings (
  competition_start,
  competition_end,
  nudge_interval_hours,
  trad_bonus_percentage
) VALUES (
  '2025-10-18 06:00:00+08'::timestamptz,
  '2025-10-18 18:00:00+08'::timestamptz,
  3,
  50
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. RLS POLICIES FOR COMPETITION SETTINGS
-- ============================================================================

-- Enable RLS
ALTER TABLE competition_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings (to check competition status)
CREATE POLICY "Anyone can view competition settings"
ON competition_settings
FOR SELECT
TO authenticated
USING (true);

-- Only admins can update settings
CREATE POLICY "Only admins can update competition settings"
ON competition_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM administrators
    WHERE administrators.auth_user_id = auth.uid()
  )
);

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to get tick multiplier based on tick number
CREATE OR REPLACE FUNCTION get_tick_multiplier(p_tick_number INTEGER)
RETURNS DECIMAL(3,2)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN CASE p_tick_number
    WHEN 1 THEN 1.00
    WHEN 2 THEN 0.75
    WHEN 3 THEN 0.50
    WHEN 4 THEN 0.25
    ELSE 0.00
  END;
END;
$$;

COMMENT ON FUNCTION get_tick_multiplier(INTEGER) IS 'Get scoring multiplier for tick number (1-4: decreasing, 5+: zero)';

-- Function to check if competition is currently active
CREATE OR REPLACE FUNCTION is_competition_active()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_settings RECORD;
  v_now TIMESTAMPTZ;
BEGIN
  -- Get current settings
  SELECT * INTO v_settings
  FROM competition_settings
  LIMIT 1;

  -- Get current time in AWST (UTC+8)
  v_now := now() AT TIME ZONE 'Australia/Perth';

  -- Check if competition is active
  IF v_settings.manual_close THEN
    RETURN false;
  END IF;

  IF v_settings.is_open THEN
    RETURN true;
  END IF;

  IF v_settings.is_extended THEN
    RETURN true;
  END IF;

  -- Check if within competition window
  RETURN v_now >= v_settings.competition_start
    AND v_now <= v_settings.competition_end;
END;
$$;

COMMENT ON FUNCTION is_competition_active() IS 'Check if competition is currently accepting submissions';

-- Function to get next tick number for climber on route
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
    AND route_id = p_route_id
    AND success = true;

  -- Return next tick number (max 10)
  RETURN LEAST(v_max_tick + 1, 10);
END;
$$;

COMMENT ON FUNCTION get_next_tick_number(UUID, UUID) IS 'Get next tick number for climber on route (max 10)';

-- ============================================================================
-- 6. UPDATE EXISTING DATA (if any)
-- ============================================================================

-- Set default tick_number=1 and tick_multiplier=1.00 for existing ascents
UPDATE ascents
SET
  tick_number = 1,
  tick_multiplier = 1.00,
  trad_bonus_applied = false
WHERE tick_number IS NULL;

-- Set default sector_order and route_order for existing routes
UPDATE routes
SET
  sector = 'Main Area',
  sector_order = 0,
  route_order = row_number() OVER (ORDER BY name)
WHERE sector IS NULL;

-- ============================================================================
-- 7. GRANT PERMISSIONS
-- ============================================================================

-- Grant access to competition_settings
GRANT SELECT ON competition_settings TO authenticated;
GRANT UPDATE ON competition_settings TO authenticated; -- RLS will restrict to admins

-- Grant execute on helper functions
GRANT EXECUTE ON FUNCTION get_tick_multiplier(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION is_competition_active() TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_tick_number(UUID, UUID) TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 007 complete: Scoring system updates applied';
  RAISE NOTICE '   - Routes table: sector, sector_order, route_order added';
  RAISE NOTICE '   - Ascents table: tick_number, tick_multiplier, trad_bonus_applied added';
  RAISE NOTICE '   - Competition settings table created with default values';
  RAISE NOTICE '   - Helper functions created for scoring logic';
  RAISE NOTICE '   - RLS policies applied';
END $$;
