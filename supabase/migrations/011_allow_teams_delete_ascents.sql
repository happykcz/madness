-- Migration 011: Allow teams to delete their own ascents
-- Date: 2025-10-13
-- Purpose: Enable teams to delete accidentally logged sends

-- Add DELETE policy for teams to delete their own ascents
CREATE POLICY "ascents_delete_own"
ON ascents FOR DELETE
USING (
  team_id IN (
    SELECT id FROM teams WHERE auth_user_id = auth.uid()
  )
);

-- Verify
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 011 complete: Teams can now delete their own ascents';
  RAISE NOTICE '   Teams can DELETE ascents where team_id matches their team';
END $$;
