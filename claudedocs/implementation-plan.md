# Implementation Plan - Scoring Phase

**Created**: 2025-10-12
**Goal**: Build complete scoring system with team editing and admin leaderboards

## 📦 Deliverables Summary

1. **UI Color Scheme** - Light pink theme, no blue
2. **Category Logic** - Add Masters category
3. **Scoring Engine** - Multiple ticks with diminishing returns
4. **Team Editing** - Admin can edit all team details
5. **Team Scoring UI** - Route list, filters, attempt submission
6. **Admin Results** - Leaderboards by category, stats, real-time updates

## 🔄 Implementation Order

### Sprint 1: Foundation (Estimated: 2-3 hours)
**Goal**: Update core systems and styling

1. **Color Scheme Update** (30 min)
   - Update CSS variables
   - Change all backgrounds
   - Remove blue colors
   - Test across all pages

2. **Database Migrations** (45 min)
   - Add sectors to routes table
   - Create games tables
   - Create competition_settings table
   - Add attempt tracking fields
   - Migration scripts

3. **Category Logic Update** (30 min)
   - Update `category-classifier.js`
   - Add Masters category logic
   - Update all category displays
   - Test classification

4. **Scoring Engine Update** (45 min)
   - Update `scoring-engine.js`
   - Implement tick multipliers (100%, 75%, 50%, 25%, 0%)
   - Apply trad bonus correctly
   - Add tests

### Sprint 2: Team Editing (Estimated: 1-2 hours)
**Goal**: Admin can edit teams

1. **Edit Team UI** (60 min)
   - Add "Edit" button to team details
   - Create edit form with all fields
   - Handle form submission
   - Update both tables
   - Success/error handling

2. **Category Recalculation** (30 min)
   - Auto-calculate on save
   - Allow manual override
   - Show preview before saving

### Sprint 3: Team Scoring Interface (Estimated: 3-4 hours)
**Goal**: Teams can view routes and submit attempts

1. **Route Display** (90 min)
   - Fetch and display routes
   - Group by sector
   - Show route details (name, grade, type, points)
   - Style zero-point routes differently

2. **Route Filters** (45 min)
   - Type filter (sport/trad/boulder/all)
   - Grade filter (rec/int/adv/all)
   - Hide zero-point routes toggle
   - Filter persistence

3. **Attempt Submission** (60 min)
   - Click route to open form
   - Record attempt
   - Calculate points
   - Update display
   - Real-time feedback

4. **Score Visualization** (45 min)
   - Display attempts per route
   - Show points earned
   - Pie chart or progress indicator
   - Total score display

### Sprint 4: Admin Results (Estimated: 3-4 hours)
**Goal**: Admin sees all leaderboards and stats

1. **Team Leaderboards** (90 min)
   - Fetch all teams
   - Filter by category
   - Sort by score
   - Real-time updates
   - Display format

2. **Individual Leaderboards** (60 min)
   - Fetch all climbers
   - Filter by category
   - Sort by score
   - Display format

3. **Stats Pages** (90 min)
   - Hardest sends list
   - Total ticks by climber
   - Total ticks by team
   - Filters and sorting

### Sprint 5: Polish & Features (Estimated: 2-3 hours)
**Goal**: Add remaining features

1. **Competition Timing** (60 min)
   - Admin controls (start/stop/extend)
   - Timer display for teams
   - Window status indicators

2. **Leaderboard Nudges** (45 min)
   - 3-hour trigger logic
   - Modal/banner display
   - Dismiss functionality

3. **Games Scoring** (45 min)
   - Admin interface to enter scores
   - Display in team dashboard
   - Validation

## 📝 Detailed Task Breakdown

### Task 1: Color Scheme Update

**Files to Modify**:
- `frontend/src/main.css` - CSS variables
- `frontend/src/main.js` - Page backgrounds
- `frontend/src/auth/login.js` - Login page background
- `frontend/src/admin/admin-login.js` - Admin login background
- `frontend/src/admin/admin-dashboard.js` - Dashboard background
- `frontend/src/admin/admin-teams.js` - Teams page background

**Changes**:
```css
/* OLD */
:root {
  --bg-primary: #fafbfc;
  --color-blue: #0366d6;
}

/* NEW */
:root {
  --bg-primary: #fff5f7; /* light pink */
  --color-primary: #ff0046; /* CAWA red */
  --color-secondary: #444d56; /* dark gray */
  --color-tertiary: #6a737d; /* medium gray */
}
```

Replace all instances of:
- `#fafbfc` → `var(--bg-primary)` or `#fff5f7`
- Blue colors (`#0366d6`, etc.) → `var(--color-secondary)` or gray

### Task 2: Database Migrations

**File**: `supabase/migrations/007_scoring_updates.sql`

