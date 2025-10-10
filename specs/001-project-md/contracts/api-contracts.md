# API Contracts: Supabase Client Interactions

**Phase 1 Output** | **Date**: 2025-10-10 | **Data Model**: [../data-model.md](../data-model.md)

## Overview

This document defines the standard patterns for interacting with Supabase from the frontend JavaScript code. All API interactions use the Supabase JS client with Row Level Security policies enforcing access control.

## Authentication Patterns

### Team Login

**User Story**: Team Authentication (Priority P1)

**Endpoint**: Supabase Auth `signInWithPassword`

**Request Pattern**:
```javascript
// src/auth/login.js
import { supabase } from '../supabase.js';

async function loginTeam(teamId, password, turnstileToken) {
  // Map team_id to internal email format
  const email = `${teamId}@internal.local`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      data: {
        turnstile_token: turnstileToken,
        role: 'team'
      }
    }
  });

  if (error) {
    throw new Error(`Login failed: ${error.message}`);
  }

  // Store role in session for UI routing
  sessionStorage.setItem('userRole', 'team');
  return data.user;
}
```

**Response**:
```javascript
{
  user: {
    id: "uuid-here",
    email: "team_001@internal.local",
    user_metadata: {
      role: "team",
      turnstile_token: "token-here"
    }
  },
  session: {
    access_token: "jwt-token",
    refresh_token: "refresh-token"
  }
}
```

**Error Handling**:
- Invalid credentials: `error.message === "Invalid login credentials"`
- Rate limiting: `error.message === "Email rate limit exceeded"`
- Turnstile failure: Handled client-side before API call

### Admin Login

**User Story**: Administrator Competition Control (Priority P1)

**Request Pattern**:
```javascript
async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      data: { role: 'admin' }
    }
  });

  if (error) throw new Error(`Admin login failed: ${error.message}`);

  // Verify admin role exists in database
  const { data: adminData, error: adminError } = await supabase
    .from('administrators')
    .select('id, name')
    .eq('auth_user_id', data.user.id)
    .single();

  if (adminError || !adminData) {
    await supabase.auth.signOut();
    throw new Error('Not authorized as administrator');
  }

  sessionStorage.setItem('userRole', 'admin');
  return { user: data.user, admin: adminData };
}
```

### Session Management

**Check Active Session**:
```javascript
async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = '/login';
  }
  if (event === 'TOKEN_REFRESHED') {
    console.log('Session refreshed');
  }
});
```

## Team User Patterns

### Fetch Routes for Selection

**User Story**: Team Climb Logging (Priority P1)

**Query Pattern**:
```javascript
// src/shared/route-selector.js
async function fetchRoutes() {
  const { data, error } = await supabase
    .from('routes')
    .select('id, sector, name, grade, gear_type, base_points')
    .order('sector', { ascending: true })
    .order('grade_numeric', { ascending: true });

  if (error) throw new Error(`Failed to fetch routes: ${error.message}`);

  // Group by sector for UI display
  const routesBySector = data.reduce((acc, route) => {
    if (!acc[route.sector]) acc[route.sector] = [];
    acc[route.sector].push(route);
    return acc;
  }, {});

  return routesBySector;
}
```

**Response**:
```javascript
{
  "Cave Sector": [
    {
      id: "uuid-1",
      sector: "Cave Sector",
      name: "Dark Side of the Moon",
      grade: "18",
      gear_type: "sport",
      base_points: 12
    },
    // ... more routes
  ],
  "Wall Sector": [...]
}
```

### Log Ascent

**User Story**: Team Climb Logging (Priority P1)

**Query Pattern**:
```javascript
// src/team/ascent-logger.js
async function logAscent(climberId, routeId) {
  // Calculate points using database function
  const { data: pointsData, error: calcError } = await supabase
    .rpc('calculate_ascent_points', {
      p_climber_id: climberId,
      p_route_id: routeId
    });

  if (calcError) throw new Error(`Points calculation failed: ${calcError.message}`);

  const pointsEarned = pointsData;

  // Insert ascent record
  const { data, error } = await supabase
    .from('ascents')
    .insert({
      climber_id: climberId,
      route_id: routeId,
      points_earned: pointsEarned,
      repeat_count: await getRepeatCount(climberId, routeId)
    })
    .select()
    .single();

  if (error) {
    // Handle RLS policy violations
    if (error.code === '42501') {
      throw new Error('Scoring window is closed. Contact admin for override.');
    }
    throw new Error(`Failed to log ascent: ${error.message}`);
  }

  return data;
}

async function getRepeatCount(climberId, routeId) {
  const { count, error } = await supabase
    .from('ascents')
    .select('*', { count: 'exact', head: true })
    .eq('climber_id', climberId)
    .eq('route_id', routeId);

  if (error) throw error;
  return (count || 0) + 1;
}
```

