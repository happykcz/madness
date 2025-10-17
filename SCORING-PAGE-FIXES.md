# Scoring Page Improvements

## Changes Made

### 1. Sticky Climber Selection
**Problem**: Climbers had to scroll up and down to change selection while browsing routes.

**Solution**:
- Made the climber selection div sticky at the top of the page (`position: sticky; top: 0; z-index: 100`)
- Added scroll detection that makes the selection more compact when scrolled down
- When scrolled > 100px:
  - Hides the "Select Climber" header
  - Removes score details from buttons (shows only names)
  - Reduces button padding from 12px to 8px
- When scrolled back to top:
  - Restores full display with header and scores

**Files Modified**: [frontend/src/dashboard/scoring.js](frontend/src/dashboard/scoring.js)

### 2. Team Total Update After Logging Ascents
**Problem**: After logging an ascent, individual climber scores updated but the team total at the top remained stale.

**Solution**:
- Added `updateTeamTotal()` function that recalculates and updates the team total display
- Called `updateTeamTotal()` in `fetchFreshTeamData()` so it updates automatically after each ascent
- Team total now updates immediately after logging a send, matching the climber score updates

**Files Modified**: [frontend/src/dashboard/scoring.js](frontend/src/dashboard/scoring.js)

## Technical Details

### New Functions Added

1. **`updateTeamTotal()`**
   - Recalculates team total points and ascents from `teamData.climberScores`
   - Updates the `.subheader-left` element with new values

2. **`setupStickyScrollBehavior()`**
   - Adds scroll event listener to window
   - Toggles compact/full display based on scroll position
   - Uses 100px scroll threshold for switching modes

### Modified Functions

1. **`fetchFreshTeamData()`**
   - Now calls `updateTeamTotal()` after updating climber scores

2. **`renderScoring()`**
   - Calls `setupStickyScrollBehavior()` during initialization
   - Added `id="climber-selection-sticky"` to climber selection div
   - Added `id="climber-selection-header"` to header text
   - Added `data-climber-name` attribute to buttons for future use

## Testing Checklist

- [x] Build succeeds without errors
- [ ] Climber selection stays at top when scrolling
- [ ] Climber selection compacts when scrolled down > 100px
- [ ] Climber selection expands when scrolled back to top < 100px
- [ ] Team total updates immediately after logging an ascent
- [ ] Team total matches sum of individual climber scores

## Browser Compatibility

The changes use standard web APIs:
- `position: sticky` - Supported in all modern browsers
- `window.scrollY` / `window.pageYOffset` - Universal support
- `Element.style` manipulation - Standard DOM API

No additional dependencies required.
