# Quarry Madness 2025 - Project Status
**Last Updated:** 2025-10-14
**Competition Date:** October 18, 2025 (6am-6pm AWST)

## ✅ COMPLETED FEATURES

### Team Interface
- ✅ Team authentication with Supabase
- ✅ Team dashboard (team info, members, scores)
- ✅ **Scoring page (fully functional)**:
  - Route list with filters (type, gradeband, hide zero-point)
  - Climber selection
  - Send logging with tick multipliers (100%→75%→50%→25%)
  - 4-wedge visual progress indicators
  - Delete last send functionality
  - Clean SVG icons (no emojis)
  - Bottom-right notifications
  - Team total score in header
  - Back to dashboard button

### Admin Interface
- ✅ Admin authentication
- ✅ Admin dashboard with navigation
- ✅ Team list view (all teams displayed)
- ✅ Team detail view
- ✅ Team editing:
  - ✅ Edit team name
  - ✅ Edit team category (dropdown selector)
  - ✅ Edit climber names, ages, categories, grades
- ✅ Leaderboard views:
  - ✅ Team categories (Masters, Advanced, Intermediate, Recreational)
  - ✅ Climber categories (Advanced, Intermediate, Recreational)
  - ✅ Hardest sends (Top 20)
  - ✅ Real-time ranking from database views
- ✅ Competition control interface:
  - ✅ View current status (open/closed, manual/scheduled)
  - ✅ Manual open/close buttons
  - ✅ Edit scoring window times

### Database
- ✅ 12 migrations applied (001-012)
- ✅ All core tables created
- ✅ RLS policies in place
- ✅ Views: climber_scores, team_scores
- ✅ Routes can have base_points = 0 (non-scoreable routes)

### Data Templates
- ✅ CSV template for teams/climbers (templates/teams_climbers_template.csv)
- ✅ CSV template for routes (templates/routes_template.csv)
- ✅ Import instructions (templates/IMPORT_INSTRUCTIONS.md)

## ❌ ABANDONED FEATURES
**Due to CORS/time constraints:**
- ❌ Password reset functionality
- ❌ Admin team creation interface (manual SQL upload instead)

## 🔧 TODO (Priority Order)

### Phase A: Essential Features ✅ COMPLETE
1. ✅ Create CSV templates (teams/climbers, routes)
2. ✅ Add team category editing to admin interface
3. ✅ Create leaderboard views
4. ✅ Competition control interface

### Phase B: UI/UX Polish
5. ⏳ Replace ALL remaining emojis with SVG icons
6. ⏳ Fix header button clutter (dropdown/subheader)
7. ⏳ Update color scheme

### Phase C: Database Cleanup
8. ⏳ Review for duplicate/unused tables

### Phase D: Bonus Games
10. ⏳ Implement bonus tracking

### Phase E: Advanced Features
11. ⏳ Leaderboard nudge system (3hr auto + admin manual trigger)

## 📋 KEY NOTES
- Manual data upload via SQL/CSV
- Leaderboard nudge needs BOTH automatic AND manual trigger
- Header needs UI cleanup (too crowded)
- Replace ALL emojis throughout app
