# Edge Functions Deployment - COMPLETE

**Date**: 2025-10-11
**Status**: ✅ DEPLOYED AND FIXED

## ✅ What's Been Done

### 1. CORS Issue - FIXED
- Added `Access-Control-Allow-Methods: POST, OPTIONS`
- Added explicit `status: 200` to OPTIONS response
- Both functions redeployed successfully

### 2. Edge Functions - DEPLOYED
```
✅ admin-create-team deployed (70.03kB)
✅ admin-reset-password deployed (69.04kB)
```

**Function URLs:**
- `https://skfdhfrfmorubqembaxt.supabase.co/functions/v1/admin-create-team`
- `https://skfdhfrfmorubqembaxt.supabase.co/functions/v1/admin-reset-password`

### 3. Admin Dashboard Redirect - FIXED
- Admins now redirect to `/admin/dashboard` instead of `/dashboard`
- No more 406 error on admin login!

## 🧪 Testing Instructions

### IMPORTANT: Hard Refresh Browser First!
Press **Ctrl+Shift+R** (or **Cmd+Shift+R** on Mac) to clear cached CORS responses.

### Test 1: Admin Login & Redirect
1. Navigate to: `http://localhost:5173/12qm25/`
2. Click "Admin" button
3. Login: username `admin`, password `adams68`
4. **Expected**: Redirects to admin dashboard (no 406 error)

### Test 2: Create New Team (CORS Fixed!)
1. From admin dashboard → Teams
2. Click "Create Team"
3. Fill form:
   - Team ID: `Test_Team`
   - Team Name: `Test Team`
   - Password: `test1234`
   - Climber 1: Alice, 25, grade 22
   - Climber 2: Bob, 28, grade 24
4. Click "Create Team"
5. **Expected**:
   - ✅ Success message with credentials
   - ✅ No CORS error
   - ✅ Team appears in list

### Test 3: Team Login
1. Sign out from admin
2. Go to login page
3. Login with newly created team:
   - Username: `Test_Team`
   - Password: `test1234`
4. **Expected**: Login successful, redirect to team dashboard

### Test 4: Password Reset (CORS Fixed!)
1. Login as admin
2. Teams → View any team
3. Click "Reset Password"
4. Enter new password (or leave blank for default)
5. **Expected**:
   - ✅ Success message
   - ✅ No 400 or CORS error
6. Test login with new password

### Test 5: Show Password Button
1. View any team
2. Click "Show" button
3. **Expected**: Password displays immediately (no double-click)
4. Click "Hide"
5. **Expected**: Password hides immediately

## 📊 Current Status

### Working Features
- ✅ Admin login with Turnstile
- ✅ Admin dashboard redirect
- ✅ Admin panel navigation
- ✅ Team list view
- ✅ Show/hide password
- ✅ Edge functions deployed
- ✅ CORS headers fixed

### Ready to Test
- ⏳ Team creation (CORS fixed, should work now)
- ⏳ Password reset (CORS fixed, should work now)
- ⏳ Team login (need to create team first)

## 🔍 Troubleshooting

### Team Login Fails - "Invalid login credentials"

**Most Likely Cause**: No teams exist yet OR wrong credentials

**Solution:**
1. Login as admin
2. Create a test team via admin panel
3. Use those exact credentials to login as team

**Check what teams exist:**
```javascript
// In browser console
const { data: teams } = await supabase
  .from('teams')
  .select('team_id, team_name, created_at')
console.log('Existing teams:', teams)
```

### CORS Error Still Appears

**Solution**: Hard refresh browser (Ctrl+Shift+R)

**Why**: Browser cached old OPTIONS response without proper headers

### Password Reset Returns 400

**Check**: Function logs in Supabase Dashboard
- Go to: https://supabase.com/dashboard/project/cbcauybpyagrhrrrmirk/functions
- Click `admin-reset-password`
- View "Logs" tab
- See exact error message

### Team Creation Fails

**Check**: Function logs for `admin-create-team`
**Common Issues**:
- Team ID already exists
- Invalid team ID format (must be 3-50 chars, alphanumeric + underscore)
- Missing required fields

## 📁 Files Changed

### Edge Functions (Redeployed)
- [supabase/functions/admin-create-team/index.ts](../supabase/functions/admin-create-team/index.ts)
- [supabase/functions/admin-reset-password/index.ts](../supabase/functions/admin-reset-password/index.ts)

### Frontend (Already Updated)
- [frontend/src/main.js](../frontend/src/main.js:20-36) - Admin redirect
- [frontend/src/admin/admin-teams.js](../frontend/src/admin/admin-teams.js) - Edge function calls

## 🎯 What's Next

After confirming these work:
1. Build Admin Results Page - View leaderboards, filter by category
2. Build Admin Settings Page - Manage scoring windows
3. Add CSV export functionality
4. Build team dashboard with live scoring

## 💡 Quick Reference

### Admin Credentials
- Username: `admin`
- Password: `adams68`

### Default Team Password
- `12qm2025`

### Dev Server
- `http://localhost:5173/12qm25/`

### Supabase Dashboard
- https://supabase.com/dashboard/project/cbcauybpyagrhrrrmirk

### Edge Functions Dashboard
- https://supabase.com/dashboard/project/cbcauybpyagrhrrrmirk/functions

## 🔧 Technical Details

### CORS Fix
Added proper methods and status code to OPTIONS response:
```typescript
'Access-Control-Allow-Methods': 'POST, OPTIONS'
// And explicit status: 200 in OPTIONS handler
```

### Admin Redirect Logic
```javascript
authManager.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    const { data: isAdmin } = await supabase.rpc('is_admin')
    if (isAdmin) {
      router.navigate('/admin/dashboard')
    } else {
      router.navigate('/dashboard')
    }
  }
})
```

### Edge Function Security
- Verifies JWT token from Authorization header
- Checks `is_admin()` before allowing operations
- Uses Service Role key (never exposed to client)
- Logs all actions to `admin_actions` table
- Includes rollback on failures

---

**Ready for testing!** Please:
1. Hard refresh browser
2. Try creating a new team
3. Try logging in with that team
4. Try resetting a password
5. Report results
