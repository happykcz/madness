-- Quarry Madness Scorekeeper - Database Schema
-- Supabase PostgreSQL Migration
-- Phase 1 Output | Date: 2025-10-10

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Teams: Pairs of climbers competing together
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id VARCHAR(50) UNIQUE NOT NULL,
  team_name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_team_category CHECK (
    category IN ('masters', 'recreational', 'intermediate', 'advanced')
  )
);

CREATE INDEX idx_teams_auth_user ON teams(auth_user_id);
CREATE INDEX idx_teams_category ON teams(category);

-- Climbers: Individual participants
CREATE TABLE climbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  redpoint_grade INTEGER NOT NULL,
  category VARCHAR(20) NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_age CHECK (age >= 10 AND age <= 100),
  CONSTRAINT valid_redpoint CHECK (redpoint_grade >= 10 AND redpoint_grade <= 35),
  CONSTRAINT valid_climber_category CHECK (
    category IN ('recreational', 'intermediate', 'advanced')
  )
);

CREATE INDEX idx_climbers_team ON climbers(team_id);
CREATE INDEX idx_climbers_auth_user ON climbers(auth_user_id);
CREATE INDEX idx_climbers_category ON climbers(category);

-- Routes: Climbing challenges
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  grade_numeric INTEGER NOT NULL,
  gear_type VARCHAR(20) NOT NULL,
  base_points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_gear_type CHECK (
    gear_type IN ('sport', 'trad', 'boulder')
  ),
  CONSTRAINT valid_base_points CHECK (base_points IN (5, 8, 12, 16, 20)),
  CONSTRAINT unique_route UNIQUE (sector, name)
);

CREATE INDEX idx_routes_sector ON routes(sector);
CREATE INDEX idx_routes_gear_type ON routes(gear_type);
CREATE INDEX idx_routes_grade_numeric ON routes(grade_numeric);

-- Ascents: Logged climbs
CREATE TABLE ascents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  climber_id UUID NOT NULL REFERENCES climbers(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE RESTRICT,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_earned INTEGER NOT NULL,
  repeat_count INTEGER NOT NULL,

  CONSTRAINT valid_points CHECK (points_earned >= 0),
  CONSTRAINT valid_repeat CHECK (repeat_count >= 1)
);

CREATE INDEX idx_ascents_climber ON ascents(climber_id);
CREATE INDEX idx_ascents_route ON ascents(route_id);
CREATE INDEX idx_ascents_team ON ascents(team_id);
CREATE INDEX idx_ascents_logged_at ON ascents(logged_at);

-- Trigger to automatically set team_id from climber
CREATE OR REPLACE FUNCTION sync_ascent_team_id()
RETURNS TRIGGER AS $$
BEGIN
  SELECT team_id INTO NEW.team_id
  FROM climbers
  WHERE id = NEW.climber_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ascent_team_sync
BEFORE INSERT OR UPDATE ON ascents
FOR EACH ROW
EXECUTE FUNCTION sync_ascent_team_id();

-- Bonus Games: Special competition events
CREATE TABLE bonus_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  points INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  CONSTRAINT valid_bonus_points CHECK (points > 0)
);

CREATE INDEX idx_bonus_games_active ON bonus_games(is_active);

-- Bonus Entries: Climbers earning bonus points
CREATE TABLE bonus_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  climber_id UUID NOT NULL REFERENCES climbers(id) ON DELETE CASCADE,
  bonus_game_id UUID NOT NULL REFERENCES bonus_games(id) ON DELETE CASCADE,
  points_awarded INTEGER NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_climber_game UNIQUE (climber_id, bonus_game_id)
);

CREATE INDEX idx_bonus_entries_climber ON bonus_entries(climber_id);
CREATE INDEX idx_bonus_entries_game ON bonus_entries(bonus_game_id);

-- Scoring Windows: Competition timeframe
CREATE TABLE scoring_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_window CHECK (
    ended_at IS NULL OR ended_at > started_at
  )
);

CREATE INDEX idx_scoring_windows_times ON scoring_windows(started_at, ended_at);

-- Team Overrides: Admin-granted exceptions to scoring window
CREATE TABLE team_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT
);

CREATE INDEX idx_team_overrides_active ON team_overrides(team_id, is_active);

