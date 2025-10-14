-- Migration 014: Fix competition_settings RLS policy for updates
-- Date: 2025-10-14
-- Purpose: Add WITH CHECK clause to allow admins to update competition_settings

-- Drop the existing policy
DROP POLICY IF EXISTS "Only admins can update competition settings" ON competition_settings;

-- Recreate with both USING and WITH CHECK
CREATE POLICY "Only admins can update competition settings"
ON competition_settings
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 014 complete: Fixed competition_settings update policy';
  RAISE NOTICE '   Added WITH CHECK clause to allow admin updates';
  RAISE NOTICE '   Now uses is_admin() function consistently';
END $$;
