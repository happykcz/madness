# Custom Domain Setup for happyk.au

Your site is now live at: **https://happykcz.github.io/madness/**

Let's configure it to use a subdomain of `happyk.au`

---

## Step 1: Choose Your Subdomain

What subdomain do you want to use? Examples:
- `madness.happyk.au`
- `quarry.happyk.au`
- `climb.happyk.au`
- `scorekeeper.happyk.au`

**Tell me which subdomain you prefer**, then continue with steps below.

---

## Step 2: Configure GitHub Pages for Custom Domain

1. Go to your repo: https://github.com/happykcz/madness
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Custom domain**, enter your chosen subdomain (e.g., `madness.happyk.au`)
4. Click **Save**
5. ✅ Check **"Enforce HTTPS"** (wait a few minutes for it to become available)

GitHub will create a CNAME file in your gh-pages branch automatically.

---

## Step 3: Configure DNS at Your Domain Registrar

Log into wherever you manage DNS for `happyk.au` (e.g., Cloudflare, AWS Route53, GoDaddy, etc.)

Add a **CNAME record**:

```
Type:  CNAME
Name:  madness (or your chosen subdomain)
Value: happykcz.github.io
TTL:   Auto or 3600
```

### Examples by Provider:

**Cloudflare:**
- Type: CNAME
- Name: madness
- Target: happykcz.github.io
- Proxy status: DNS only (gray cloud)
- TTL: Auto

**AWS Route53:**
- Record name: madness
- Record type: CNAME
- Value: happykcz.github.io
- TTL: 300

**GoDaddy:**
- Type: CNAME
- Name: madness
- Value: happykcz.github.io
- TTL: 1 Hour

---

## Step 4: Wait for DNS Propagation

DNS changes can take 5 minutes to 48 hours (usually 10-30 minutes).

Check status:
```bash
# Check if DNS is propagated
dig madness.happyk.au

# Or use online tool
# https://www.whatsmydns.net/#CNAME/madness.happyk.au
```

When it's ready, you'll see:
```
madness.happyk.au. 300 IN CNAME happykcz.github.io.
```

---

## Step 5: Enable HTTPS

1. Go back to: https://github.com/happykcz/madness/settings/pages
2. Wait until **"Enforce HTTPS"** checkbox becomes available (may take 5-10 minutes after DNS propagates)
3. ✅ Check **"Enforce HTTPS"**
4. Save

GitHub will automatically provision a free SSL certificate from Let's Encrypt.

---

## Verification Checklist

After DNS propagates and HTTPS is enabled:

- [ ] Visit `https://madness.happyk.au` (or your subdomain)
- [ ] Site loads correctly
- [ ] HTTPS works (green padlock in browser)
- [ ] Login functionality works
- [ ] Dashboard displays data
- [ ] No console errors
- [ ] Mobile responsive design works

---

## Troubleshooting

### "Site not found" or DNS errors
- **Wait longer:** DNS can take up to 48 hours
- **Check DNS:** Use `dig yourdomain.happyk.au`
- **Verify CNAME:** Points to `happykcz.github.io` (no trailing slash)

### HTTPS not available yet
- **Wait:** Can take 10-30 minutes after DNS propagates
- **Check DNS first:** HTTPS won't work until DNS is fully propagated
- **Try again:** Sometimes takes multiple attempts

### Site loads but shows 404
- **Check GitHub Pages settings:** Verify custom domain is saved
- **Check CNAME file:** Should be in gh-pages branch
- **Redeploy:** Run `npm run deploy` again

### Mixed content warnings
- **All good!** Your app uses relative paths and HTTPS Supabase URL
- Should work fine with HTTPS

---

## Current Status

✅ Site deployed to GitHub Pages
✅ Vite configured for custom domain (base: '/')
✅ Production build optimized
⏳ Custom domain: **Pending your DNS setup**

---

## What You Need to Do Now:

1. **Choose subdomain** (e.g., madness.happyk.au)
2. **Add to GitHub Pages:** Settings → Pages → Custom domain
3. **Update DNS:** Add CNAME record pointing to happykcz.github.io
4. **Wait 10-30 minutes** for DNS propagation
5. **Enable HTTPS** in GitHub Pages settings
6. **Test your site!**

---

## Current Live URLs

**GitHub Pages (working now):**
https://happykcz.github.io/madness/

**Custom Domain (after DNS setup):**
https://your-subdomain.happyk.au/

---

Let me know:
1. What subdomain you want to use
2. Where you manage DNS for happyk.au
3. When you've added the DNS record

Then I'll help verify everything is working!