**Response**:
```javascript
{
  id: "ascent-uuid",
  climber_id: "climber-uuid",
  route_id: "route-uuid",
  team_id: "team-uuid",
  logged_at: "2025-10-10T14:30:00Z",
  points_earned: 18,  // 12 base * 1.5 trad bonus
  repeat_count: 1
}
```

**Error Codes**:
- `42501`: RLS policy violation (outside scoring window without override)
- `23503`: Foreign key violation (invalid climber_id or route_id)

### Fetch Team Score

**User Story**: Team Climb Logging (Priority P1)

**Query Pattern**:
```javascript
// src/team/score-display.js
async function fetchTeamScore(teamId) {
  const { data, error } = await supabase
    .from('team_scores')
    .select('*')
    .eq('team_id', teamId)
    .single();

  if (error) throw new Error(`Failed to fetch score: ${error.message}`);
  return data;
}

// Real-time score updates
function subscribeToScoreUpdates(teamId, callback) {
  const subscription = supabase
    .channel('team-ascents')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'ascents',
        filter: `team_id=eq.${teamId}`
      },
      (payload) => {
        // Refetch team score when new ascent logged
        fetchTeamScore(teamId).then(callback);
      }
    )
    .subscribe();

  return subscription;
}
```

**Response**:
```javascript
{
  team_id: "team-uuid",
  team_code: "team_001",
  team_name: "The Crushers",
  category: "advanced",
  total_points: 245,
  route_points: 225,
  bonus_points: 20,
  total_ascents: 18
}
```

### Fetch Climber Scores (Team View)

**Query Pattern**:
```javascript
async function fetchCliamberScores(teamId) {
  const { data, error } = await supabase
    .from('climber_scores')
    .select('*')
    .eq('team_id', teamId)
    .order('total_points', { ascending: false });

  if (error) throw error;
  return data;
}
```

**Response**:
```javascript
[
  {
    climber_id: "uuid-1",
    name: "Alice Climber",
    team_id: "team-uuid",
    category: "advanced",
    redpoint_grade: 25,
    total_points: 130,
    hardest_send: 22,
    unique_routes_climbed: 12
  },
  {
    climber_id: "uuid-2",
    name: "Bob Climber",
    team_id: "team-uuid",
    category: "intermediate",
    redpoint_grade: 21,
    total_points: 115,
    hardest_send: 20,
    unique_routes_climbed: 10
  }
]
```

### Log Bonus Game Points

**User Story**: Bonus Games Tracking (Priority P2)

**Query Pattern**:
```javascript
// src/team/bonus-logger.js
async function logBonusPoints(climberId, bonusGameId) {
  // Check if climber already earned this bonus
  const { data: existing, error: checkError } = await supabase
    .from('bonus_entries')
    .select('id')
    .eq('climber_id', climberId)
    .eq('bonus_game_id', bonusGameId)
    .maybeSingle();

  if (checkError) throw checkError;
  if (existing) {
    throw new Error('Climber already earned points for this bonus game');
  }

  // Get bonus game points
  const { data: game, error: gameError } = await supabase
    .from('bonus_games')
    .select('points')
    .eq('id', bonusGameId)
    .eq('is_active', true)
    .single();

  if (gameError || !game) {
    throw new Error('Bonus game not found or inactive');
  }

  // Insert bonus entry
  const { data, error } = await supabase
    .from('bonus_entries')
    .insert({
      climber_id: climberId,
      bonus_game_id: bonusGameId,
      points_awarded: game.points
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Duplicate bonus entry (unique constraint violation)');
    }
    throw new Error(`Failed to log bonus: ${error.message}`);
  }

  return data;
}
```

### Fetch Active Bonus Games

**Query Pattern**:
```javascript
async function fetchActiveBonusGames() {
  const { data, error } = await supabase
    .from('bonus_games')
    .select('id, name, points')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

## Admin User Patterns

### Upload Routes (Bulk Insert)

**User Story**: Pre-Competition Setup (Priority P2)

**Query Pattern**:
```javascript
// src/admin/route-upload.js
async function uploadRoutes(routesArray) {
  // routesArray: [{ sector, name, grade, gear_type }, ...]

  // Transform to include calculated fields
  const routesWithPoints = routesArray.map(route => ({
    ...route,
    grade_numeric: parseGradeToNumeric(route.grade),
    base_points: calculateBasePoints(route.grade)
  }));

  // Batch insert (upsert to allow re-upload)
  const { data, error } = await supabase
    .from('routes')
    .upsert(routesWithPoints, {
      onConflict: 'sector,name',  // Requires unique constraint
      ignoreDuplicates: false
    })
    .select();

  if (error) throw new Error(`Route upload failed: ${error.message}`);
  return data;
}

