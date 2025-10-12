# Supabase Edge Functions Deployment

## Overview

These Edge Functions handle admin operations that require Service Role privileges:
- `admin-create-team` - Create teams with auth users
- `admin-reset-password` - Reset team passwords

## Prerequisites

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Deployment

### Deploy All Functions
```bash
cd /home/jiri/Documents/coding/projects/12qm25
supabase functions deploy
```

### Deploy Individual Function
```bash
# Deploy admin-create-team
supabase functions deploy admin-create-team

# Deploy admin-reset-password
supabase functions deploy admin-reset-password
```

## Environment Variables

The functions automatically have access to:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (has admin privileges)

These are injected automatically by Supabase.

## Testing

### Test admin-create-team
```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/admin-create-team' \
  -H 'Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "teamId": "Test_Team",
    "teamName": "Test Team",
    "password": "test1234",
    "climber1": {
      "name": "Alice",
      "age": 25,
      "grade": 22
    },
    "climber2": {
      "name": "Bob",
      "age": 28,
      "grade": 24
    },
    "category": "advanced"
  }'
```

### Test admin-reset-password
```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/admin-reset-password' \
  -H 'Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "USER_UUID",
    "newPassword": "newpass123",
    "teamId": "Test_Team"
  }'
```

## Function URLs

After deployment, your functions will be available at:
- `https://YOUR_PROJECT_REF.supabase.co/functions/v1/admin-create-team`
- `https://YOUR_PROJECT_REF.supabase.co/functions/v1/admin-reset-password`

The frontend code already uses `supabase.supabaseUrl` which automatically points to these URLs.

## Troubleshooting

### Function not found
- Ensure you've deployed the functions
- Check your project link: `supabase projects list`

### Authorization errors
- Verify the admin user is logged in
- Check the `is_admin()` function returns true

### Service role errors
- The Service Role key is automatically injected by Supabase
- Don't commit Service Role keys to git

## Local Development

To test functions locally:
```bash
# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve

# Functions will be available at:
# http://localhost:54321/functions/v1/admin-create-team
# http://localhost:54321/functions/v1/admin-reset-password
```

## Security Notes

- Edge Functions run with Service Role privileges
- Always verify the requesting user is an admin
- Never expose Service Role key to client-side code
- All admin operations are logged in `admin_actions` table
