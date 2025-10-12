# Check Teams in Database

Please run these commands in your browser console to check what teams exist:

## 1. Check All Teams

```javascript
// Open browser console (F12) and run:
const { data: teams, error } = await supabase
  .from('teams')
  .select('*')

console.log('Teams:', teams)
console.log('Error:', error)
console.log('Team count:', teams?.length || 0)
```

## 2. Check Specific Team

```javascript
// Check if team_001 exists
const { data: team001, error } = await supabase
  .from('teams')
  .select('*')
  .eq('team_id', 'team_001')
  .single()

console.log('team_001:', team001)
console.log('Error:', error)
```

## 3. Check Auth Users (as admin)

```javascript
// Login as admin first, then run:
const { data: session } = await supabase.auth.getSession()
console.log('Current user:', session?.session?.user?.email)

// Check if current user is admin
const { data: isAdmin } = await supabase.rpc('is_admin')
console.log('Is admin:', isAdmin)
```

## 4. Test Create Team Function

```javascript
// Login as admin, then run:
const { data: { session } } = await supabase.auth.getSession()

const response = await fetch(
  'https://skfdhfrfmorubqembaxt.supabase.co/functions/v1/admin-create-team',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      teamId: 'Console_Test',
      teamName: 'Console Test Team',
      password: 'test1234',
      climber1: { name: 'Alice', age: 25, grade: 22 },
      climber2: { name: 'Bob', age: 28, grade: 24 },
      category: 'advanced'
    })
  }
)

const result = await response.json()
console.log('Response:', result)
console.log('Status:', response.status)
```

## 5. Check Function Logs

Go to Supabase Dashboard:
- https://supabase.com/dashboard/project/cbcauybpyagrhrrrmirk/functions
- Click on `admin-create-team`
- View "Logs" tab
- Look for recent errors

## Common Issues

### If No Teams Exist
- Need to create the first team via admin panel
- Or use console test above

### If team_001 Login Fails
The team `team_001` might:
1. Not exist
2. Have a different password
3. Be in auth.users but not in teams table

### Check Auth Users Table
```javascript
// This shows if team_001 exists in auth
const email = 'team_001@quarrymadness.local'
// Can't query auth.users directly from client
// Need to check via Supabase Dashboard → Authentication → Users
```

Go to: https://supabase.com/dashboard/project/cbcauybpyagrhrrrmirk/auth/users
- Look for `team_001@quarrymadness.local`
- If it exists, check if password is correct
- If it doesn't exist, need to create it

## What to Report

Please share:
1. How many teams exist (from step 1)
2. Does team_001 exist (from step 2)
3. Result of console test (from step 4)
4. Any error messages from function logs (from step 5)
