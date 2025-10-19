# Next Improvements & Known Issues

**Last Updated**: 2025-10-19

## Known Bugs to Fix

### 1. Auto-announcements Not Working
- **Issue**: Announcements scheduled every 3 hours are not being sent automatically
- **Impact**: Manual intervention required for timed announcements
- **Priority**: High
- **Location**: Likely in database cron job or edge function scheduling
- **Files to Check**:
  - Database cron jobs
  - Edge functions for scheduled announcements
  - `supabase/functions/` directory

### 2. Cloudflare Turnstile Notification Persistence
- **Issue**: When Turnstile verification fails and then succeeds, the error notification "Please complete verification challenge" doesn't disappear
- **Impact**: User confusion, looks like login is still broken even after success
- **Priority**: Medium
- **Location**: `frontend/src/admin/admin-login.js`
- **Fix Needed**: Clear error notifications on successful verification

## Planned Improvements

### 1. Auto-dismiss Notifications (30 min timeout)
- **Feature**: All nudges and admin announcements should auto-dismiss after 30 minutes if not manually closed
- **Priority**: Medium
- **Implementation**:
  - Add timestamp to notification display
  - Set `setTimeout()` for 30 minutes (1800000ms)
  - Auto-remove notification from DOM after timeout
- **Files to Modify**:
  - `frontend/src/shared/ui-helpers.js` - notification system
  - Any notification rendering functions

### 2. Climber Stats Hover Card
- **Feature**: Hover over climber name in results to show comprehensive stats
- **Priority**: High
- **Stats to Display**:
  - Grades climbed (by discipline: Boulder/Sport/Trad)
  - Total repeats by discipline
  - Total ticks by discipline
  - Hardest sends per discipline
  - Average grade climbed
  - Points breakdown
- **Implementation**:
  - Create tooltip/popover component
  - Fetch detailed climber stats on hover (or include in initial data)
  - Use CSS for hover trigger + positioning
- **Files to Create/Modify**:
  - `frontend/src/admin/admin-leaderboards.js` - add hover functionality
  - New component: `frontend/src/shared/climber-stats-tooltip.js`
  - Consider using `position: absolute` popover with arrow

### 3. Enhanced Admin Dashboard Stats
- **Feature**: Improve admin dashboard with better summary statistics
- **Current State**: Shows "best overall" team
- **Desired State**:
  - **Summary Stats Card**:
    - Total ticks across all climbers
    - Total points awarded
    - Total climbers registered
    - Total teams registered
    - Average ticks per climber
    - Average points per team
  - **Category Leaders Card** (replace "best overall"):
    - Masters Team Leader
    - Advanced Team Leader
    - Intermediate Team Leader
    - Recreational Team Leader
    - Display: Team name + current points
- **Priority**: Medium
- **Files to Modify**:
  - `frontend/src/admin/admin-dashboard.js`
  - May need new RPC functions in database for aggregated stats

## Technical Debt / Code Quality

### 1. Consider Caching for Performance
- Implement client-side caching for leaderboard data
- Reduce database queries on frequent refreshes
- Use `window.leaderboardData` more effectively

### 2. Error Handling Improvements
- Add better error boundaries
- Improve error messages shown to users
- Add retry logic for failed API calls

### 3. Accessibility Improvements
- Add ARIA labels to filter buttons
- Improve keyboard navigation for pagination
- Test with screen readers

## Completed (This Session)
- ✅ Unified results page (admin + team access)
- ✅ Pagination system (10 items per page)
- ✅ Filter synchronization (Special Awards + Game Rewards)
- ✅ Performance optimization (event delegation, memory leak fix)
- ✅ Role-based access control
- ✅ Bundle size reduction (380KB → 378KB)
