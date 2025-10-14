# Competition Status Enforcement Fix

**Date:** 2025-10-14
**Issue:** Teams could log scores even when competition was closed
**Status:** ✅ Fixed

## The Problem

When admins used the competition control interface to close the competition:
1. The UI correctly updated `competition_settings.is_open = false`
2. The status display showed "CLOSED" correctly
3. **BUT** teams could still log scores on the scoring page

## Root Cause

There was a **mismatch between the admin UI and the database security layer**:

### Admin UI (competition-control.js)
- Updates: `competition_settings.is_open`, `competition_start`, `competition_end`
- Displays status based on these fields

### Database RLS Function (is_scoring_window_active)
- **Before fix:** Only checked `scoring_windows` table (wrong source!)
- **After fix:** Checks `competition_settings.is_open` and `competition_start/end` (correct source!)

### Scoring Page (scoring.js)
- **Before fix:** No validation - allowed sends regardless of competition status
- **After fix:** Validates status before showing modal and before submission

## The Solution

### 1. Frontend Validation ([scoring.js](frontend/src/dashboard/scoring.js))

Added `checkCompetitionStatus()` function that:
- Queries `competition_settings` table
- Checks if `is_open = true` (manual override)
- OR if current time is within `competition_start` to `competition_end` window
- Returns `true` if competition is active, `false` otherwise

Validation points:
- Before showing the send logging modal
- Before actually submitting the send to database
- On page load (to show status badge)

Visual indicator:
- Green "OPEN" badge when active
- Red "CLOSED" badge when inactive

### 2. Database-Level Security ([migration 013](supabase/migrations/013_fix_competition_status_check.sql))

Updated `is_scoring_window_active()` function to:
```sql
-- Check competition_settings (correct source)
SELECT is_open, competition_start, competition_end
FROM competition_settings

-- Allow if manually opened
IF is_open = TRUE THEN RETURN TRUE

-- Allow if within scheduled window
IF now >= competition_start AND now <= competition_end THEN RETURN TRUE

-- Otherwise deny
RETURN FALSE
```

**Before:** Checked `scoring_windows` table (which was never being updated)
**After:** Checks `competition_settings` table (which admin UI updates)

## Defense in Depth

The fix implements **two layers of security**:

1. **Frontend validation** - provides immediate user feedback
2. **Database RLS policies** - enforces security even if frontend is bypassed

Even if someone modified the JavaScript or used direct API calls, the database RLS policies would block the insert.

## Testing the Fix

### To verify competition control works:

1. **Close competition via admin interface**
   - Navigate to Admin Dashboard → Settings
   - Click "Close" button
   - Status should show "CLOSED"

2. **Attempt to log send as team**
   - Login as a team
   - Go to scoring page
   - Should see red "CLOSED" badge
   - Click any route → should show error: "Competition is currently closed"
   - Cannot submit sends

3. **Open competition via admin interface**
   - Click "Open" button
   - Status should show "OPEN"

4. **Verify teams can now log sends**
   - Should see green "OPEN" badge
   - Can click routes and submit sends successfully

### To verify scheduled window works:

1. Set `competition_start` to future date → sends blocked
2. Set `competition_start` to past, `competition_end` to future → sends allowed
3. Set `competition_end` to past → sends blocked
4. Manual "Open" button overrides schedule → sends allowed

## Related Files

- [frontend/src/dashboard/scoring.js](frontend/src/dashboard/scoring.js) - Frontend validation
- [frontend/src/admin/admin-competition.js](frontend/src/admin/admin-competition.js) - Admin control UI
- [supabase/migrations/013_fix_competition_status_check.sql](supabase/migrations/013_fix_competition_status_check.sql) - Database fix
- [supabase/migrations/009_fix_is_scoring_window_active.sql](supabase/migrations/009_fix_is_scoring_window_active.sql) - Previous attempt (incomplete)

## Key Learnings

1. **Always verify the source of truth** - The admin UI was updating `competition_settings`, but the security layer was checking `scoring_windows`
2. **Database security is authoritative** - RLS policies must be correct; frontend validation is just UX
3. **Test the actual enforcement** - The UI showing "CLOSED" doesn't mean sends are blocked
4. **Defense in depth** - Both frontend and database layers provide protection

## Migration Notes

**Migration 013 must be applied to the database** for this fix to work:

```bash
# Option 1: Via Supabase Dashboard SQL Editor
# Copy contents of 013_fix_competition_status_check.sql and execute

# Option 2: Via CLI (when db push works)
supabase db push
```

The RLS policies automatically use the updated function, no policy changes needed.
