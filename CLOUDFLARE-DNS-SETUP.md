# Cloudflare DNS Setup for madness.happyk.au

Step-by-step guide to point `madness.happyk.au` to your GitHub Pages site.

---

## Step 1: Add Custom Domain to GitHub Pages (Do This First!)

1. Go to: **https://github.com/happykcz/madness/settings/pages**
2. Scroll down to **"Custom domain"** section
3. Enter: `madness.happyk.au`
4. Click **"Save"**
5. You'll see a DNS check - it will say "DNS check unsuccessful" - **this is normal**, we'll fix it in the next step

---

## Step 2: Configure DNS in Cloudflare

### Login to Cloudflare
1. Go to: **https://dash.cloudflare.com/**
2. Log in
3. Click on your **happyk.au** domain

### Add CNAME Record
1. Click **DNS** in the left sidebar (or top menu)
2. Click **"Add record"** button
3. Fill in the details:

```
Type:         CNAME
Name:         madness
Content:      happykcz.github.io
Proxy status: DNS only (click the cloud icon to make it GRAY/orange - DNS only is recommended for GitHub Pages)
TTL:          Auto
```

**Important Settings:**
- **Type:** Must be `CNAME` (not A record)
- **Name:** Just `madness` (Cloudflare adds .happyk.au automatically)
- **Content:** `happykcz.github.io` (no trailing slash, no https://)
- **Proxy status:** **DNS only (gray cloud)** - This is important!
  - Click the orange cloud to toggle it to gray
  - GitHub Pages needs direct DNS, not Cloudflare proxy

4. Click **"Save"**

### Visual Guide:
```
┌─────────────────────────────────────────────────────┐
│ Add DNS record                                      │
├─────────────────────────────────────────────────────┤
│ Type: [CNAME ▼]                                     │
│ Name: [madness                     ] .happyk.au     │
│ Target: [happykcz.github.io                       ] │
│ Proxy status: [🌥️] ← Click to make it gray (DNS only)│
│ TTL: [Auto ▼]                                       │
│                                                     │
│               [Cancel]  [Save]                      │
└─────────────────────────────────────────────────────┘
```

---

## Step 3: Verify DNS Record

After adding the record, you should see it in your DNS records list:

```
Type    Name      Content                  Proxy  TTL
CNAME   madness   happykcz.github.io      DNS    Auto
                                          (gray)
```

### Check DNS Propagation
Wait 2-5 minutes, then check:

**Option A: Use Cloudflare's DNS checker**
- In your DNS records page, you'll see the record
- Should show as active immediately

**Option B: Use command line**
```bash
dig madness.happyk.au

# Should show:
# madness.happyk.au. 300 IN CNAME happykcz.github.io.
```

**Option C: Online tool**
- Visit: https://www.whatsmydns.net/#CNAME/madness.happyk.au
- Should show `happykcz.github.io` globally

---

## Step 4: Verify GitHub Pages Custom Domain

1. Go back to: **https://github.com/happykcz/madness/settings/pages**
2. Refresh the page
3. Wait 2-5 minutes
4. The DNS check should change from ❌ to ✅
5. You'll see: **"DNS check successful"**

---

## Step 5: Enable HTTPS

After DNS check is successful (may take 5-10 minutes):

1. Still in GitHub Pages settings
2. Look for **"Enforce HTTPS"** checkbox
3. It may say "Not yet available" - **wait 5-10 more minutes**
4. Once available, ✅ check **"Enforce HTTPS"**
5. Click **"Save"** if prompted

GitHub will automatically provision a free SSL certificate from Let's Encrypt.

---

## Step 6: Test Your Site!

After HTTPS is enabled (total time: 15-30 minutes from DNS setup):

Visit: **https://madness.happyk.au**

Should see your Quarry Madness scorekeeper app!

---

## Troubleshooting

### DNS check still failing after 10 minutes

**Check Proxy Status:**
- Must be **DNS only (gray cloud)**, not proxied (orange cloud)
- If orange, click it to toggle to gray, then save

**Verify CNAME:**
```bash
dig madness.happyk.au
# Should return: happykcz.github.io
```

**Common mistakes:**
- ❌ Content: `https://happykcz.github.io` (remove https://)
- ❌ Content: `happykcz.github.io/` (remove trailing slash)
- ❌ Name: `madness.happyk.au` (should be just `madness`)
- ✅ Content: `happykcz.github.io` (correct!)

### "Enforce HTTPS" not available

- **Wait longer:** Can take up to 30 minutes after DNS check succeeds
- **Try toggling:** Uncheck and recheck the custom domain in GitHub settings
- **Redeploy:** Run `npm run deploy` again from your frontend folder

### Site shows 404

- **Check GitHub Pages source:** Should be `gh-pages` branch
- **Check custom domain:** Should show `madness.happyk.au` in settings
- **Redeploy:** Run `npm run deploy` from frontend folder

### Mixed content warnings

Your app should be fine - all resources use HTTPS:
- ✅ Supabase: `https://skfdhfrfmorubqembaxt.supabase.co`
- ✅ Relative paths for assets
- ✅ Cloudflare Turnstile works with HTTPS

---

## Cloudflare Pro Tips

### SSL/TLS Settings (Optional but recommended)
1. In Cloudflare dashboard → **SSL/TLS**
2. Set to **"Full"** or **"Full (strict)"**
3. This ensures end-to-end encryption

### Page Rules (Optional)
If you want to always redirect to HTTPS:
1. **Page Rules** → Create Rule
2. URL: `http://madness.happyk.au/*`
3. Setting: **Always Use HTTPS**
4. Save

### Cache (Optional)
For faster loading:
1. **Caching** → Configuration
2. Caching level: Standard
3. Browser TTL: Respect existing headers

---

## Current Setup Summary

**GitHub Pages:**
- Repository: happykcz/madness
- Branch: gh-pages
- Custom domain: madness.happyk.au (to be configured)
- Source: https://happykcz.github.io/madness/

**DNS (Cloudflare):**
- Domain: happyk.au
- Subdomain: madness
- Record type: CNAME
- Points to: happykcz.github.io
- Proxy: DNS only (gray cloud)

**Live URLs:**
- GitHub URL: https://happykcz.github.io/madness/ ✅ Working now
- Custom URL: https://madness.happyk.au ⏳ Will work after DNS setup

---

## Timeline

- **Now:** Add custom domain to GitHub Pages
- **2-5 mins:** Add CNAME in Cloudflare DNS
- **5-10 mins:** DNS check succeeds on GitHub
- **10-20 mins:** HTTPS becomes available
- **15-30 mins:** Site fully live at https://madness.happyk.au 🎉

---

## Your Action Items:

1. ✅ **GitHub Pages:** Add `madness.happyk.au` as custom domain
2. ✅ **Cloudflare DNS:** Add CNAME record (madness → happykcz.github.io, gray cloud)
3. ⏳ **Wait 15-30 minutes**
4. ✅ **Enable HTTPS** on GitHub Pages
5. 🎉 **Test:** Visit https://madness.happyk.au

---

Need help with any step? Let me know where you get stuck!
