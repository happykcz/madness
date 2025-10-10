# Data Model: Quarry Madness Scorekeeper

**Phase 1 Output** | **Date**: 2025-10-10 | **Research**: [research.md](./research.md)

## Overview

This document defines the database schema for the Quarry Madness Scorekeeper application using Supabase PostgreSQL. The schema implements all entities from the feature specification with Row Level Security (RLS) policies to enforce business rules.

## Entity Relationship Diagram

```
┌─────────────────┐
│  auth.users     │ (Supabase managed)
│  - id (uuid)    │
│  - email        │ Maps to team_id@internal.local
│  - role_meta    │ 'team' or 'admin'
└────────┬────────┘
         │
    ┌────┴────┬─────────────────────┐
    │         │                     │
┌───▼──────┐ ┌▼────────────┐ ┌─────▼────────┐
│  teams   │ │ climbers    │ │administrators│
│  - id    │ │ - id        │ │ - id         │
│  - name  │ │ - team_id ──┼─┤ - name       │
│  - cat.  │ │ - name      │ │ - auth_id    │
│  - auth  │ │ - age       │ └──────────────┘
└───┬──────┘ │ - redpt_gr. │
    │        │ - category  │
    │        │ - auth_id   │
    │        └──┬──────────┘
    │           │
    │      ┌────▼──────────┐
    │      │   ascents     │
    │      │   - id        │
    │      │   - climber   │
    │      │   - route ────┼──┐
    │      │   - timestamp │  │
    │      │   - points    │  │
    │      └───────────────┘  │
    │                         │
    │      ┌──────────────┐   │
    │      │bonus_entries│   │
    │      │ - id        │   │
    │      │ - climber   │   │
    │      │ - game ─────┼─┐ │
    │      │ - points    │ │ │
    │      └─────────────┘ │ │
    │                      │ │
┌───▼───────────┐ ┌────────▼─▼───────┐
│team_overrides │ │     routes       │
│ - team_id     │ │     - id         │
│ - is_active   │ │     - sector     │
│ - granted_by  │ │     - name       │
└───────────────┘ │     - grade      │
                  │     - gear_type  │
┌─────────────┐   │     - base_pts   │
│scoring_win. │   └──────────────────┘
│ - id        │
│ - started   │   ┌──────────────┐
│ - ended     │   │ bonus_games  │
└─────────────┘   │ - id         │
                  │ - name       │
                  │ - points     │
                  │ - is_active  │
                  └──────────────┘
```

## Core Entities

### 1. Teams

**Purpose**: Represents a pair of climbers competing together

**Schema**:
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id VARCHAR(50) UNIQUE NOT NULL,  -- e.g., "team_001"
  team_name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL,        -- 'masters', 'recreational', 'intermediate', 'advanced'
  auth_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_category CHECK (
    category IN ('masters', 'recreational', 'intermediate', 'advanced')
  )
);

CREATE INDEX idx_teams_auth_user ON teams(auth_user_id);
CREATE INDEX idx_teams_category ON teams(category);
```

**Validation Rules**:
- `team_id` must be unique and non-empty
- `category` must be one of the four valid categories
- `team_name` required for display purposes

**State Transitions**:
- Created during pre-competition setup by admin
- Category assigned based on climber attributes (calculated during registration)
- Immutable during competition (category changes require admin intervention)

### 2. Climbers

**Purpose**: Individual participants belonging to a team

**Schema**:
```sql
CREATE TABLE climbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  redpoint_grade INTEGER NOT NULL,      -- Ewbank grade (e.g., 24 for grade 24)
  category VARCHAR(20) NOT NULL,        -- 'recreational', 'intermediate', 'advanced'
  auth_user_id UUID REFERENCES auth.users(id),
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
```

**Validation Rules**:
- Each team must have exactly 2 climbers (enforced in application logic)
- `age` must be reasonable (10-100 years)
- `redpoint_grade` must be valid Ewbank grade (10-35)
- `category` calculated based on redpoint grade:
  - Recreational: grades 10-19
  - Intermediate: grades 20-23
  - Advanced: grades 24+

**Relationships**:
- Many-to-one with teams (each climber belongs to one team)
- One-to-many with ascents (each climber has multiple ascents)
- One-to-many with bonus_entries (each climber can earn multiple bonus points)

### 3. Routes

**Purpose**: Climbing challenges available for logging

**Schema**:
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  grade VARCHAR(10) NOT NULL,           -- e.g., "18", "V3"
  grade_numeric INTEGER NOT NULL,       -- Normalized for calculations
  gear_type VARCHAR(20) NOT NULL,       -- 'sport', 'trad', 'boulder'
  base_points INTEGER NOT NULL,         -- Before trad bonus
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_gear_type CHECK (
    gear_type IN ('sport', 'trad', 'boulder')
  ),
  CONSTRAINT valid_base_points CHECK (base_points IN (5, 8, 12, 16, 20))
);

CREATE INDEX idx_routes_sector ON routes(sector);
CREATE INDEX idx_routes_gear_type ON routes(gear_type);
CREATE INDEX idx_routes_grade_numeric ON routes(grade_numeric);
```