```sql
-- Add sectors to routes
ALTER TABLE routes
ADD COLUMN sector VARCHAR(100),
ADD COLUMN sector_order INTEGER DEFAULT 0,
ADD COLUMN route_type VARCHAR(20) DEFAULT 'sport',
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Add attempt tracking
ALTER TABLE attempts
ADD COLUMN tick_number INTEGER DEFAULT 1,
ADD COLUMN tick_multiplier DECIMAL(3,2) DEFAULT 1.00,
ADD COLUMN trad_bonus_applied BOOLEAN DEFAULT false;

-- Create games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_name VARCHAR(255) NOT NULL,
  description TEXT,
  min_value INTEGER,
  max_value INTEGER,
  unit VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_scores table
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  climber_id UUID REFERENCES climbers(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, climber_id)
);

-- Create competition_settings table
CREATE TABLE competition_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Initial settings
INSERT INTO competition_settings (setting_key, setting_value) VALUES
  ('scoring_window_start', '2025-10-18T06:00:00+08:00'),
  ('scoring_window_end', '2025-10-18T18:00:00+08:00'),
  ('scoring_enabled', 'false'),
  ('nudge_frequency_hours', '3');

-- Add RLS policies for new tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_settings ENABLE ROW LEVEL SECURITY;

-- Games: All can view active games
CREATE POLICY "Anyone can view active games"
ON games FOR SELECT
TO authenticated
USING (is_active = true);

-- Game scores: Teams see only their own
CREATE POLICY "Climbers see own game scores"
ON game_scores FOR SELECT
TO authenticated
USING (
  climber_id IN (
    SELECT id FROM climbers WHERE team_id IN (
      SELECT id FROM teams WHERE auth_user_id = auth.uid()
    )
  )
  OR public.is_admin()
);

-- Competition settings: All can read, admins can write
CREATE POLICY "Anyone can view settings"
ON competition_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can update settings"
ON competition_settings FOR UPDATE
TO authenticated
USING (public.is_admin());
```

### Task 3: Category Classifier Update

**File**: `frontend/src/shared/category-classifier.js`

Update `classifyTeam()` function:

```javascript
export function classifyTeam(climber1, climber2) {
  // Check Masters first (NEW)
  if (climber1.age >= 50 || climber2.age >= 50) {
    return 'masters'
  }
  if (climber1.age >= 45 && climber2.age >= 45) {
    return 'masters'
  }

  // Get individual categories
  const cat1 = classifyClimber(climber1)
  const cat2 = classifyClimber(climber2)

  // Return highest category
  if (cat1 === 'advanced' || cat2 === 'advanced') {
    return 'advanced'
  }
  if (cat1 === 'intermediate' || cat2 === 'intermediate') {
    return 'intermediate'
  }
  return 'recreational'
}

export function classifyClimber(climber) {
  const grade = climber.redpointGrade || climber.self_reported_grade

  if (grade >= 24) return 'advanced'
  if (grade >= 20) return 'intermediate'
  return 'recreational'
}
```

### Task 4: Scoring Engine Update

**File**: `frontend/src/scoring/scoring-engine.js`

Update scoring functions:

```javascript
// Get tick multiplier based on attempt number
function getTickMultiplier(tickNumber) {
  const multipliers = {
    1: 1.00,   // 100%
    2: 0.75,   // 75%
    3: 0.50,   // 50%
    4: 0.25,   // 25%
  }
  return multipliers[tickNumber] || 0  // 5+ = 0%
}

// Calculate points for a single attempt
export function calculateAttemptScore(route, attemptNumber, isTrad) {
  if (route.base_points === 0) return 0
  if (attemptNumber > 4) return 0  // No points after 4th tick

  const basePoints = route.base_points
  const tickMultiplier = getTickMultiplier(attemptNumber)
  const tradBonus = isTrad ? 1.5 : 1.0

  return basePoints * tickMultiplier * tradBonus
}

// Calculate total climber score across all routes
export function calculateClimberScore(attempts) {
  return attempts.reduce((total, attempt) => {
    return total + (attempt.points_earned || 0)
  }, 0)
}

// Calculate team score
export function calculateTeamScore(climber1Attempts, climber2Attempts) {
  return calculateClimberScore(climber1Attempts) +
         calculateClimberScore(climber2Attempts)
}
```

## ✅ Testing Checklist

### Color Scheme
- [ ] All pages have light pink background
- [ ] No blue colors visible
- [ ] Buttons use theme colors
- [ ] Badges use theme colors
- [ ] Links use theme colors

### Category Logic
- [ ] Masters: age 50+ or both 45+ works
- [ ] Advanced: grade 24+ works
- [ ] Intermediate: grades 20-23 works
- [ ] Recreational: <20 works
- [ ] Team category follows priority

### Scoring
- [ ] 1st tick = 100% points
- [ ] 2nd tick = 75% points
- [ ] 3rd tick = 50% points
- [ ] 4th tick = 25% points
- [ ] 5th+ tick = 0% points
- [ ] Trad bonus applies correctly
- [ ] Zero-point routes score 0

### Team Editing
- [ ] Can edit team name
- [ ] Can edit climber names
- [ ] Can edit ages
- [ ] Can edit grades
- [ ] Category recalculates
- [ ] Changes persist

### Team Scoring UI
- [ ] Routes display correctly
- [ ] Filters work
- [ ] Can submit attempts
- [ ] Scores update
- [ ] Real-time updates work

### Admin Results
- [ ] Leaderboards display
- [ ] Category filters work
- [ ] Real-time updates work
- [ ] Stats are accurate

## 📊 Progress Tracking

Use this checklist to track completion:

- [ ] Sprint 1: Foundation
  - [ ] Color scheme
  - [ ] Database migrations
  - [ ] Category logic
  - [ ] Scoring engine
- [ ] Sprint 2: Team Editing
- [ ] Sprint 3: Team Scoring UI
- [ ] Sprint 4: Admin Results
- [ ] Sprint 5: Polish & Features

## 🚀 Ready to Start

Estimated total time: **11-16 hours** of development

Start with Sprint 1 (Foundation) - this sets up everything else.

Which sprint would you like me to begin with?