-- Partial unique index: only one active override per team
CREATE UNIQUE INDEX idx_unique_active_override
ON team_overrides(team_id)
WHERE is_active = TRUE;

-- Administrators: Competition organizers
CREATE TABLE administrators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_administrators_auth_user ON administrators(auth_user_id);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Calculate points for an ascent
CREATE OR REPLACE FUNCTION calculate_ascent_points(
  p_climber_id UUID,
  p_route_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_base_points INTEGER;
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

-- Assign team category based on climber attributes
CREATE OR REPLACE FUNCTION assign_team_category(
  p_climber1_age INTEGER,
  p_climber1_grade INTEGER,
  p_climber2_age INTEGER,
  p_climber2_grade INTEGER
)
RETURNS VARCHAR(20) AS $$
DECLARE
  v_max_grade INTEGER;
BEGIN
  -- Masters: one climber 50+ OR both 45+
  IF (p_climber1_age >= 50 OR p_climber2_age >= 50)
     OR (p_climber1_age >= 45 AND p_climber2_age >= 45) THEN
    RETURN 'masters';
  END IF;

  -- Otherwise categorize by stronger climber's grade
  v_max_grade := GREATEST(p_climber1_grade, p_climber2_grade);

  IF v_max_grade >= 24 THEN
    RETURN 'advanced';
  ELSIF v_max_grade >= 20 THEN
    RETURN 'intermediate';
  ELSE
    RETURN 'recreational';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- COMPUTED VIEWS
-- =============================================================================

-- Team scores aggregated view
CREATE OR REPLACE VIEW team_scores AS
SELECT
  t.id AS team_id,
  t.team_id AS team_code,
  t.team_name,
  t.category,
  COALESCE(SUM(a.points_earned), 0) + COALESCE(SUM(b.points_awarded), 0) AS total_points,
  COALESCE(SUM(a.points_earned), 0) AS route_points,
  COALESCE(SUM(b.points_awarded), 0) AS bonus_points,
  COUNT(DISTINCT a.id) AS total_ascents
FROM teams t
LEFT JOIN climbers c ON c.team_id = t.id
LEFT JOIN ascents a ON a.climber_id = c.id
LEFT JOIN bonus_entries b ON b.climber_id = c.id
GROUP BY t.id, t.team_id, t.team_name, t.category;

-- Climber scores aggregated view
CREATE OR REPLACE VIEW climber_scores AS
SELECT
  c.id AS climber_id,
  c.name,
  c.team_id,
  c.category,
  c.redpoint_grade,
  COALESCE(SUM(a.points_earned), 0) + COALESCE(SUM(b.points_awarded), 0) AS total_points,
  COALESCE(MAX(r.grade_numeric), 0) AS hardest_send,
  COUNT(DISTINCT a.route_id) AS unique_routes_climbed
FROM climbers c
LEFT JOIN ascents a ON a.climber_id = c.id
LEFT JOIN routes r ON r.id = a.route_id
LEFT JOIN bonus_entries b ON b.climber_id = c.id
GROUP BY c.id, c.name, c.team_id, c.category, c.redpoint_grade;

-- Hardest send leaderboard
CREATE OR REPLACE VIEW hardest_send_leaderboard AS
WITH climber_hardest AS (
  SELECT
    c.id AS climber_id,
    c.name,
    MAX(r.grade_numeric) AS hardest_grade
  FROM climbers c
  JOIN ascents a ON a.climber_id = c.id
  JOIN routes r ON r.id = a.route_id
  GROUP BY c.id, c.name
)
SELECT
  ch.climber_id,
  ch.name,
  ch.hardest_grade,
  r.grade AS hardest_grade_display,
  COUNT(*) AS ascents_at_hardest
FROM climber_hardest ch
JOIN ascents a ON a.climber_id = ch.climber_id
JOIN routes r ON r.id = a.route_id AND r.grade_numeric = ch.hardest_grade
GROUP BY ch.climber_id, ch.name, ch.hardest_grade, r.grade
ORDER BY ch.hardest_grade DESC, ascents_at_hardest DESC;

-- =============================================================================
-- NOTE: Row Level Security policies are defined in rls-policies.sql
-- =============================================================================
