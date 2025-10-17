# Leaderboard Updates Summary

## Changes Made

### 1. Removed Display Limits ✅

**Before**: Limited results displayed
- Hardest Sends: Top 20 only
- Most Ticks: Top 20 only
- Bonus Games: Top 5 per game only

**After**: Show all results
- Hardest Sends: All climbers displayed
- Most Ticks: All climbers displayed
- Bonus Games: All participants per game displayed

**Code Changes**:
- Removed `.limit(20)` from `fetchHardestSends()` query
- Removed `.limit(20)` from `fetchMostTicks()` query
- Removed `.limit(5)` from bonus games entries query

### 2. Clarified Bonus Points Inclusion ✅

Added clear messaging throughout all leaderboards:

#### Team Categories Leaderboard
- Added info banner: **"Points include: Route points + Bonus games"**

#### Climber Categories Leaderboard
- Added info banner: **"Points include: Route points + Bonus games"**

#### Hardest Sends Leaderboard
- Updated title: "Hardest Sends" (removed "Top 20")
- Added note: **"Total points include route points + bonus games"**

#### Most Ticks Leaderboard
- Updated title: **"Most Ticks (Route Ascents Only)"**
- Added clear distinction:
  - **Ticks count**: Route ascents only (bonus games not included)
  - **Total points**: Route points + bonus games
  - **Tiebreaker**: Lower category wins

#### Bonus Games Leaderboard
- No changes needed (already clear it's bonus games)

## What's Included Where

### Ticks Count (route_ascents)
- ❌ **Does NOT include** bonus games
- ✅ Only counts actual route ascents
- Used for "Most Ticks" ranking

### Total Points
- ✅ **Includes** route points from ascents
- ✅ **Includes** bonus game points
- Used for all category leaderboards and displayed in all leaderboards

### Summary Table

| Leaderboard | Ranking Metric | Points Display | Bonus Included? |
|-------------|----------------|----------------|-----------------|
| Team Categories | Total Points | Total Points | ✅ Yes |
| Climber Categories | Total Points | Total Points | ✅ Yes |
| Hardest Sends | Hardest Grade | Total Points | ✅ Yes (in points) |
| Most Ticks | Route Ascents | Total Points | ❌ No (in ticks), ✅ Yes (in points) |
| Bonus Games | Bonus Points | Bonus Points | ✅ Yes (by definition) |

## Database Views Reference

The data comes from these views:

### `team_scores` view
```sql
total_points = COALESCE(SUM(ascents.points), 0) + COALESCE(SUM(bonus_entries.points), 0)
```
✅ Includes both route points and bonus points

### `climber_scores` view
```sql
total_points = COALESCE(SUM(ascents.points), 0) + COALESCE(SUM(bonus_entries.points), 0)
route_ascents = COUNT(ascents.id)  -- Only route ascents, no bonus
```
✅ Total points include both
❌ Route ascents count only actual ascents

## Files Modified

- [frontend/src/admin/admin-leaderboards.js](frontend/src/admin/admin-leaderboards.js)

## Testing Checklist

- [ ] Team categories show all teams with correct total points
- [ ] Climber categories show all climbers with correct total points
- [ ] Hardest sends shows all climbers (not just 20)
- [ ] Most ticks shows all climbers (not just 20)
- [ ] Most ticks count is route ascents only (verify it doesn't change when bonus points awarded)
- [ ] Most ticks total points include bonus games
- [ ] Bonus games show all participants (not just 5)
- [ ] Info banners clearly explain what's included
- [ ] Mobile dropdown selector works for all tabs
