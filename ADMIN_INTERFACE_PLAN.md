# Admin Interface - Team Management System

## 🎯 Purpose
Provide admins with a simple CRUD interface to manage teams, reset passwords, and handle credentials without touching Supabase directly.

## 🔐 Authentication Approach

### Admin Login
- URL: `#/admin` (separate from team login)
- Uses same Supabase Auth with special admin check
- Admin user: `admin@quarrymadness.local`
- Default password: `12qm2025` (can be changed)

### Admin Detection
Uses the `is_admin()` function already in your RLS policies:
```sql
-- Already exists in 002_rls_policies.sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email FROM auth.users
    WHERE id = auth.uid()
  ) = 'admin@quarrymadness.local';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📋 Features Overview

### 1. Team List View (Main Dashboard)
```
┌─────────────────────────────────────────────────────────────┐
│ 🏆 Quarry Madness - Admin Dashboard                        │
│                                                   [Sign Out] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [+ Create New Team]  [📤 Bulk Upload CSV]  [🔄 Refresh]   │
│                                                              │
│  🔍 Search: [____________]  Category: [All ▼]               │
│                                                              │
├──────┬────────────────┬──────────────┬──────────┬──────────┤
│ ID   │ Team Name      │ Category     │ Members  │ Actions  │
├──────┼────────────────┼──────────────┼──────────┼──────────┤
│ 001  │ Test Alpha     │ Intermediate │ 2        │ [View]   │
│      │                │              │          │ [Edit]   │
│      │                │              │          │ [Reset]  │
│ 002  │ Boulder Bros   │ Advanced     │ 2        │ [View]   │
│ 003  │ Climbing Cats  │ Recreational │ 2        │ [View]   │
└──────┴────────────────┴──────────────┴──────────┴──────────┘

Total Teams: 3 | Active: 3 | Inactive: 0
```

### 2. Create Team Form
```
┌─────────────────────────────────────────────┐
│ Create New Team                             │
├─────────────────────────────────────────────┤
│                                             │
│ Team ID:     [team_004] (auto-generated)    │
│ Team Name:   [________________]             │
│ Category:    [Intermediate ▼]               │
│                                             │
│ Password:    [12qm2025] (default)           │
│              [Generate Random]              │
│                                             │
│ ──── Climber 1 ────                        │
│ Name:        [________________]             │
│ Age:         [__]                           │
│ Grade:       [__] (Ewbank 10-35)            │
│                                             │
│ ──── Climber 2 ────                        │
│ Name:        [________________]             │
│ Age:         [__]                           │
│ Grade:       [__]                           │
│                                             │
│              [Cancel]  [Create Team]        │
└─────────────────────────────────────────────┘
```

### 3. Team Details View
```
┌─────────────────────────────────────────────┐
│ Team Details - team_001                     │
├─────────────────────────────────────────────┤
│                                             │
│ 🆔 Login Credentials                        │
│ ├─ Team ID:       team_001                  │
│ ├─ Password:      ••••••••  [Show] [Reset]  │
│ └─ Login URL:     https://.../#/login       │
│                   [📋 Copy Credentials]      │
│                                             │
│ 📊 Team Information                         │
│ ├─ Team Name:     Test Team Alpha           │
│ ├─ Category:      Intermediate              │
│ ├─ Total Points:  0                         │
│ ├─ Total Ascents: 0                         │
│ └─ Created:       2025-10-10                │
│                                             │
│ 👥 Team Members                             │
│ ├─ Alice Climber (30, Grade 22)            │
│ │  └─ Points: 0 | Ascents: 0               │
│ └─ Bob Climber (28, Grade 20)              │
│    └─ Points: 0 | Ascents: 0               │
│                                             │
│              [Edit Team]  [Back to List]    │
└─────────────────────────────────────────────┘
```

### 4. Reset Password Modal
```
┌───────────────────────────────────┐
│ Reset Password - team_001         │
├───────────────────────────────────┤
│                                   │
│ New Password:                     │
│ ○ Default (12qm2025)              │
│ ○ Custom: [____________]          │
│ ○ Generate Random                 │
│                                   │
│ ⚠️ This will invalidate the       │
│    team's current session         │
│                                   │
│     [Cancel]  [Reset Password]    │
└───────────────────────────────────┘
```

### 5. Bulk Upload CSV
```
┌─────────────────────────────────────────────┐
│ Bulk Upload Teams                           │
├─────────────────────────────────────────────┤
│                                             │
│ 📄 CSV Format Required:                     │
│ team_name,climber1_name,climber1_age,       │
│ climber1_grade,climber2_name,climber2_age,  │
│ climber2_grade                              │
│                                             │
│ Example:                                    │
│ "Team Alpha",Alice,30,22,Bob,28,20          │
│ "Team Beta",Charlie,35,24,Diana,32,21       │
│                                             │
│ [Choose File] teams.csv        [Upload]     │
│                                             │
│ ✅ Preview (2 teams):                       │
│ ├─ Team Alpha (Intermediate)                │
│ │  └─ Generated ID: team_004                │
│ │  └─ Password: 12qm2025                    │
│ └─ Team Beta (Advanced)                     │
│    └─ Generated ID: team_005                │
│    └─ Password: 12qm2025                    │
│                                             │
│ [Download Credentials CSV]                  │
│              [Cancel]  [Create All Teams]   │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Technical Implementation

