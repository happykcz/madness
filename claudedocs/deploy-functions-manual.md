# Manual Edge Function Deployment via Supabase Dashboard

Since the CLI deployment is slow (pulling Docker images), you can deploy the functions manually via the Supabase Dashboard.

## Step 1: Navigate to Edge Functions

1. Go to: https://supabase.com/dashboard
2. Select your project: **hvt-climbing**
3. Click "Edge Functions" in the left sidebar
4. Click "Create a new function"

## Step 2: Deploy admin-create-team Function

1. Click "+ New Function"
2. Function name: `admin-create-team`
3. Copy and paste the content from: `supabase/functions/admin-create-team/index.ts`
4. Click "Deploy function"

## Step 3: Deploy admin-reset-password Function

1. Click "+ New Function"
2. Function name: `admin-reset-password`
3. Copy and paste the content from: `supabase/functions/admin-reset-password/index.ts`
4. Click "Deploy function"

## Step 4: Verify Deployment

1. Both functions should now appear in the Edge Functions list
2. Click on each function to see its URL:
   - `https://cbcauybpyagrhrrrmirk.supabase.co/functions/v1/admin-create-team`
   - `https://cbcauybpyagrhrrrmirk.supabase.co/functions/v1/admin-reset-password`

## Step 5: Test Functions

After deployment, test by:
1. Navigate to: `http://localhost:5174/12qm25/#/admin`
2. Login as admin
3. Go to Teams page
4. Try creating a new team
5. Try resetting a password

## Function Code Locations

- Create Team: [supabase/functions/admin-create-team/index.ts](../supabase/functions/admin-create-team/index.ts)
- Reset Password: [supabase/functions/admin-reset-password/index.ts](../supabase/functions/admin-reset-password/index.ts)

## Environment Variables

The functions automatically have access to:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (admin privileges)

No additional configuration needed!

## Troubleshooting

### Function not found
- Verify function is deployed and shows "Active" status in dashboard
- Check function name matches exactly (no typos)

### Authorization errors
- Ensure you're logged in as admin
- Check `is_admin()` function returns true

### CORS errors
- Functions already include CORS headers
- If issues persist, check browser console for specific error

## Alternative: Wait for CLI Deployment

The CLI deployment command is running in the background:
```bash
# Check status
tail -f /tmp/deploy-create-team.log

# Check if still running
ps aux | grep supabase
```

Once complete, deploy the second function:
```bash
~/.local/bin/supabase functions deploy admin-reset-password --no-verify-jwt
```
