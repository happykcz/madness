# Quick Deployment Guide - 12qm25

Your production build is ready in `frontend/dist/`!

## ✅ Build Complete
- Environment: production
- Turnstile: production key configured
- Supabase: connected to production database
- Bundle size: 337 KB JS (74 KB gzipped) + 15 KB CSS (4 KB gzipped)

---

## 🚀 Deploy Now - Pick One Method

### **Option 1: Netlify (Easiest - Drag & Drop)**

1. Go to https://app.netlify.com/drop
2. **Drag and drop** the entire `frontend/dist` folder
3. Done! You'll get a URL like: `https://random-name-12345.netlify.app`

**To get a custom domain later:**
- Go to Site settings → Domain management → Add custom domain

---

### **Option 2: Netlify CLI (More Control)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from frontend directory
cd /home/jiri/Documents/coding/projects/12qm25/frontend
netlify deploy --prod --dir=dist

# Follow prompts:
# - Create new site or link existing
# - Confirm deploy directory: dist
```

**Your site will be live at:** `https://your-site-name.netlify.app`

---

### **Option 3: Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd /home/jiri/Documents/coding/projects/12qm25/frontend
vercel --prod

# When prompted:
# - Set up and deploy: Y
# - Scope: your account
# - Link to existing project: N (first time)
# - Project name: quarry-madness
# - Directory: ./
# - Override build settings: N
```

---

### **Option 4: Cloudflare Pages (UI)**

1. Go to https://dash.cloudflare.com/
2. Pages → Create a project → Connect to Git or Upload assets
3. **If using Git:**
   - Connect your GitHub repo
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `frontend`

4. **If uploading directly:**
   - Upload the `frontend/dist` folder
   - Done!

---

### **Option 5: GitHub Pages**

```bash
# Install gh-pages package
cd /home/jiri/Documents/coding/projects/12qm25/frontend
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

Your site will be at: `https://yourusername.github.io/12qm25/`

---

## ⚡ Fastest Method Right Now

**Use Netlify Drop (Option 1):**

1. Open browser: https://app.netlify.com/drop
2. Find your `frontend/dist` folder in file manager
3. Drag entire `dist` folder to browser
4. Wait 10 seconds
5. **Done!** Copy your URL

---

## 🔧 Post-Deployment Checklist

After deploying, test these features:

- [ ] Visit your deployment URL
- [ ] Login works (test with a team account)
- [ ] Dashboard loads with correct data
- [ ] Scoring page works
- [ ] Admin panel accessible (if admin user)
- [ ] Nudge banner displays correctly
- [ ] Bonus games tab works
- [ ] Mobile responsive design works
- [ ] Cloudflare Turnstile captcha works
- [ ] No console errors in browser

---

## 🎯 Current File Locations

```
Build output:     /home/jiri/Documents/coding/projects/12qm25/frontend/dist/
Deployment files: dist/index.html + dist/assets/
```

---

## 🔄 Future Deployments

After the initial deployment, updates are simple:

**Netlify:**
```bash
cd /home/jiri/Documents/coding/projects/12qm25/frontend
npm run build
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
cd /home/jiri/Documents/coding/projects/12qm25/frontend
npm run build
vercel --prod
```

**Cloudflare/GitHub:** Push to git and auto-deploy runs

---

## 📝 Custom Domain Setup

After deployment, you can add a custom domain:

**Netlify:** Site settings → Domain management → Add custom domain
**Vercel:** Project settings → Domains → Add domain
**Cloudflare Pages:** Custom domains → Add domain

Then update DNS:
- Add CNAME record pointing to deployment platform
- Wait for DNS propagation (5-30 minutes)

---

## 🆘 Troubleshooting

**Site loads but shows errors:**
- Check browser console (F12)
- Verify environment variables are correct
- Check Supabase project is accessible

**Captcha not working:**
- Verify Turnstile site key is correct
- Check domain is added to Turnstile allowed domains

**Database connection fails:**
- Verify VITE_SUPABASE_URL is correct
- Check VITE_SUPABASE_ANON_KEY is valid
- Ensure Supabase project is active

**Want to rollback:**
- Netlify: Deploys → Click previous deploy → Publish
- Vercel: Deployments → Click previous → Promote to Production

---

## 🎉 You're Ready!

Your app is production-ready. Choose your deployment method and go live!

**Recommended:** Start with Netlify Drop (Option 1) for immediate deployment, then set up CLI for future updates.
