# GitHub Pages Deployment Setup

## Current Status
✅ gh-pages package installed
✅ Deploy script added to package.json
⚠️ No Git remote configured yet

---

## Option 1: You Already Have a GitHub Repo

If you already created a GitHub repository for this project:

```bash
# Add the remote (replace with your actual repo URL)
cd /home/jiri/Documents/coding/projects/12qm25
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push your code
git push -u origin 001-project-md
git push -u origin master

# Deploy to GitHub Pages
cd frontend
npm run deploy
```

Your site will be at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

## Option 2: Create a New GitHub Repo

### Step 1: Create Repo on GitHub
1. Go to https://github.com/new
2. Repository name: `12qm25` (or `quarry-madness`)
3. Description: "Quarry Madness Scorekeeper"
4. Public or Private: Choose (Public recommended for GitHub Pages free tier)
5. **DON'T** initialize with README (you already have code)
6. Click "Create repository"

### Step 2: Connect and Push
GitHub will show you commands. Use these:

```bash
# Add remote
cd /home/jiri/Documents/coding/projects/12qm25
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Rename branch if needed (GitHub uses 'main', you have 'master')
git branch -M main

# Push code
git push -u origin main
git push origin 001-project-md
```

### Step 3: Deploy to GitHub Pages
```bash
cd frontend
npm run deploy
```

### Step 4: Enable GitHub Pages (if needed)
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: `gh-pages` (root)
5. Save

Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

## Option 3: Use GitHub CLI (gh)

If you have GitHub CLI installed:

```bash
# Create repo and push in one go
cd /home/jiri/Documents/coding/projects/12qm25
gh repo create 12qm25 --public --source=. --remote=origin --push

# Deploy
cd frontend
npm run deploy
```

---

## After First Deployment

### Future deployments are simple:
```bash
cd /home/jiri/Documents/coding/projects/12qm25/frontend

# Make changes, then:
npm run build
npm run deploy
```

### Your deployment workflow:
1. Make code changes
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy: `npm run deploy`
5. Wait 1-2 minutes
6. Visit your site!

---

## Important: Base Path Configuration

GitHub Pages serves from `/repo-name/` not from root `/`.

**If your app doesn't load after deployment**, update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/YOUR-REPO-NAME/', // Add this line
  plugins: [
    // ... existing plugins
  ]
})
```

Then rebuild and redeploy:
```bash
npm run build
npm run deploy
```

---

## Troubleshooting

### Site shows 404
- Check GitHub Pages is enabled (Settings → Pages)
- Verify branch is set to `gh-pages`
- Wait 2-3 minutes for deployment

### Site loads but broken/blank
- Add `base` to vite.config.js (see above)
- Check browser console for errors
- Verify all paths are relative, not absolute

### Deploy command fails
- Check you're in `frontend` directory
- Verify `dist` folder exists (run `npm run build` first)
- Check Git remote is configured (`git remote -v`)

### Want custom domain?
1. Add `CNAME` file to `public/` folder with your domain
2. Configure DNS: Add CNAME pointing to `USERNAME.github.io`
3. In GitHub: Settings → Pages → Custom domain

---

## Quick Reference

```bash
# First time setup
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# Deploy
cd frontend
npm run build  # If you made changes
npm run deploy

# Check status
git remote -v  # See configured remotes
```

---

## What Happens When You Deploy

1. `npm run deploy` runs `gh-pages -d dist`
2. gh-pages creates/updates `gh-pages` branch
3. Copies everything from `dist/` to that branch
4. Pushes to GitHub
5. GitHub Pages automatically serves from `gh-pages` branch
6. Site live in 1-2 minutes

---

## Your Next Steps

**Tell me:**
1. Do you have a GitHub repo already? (what's the URL?)
2. Or should I help you create one?

Once we know, we can deploy immediately!
