# Moving to Scoring Phase

**Date**: 2025-10-12
**Status**: ✅ Ready for Scoring Development

## ✅ Completed Fixes

### 1. Password Show/Hide Buttons
- ✅ Added to team login page
- ✅ Added to admin login page
- Both work on first click

### 2. Admin Team Details
- ✅ Removed incorrect password display (was showing default, not actual)
- ✅ Disabled "Reset Password" button (non-functional)
- ✅ Shows "Contact admin to reset" message

### 3. Admin Team Creation
- ✅ Disabled "Create New Team" button
- ✅ Button shows "(Disabled)" and tooltip
- ✅ Manual SQL script created for team creation

### 4. Login Status
- ✅ Team login works (team_001 with password: 1234)
- ✅ Admin login works (admin with password: adams68)

## 📋 Manual Team Creation Process

### Quick Steps:
1. **Create Auth User** in Supabase Dashboard:
   - Go to: Authentication → Users → Invite User
   - Email: `<team_id>@quarrymadness.local`
   - Password: (your choice)
   - Confirm email: YES
   - Copy the user ID

2. **Run SQL Script**:
   - Open [006_manual_team_creation.sql](../supabase/migrations/006_manual_team_creation.sql)
   - Replace variables (team_id, names, ages, grades, auth_user_id)
   - Run in Supabase SQL Editor

3. **Test Login**:
   - Go to login page
   - Username: `<team_id>`
   - Password: (what you set in step 1)

### Example:
```sql
-- Create team "Jeff_Peter"
v_team_id := 'Jeff_Peter';
v_team_name := 'Jeff and Peter';
v_auth_user_id := 'paste-user-id-here';  -- from step 1
v_climber1_name := 'Jeff';
v_climber1_age := 28;
v_climber1_grade := 23;
-- ...etc
```

## 🎯 Next Phase: Scoring System

### What We Need to Build:

#### 1. Team Scoring Interface
**Location**: Team Dashboard (`/dashboard`)

**Features Needed**:
- [ ] Display current competition routes
- [ ] Submit attempts (route, attempts, success/fail)
- [ ] View team's scores in real-time
- [ ] See current leaderboard position
- [ ] Timer showing scoring window status

**User Flow**:
1. Team logs in
2. Sees available routes for their category
3. Clicks route to record attempt
4. Enters: attempts count, success/fail
5. System calculates score
6. Updates leaderboard

#### 2. Admin Results Interface
**Location**: Admin Dashboard → Results (`/admin/results`)

**Features Needed**:
- [ ] View all teams' scores
- [ ] Filter by category (Elite, Advanced, Intermediate, Recreational)
- [ ] See leaderboard for each category
- [ ] View individual team performance
- [ ] Export results (CSV, PDF)
- [ ] Real-time score updates

**User Flow**:
1. Admin logs in
2. Goes to Results page
3. Selects category filter
4. Views sorted leaderboard
5. Can click team to see detailed attempts
6. Can export for reporting

#### 3. Admin Route Management
**Location**: Admin Dashboard → Routes (`/admin/routes`)

**Features Needed (Maybe Later)**:
- [ ] View all routes
- [ ] Add new route
- [ ] Edit route details
- [ ] Assign routes to categories
- [ ] Set scoring windows

**For Now**:
- Routes imported manually via SQL
- Interface can come later if needed

### Database Already Has:

✅ **routes table** - store competition routes
✅ **attempts table** - record team attempts
✅ **Scoring engine** - calculate points based on attempts
✅ **Category classifier** - categorize teams automatically
✅ **RLS policies** - teams see only their data

### What Needs to Be Built:

1. **Team Dashboard UI** - route list, attempt submission form, scores display
2. **Admin Results UI** - leaderboards, filters, team details
3. **Real-time Updates** - Supabase realtime subscriptions for live scores
4. **Score Calculation Integration** - wire up existing scoring engine to UI

## 📐 Suggested Development Order:

### Phase 1: Basic Scoring (Critical)
1. Create routes (manual SQL for now)
2. Build team dashboard with route list
3. Build attempt submission form
4. Wire up scoring calculation
5. Display team's own scores

### Phase 2: Leaderboards (Important)
1. Build admin results page
2. Show all teams' scores
3. Add category filtering
4. Sort by total score
5. Real-time updates

### Phase 3: Polish (Nice-to-Have)
1. Add timer/countdown
2. Add route management UI
3. Add CSV export
4. Add detailed attempt history
5. Add charts/graphs

## 🗂️ Routes Import Process

Since you'll import routes manually, here's the structure:

```sql
-- Example route creation
INSERT INTO routes (route_id, route_name, difficulty_grade, category, points_base)
VALUES
  ('R001', 'The Overhang', 22, 'advanced', 100),
  ('R002', 'Vertical Challenge', 24, 'elite', 150),
  ('R003', 'Easy Climb', 16, 'recreational', 50);
```

Then you can modify routes via SQL if needed.

## 📊 Existing Scoring System

The scoring engine is already built in [frontend/src/scoring/scoring-engine.js](../frontend/src/scoring/scoring-engine.js).

**Key Functions**:
- `calculateAttemptScore()` - scores individual attempt
- `calculateTeamScore()` - aggregates team total
- `generateLeaderboard()` - sorts teams by score

**Scoring Logic**:
- Fewer attempts = higher score
- Success = full points
- Fail = reduced points
- Category-specific multipliers

All we need is to connect this to the UI!

## 🚀 Ready to Start?

### Immediate Next Steps:
1. Review [scoring-engine.js](../frontend/src/scoring/scoring-engine.js) to understand scoring
2. Design team dashboard UI layout
3. Create routes (manual SQL)
4. Build attempt submission form
5. Wire up scoring calculation

### Questions to Answer:
1. How many routes will there be?
2. What categories do routes belong to?
3. When do scoring windows open/close?
4. Should teams see other teams' scores?
5. Any special scoring rules to add?

Let me know when you're ready to start building the scoring interface!