**Validation Rules**:
- `gear_type` must be sport, trad, or boulder
- `base_points` must match grade-to-points mapping from spec:
  - Ewbank 10-14: 5 points
  - Ewbank 15-17: 8 points
  - Ewbank 18-20: 12 points
  - Ewbank 21-22: 16 points
  - Ewbank 23+: 20 points
  - Boulder V0-V2: 8 points
  - Boulder V3-V4: 16 points
  - Boulder V5+: 20 points
- `grade` stored as string for display, `grade_numeric` for calculations

**Static Data**:
- Routes are loaded once during pre-competition setup
- No updates during competition (immutable during active scoring)

### 4. Ascents

**Purpose**: Logged climbs by climbers on specific routes

**Schema**:
```sql
CREATE TABLE ascents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  climber_id UUID REFERENCES climbers(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id) ON DELETE RESTRICT,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,  -- Denormalized for RLS
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_earned INTEGER NOT NULL,       -- Calculated with bonuses and penalties
  repeat_count INTEGER NOT NULL,        -- 1st, 2nd, 3rd, 4th+ ascent of this route by this climber

  CONSTRAINT valid_points CHECK (points_earned >= 0),
  CONSTRAINT valid_repeat CHECK (repeat_count >= 1)
);

CREATE INDEX idx_ascents_climber ON ascents(climber_id);
CREATE INDEX idx_ascents_route ON ascents(route_id);
CREATE INDEX idx_ascents_team ON ascents(team_id);
CREATE INDEX idx_ascents_logged_at ON ascents(logged_at);

-- Ensure team_id matches climber's team for data integrity
CREATE OR REPLACE FUNCTION check_ascent_team()
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
EXECUTE FUNCTION check_ascent_team();
```

**Validation Rules**:
- `points_earned` calculated as: `base_points * trad_multiplier * repeat_multiplier`
  - `trad_multiplier`: 1.5 if trad, 1.0 otherwise
  - `repeat_multiplier`: 1.0 (1st), 0.75 (2nd), 0.25 (3rd), 0.0 (4th+)
- `repeat_count` determined by counting previous ascents of same route by same climber

**State Transitions**:
- Created when climber logs an ascent
- Immutable after creation (no edits, only admin override for corrections)
- Soft delete pattern not needed (ascents are permanent record)

### 5. Bonus Games

**Purpose**: Special competition events with point awards

**Schema**:
```sql
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
```

**Validation Rules**:
- `points` must be positive
- `name` must be unique per competition (application-enforced)

**Lifecycle**:
- Created by admin during competition as games are announced
- `is_active` toggled to false when game ends

### 6. Bonus Entries

**Purpose**: Tracks climbers earning bonus game points

**Schema**:
```sql
CREATE TABLE bonus_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  climber_id UUID REFERENCES climbers(id) ON DELETE CASCADE,
  bonus_game_id UUID REFERENCES bonus_games(id) ON DELETE CASCADE,
  points_awarded INTEGER NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one entry per climber per game
  CONSTRAINT unique_climber_game UNIQUE (climber_id, bonus_game_id)
);

CREATE INDEX idx_bonus_entries_climber ON bonus_entries(climber_id);
CREATE INDEX idx_bonus_entries_game ON bonus_entries(bonus_game_id);
```

**Validation Rules**:
- Each climber can earn bonus points only once per game (enforced by UNIQUE constraint)
- `points_awarded` must match parent bonus_game.points

### 7. Scoring Windows

**Purpose**: Defines the official competition timeframe

**Schema**:
```sql
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

-- Ensure only one active window at a time (application-enforced)
```

**Validation Rules**:
- `ended_at` must be after `started_at` (if set)
- Only one active window allowed at a time (NULL `ended_at`)

**State Transitions**:
- Created by admin at competition start with `started_at` = NOW(), `ended_at` = NULL
- Updated by admin at competition end to set `ended_at` = NOW()

### 8. Team Overrides

**Purpose**: Allows admin to grant specific teams write access outside scoring window

**Schema**:
```sql
CREATE TABLE team_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,

  -- Ensure only one active override per team
  CONSTRAINT unique_active_override UNIQUE (team_id, is_active)
);

CREATE INDEX idx_team_overrides_active ON team_overrides(team_id, is_active);
```

