-- Migration 018: Fix Scoring Cartesian Product Bug
-- Date: 2025-10-19
-- Purpose: Fix incorrect totals when climbers have both ascents and bonus points
--
-- Problem: LEFT JOIN between ascents and bonus_entries creates Cartesian product
-- causing SUM() to multiply values incorrectly
--
-- Solution: Calculate route points and bonus points separately using subqueries

-- =============================================================================
-- Fix climber_scores view
-- =============================================================================

CREATE OR REPLACE VIEW climber_scores AS
SELECT
  c.id AS climber_id,
  c.name,
  c.team_id,
  c.category,
  c.redpoint_grade,
  -- Calculate total_points by summing separately (no Cartesian product)
  COALESCE(route_points.total, 0) + COALESCE(bonus_points.total, 0) AS total_points,
  COALESCE(route_stats.hardest_send, 0) AS hardest_send,
  COALESCE(route_stats.unique_routes, 0) AS unique_routes_climbed,
  COALESCE(route_stats.total_ascents, 0) AS route_ascents
FROM climbers c
-- Aggregate route points separately
LEFT JOIN LATERAL (
  SELECT
    SUM(a.points_earned) AS total,
    MAX(r.grade_numeric) AS hardest_send,
    COUNT(DISTINCT a.route_id) AS unique_routes,
    COUNT(a.id) AS total_ascents
  FROM ascents a
  LEFT JOIN routes r ON r.id = a.route_id
  WHERE a.climber_id = c.id
) route_points ON true
LEFT JOIN LATERAL (
  SELECT
    MAX(r.grade_numeric) AS hardest_send,
    COUNT(DISTINCT a.route_id) AS unique_routes,
    COUNT(a.id) AS total_ascents
  FROM ascents a
  LEFT JOIN routes r ON r.id = a.route_id
  WHERE a.climber_id = c.id
) route_stats ON true
-- Aggregate bonus points separately
LEFT JOIN LATERAL (
  SELECT SUM(b.points_awarded) AS total
  FROM bonus_entries b
  WHERE b.climber_id = c.id
) bonus_points ON true
GROUP BY
  c.id, c.name, c.team_id, c.category, c.redpoint_grade,
  route_points.total, bonus_points.total,
  route_stats.hardest_send, route_stats.unique_routes, route_stats.total_ascents;

-- =============================================================================
-- Fix team_scores view
-- =============================================================================

CREATE OR REPLACE VIEW team_scores AS
SELECT
  t.id AS team_id,
  t.team_id AS team_code,
  t.team_name,
  t.category,
  -- Calculate total_points by summing separately (no Cartesian product)
  COALESCE(route_points.total, 0) + COALESCE(bonus_points.total, 0) AS total_points,
  COALESCE(route_points.total, 0) AS route_points,
  COALESCE(bonus_points.total, 0) AS bonus_points,
  COALESCE(route_points.total_ascents, 0) AS total_ascents
FROM teams t
-- Aggregate route points separately for all climbers in team
LEFT JOIN LATERAL (
  SELECT
    SUM(a.points_earned) AS total,
    COUNT(DISTINCT a.id) AS total_ascents
  FROM climbers c
  JOIN ascents a ON a.climber_id = c.id
  WHERE c.team_id = t.id
) route_points ON true
-- Aggregate bonus points separately for all climbers in team
LEFT JOIN LATERAL (
  SELECT SUM(b.points_awarded) AS total
  FROM climbers c
  JOIN bonus_entries b ON b.climber_id = c.id
  WHERE c.team_id = t.id
) bonus_points ON true
GROUP BY
  t.id, t.team_id, t.team_name, t.category,
  route_points.total, route_points.total_ascents, bonus_points.total;

-- =============================================================================
-- Verification
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 018 complete: Fixed scoring Cartesian product bug';
  RAISE NOTICE '   - climber_scores view: Calculates route_points and bonus_points separately';
  RAISE NOTICE '   - team_scores view: Calculates route_points and bonus_points separately';
  RAISE NOTICE '   - Scores should now be accurate when climbers have both ascents and bonus points';
END $$;
