-- Allow teams to see all bonus entries when results are open
-- This enables the Game Rewards leaderboard on the results page

CREATE POLICY "bonus_entries_select_when_results_open"
ON bonus_entries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM competition_settings
    WHERE results_open = true
  )
);
