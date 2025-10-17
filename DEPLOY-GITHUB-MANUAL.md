# Deploy to GitHub Pages - Manual Steps

Since GitHub CLI requires sudo to install, here's the manual process (actually simpler!):

---

## Step 1: Create GitHub Repo (2 minutes)

1. **Open browser:** https://github.com/new

2. **Fill in details:**
   - Repository name: `madness`
   - Description: `Quarry Madness Scorekeeper`
   - Visibility: **Public** (required for free GitHub Pages)
   - **DON'T check** "Add a README file"
   - **DON'T check** "Add .gitignore"
   - **DON'T check** "Choose a license"

3. **Click:** "Create repository"

4. **You'll see a page with setup instructions** - ignore those, use the commands below instead

---

## Step 2: Connect Your Local Repo to GitHub

After creating the repo, GitHub will show you a URL like:
`https://github.com/YOUR-USERNAME/madness.git`

**Run these commands:**

```bash
cd /home/jiri/Documents/coding/projects/12qm25

# Add GitHub as remote (replace YOUR-USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/madness.git

# Verify it's added
git remote -v

# Push your main branch
git push -u origin master

# Push your feature branch too
git push origin 001-project-md
```

---

## Step 3: Deploy to GitHub Pages

```bash
cd /home/jiri/Documents/coding/projects/12qm25/frontend

# Deploy (this creates gh-pages branch and pushes your site)
npm run deploy
```

**Wait 1-2 minutes**, then your site will be live at:
`https://YOUR-USERNAME.github.io/madness/`

---

## Step 4: Configure Base Path (Important!)

GitHub Pages serves from `/madness/` not root `/`. Update Vite config:

```bash
# I'll do this for you - just tell me when Step 2 is done
```

---

## Quick Summary

1. ✅ Create repo on GitHub named "madness" (Public)
2. ✅ Copy the repo URL (will be `https://github.com/YOUR-USERNAME/madness.git`)
3. ✅ Tell me your GitHub username
4. ✅ I'll run the git commands for you
5. ✅ We'll deploy together

---

## What You Need to Tell Me:

**Your GitHub username** (so I can set up the remote correctly)

Then I'll handle the rest!