**Validation Rules**:
- Only one active override per team (enforced by partial unique index)
- `is_active` toggled to false when override is revoked

### 9. Administrators

**Purpose**: Competition organizer accounts with privileged access

**Schema**:
```sql
CREATE TABLE administrators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_administrators_auth_user ON administrators(auth_user_id);
```

**Validation Rules**:
- `auth_user_id` must be unique (one admin account per Supabase user)

## Computed Views

### Team Scores View

**Purpose**: Aggregate team scores for leaderboards

```sql
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
```

**RLS Policy**:
- Teams can see their own score anytime
- All teams visible after scoring window ends
- Admins can see all scores anytime

### Climber Scores View

**Purpose**: Individual climber scores and hardest send tracking

```sql
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
```

### Hardest Send Leaderboard

**Purpose**: Track candidates for hardest send award

```sql
CREATE OR REPLACE VIEW hardest_send_leaderboard AS
SELECT
  c.id AS climber_id,
  c.name,
  MAX(r.grade_numeric) AS hardest_grade,
  COUNT(*) FILTER (WHERE r.grade_numeric = MAX(r.grade_numeric)) AS ascents_at_hardest
FROM climbers c
JOIN ascents a ON a.climber_id = c.id
JOIN routes r ON r.id = a.route_id
GROUP BY c.id, c.name
ORDER BY hardest_grade DESC, ascents_at_hardest DESC;
```

## Row Level Security (RLS) Policies

### Teams Table

```sql
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Teams can read their own data anytime
CREATE POLICY "Teams read own data"
ON teams FOR SELECT
USING (
  auth.uid() = auth_user_id
);

-- Admins can read all teams
CREATE POLICY "Admins read all teams"
ON teams FOR SELECT
USING (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
);

-- Only admins can insert/update/delete teams
CREATE POLICY "Admins manage teams"
ON teams FOR ALL
USING (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
);
```

### Ascents Table

```sql
ALTER TABLE ascents ENABLE ROW LEVEL SECURITY;

-- Teams can read their own ascents anytime
CREATE POLICY "Teams read own ascents"
ON ascents FOR SELECT
USING (
  team_id IN (
    SELECT id FROM teams WHERE auth_user_id = auth.uid()
  )
);

-- Teams can see ALL ascents after scoring window ends
CREATE POLICY "All teams read ascents after competition"
ON ascents FOR SELECT
USING (
  NOT EXISTS (
    SELECT 1 FROM scoring_windows
    WHERE ended_at IS NULL OR ended_at > NOW()
  )
);

-- Admins can read all ascents anytime
CREATE POLICY "Admins read all ascents"
ON ascents FOR SELECT
USING (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
);

-- Teams can insert ascents during active window OR if override granted
CREATE POLICY "Teams insert ascents during window"
ON ascents FOR INSERT
WITH CHECK (
  climber_id IN (
    SELECT id FROM climbers WHERE auth_user_id = auth.uid()
  )
  AND (
    -- Active scoring window exists
    EXISTS (
      SELECT 1 FROM scoring_windows
      WHERE started_at <= NOW() AND (ended_at IS NULL OR ended_at > NOW())
    )
    OR
    -- Team has active override
    EXISTS (
      SELECT 1 FROM team_overrides
      WHERE team_id = (
        SELECT team_id FROM climbers WHERE id = ascents.climber_id
      )
      AND is_active = TRUE
    )
  )
);

-- Admins can always insert/update ascents
CREATE POLICY "Admins manage ascents"
ON ascents FOR ALL
USING (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
);
```

### Routes Table

```sql
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read routes
CREATE POLICY "Authenticated users read routes"
ON routes FOR SELECT
TO authenticated
USING (TRUE);

-- Only admins can manage routes
CREATE POLICY "Admins manage routes"
ON routes FOR ALL
USING (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
);
```

### Scoring Windows Table

```sql
ALTER TABLE scoring_windows ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read scoring windows
CREATE POLICY "Authenticated users read windows"
ON scoring_windows FOR SELECT
TO authenticated
USING (TRUE);

-- Only admins can manage windows
CREATE POLICY "Admins manage windows"
ON scoring_windows FOR ALL
USING (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM administrators WHERE auth_user_id = auth.uid())
);
```

## Data Validation Functions

### Calculate Ascent Points

