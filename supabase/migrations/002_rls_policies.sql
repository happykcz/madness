-- Quarry Madness Scorekeeper - Row Level Security Policies
-- Supabase PostgreSQL RLS Configuration
-- Phase 1 Output | Date: 2025-10-10

-- =============================================================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================================================

-- Check if user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM administrators
    WHERE auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Check if scoring window is currently active
CREATE OR REPLACE FUNCTION public.is_scoring_window_active()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM scoring_windows
    WHERE started_at <= NOW()
      AND (ended_at IS NULL OR ended_at > NOW())
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Check if team has active override
CREATE OR REPLACE FUNCTION public.team_has_override(p_team_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_overrides
    WHERE team_id = p_team_id
      AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- TEAMS TABLE POLICIES
-- =============================================================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Teams can read their own data
CREATE POLICY "teams_select_own"
ON teams FOR SELECT
USING (auth.uid() = auth_user_id);

-- Admins can read all teams
CREATE POLICY "teams_select_admin"
ON teams FOR SELECT
USING (public.is_admin());

-- Only admins can insert teams
CREATE POLICY "teams_insert_admin"
ON teams FOR INSERT
WITH CHECK (public.is_admin());

-- Only admins can update teams
CREATE POLICY "teams_update_admin"
ON teams FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Only admins can delete teams
CREATE POLICY "teams_delete_admin"
ON teams FOR DELETE
USING (public.is_admin());

-- =============================================================================
-- CLIMBERS TABLE POLICIES
-- =============================================================================

ALTER TABLE climbers ENABLE ROW LEVEL SECURITY;

-- Teams can read their own climbers
CREATE POLICY "climbers_select_own"
ON climbers FOR SELECT
USING (
  team_id IN (
    SELECT id FROM teams WHERE auth_user_id = auth.uid()
  )
);

-- Admins can read all climbers
CREATE POLICY "climbers_select_admin"
ON climbers FOR SELECT
USING (public.is_admin());

-- Only admins can manage climbers
CREATE POLICY "climbers_manage_admin"
ON climbers FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- ROUTES TABLE POLICIES
-- =============================================================================

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read routes
CREATE POLICY "routes_select_authenticated"
ON routes FOR SELECT
TO authenticated
USING (TRUE);

-- Only admins can manage routes
CREATE POLICY "routes_manage_admin"
ON routes FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- ASCENTS TABLE POLICIES
-- =============================================================================

ALTER TABLE ascents ENABLE ROW LEVEL SECURITY;

-- Teams can read their own ascents anytime
CREATE POLICY "ascents_select_own"
ON ascents FOR SELECT
USING (
  team_id IN (
    SELECT id FROM teams WHERE auth_user_id = auth.uid()
  )
);

-- All teams can read ALL ascents after competition ends
CREATE POLICY "ascents_select_all_after_competition"
ON ascents FOR SELECT
USING (
  NOT is_scoring_window_active()
);

-- Admins can read all ascents anytime
CREATE POLICY "ascents_select_admin"
ON ascents FOR SELECT
USING (public.is_admin());

-- Teams can insert ascents during active window OR with override
CREATE POLICY "ascents_insert_during_window"
ON ascents FOR INSERT
WITH CHECK (
  -- Must be own climber
  climber_id IN (
    SELECT id FROM climbers
    WHERE team_id IN (
      SELECT id FROM teams WHERE auth_user_id = auth.uid()
    )
  )
  AND (
    -- Active scoring window exists
    is_scoring_window_active()
    OR
    -- Team has active override
    team_has_override(team_id)
  )
);

-- Admins can always insert ascents
CREATE POLICY "ascents_insert_admin"
ON ascents FOR INSERT
WITH CHECK (public.is_admin());

-- Admins can update/delete ascents (corrections)
CREATE POLICY "ascents_manage_admin"
ON ascents FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- BONUS GAMES TABLE POLICIES
-- =============================================================================

ALTER TABLE bonus_games ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read bonus games
CREATE POLICY "bonus_games_select_authenticated"
ON bonus_games FOR SELECT
TO authenticated
USING (TRUE);

-- Only admins can manage bonus games
CREATE POLICY "bonus_games_manage_admin"
ON bonus_games FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- BONUS ENTRIES TABLE POLICIES
-- =============================================================================

ALTER TABLE bonus_entries ENABLE ROW LEVEL SECURITY;

-- Teams can read their own bonus entries
CREATE POLICY "bonus_entries_select_own"
ON bonus_entries FOR SELECT
USING (
  climber_id IN (
    SELECT id FROM climbers
    WHERE team_id IN (
      SELECT id FROM teams WHERE auth_user_id = auth.uid()
    )
  )
);

-- Admins can read all bonus entries
CREATE POLICY "bonus_entries_select_admin"
ON bonus_entries FOR SELECT
USING (public.is_admin());

-- Teams can insert bonus entries during active window
CREATE POLICY "bonus_entries_insert_during_window"
ON bonus_entries FOR INSERT
WITH CHECK (
  climber_id IN (
    SELECT id FROM climbers
    WHERE team_id IN (
      SELECT id FROM teams WHERE auth_user_id = auth.uid()
    )
  )
  AND is_scoring_window_active()
);

-- Admins can always insert bonus entries
CREATE POLICY "bonus_entries_insert_admin"
ON bonus_entries FOR INSERT
WITH CHECK (public.is_admin());

-- Admins can update/delete bonus entries
CREATE POLICY "bonus_entries_manage_admin"
ON bonus_entries FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- SCORING WINDOWS TABLE POLICIES
-- =============================================================================

ALTER TABLE scoring_windows ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read scoring windows
CREATE POLICY "scoring_windows_select_authenticated"
ON scoring_windows FOR SELECT
TO authenticated
USING (TRUE);

-- Only admins can manage scoring windows
CREATE POLICY "scoring_windows_manage_admin"
ON scoring_windows FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- TEAM OVERRIDES TABLE POLICIES
-- =============================================================================

ALTER TABLE team_overrides ENABLE ROW LEVEL SECURITY;

-- Teams can read their own overrides
CREATE POLICY "team_overrides_select_own"
ON team_overrides FOR SELECT
USING (
  team_id IN (
    SELECT id FROM teams WHERE auth_user_id = auth.uid()
  )
);

-- Admins can read all overrides
CREATE POLICY "team_overrides_select_admin"
ON team_overrides FOR SELECT
USING (public.is_admin());

-- Only admins can manage overrides
CREATE POLICY "team_overrides_manage_admin"
ON team_overrides FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- ADMINISTRATORS TABLE POLICIES
-- =============================================================================

ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;

-- Admins can read all administrators
CREATE POLICY "administrators_select_admin"
ON administrators FOR SELECT
USING (public.is_admin());

-- Only admins can manage administrators
CREATE POLICY "administrators_manage_admin"
ON administrators FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- VIEW POLICIES (inherit from base tables via RLS)
-- =============================================================================

-- Team scores view - inherits RLS from teams/climbers/ascents/bonus_entries
-- Climber scores view - inherits RLS from climbers/ascents/bonus_entries
-- Hardest send leaderboard - inherits RLS from climbers/ascents

-- Grant access to views for authenticated users
GRANT SELECT ON team_scores TO authenticated;
GRANT SELECT ON climber_scores TO authenticated;
GRANT SELECT ON hardest_send_leaderboard TO authenticated;

-- =============================================================================
-- NOTES ON RLS ENFORCEMENT
-- =============================================================================

/*
Key RLS behaviors:

1. Score Privacy During Competition:
   - Teams can only SELECT their own ascents during active competition
   - After scoring window ends, all teams can SELECT all ascents
   - Admins always have full SELECT access

2. Time-Gated Write Access:
   - Teams can INSERT ascents only during active scoring window
   - Team overrides allow INSERT even when window is closed
   - Admins can always INSERT/UPDATE/DELETE ascents

3. Data Isolation:
   - Teams cannot see other teams' ascents during competition
   - Teams cannot modify other teams' data (enforced by climber_id check)
   - Admins bypass all restrictions via public.is_admin() checks

4. Performance Considerations:
   - RLS policies are applied on every query
   - Denormalized team_id in ascents reduces JOINs in policies
   - Helper functions (is_admin, is_scoring_window_active) are marked STABLE for caching

5. Security Defense-in-Depth:
   - RLS enforces access control at database level
   - Frontend UI respects same rules (but RLS is authoritative)
   - Supabase anon key is public-safe due to RLS enforcement
*/
