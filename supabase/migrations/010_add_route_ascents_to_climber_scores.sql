-- Migration 010: Add route_ascents column to climber_scores view
-- Date: 2025-10-12
-- Purpose: Track total number of ascents (not just unique routes)

-- Update climber_scores view to include total ascent count
CREATE OR REPLACE VIEW climber_scores AS
SELECT
  c.id AS climber_id,
  c.name,
  c.team_id,
  c.category,
  c.redpoint_grade,
  COALESCE(SUM(a.points_earned), 0) + COALESCE(SUM(b.points_awarded), 0) AS total_points,
  COALESCE(MAX(r.grade_numeric), 0) AS hardest_send,
  COUNT(DISTINCT a.route_id) AS unique_routes_climbed,
  COUNT(a.id) AS route_ascents  -- NEW: Total number of ascents including repeats
FROM climbers c
LEFT JOIN ascents a ON a.climber_id = c.id
LEFT JOIN routes r ON r.id = a.route_id
LEFT JOIN bonus_entries b ON b.climber_id = c.id
GROUP BY c.id, c.name, c.team_id, c.category, c.redpoint_grade;

-- Verify
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 010 complete: climber_scores view updated';
  RAISE NOTICE '   Added route_ascents column (total ascents including repeats)';
  RAISE NOTICE '   Kept unique_routes_climbed (distinct routes only)';
END $$;
