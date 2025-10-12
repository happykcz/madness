# Scoring Phase - Complete Specification

**Date**: 2025-10-12
**Competition Date**: Saturday, 18th October 2025, 6am-6pm (Western Australian Time)

## 🎨 UI/UX Design Changes

### Color Scheme Update
- **Background**: Change from `#fafbfc` → Light pink (e.g., `#fff5f7` or `#ffe6eb`)
- **Remove Blue**: Replace all blue colors in buttons/badges/links
- **Use Theme Colors**:
  - Primary: `#ff0046` (CAWA red/pink)
  - Secondary: TBD
  - Tertiary: TBD

### Files to Update:
- All page backgrounds
- Button styles (btn-secondary, btn-primary variants)
- Badge colors in admin dashboard
- Link colors

## 👥 Team & Climber Categories

### Climber Categories (Individual)
Based on hardest redpoint on rock:
- **Recreational**: Up to grade 19
- **Intermediate**: Grades 20-23
- **Advanced**: Grade 24+

### Team Categories
Based on stronger/older climber (NEW: Masters added):
- **Masters**: At least one member is 50+ OR both members are 45+
- **Recreational**: Both members are recreational
- **Intermediate**: One or both members are intermediate
- **Advanced**: One or both members are advanced

**Priority Order**: Masters > Advanced > Intermediate > Recreational

### Category Classification Logic
```
function classifyTeam(climber1, climber2):
  // Check Masters first
  if (climber1.age >= 50 OR climber2.age >= 50):
    return 'Masters'
  if (climber1.age >= 45 AND climber2.age >= 45):
    return 'Masters'

  // Get individual categories
  cat1 = classifyClimber(climber1)
  cat2 = classifyClimber(climber2)

  // Return highest category
  if (cat1 == 'Advanced' OR cat2 == 'Advanced'):
    return 'Advanced'
  if (cat1 == 'Intermediate' OR cat2 == 'Intermediate'):
    return 'Intermediate'
  return 'Recreational'
```

## ✏️ Team Editing

### Requirements
Admin needs ability to edit:
- ✅ Team name
- ✅ Team category (manual override)
- ✅ Climber 1: name, age, grade, category
- ✅ Climber 2: name, age, grade, category
- ❌ Team ID (not editable)
- ❌ Password (separate reset function)

### Implementation
- Add "Edit Team" button to team details page
- Form with all editable fields
- Re-calculate category on save (with manual override option)
- Update both `teams` and `climbers` tables

## 🎯 Scoring System

### Route Base Points
Each route has base points by grade (applies to sport, trad, boulders):
- Points assigned by grade (e.g., grade 19 = 100 pts, grade 24 = 200 pts)
- Routes with **0 points** = non-scoring routes (for navigation only)

### Trad Bonus
- **50% bonus** on base points for trad routes
- Example: 100 base points → 150 points on trad route

### Multiple Attempts (NEW RULE)
Each route can be scored multiple times by same climber:
- **1st tick**: 100% of points
- **2nd tick**: 75% of points
- **3rd tick**: 50% of points
- **4th tick**: 25% of points
- **5th+ tick**: 0% of points (no more scoring)

**Trad bonus applies to each tick**

Example:
- Route: 100 base points, trad
- 1st attempt: 100 × 1.5 × 1.00 = 150 points
- 2nd attempt: 100 × 1.5 × 0.75 = 112.5 points
- 3rd attempt: 100 × 1.5 × 0.50 = 75 points
- 4th attempt: 100 × 1.5 × 0.25 = 37.5 points
- 5th attempt: 0 points

### Team Scoring
- Team score = Sum of both climbers' points
- Each climber scores independently
- No limit on team total

### Games Scoring
- Each climber can score only **once** per game
- Score manually entered by admin
- Min/max values TBD (need admin config)

## 📊 Scoring Interface (Team Dashboard)

### Route Display
- Show all routes in groups (by area/sector)
- Display in specified order
- For each route show:
  - Route name
  - Grade
  - Type (sport/trad/boulder)
  - Base points
  - Score box for each climber

### Score Box Per Climber
- **Attempts visualization**: Pie chart or similar showing:
  - Number of attempts made
  - Points earned per attempt
  - Total points for this route
- **Quick action**: Tap to add new attempt

### Route Filtering
- By type: Sport | Trad | Boulder | All
- By grade band:
  - Recreational: ≤19
  - Intermediate: 20-23
  - Advanced: 24+
  - All
- **Hide zero-point routes**: Toggle option

### Zero-Point Routes
- Display with muted text/styling
- Clearly marked as "Navigation only" or "0 pts"
- Option to hide these routes (checkbox filter)

## ⏰ Competition Timing

### Main Scoring Window
- **Official**: Saturday, 18th October 2025
- **Time**: 6:00 AM - 6:00 PM (Western Australian Time)
- **Admin control**: Set start/end datetime
- **Same window for all competitors**

