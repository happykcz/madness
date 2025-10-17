# 🚨 SECURITY BREACH - Immediate Action Required

## What's Exposed

Your `team-credentials.md` file is publicly visible on GitHub with:
- ❌ Team password: `sq6to18`
- ❌ All team email addresses
- ❌ Team member names and personal info

**Repository:** https://github.com/happykcz/madness
**Visibility:** Public (anyone can see)

---

## Immediate Actions Required

### 🔴 CRITICAL - Do Right Now:

#### 1. Change All Team Passwords (URGENT!)

You need to reset the password for ALL teams in Supabase:

**Option A: Using SQL (Fastest)**
```sql
-- Run this in Supabase SQL Editor:
-- Change 'NEW_SECURE_PASSWORD' to a new strong password

UPDATE auth.users
SET encrypted_password = crypt('NEW_SECURE_PASSWORD', gen_salt('bf'))
WHERE email LIKE '%@quarrymadness.local';
```

**Option B: Using Admin Reset Function**
Reset each team individually through your admin panel.

**Recommended New Password:** Generate a strong one like: `Qm2025!Climb#Secure$789`

#### 2. Remove File from Git History

The file exists in git history, so we need to completely remove it:

```bash
cd /home/jiri/Documents/coding/projects/12qm25

# Remove from current commit
git rm --cached team-credentials.md

# Commit removal
git commit -m "Remove exposed credentials file"

# Push changes
git push origin master
```

**IMPORTANT:** Even after removal, the file is still visible in git history!
To completely remove it requires rewriting history (see below).

---

## What's Actually at Risk

### Low Risk (These are OK):
✅ **Supabase URL** - Public, meant to be in frontend code
✅ **Supabase Anon Key** - Public, has RLS protection
✅ **Turnstile Site Key** - Public, meant for frontend

### HIGH RISK (These are exposed):
❌ **Team Password** (`sq6to18`) - Anyone can login as any team!
❌ **Team Emails** - Used for authentication
❌ **Personal Info** - Names, ages, grades

---

## Why This is a Problem

**Right now, anyone can:**
1. Visit your site: https://madness.happyk.au
2. Login as ANY team using: `{teamid}@quarrymadness.local` / `sq6to18`
3. View/modify that team's scores
4. Submit ascents as that team
5. See all team data

---

## Complete Fix Steps

### Step 1: Change Passwords (Do First!)

**Using Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/skfdhfrfmorubqembaxt
2. Authentication → Users
3. For each team user:
   - Click the user
   - Click "Send password recovery email" OR
   - Use your admin reset function

**OR use SQL (faster):**
```sql
-- Run in Supabase SQL Editor
-- Replace 'YOUR_NEW_PASSWORD' with a strong password

UPDATE auth.users
SET encrypted_password = crypt('YOUR_NEW_PASSWORD', gen_salt('bf'))
WHERE email LIKE '%@quarrymadness.local';

-- Verify it worked:
SELECT email, created_at
FROM auth.users
WHERE email LIKE '%@quarrymadness.local'
LIMIT 5;
```

### Step 2: Remove File from Git

```bash
cd /home/jiri/Documents/coding/projects/12qm25

# Remove from tracking
git rm --cached team-credentials.md

# Commit
git commit -m "Remove exposed credentials from repository"

# Push
git push origin master
```

### Step 3: Add to .gitignore (Already done! ✅)

The file is now in `.gitignore` to prevent future commits.

### Step 4: Notify Teams (Optional)

If you want to be transparent:
- Email teams with new passwords
- Explain the password was changed for security
- No need to mention it was exposed (unless you prefer)

---

## Advanced: Complete History Removal (Optional)

**WARNING:** This rewrites git history and requires force push!

Only do this if you want to completely remove the file from all history:

```bash
cd /home/jiri/Documents/coding/projects/12qm25

# Remove from all history (DESTRUCTIVE!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch team-credentials.md" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (DANGEROUS - overwrites GitHub)
git push origin --force --all

# Clean up local refs
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**⚠️ WARNING:** Force push will break anyone else who cloned the repo!

---

## Prevention for Future

### ✅ Never Commit:
- Password files
- `.env` files (except `.env.example`)
- Database dumps with real data
- API keys (except public ones like Supabase anon key)
- Personal information

### ✅ Always Use:
- `.gitignore` for sensitive files
- Environment variables for secrets
- Separate credentials for dev/prod
- Password managers for storage

### ✅ Safe to Commit:
- Public API keys (Supabase anon key, Turnstile site key)
- `.env.example` templates
- Documentation without credentials
- Public configuration

---

## Current Status Checklist

- [ ] Change all team passwords in database
- [ ] Remove `team-credentials.md` from git
- [ ] Push removal to GitHub
- [ ] Verify file not visible on GitHub
- [ ] (Optional) Notify teams of password change
- [ ] (Optional) Remove from git history completely
- [ ] Keep new password in password manager ONLY

---

## Your Next Steps

**I recommend:**

1. **Change the password NOW** using the SQL command above
2. **Remove the file from git** using the commands above
3. **Push to GitHub** to remove from current view
4. **Test with new password** to confirm it works
5. **Store new password securely** (password manager, encrypted notes)
6. **Notify teams** with new credentials via email/text

**Optional but recommended:**
7. **Make repo private** on GitHub (Settings → Danger Zone → Change visibility)
   - Or remove from history completely using filter-branch

---

## Questions to Consider

1. **Is your GitHub repo public or private?**
   - Public = Anyone can see
   - Private = Only you can see

2. **Do you want to keep it public?**
   - Yes = Must remove from history
   - No = Can make it private now

3. **Should you rotate other secrets?**
   - Supabase keys are OK (public by design with RLS)
   - But consider if anything else was exposed

---

## Summary

**Immediate danger:** Anyone can login as any team right now!

**Fix:** Change password → Remove file → Push changes

**Time needed:** 10-15 minutes

**Priority:** 🔴 Critical - Do before teams start using the system!

---

Let me know if you want help with any of these steps!
