# Production Deployment Guide - 12qm25 Quarry Madness

## Pre-Deployment Checklist

### 1. Code Quality & Version Control
- [ ] All changes committed to git
- [ ] Feature branch merged to main/master
- [ ] Clean working directory (`git status`)
- [ ] All console.log/debug statements removed or replaced with proper logging
- [ ] Code reviewed and tested

### 2. Environment Configuration
- [ ] Production `.env` file created with real credentials
- [ ] Cloudflare Turnstile production key configured (not test key)
- [ ] Supabase production project URL and keys verified
- [ ] All environment variables documented

### 3. Database & Backend
- [ ] All migrations applied to production database
- [ ] Duplicate migration files resolved (011_leaderboard_nudges)
- [ ] RLS policies tested and verified
- [ ] Database functions tested
- [ ] Edge functions deployed to Supabase

### 4. Testing
- [ ] Manual testing completed on all features
- [ ] Admin panel functionality verified
- [ ] Authentication flow tested
- [ ] Scoring system validated
- [ ] Nudge system tested
- [ ] Bonus games functionality checked

### 5. Build & Deploy
- [ ] Production build successful (`npm run build`)
- [ ] Build artifacts verified in `dist/`
- [ ] Static assets optimized
- [ ] Frontend deployed to hosting platform

---

## Step-by-Step Deployment

### Step 1: Clean Up Code

```bash
# Remove debug statements (review each one first)
grep -r "console.log\|console.error" src/ --include="*.js"
# Remove or replace with proper logging
```

### Step 2: Fix Migration Conflicts

```bash
cd supabase/migrations
# Rename one of the duplicate files
mv 011_leaderboard_nudges.sql 017_leaderboard_nudges_backup.sql
# Or delete if it's superseded by the _fixed version
```

### Step 3: Commit Changes

```bash
git status
git add -A
git commit -m "Prepare for production deployment: cleanup and finalization"
git push origin 001-project-md

# Merge to main if ready
git checkout master
git merge 001-project-md
git push origin master
```

### Step 4: Link Supabase Project

```bash
~/.local/bin/supabase link --project-ref skfdhfrfmorubqembaxt
```

### Step 5: Deploy Database Migrations

```bash
# Review what will be deployed
~/.local/bin/supabase db diff

# Push migrations to production
~/.local/bin/supabase db push

# Or apply specific migration
~/.local/bin/supabase db execute --file supabase/migrations/XXX_migration.sql
```

### Step 6: Deploy Edge Functions

```bash
# Deploy admin functions
~/.local/bin/supabase functions deploy admin-create-team --no-verify-jwt
~/.local/bin/supabase functions deploy admin-reset-password --no-verify-jwt

# Verify deployment
~/.local/bin/supabase functions list
```

### Step 7: Configure Production Environment

Create `frontend/.env.production`:
```env
# Supabase Production Configuration
VITE_SUPABASE_URL=https://skfdhfrfmorubqembaxt.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Cloudflare Turnstile Production Key
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAB5xR2YjqecWsKNH

# Environment
VITE_ENV=production
```

### Step 8: Build for Production

```bash
cd frontend

# Clean previous builds
rm -rf dist/

# Build with production env
npm run build

# Verify build
ls -la dist/
```

### Step 9: Deploy Frontend

**Option A: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Option B: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Option C: Manual (any static host)**
```bash
# Upload contents of dist/ folder to your hosting provider
# - AWS S3 + CloudFront
# - DigitalOcean App Platform
# - Cloudflare Pages
# - GitHub Pages
```

### Step 10: Verify Deployment

- [ ] Visit production URL
- [ ] Test authentication (login/logout)
- [ ] Test team creation
- [ ] Test scoring functionality
- [ ] Test admin panel access
- [ ] Test nudge system
- [ ] Test bonus games
- [ ] Verify Cloudflare Turnstile works
- [ ] Check browser console for errors

---

## Post-Deployment

### Monitoring
- Monitor Supabase dashboard for errors
- Check Edge Functions logs
- Monitor database performance
- Set up uptime monitoring (e.g., UptimeRobot)

### Backup
```bash
# Backup production database
~/.local/bin/supabase db dump -f backup-$(date +%Y%m%d).sql
```

### Rollback Procedure
If issues occur:

1. **Frontend Rollback:**
   - Revert to previous deployment in hosting platform
   - Or deploy previous git commit

2. **Database Rollback:**
   ```bash
   # Use migration down files or restore from backup
   ~/.local/bin/supabase db reset --db-url <production-url>
   ```

3. **Edge Functions Rollback:**
   ```bash
   # Redeploy previous version
   git checkout <previous-commit>
   ~/.local/bin/supabase functions deploy <function-name>
   ```

---

## Security Checklist

- [ ] All secrets in environment variables (not committed)
- [ ] RLS policies enabled on all tables
- [ ] Admin functions require proper authentication
- [ ] Cloudflare Turnstile configured for bot protection
- [ ] CORS configured correctly in Supabase
- [ ] Rate limiting configured
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified

---

## Performance Optimization

- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable compression (gzip/brotli)
- [ ] Monitor bundle size
- [ ] Configure database indexes

---

## Required Environment Variables

### Frontend (.env.production)
```env
VITE_SUPABASE_URL=<your-production-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-production-anon-key>
VITE_TURNSTILE_SITE_KEY=<your-production-turnstile-key>
VITE_ENV=production
```

### Supabase Edge Functions
Configure these in Supabase dashboard under Functions > Secrets:
- SUPABASE_SERVICE_ROLE_KEY (for admin functions)

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Migration Conflicts
```bash
# Check migration status
~/.local/bin/supabase migration list

# Reset local database
~/.local/bin/supabase db reset
```

### Function Deployment Issues
```bash
# Check logs
~/.local/bin/supabase functions logs <function-name>

# Redeploy with verbose output
~/.local/bin/supabase functions deploy <function-name> --debug
```

---

## Support & Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)
- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)

---

## Notes

- **Test everything in staging first** if you have a staging environment
- **Backup database before applying migrations**
- **Monitor for 24 hours after deployment**
- **Have rollback plan ready**
- **Document any production-specific configurations**