### Override Controls (Admin)
- **Open scoring early**: Button to enable scoring before start time
- **Extend scoring**: Button to keep scoring open after end time
- **Close scoring**: Button to end scoring manually
- **Status indicator**: Clear display of current window status

### Timer Display (Teams)
- Show time until start (if before window)
- Show time remaining (if during window)
- Show "Scoring closed" (if after window)

## 📈 Admin Results & Leaderboards

### Team Leaderboards
Filter by team category:
- Masters
- Advanced
- Intermediate
- Recreational

Display:
- Rank
- Team name
- Team members
- Total points
- Number of routes completed
- Real-time updates

### Individual Climber Leaderboards
Filter by climber category:
- Advanced
- Intermediate
- Recreational

Display:
- Rank
- Climber name
- Team
- Category
- Total points
- Number of routes completed

### Hardest Sends List
- Route name
- Grade
- Climber name
- Team
- Date/time of send
- Sort by grade (hardest first)

### Total Ticks (Sends) Lists
**By Climber**:
- Climber name
- Team
- Number of routes sent
- Total points

**By Team**:
- Team name
- Combined sends
- Total team points

### Real-time Updates
- Use Supabase Realtime subscriptions
- Auto-refresh when attempts added
- Live leaderboard updates

## 🔔 Leaderboard Nudges (Extra Feature)

### Requirements
- Show partial leaderboard to teams periodically
- Frequency: Every 3 hours
- Display: Modal or banner with:
  - "You are currently #X in your category"
  - Top 3 teams in their category (no names, just positions)
  - Motivational message

### Implementation Options
1. **Time-based**: Check every 3 hrs, show popup
2. **On page load**: If >3hrs since last view, show nudge
3. **Admin triggered**: Admin can send nudge manually

## 🗂️ Routes & Games

### Route Structure
```javascript
{
  id: UUID,
  route_id: 'R001',
  route_name: 'The Overhang',
  route_type: 'sport' | 'trad' | 'boulder',
  difficulty_grade: 22,
  base_points: 100,
  is_active: true,
  sector: 'Main Wall',
  sector_order: 1,
  created_at: timestamp
}
```

### ~60 routes total
- Organized by sectors/groups
- Ordered within each sector
- Mix of sport, trad, boulder

### Games
```javascript
{
  id: UUID,
  game_name: 'Speed Climbing',
  min_value: 0,
  max_value: 100,
  unit: 'seconds' | 'points' | etc,
  is_active: true
}
```

## 🚫 Privacy & Visibility

### Team View
- ✅ Own scores and attempts
- ✅ Own leaderboard position
- ✅ Periodic nudges (every 3hrs)
- ❌ Other teams' scores
- ❌ Full leaderboard
- ❌ Other teams' attempts

### Admin View
- ✅ All teams' scores
- ✅ All attempts
- ✅ Full leaderboards
- ✅ Real-time stats
- ✅ Export capabilities

## 📁 Database Schema Updates Needed

### Routes Table (Exists)
- Add `sector` field
- Add `sector_order` field
- Add `route_type` field (sport/trad/boulder)
- Add `is_active` field

### Attempts Table (Exists)
- Ensure `attempt_number` field (for multiple ticks)
- Add `points_earned` field (calculated)
- Add `tick_multiplier` field (100%, 75%, 50%, 25%)

### Games Table (New)
```sql
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
```

### Game Scores Table (New)
```sql
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  climber_id UUID REFERENCES climbers(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  recorded_by UUID REFERENCES auth.users(id), -- admin who entered it
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, climber_id) -- one score per climber per game
);
```

### Competition Settings Table (New)
```sql
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
  ('last_leaderboard_nudge', NULL);
```

## 📋 Implementation Phases

### Phase 1: Core Updates (Priority 1)
1. ✅ Update color scheme (backgrounds, buttons, badges)
2. ✅ Update category classification (add Masters)
3. ✅ Update scoring engine (new tick multipliers, trad bonus)
4. ✅ Add team editing functionality
5. ✅ Create database migrations

### Phase 2: Team Scoring UI (Priority 1)
1. Route list with filters
2. Score boxes with attempt visualization
3. Add attempt form
4. Real-time score updates
5. Timer/window status display

### Phase 3: Admin Results (Priority 1)
1. Team leaderboards by category
2. Individual leaderboards by category
3. Hardest sends list
4. Total ticks lists
5. Real-time updates

### Phase 4: Polish (Priority 2)
1. Leaderboard nudges
2. Games scoring interface
3. CSV export
4. Admin scoring window controls

## 🎯 Success Criteria

- ✅ Teams can view and score routes
- ✅ Multiple ticks work correctly with diminishing returns
- ✅ Trad bonus applies correctly
- ✅ Masters category works
- ✅ Teams see only their own scores
- ✅ Admin sees all leaderboards in real-time
- ✅ Colors match theme (no blue!)
- ✅ Competition window controls work
- ✅ Team editing works