### Database Functions

#### 1. Admin Team Creation Function
```sql
-- Create team with auto-generated ID and auth user
CREATE OR REPLACE FUNCTION admin_create_team(
  p_team_name VARCHAR(100),
  p_category VARCHAR(20),
  p_password VARCHAR(100),
  p_climber1_name VARCHAR(100),
  p_climber1_age INTEGER,
  p_climber1_grade INTEGER,
  p_climber2_name VARCHAR(100),
  p_climber2_age INTEGER,
  p_climber2_grade INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_next_id INTEGER;
  v_team_id VARCHAR(50);
  v_team_uuid UUID;
  v_auth_user_id UUID;
  v_email VARCHAR(255);
BEGIN
  -- Only admins can call this
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: admin access required';
  END IF;

  -- Generate next team ID
  SELECT COALESCE(MAX(CAST(SUBSTRING(team_id FROM 6) AS INTEGER)), 0) + 1
  INTO v_next_id
  FROM teams
  WHERE team_id LIKE 'team_%';

  v_team_id := 'team_' || LPAD(v_next_id::TEXT, 3, '0');
  v_email := v_team_id || '@quarrymadness.local';

  -- Create auth user (requires admin extension or service role)
  -- This part needs to be done via Supabase Admin API from frontend
  -- For now, return the required data to create auth user client-side

  RETURN json_build_object(
    'team_id', v_team_id,
    'email', v_email,
    'password', p_password,
    'team_name', p_team_name,
    'category', p_category,
    'climbers', json_build_array(
      json_build_object(
        'name', p_climber1_name,
        'age', p_climber1_age,
        'grade', p_climber1_grade
      ),
      json_build_object(
        'name', p_climber2_name,
        'age', p_climber2_age,
        'grade', p_climber2_grade
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Admin Reset Password
```sql
-- Function to track password resets
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id),
  action_type VARCHAR(50) NOT NULL,
  target_team_id VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION log_admin_action(
  p_action_type VARCHAR(50),
  p_team_id VARCHAR(50),
  p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: admin access required';
  END IF;

  INSERT INTO admin_actions (admin_user_id, action_type, target_team_id, details)
  VALUES (auth.uid(), p_action_type, p_team_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Frontend Implementation

#### Admin Pages Structure
```
frontend/src/admin/
├── admin-login.js         # Admin authentication
├── admin-dashboard.js     # Main team list
├── team-create.js         # Create team form
├── team-detail.js         # View/edit team
├── team-bulk-upload.js    # CSV upload
└── admin-helpers.js       # Shared utilities
```

#### Key Features

**1. Supabase Admin API Integration**
Use Supabase Service Role key (server-side) to:
- Create auth users programmatically
- Reset passwords
- Manage user metadata

**Security**: Service role key should NEVER be in frontend code.
- Option A: Create serverless function (Supabase Edge Functions)
- Option B: Simple backend API endpoint
- Option C: Use Supabase Management API with proper CORS

**2. Auto-Generate Team IDs**
```javascript
async function generateNextTeamId() {
  const { data } = await supabase
    .from('teams')
    .select('team_id')
    .like('team_id', 'team_%')
    .order('team_id', { ascending: false })
    .limit(1)

  if (!data || data.length === 0) {
    return 'team_001'
  }

  const lastId = data[0].team_id
  const lastNumber = parseInt(lastId.replace('team_', ''))
  const nextNumber = lastNumber + 1
  return `team_${String(nextNumber).padStart(3, '0')}`
}
```

**3. Copy Credentials to Clipboard**
```javascript
function copyCredentials(teamId, password) {
  const text = `
Team Login Credentials
─────────────────────
Team ID:  ${teamId}
Password: ${password}
Login:    ${window.location.origin}/12qm25/#/login

Instructions:
1. Go to the login page
2. Enter your Team ID and Password
3. Complete verification
4. Click Sign In
  `.trim()

  navigator.clipboard.writeText(text)
  showToast('Credentials copied to clipboard!', 'success')
}
```

**4. CSV Upload Processing**
```javascript
async function processCsvUpload(file) {
  const text = await file.text()
  const rows = text.split('\n').slice(1) // Skip header

  const teams = rows.map(row => {
    const [teamName, c1Name, c1Age, c1Grade, c2Name, c2Age, c2Grade] = row.split(',')
    return {
      teamName: teamName.trim(),
      climbers: [
        { name: c1Name.trim(), age: parseInt(c1Age), grade: parseInt(c1Grade) },
        { name: c2Name.trim(), age: parseInt(c2Age), grade: parseInt(c2Grade) }
      ]
    }
  })

  return teams
}
```

---

## 🔒 Security Considerations

### RLS Policies for Admin Actions
```sql
-- Admin can read all teams
CREATE POLICY "Admins can view all teams"
ON teams FOR SELECT
TO authenticated
USING (public.is_admin());

-- Admin can create teams
CREATE POLICY "Admins can create teams"
ON teams FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Admin can update teams
CREATE POLICY "Admins can update teams"
ON teams FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Similar policies for climbers, admin_actions tables
```

### Audit Trail
All admin actions logged to `admin_actions` table:
- Team creation
- Password resets
- Team edits
- Bulk uploads

---

## 📦 Phase 3.5: Admin Interface Implementation Plan

### Task Breakdown

1. **Database Setup** (30 min)
   - Create `admin_actions` table
   - Add admin RLS policies
   - Create helper functions

2. **Admin Authentication** (1 hour)
   - Admin login page
   - Admin route guard
   - Session management

3. **Team List Dashboard** (2 hours)
   - Fetch and display teams
   - Search and filter
   - Navigate to detail/create

4. **Create Team Form** (2 hours)
   - Form validation
   - Auto-generate team ID
   - Create auth user + team + climbers
   - Error handling

5. **Team Detail View** (1.5 hours)
   - Display team info
   - Show credentials
   - Copy to clipboard
   - Edit mode

6. **Password Reset** (1 hour)
   - Reset password modal
   - Update auth user
   - Log admin action

7. **Bulk CSV Upload** (2 hours)
   - File upload
   - CSV parsing
   - Preview teams
   - Batch create
   - Download credentials

**Total Estimated Time**: 10 hours

---

## 🎯 Next Steps

**Option 1: Fix Login First** (Recommended)
1. Run [verify_test_team.sql](supabase/verify_test_team.sql)
2. Follow [LOGIN_TROUBLESHOOTING.md](LOGIN_TROUBLESHOOTING.md)
3. Get test login working
4. Then build admin interface

**Option 2: Build Admin Interface Now**
1. Skip test login for now
2. Build admin interface
3. Use admin interface to create properly configured teams
4. Test team login with admin-created teams

**Which would you prefer?**

I recommend Option 1 to ensure the auth flow works end-to-end before building more features on top.
