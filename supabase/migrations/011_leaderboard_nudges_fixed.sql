-- Migration: Leaderboard Nudge System
-- Created: 2025-10-15
-- Purpose: Enable automatic 3-hour nudges and manual admin announcements

-- Nudges table to store all sent nudges
CREATE TABLE IF NOT EXISTS leaderboard_nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  nudge_type VARCHAR(20) NOT NULL CHECK (nudge_type IN ('auto', 'manual')),
  show_leaderboard BOOLEAN DEFAULT TRUE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_by UUID REFERENCES auth.users(id), -- NULL for auto-nudges
  is_active BOOLEAN DEFAULT TRUE -- Admins can deactivate/dismiss
);

-- Index for active nudges query
CREATE INDEX IF NOT EXISTS idx_nudges_active ON leaderboard_nudges(is_active, sent_at DESC);

-- Dismissed nudges tracking (per team)
CREATE TABLE IF NOT EXISTS nudge_dismissals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nudge_id UUID NOT NULL REFERENCES leaderboard_nudges(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_team_nudge UNIQUE (nudge_id, team_id)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_dismissals_team ON nudge_dismissals(team_id, nudge_id);

-- Auto-nudge configuration in competition_settings (only add if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='competition_settings' AND column_name='auto_nudge_enabled') THEN
    ALTER TABLE competition_settings ADD COLUMN auto_nudge_enabled BOOLEAN DEFAULT TRUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='competition_settings' AND column_name='last_auto_nudge_sent') THEN
    ALTER TABLE competition_settings ADD COLUMN last_auto_nudge_sent TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='competition_settings' AND column_name='nudge_interval_hours') THEN
    ALTER TABLE competition_settings ADD COLUMN nudge_interval_hours INTEGER DEFAULT 3 CHECK (nudge_interval_hours > 0);
  END IF;
END $$;

-- RLS Policies

-- Teams can read active nudges they haven't dismissed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='leaderboard_nudges' AND policyname='Teams can view active nudges') THEN
    CREATE POLICY "Teams can view active nudges"
      ON leaderboard_nudges
      FOR SELECT
      USING (is_active = TRUE);
  END IF;
END $$;

-- Teams can dismiss nudges
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='nudge_dismissals' AND policyname='Teams can record dismissals') THEN
    CREATE POLICY "Teams can record dismissals"
      ON nudge_dismissals
      FOR INSERT
      WITH CHECK (team_id IN (
        SELECT id FROM teams WHERE auth_user_id = auth.uid()
      ));
  END IF;
END $$;

-- Teams can view their own dismissals
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='nudge_dismissals' AND policyname='Teams can view their dismissals') THEN
    CREATE POLICY "Teams can view their dismissals"
      ON nudge_dismissals
      FOR SELECT
      USING (team_id IN (
        SELECT id FROM teams WHERE auth_user_id = auth.uid()
      ));
  END IF;
END $$;

-- Admins can do everything with nudges
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='leaderboard_nudges' AND policyname='Admins full access to nudges') THEN
    CREATE POLICY "Admins full access to nudges"
      ON leaderboard_nudges
      FOR ALL
      USING (
        auth.uid() IN (SELECT auth_user_id FROM administrators)
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='nudge_dismissals' AND policyname='Admins full access to dismissals') THEN
    CREATE POLICY "Admins full access to dismissals"
      ON nudge_dismissals
      FOR ALL
      USING (
        auth.uid() IN (SELECT auth_user_id FROM administrators)
      );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE leaderboard_nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE nudge_dismissals ENABLE ROW LEVEL SECURITY;

-- Create view for teams to get active nudges they haven't dismissed
CREATE OR REPLACE VIEW active_team_nudges AS
SELECT
  ln.id,
  ln.message,
  ln.nudge_type,
  ln.show_leaderboard,
  ln.sent_at,
  t.id AS team_id,
  t.auth_user_id
FROM leaderboard_nudges ln
CROSS JOIN teams t
LEFT JOIN nudge_dismissals nd ON nd.nudge_id = ln.id AND nd.team_id = t.id
WHERE ln.is_active = TRUE
  AND nd.id IS NULL  -- Team hasn't dismissed this nudge
ORDER BY ln.sent_at DESC;

-- Grant access to view
GRANT SELECT ON active_team_nudges TO authenticated;

COMMENT ON TABLE leaderboard_nudges IS 'Stores all leaderboard nudges (auto every 3hrs + manual admin announcements)';
COMMENT ON TABLE nudge_dismissals IS 'Tracks which teams have dismissed which nudges';
COMMENT ON VIEW active_team_nudges IS 'Shows active nudges for teams that haven''t dismissed them yet';