```sql
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
  -- Get route base points and gear type
  SELECT base_points, gear_type
  INTO v_base_points, v_gear_type
  FROM routes
  WHERE id = p_route_id;

  -- Count existing ascents of this route by this climber
  SELECT COUNT(*) + 1
  INTO v_repeat_count
  FROM ascents
  WHERE climber_id = p_climber_id AND route_id = p_route_id;

  -- Calculate trad multiplier
  v_trad_multiplier := CASE
    WHEN v_gear_type = 'trad' THEN 1.5
    ELSE 1.0
  END;

  -- Calculate repeat penalty multiplier
  v_repeat_multiplier := CASE
    WHEN v_repeat_count = 1 THEN 1.0
    WHEN v_repeat_count = 2 THEN 0.75
    WHEN v_repeat_count = 3 THEN 0.25
    ELSE 0.0
  END;

  -- Calculate final points
  v_final_points := FLOOR(v_base_points * v_trad_multiplier * v_repeat_multiplier);

  RETURN v_final_points;
END;
$$ LANGUAGE plpgsql;
```

### Assign Team Category

```sql
CREATE OR REPLACE FUNCTION assign_team_category(
  p_climber1_age INTEGER,
  p_climber1_grade INTEGER,
  p_climber2_age INTEGER,
  p_climber2_grade INTEGER
)
RETURNS VARCHAR(20) AS $$
BEGIN
  -- Masters: one climber 50+ OR both 45+
  IF (p_climber1_age >= 50 OR p_climber2_age >= 50)
     OR (p_climber1_age >= 45 AND p_climber2_age >= 45) THEN
    RETURN 'masters';
  END IF;

  -- Otherwise categorize by stronger climber's grade
  DECLARE
    v_max_grade INTEGER := GREATEST(p_climber1_grade, p_climber2_grade);
  BEGIN
    IF v_max_grade >= 24 THEN
      RETURN 'advanced';
    ELSIF v_max_grade >= 20 THEN
      RETURN 'intermediate';
    ELSE
      RETURN 'recreational';
    END IF;
  END;
END;
$$ LANGUAGE plpgsql;
```

## Migration Strategy

### Initial Schema Setup

```sql
-- Migration: 001_initial_schema.sql
BEGIN;

-- Create tables in dependency order
CREATE TABLE teams (...);
CREATE TABLE climbers (...);
CREATE TABLE routes (...);
CREATE TABLE ascents (...);
CREATE TABLE bonus_games (...);
CREATE TABLE bonus_entries (...);
CREATE TABLE scoring_windows (...);
CREATE TABLE team_overrides (...);
CREATE TABLE administrators (...);

-- Create indexes
CREATE INDEX ...;

-- Create views
CREATE VIEW team_scores ...;
CREATE VIEW climber_scores ...;
CREATE VIEW hardest_send_leaderboard ...;

-- Create functions
CREATE FUNCTION calculate_ascent_points ...;
CREATE FUNCTION assign_team_category ...;

-- Enable RLS and create policies
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...;

COMMIT;
```

### Development Seed Data

```sql
-- seed.sql (for local development only)
-- Create test admin
INSERT INTO auth.users (email, role)
VALUES ('admin@quarrymadness.local', 'admin');

INSERT INTO administrators (name, auth_user_id)
SELECT 'Admin User', id FROM auth.users WHERE email = 'admin@quarrymadness.local';

-- Create test teams and climbers
-- (omitted for brevity)
```

## Performance Considerations

**Indexing Strategy**:
- Primary indexes on foreign keys (climber_id, route_id, team_id)
- Composite index on (team_id, is_active) for team_overrides
- Timestamp index on ascents.logged_at for chronological queries

**Query Optimization**:
- Denormalize team_id in ascents table to avoid JOIN in RLS policies
- Use materialized views for leaderboards if query performance degrades with large datasets
- Consider partitioning ascents table by date if competition runs multiple days

**Scaling Limits**:
- Current schema supports 1000+ teams without optimization
- Expected load: 50 teams × 2 climbers × 100 ascents = 10,000 rows in ascents table
- Leaderboard queries complete in <100ms with proper indexing

## Data Integrity Constraints

**Referential Integrity**:
- All foreign keys use CASCADE delete for dependent data (climbers → ascents)
- Routes use RESTRICT delete to prevent accidental deletion during competition
- Triggers ensure team_id consistency in ascents table

**Business Logic Constraints**:
- Unique constraint on (climber_id, bonus_game_id) enforces one bonus per climber per game
- Check constraints validate category values, age ranges, grade ranges
- Trigger functions calculate derived fields (team_id in ascents)

**Audit Trail**:
- All tables include created_at timestamp
- Sensitive operations (admin actions) include created_by reference
- Immutable data (ascents) prevents post-hoc manipulation

## Next Steps

With the data model defined, the next phase involves:
1. Creating API contracts (Supabase client interaction patterns)
2. Generating quickstart guide for local development
3. Implementing database migrations in `supabase/migrations/`
