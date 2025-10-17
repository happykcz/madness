# GitHub Authentication Required

You need to authenticate with GitHub to push code. Here are your options:

---

## Option 1: Personal Access Token (Recommended - Easy)

### Step 1: Create Token on GitHub
1. Go to: https://github.com/settings/tokens/new
2. **Note:** "12qm25 deployment"
3. **Expiration:** Choose your preference (90 days or custom)
4. **Select scopes:**
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (if using GitHub Actions)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Use Token to Push
```bash
cd /home/jiri/Documents/coding/projects/12qm25

# Push with token (you'll be prompted for username and password)
# Username: happykcz
# Password: paste your token (not your GitHub password!)
git push -u origin master
```

### Step 3: Save Token (Optional but recommended)
```bash
# Store credentials so you don't have to enter token every time
git config --global credential.helper store

# Now push again, enter token one more time, and it will be saved
git push -u origin master
```

---

## Option 2: SSH Keys (More Secure, One-time Setup)

### Step 1: Generate SSH Key
```bash
# Generate key (press Enter for all prompts)
ssh-keygen -t ed25519 -C "jiris@climberswa.asn.au"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add key
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

### Step 2: Add to GitHub
1. Copy the output from the `cat` command
2. Go to: https://github.com/settings/ssh/new
3. Title: "12qm25 deployment key"
4. Paste the key
5. Click "Add SSH key"

### Step 3: Change Remote to SSH
```bash
cd /home/jiri/Documents/coding/projects/12qm25

# Change remote from HTTPS to SSH
git remote set-url origin git@github.com:happykcz/madness.git

# Verify
git remote -v

# Push
git push -u origin master
```

---

## Option 3: GitHub CLI (Requires sudo to install)

```bash
# Install gh (requires sudo)
sudo apt install gh

# Login
gh auth login

# Push
git push -u origin master
```

---

## Quick Comparison

| Method | Setup Time | Security | Expires |
|--------|------------|----------|---------|
| **Personal Token** | 2 min | Good | Yes (90 days+) |
| **SSH Keys** | 5 min | Best | Never |
| **GitHub CLI** | 3 min | Best | Never |

---

## Recommended: Personal Access Token

**It's the fastest for now.** Steps:

1. ✅ Go to https://github.com/settings/tokens/new
2. ✅ Name: "12qm25 deployment"
3. ✅ Check: `repo` scope
4. ✅ Generate token
5. ✅ Copy token
6. ✅ Tell me when ready, and I'll run the push command
7. ✅ When prompted:
   - Username: `happykcz`
   - Password: paste your token

After first push, we can save it so you don't need to enter again.

---

## What Happens Next

Once authenticated:
1. ✅ Push master branch to GitHub
2. ✅ Push feature branch (001-project-md)
3. ✅ Deploy to GitHub Pages
4. ✅ Configure custom domain (subdomain.happyk.au)
5. ✅ Update DNS settings

**Almost there!** Just need the authentication sorted.
