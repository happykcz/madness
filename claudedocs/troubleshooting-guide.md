# Troubleshooting Guide

## ✅ CORS Fixed and Functions Redeployed!

Both edge functions have been updated with proper CORS headers and redeployed successfully.

## Team Login Issue

### Error
```
Failed to load resource: the server responded with a status of 400 ()
Sign in error: AuthApiError: Invalid login credentials
```

### Possible Causes

1. **Team doesn't exist yet** - You might not have any teams created
2. **Wrong password** - Password doesn't match
3. **Wrong email format** - Team ID should not include `@quarrymadness.local`

### How to Check Teams

Open browser console and run:
```javascript
// Check what teams exist
const { data: teams, error } = await supabase
  .from('teams')
  .select('team_id, team_name, created_at')

console.log('Teams:', teams)
console.log('Error:', error)
```

### How to Check Auth Users

```javascript
// This requires admin privileges
// Login as admin first, then run:
const { data: users, error } = await supabase.auth.admin.listUsers()
console.log('Users:', users)
```

### Team Login Format

When logging in as a team:
- **Username**: Just the team_id (e.g., `team_001` or `Jeff_Peter`)
- **Password**: Whatever was set when team was created (default: `12qm2025`)

The login page should automatically convert `team_001` → `team_001@quarrymadness.local`

## Test the Fixes

### 1. Test Admin Login (Should Still Work)
1. Go to: `http://localhost:5173/12qm25/#/admin`
2. Username: `admin`
3. Password: `adams68`
4. Should redirect to admin dashboard

### 2. Test Team Creation (Should Work Now!)
1. Login as admin
2. Go to Teams page
3. Click "Create Team"
4. Fill in:
   - Team ID: `Test_Team`
   - Team Name: `Test Team`
   - Password: `test1234`
   - Climber 1: Alice, 25, grade 22
   - Climber 2: Bob, 28, grade 24
5. Click "Create Team"
6. **Expected**: Success message with credentials
7. **Expected**: No CORS error!

### 3. Test Team Login (With Newly Created Team)
1. Sign out from admin
2. Go to: `http://localhost:5173/12qm25/#/login`
3. Username: `Test_Team`
4. Password: `test1234`
5. **Expected**: Login successful, redirect to team dashboard

### 4. Test Password Reset
1. Login as admin
2. Go to Teams → View `Test_Team`
3. Click "Reset Password"
4. Enter new password: `newpass123`
5. **Expected**: Success message
6. **Expected**: No 400 error!
7. Test login with new password

## Common Issues

### CORS Error Still Appears
- **Solution**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- **Reason**: Browser cached old OPTIONS response

### Team Login Still Fails
- **Check**: Is there a team called `team_001`?
- **Check**: What password was used when creating it?
- **Try**: Create a new team via admin panel first

### Password Reset 400 Error
- **Check Console**: Look for specific error message in response
- **Common Cause**: `userId` or `newPassword` field missing

## Debug Console Commands

### Check if functions are deployed
```bash
~/.local/bin/supabase functions list
```

### Check function logs
Go to: https://supabase.com/dashboard/project/cbcauybpyagrhrrrmirk/functions
- Click on function name
- View "Logs" tab
- See error details

### Test function directly
```bash
# Get your admin access token first by logging in as admin
# Then check browser console and run:
console.log(supabase.auth.session()?.access_token)

# Use that token to test function:
curl -X POST \
  'https://skfdhfrfmorubqembaxt.supabase.co/functions/v1/admin-create-team' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "teamId": "curl_test",
    "teamName": "Curl Test",
    "password": "test123",
    "climber1": {"name": "Alice", "age": 25, "grade": 22},
    "climber2": {"name": "Bob", "age": 28, "grade": 24},
    "category": "advanced"
  }'
```

## What Was Fixed

### CORS Headers
**Before:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders })
}
```

**After:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',  // Added this
}

if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders, status: 200 })  // Added status
}
```

### Functions Redeployed
```bash
✅ admin-create-team deployed (script size: 70.03kB)
✅ admin-reset-password deployed (script size: 69.04kB)
```

## Next Steps

1. **Hard refresh browser** to clear cached CORS responses
2. **Create a test team** via admin panel
3. **Try logging in** with the test team credentials
4. **Report results** - what works and what doesn't

If team login still fails, we need to check:
- What teams exist in the database
- What the actual credentials are
- If there's an issue with the login form conversion