function parseGradeToNumeric(grade) {
  // Convert "18" → 18, "V3" → 103 (offset for boulders)
  if (grade.startsWith('V')) {
    return 100 + parseInt(grade.substring(1));
  }
  return parseInt(grade);
}

function calculateBasePoints(grade) {
  const numeric = parseGradeToNumeric(grade);

  if (numeric >= 100) {  // Boulder
    const vGrade = numeric - 100;
    if (vGrade <= 2) return 8;
    if (vGrade <= 4) return 16;
    return 20;
  }

  // Rope climbing
  if (numeric <= 14) return 5;
  if (numeric <= 17) return 8;
  if (numeric <= 20) return 12;
  if (numeric <= 22) return 16;
  return 20;
}
```

### Register Teams

**User Story**: Pre-Competition Setup (Priority P2)

**Query Pattern**:
```javascript
// src/admin/team-registration.js
async function registerTeam(teamData) {
  // teamData: {
  //   team_id: "team_001",
  //   team_name: "The Crushers",
  //   password: "secure-password",
  //   climbers: [
  //     { name: "Alice", age: 28, redpoint_grade: 25 },
  //     { name: "Bob", age: 32, redpoint_grade: 21 }
  //   ]
  // }

  // Calculate team category
  const category = calculateTeamCategory(teamData.climbers);

  // Create Supabase auth user
  const email = `${teamData.team_id}@internal.local`;
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: teamData.password,
    email_confirm: true,
    user_metadata: { role: 'team' }
  });

  if (authError) throw new Error(`Auth creation failed: ${authError.message}`);

  // Insert team record
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      team_id: teamData.team_id,
      team_name: teamData.team_name,
      category,
      auth_user_id: authData.user.id
    })
    .select()
    .single();

  if (teamError) throw new Error(`Team creation failed: ${teamError.message}`);

  // Insert climbers
  const climbers = teamData.climbers.map(c => ({
    team_id: team.id,
    name: c.name,
    age: c.age,
    redpoint_grade: c.redpoint_grade,
    category: calculateClimberCategory(c.redpoint_grade),
    auth_user_id: authData.user.id
  }));

  const { data: climbersData, error: climbersError } = await supabase
    .from('climbers')
    .insert(climbers)
    .select();

  if (climbersError) throw new Error(`Climber creation failed: ${climbersError.message}`);

  return { team, climbers: climbersData };
}

function calculateTeamCategory(climbers) {
  const ages = climbers.map(c => c.age);
  const grades = climbers.map(c => c.redpoint_grade);

  // Masters: one 50+ OR both 45+
  if (ages.some(a => a >= 50) || ages.every(a => a >= 45)) {
    return 'masters';
  }

  // Otherwise by stronger climber's grade
  const maxGrade = Math.max(...grades);
  if (maxGrade >= 24) return 'advanced';
  if (maxGrade >= 20) return 'intermediate';
  return 'recreational';
}

