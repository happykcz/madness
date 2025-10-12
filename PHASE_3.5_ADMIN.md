# Phase 3.5: Admin Interface

## 🎯 Overview
Build admin dashboard with team management, results viewing, and competition settings control.

---

## 📋 Features

### 1. Admin Authentication
- **URL**: `#/admin`
- **Admin user**: `admin@quarrymadness.local`
- **Default password**: `admin12qm` (can be changed)
- Uses existing `is_admin()` RLS function
- Separate from team login

### 2. Admin Team Registration
- Create new teams with auto-generated IDs (team_001, team_002, etc.)
- Default password: `12qm2025`
- Two climbers per team
- Auto-categorize team based on climber ages/grades
- Option to customize password per team
- Generate printable credential cards

### 3. Admin Results Dashboard
- View current leaderboard (all categories)
- Filter by category: Masters, Recreational, Intermediate, Advanced
- View individual team performance
- Export results to CSV
- Real-time updates during competition

### 4. Admin Competition Settings
- View current scoring window
- Create new scoring window
- Override start/end times for active window
- Deactivate/reactivate windows
- Team-specific overrides (extend time for specific teams)

---

## 🗄️ Database Schema Additions

### Admin Actions Audit Table
```sql
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  action_type VARCHAR(50) NOT NULL, -- 'create_team', 'reset_password', 'update_window', etc.
  target_id VARCHAR(100), -- team_id, window_id, etc.
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_user_id);
CREATE INDEX idx_admin_actions_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_created ON admin_actions(created_at);
```

### Team Password Management
```sql
-- Store team passwords (hashed by Supabase Auth automatically)
-- Track password resets
ALTER TABLE teams ADD COLUMN password_reset_count INTEGER DEFAULT 0;
ALTER TABLE teams ADD COLUMN last_password_reset TIMESTAMP WITH TIME ZONE;
```

### RLS Policies for Admin
```sql
-- Admins can view all teams
CREATE POLICY "Admins can view all teams"
ON teams FOR SELECT
TO authenticated
USING (
  auth_user_id = auth.uid()
  OR public.is_admin()
);

-- Admins can create teams
CREATE POLICY "Admins can create teams"
ON teams FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Admins can update teams
CREATE POLICY "Admins can update teams"
ON teams FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Similar for climbers, scoring_windows, etc.
```

---

## 🎨 Admin Interface Structure

```
frontend/src/admin/
├── admin-auth.js           # Admin login page
├── admin-dashboard.js      # Main admin hub
├── admin-teams.js          # Team management page
├── admin-results.js        # Leaderboard/results view
├── admin-settings.js       # Competition settings
└── admin-api.js            # Shared admin API calls
```

---

## 🔧 Implementation Plan

### Step 1: Database Setup (30 min)
- [x] Create admin_actions table
- [x] Add admin RLS policies
- [x] Create admin user in Supabase Auth
- [x] Test admin authentication

### Step 2: Admin Authentication (1 hour)
- [ ] Create admin login page (#/admin)
- [ ] Admin route guard
- [ ] Admin session management
- [ ] Redirect to admin dashboard on success

### Step 3: Admin Dashboard Hub (1 hour)
- [ ] Main navigation (Teams, Results, Settings)
- [ ] Quick stats (total teams, active window, current leader)
- [ ] Recent admin actions log

### Step 4: Team Registration Page (3 hours)
- [ ] Create team form with validation
- [ ] Auto-generate next team ID
- [ ] Create Supabase Auth user programmatically
- [ ] Insert team + climbers in transaction
- [ ] Display credentials after creation
- [ ] Print credentials button
- [ ] List all teams with search/filter

### Step 5: Results Dashboard (2 hours)
- [ ] Fetch leaderboard data from views
- [ ] Category filters
- [ ] Team detail drill-down
- [ ] Export to CSV
- [ ] Real-time updates (Supabase realtime subscriptions)

### Step 6: Competition Settings (2 hours)
- [ ] View current scoring windows
- [ ] Create new window form
- [ ] Update window times
- [ ] Team override management
- [ ] Audit trail display

**Total Estimated Time**: 9.5 hours

---

## 🚀 Let's Start!

Ready to begin? I'll build this in order:

1. **First**: Database setup + Admin auth
2. **Second**: Team registration (most important for you)
3. **Third**: Results dashboard
4. **Fourth**: Competition settings

Sound good?
