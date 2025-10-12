# FINAL FIX - is_admin() .single() Issue

**Date**: 2025-10-11
**Status**: ✅ FIXED AND REDEPLOYED

## The Problem

The edge functions were calling `.single()` on the `is_admin()` RPC function:

```typescript
// ❌ WRONG
const { data: isAdmin, error: adminError } = await supabaseAdmin
  .rpc('is_admin')
  .single()  // <- This causes an error!
```

**Why it failed**: RPC functions return a single value, not a row set. The `.single()` modifier is for query results, not RPC calls.

## The Fix

Removed `.single()` from both edge functions:

```typescript
// ✅ CORRECT
const { data: isAdmin, error: adminError } = await supabaseAdmin
  .rpc('is_admin')  // <- No .single()
```

## What's Been Deployed

```bash
✅ admin-create-team (70.04kB) - REDEPLOYED
✅ admin-reset-password (69.02kB) - REDEPLOYED
```

## Testing Instructions

### 1. Hard Refresh Browser (Again!)
Press **Ctrl+Shift+R** or **Cmd+Shift+R**

### 2. Test Team Creation
1. Login as admin (`admin` / `adams68`)
2. Go to Teams → Create Team
3. Fill in form:
   - Team ID: `NewTest_Team`
   - Team Name: `New Test Team`
   - Password: `test1234`
   - Climber 1: Alice, 25, grade 22
   - Climber 2: Bob, 28, grade 24
4. Click "Create Team"
5. **Should work now!**

### 3. Test Password Reset
1. View any team
2. Click "Reset Password"
3. Enter new password
4. **Should work now!**

### 4. Test Team Login
1. After creating a team, sign out
2. Go to login page
3. Login with:
   - Username: `NewTest_Team`
   - Password: `test1234`
4. **Should work!**

## About team_001 Login Failure

The `team_001` login is failing because either:
1. The team `team_001` doesn't exist in the database
2. The password for `team_001` is different than what you're entering

**To check if team_001 exists**, run in browser console:
```javascript
const { data: teams } = await supabase
  .from('teams')
  .select('team_id, team_name')

console.log('All teams:', teams)
```

**If no teams exist**: Create one via the admin panel (should work now with the fix!)

**If team_001 exists but login fails**: The password might be different. Either:
- Reset its password via admin panel
- Or create a new team with known credentials

## Changes Made

### Files Modified
- `supabase/functions/admin-create-team/index.ts` - Removed `.single()` from line 44
- `supabase/functions/admin-reset-password/index.ts` - Removed `.single()` from line 44

### Deployments
```
Deployment 1: CORS fix
Deployment 2: is_admin() .single() fix  ← YOU ARE HERE
```

## Expected Results

After this fix, you should be able to:
- ✅ Create new teams via admin panel
- ✅ Reset team passwords via admin panel
- ✅ Login with newly created teams

## If It Still Doesn't Work

1. Check browser console for new error messages
2. Check Supabase function logs:
   - https://supabase.com/dashboard/project/cbcauybpyagrhrrrmirk/functions
   - Click function name → Logs tab
   - Look for error details
3. Run the console test from [check-teams-script.md](./check-teams-script.md)

## Next Steps

1. **Hard refresh browser**
2. **Create a test team** via admin panel
3. **Try logging in** with that team
4. **Report results**

If team creation and password reset work now, the system is fully functional!