function calculateClimberCategory(redpointGrade) {
  if (redpointGrade >= 24) return 'advanced';
  if (redpointGrade >= 20) return 'intermediate';
  return 'recreational';
}
```

### Start Scoring Window

**User Story**: Administrator Competition Control (Priority P1)

**Query Pattern**:
```javascript
// src/admin/competition-control.js
async function startScoringWindow() {
  // Check for existing active window
  const { data: existing, error: checkError } = await supabase
    .from('scoring_windows')
    .select('id')
    .is('ended_at', null)
    .maybeSingle();

  if (checkError) throw checkError;
  if (existing) {
    throw new Error('Scoring window already active');
  }

  // Create new window
  const { data, error } = await supabase
    .from('scoring_windows')
    .insert({
      started_at: new Date().toISOString(),
      created_by: (await supabase.auth.getUser()).data.user.id
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to start window: ${error.message}`);
  return data;
}
```

### End Scoring Window

**Query Pattern**:
```javascript
async function endScoringWindow() {
  const { data, error } = await supabase
    .from('scoring_windows')
    .update({ ended_at: new Date().toISOString() })
    .is('ended_at', null)
    .select()
    .single();

  if (error) throw new Error(`Failed to end window: ${error.message}`);
  if (!data) throw new Error('No active scoring window found');
  return data;
}
```

### Check Scoring Window Status

**Query Pattern**:
```javascript
async function getScoringWindowStatus() {
  const { data, error } = await supabase
    .from('scoring_windows')
    .select('id, started_at, ended_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { status: 'not_started' };

  const now = new Date();
  const started = new Date(data.started_at);
  const ended = data.ended_at ? new Date(data.ended_at) : null;

  if (ended && now > ended) {
    return { status: 'ended', window: data };
  }
  if (now >= started && (!ended || now <= ended)) {
    return { status: 'active', window: data };
  }
  return { status: 'scheduled', window: data };
}
```

### Grant Team Override

**User Story**: Admin Override Capabilities (Priority P3)

**Query Pattern**:
```javascript
// src/admin/override-manager.js
async function grantOverride(teamId, reason) {
  const { data, error } = await supabase
    .from('team_overrides')
    .insert({
      team_id: teamId,
      is_active: true,
      granted_by: (await supabase.auth.getUser()).data.user.id,
      reason
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Team already has an active override');
    }
    throw new Error(`Failed to grant override: ${error.message}`);
  }

  return data;
}

async function revokeOverride(teamId) {
  const { data, error } = await supabase
    .from('team_overrides')
    .update({ is_active: false })
    .eq('team_id', teamId)
    .eq('is_active', true)
    .select()
    .single();

  if (error) throw new Error(`Failed to revoke override: ${error.message}`);
  if (!data) throw new Error('No active override found for team');
  return data;
}
```

### Fetch Leaderboards

**User Story**: Administrator Competition Control (Priority P1)

**Query Pattern**:
```javascript
// src/admin/leaderboards.js
async function fetchCategoryLeaderboard(category) {
  const { data, error } = await supabase
    .from('team_scores')
    .select('*')
    .eq('category', category)
    .order('total_points', { ascending: false })
    .order('team_code', { ascending: true });  // Tiebreaker

  if (error) throw error;
  return data;
}

async function fetchHardestSendLeaderboard() {
  const { data, error } = await supabase
    .from('hardest_send_leaderboard')
    .select('*')
    .limit(10);

  if (error) throw error;
  return data;
}

async function fetchAllLeaderboards() {
  const categories = ['masters', 'recreational', 'intermediate', 'advanced'];

  const results = await Promise.all([
    ...categories.map(cat => fetchCategoryLeaderboard(cat)),
    fetchHardestSendLeaderboard()
  ]);

  return {
    masters: results[0],
    recreational: results[1],
    intermediate: results[2],
    advanced: results[3],
    hardest_send: results[4]
  };
}
```

### Create Bonus Game

**User Story**: Bonus Games Tracking (Priority P2)

**Query Pattern**:
```javascript
async function createBonusGame(name, points) {
  const { data, error } = await supabase
    .from('bonus_games')
    .insert({
      name,
      points,
      is_active: true,
      created_by: (await supabase.auth.getUser()).data.user.id
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create bonus game: ${error.message}`);
  return data;
}

async function deactivateBonusGame(gameId) {
  const { data, error } = await supabase
    .from('bonus_games')
    .update({ is_active: false })
    .eq('id', gameId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

## Error Handling Standards

### Common Error Codes

| Code | Meaning | Handling |
|------|---------|----------|
| `42501` | RLS policy violation | Show "Access denied" or "Scoring window closed" |
| `23505` | Unique constraint violation | Show "Duplicate entry" with context |
| `23503` | Foreign key violation | Show "Invalid reference" (shouldn't happen with UI) |
| `PGRST116` | No rows returned from single() | Handle gracefully, show "Not found" |

### Error Handling Pattern

```javascript
async function apiCall() {
  try {
    const { data, error } = await supabase.from('table').select();

    if (error) {
      // Log error for debugging
      console.error('Supabase error:', error);

      // User-friendly message
      switch (error.code) {
        case '42501':
          throw new Error('You do not have permission to perform this action');
        case '23505':
          throw new Error('This record already exists');
        default:
          throw new Error(`Operation failed: ${error.message}`);
      }
    }

    return data;
  } catch (err) {
    // Show error to user (toast notification, alert, etc.)
    showErrorNotification(err.message);
    throw err;
  }
}
```

## Performance Optimization

### Caching Strategy

```javascript
// Cache routes (static data) in memory
let routesCache = null;

async function getRoutes() {
  if (routesCache) return routesCache;

  const routes = await fetchRoutes();
  routesCache = routes;
  return routes;
}

// Invalidate cache on admin route upload
function invalidateRoutesCache() {
  routesCache = null;
}
```

### Batching Requests

```javascript
// Fetch team data in parallel
async function fetchTeamDashboardData(teamId) {
  const [teamScore, climberScores, activeBonusGames] = await Promise.all([
    fetchTeamScore(teamId),
    fetchClimberScores(teamId),
    fetchActiveBonusGames()
  ]);

  return { teamScore, climberScores, activeBonusGames };
}
```

## Next Steps

With API contracts defined, the next phase involves:
1. Creating the quickstart guide for local development
2. Implementing actual database schema migration file
3. Building frontend modules following these API patterns
