# Research: Quarry Madness Scorekeeper

**Phase 0 Output** | **Date**: 2025-10-10 | **Plan**: [plan.md](./plan.md)

## Overview

This document consolidates research findings for implementing the Quarry Madness Scorekeeper application. The system is a mobile-first web app for managing a climbing competition with real-time scoring, authentication, and admin controls.

## Technology Stack Decisions

### Frontend Framework: Vite + Vanilla JavaScript

**Decision**: Use Vite as the build tool with vanilla JavaScript (no framework like React/Vue)

**Rationale**:
- **Performance**: Vanilla JS eliminates framework overhead, critical for mobile performance targets (<2s score updates)
- **Simplicity**: The UI is relatively simple (forms, lists, tables) without complex state management needs
- **Bundle Size**: Smaller JavaScript payload improves load times on mobile networks
- **Vite Benefits**: Fast HMR during development, optimized production builds, native ES modules support
- **Team Expertise**: Vanilla JS is universally understood, no framework learning curve

**Alternatives Considered**:
- **React/Vue**: Rejected due to unnecessary complexity for this scope. The app has ~10 views and simple state that can be managed with vanilla JS and Supabase real-time subscriptions
- **Svelte**: Lighter than React/Vue but still adds compilation complexity for minimal benefit given the simple UI requirements

**Implementation Notes**:
- Use ES6 modules for code organization
- Leverage Vite's code-splitting for team vs admin routes
- Use native Web Components for reusable UI elements (route cards, score displays)

### Styling: Tailwind CSS

**Decision**: Use Tailwind CSS utility-first framework

**Rationale**:
- **Mobile-First**: Tailwind's responsive utilities align perfectly with mobile-first requirement (320px-768px)
- **Development Speed**: Utility classes enable rapid UI prototyping without writing custom CSS
- **Consistency**: Pre-defined spacing/color scales ensure visual consistency
- **Bundle Size**: PurgeCSS integration removes unused styles, keeping production bundle small
- **Dark Mode**: Built-in dark mode support (future enhancement)

**Alternatives Considered**:
- **Custom CSS**: Rejected due to slower development and harder maintenance
- **Bootstrap**: Rejected due to heavier default styling and less flexible responsive utilities

**Implementation Notes**:
- Configure Tailwind for mobile-first breakpoints (sm: 640px, md: 768px)
- Use `@apply` sparingly, prefer utility classes for maintainability
- Enable JIT mode for faster builds during development

### Backend: Supabase

**Decision**: Use Supabase (managed PostgreSQL + authentication + real-time)

**Rationale**:
- **All-in-One**: Combines database, authentication, and real-time subscriptions in one service
- **Row Level Security (RLS)**: Built-in PostgreSQL RLS enforces score privacy and admin-only access at database level
- **Real-Time Subscriptions**: WebSocket-based updates enable instant score updates without polling
- **Serverless**: No backend code to deploy or maintain, ideal for a one-day competition app
- **Cost**: Free tier supports 50 concurrent users and expected data volume
- **Developer Experience**: Auto-generated TypeScript types, excellent documentation

**Alternatives Considered**:
- **Firebase**: Rejected due to less flexible querying (NoSQL) and higher cost for relational data patterns
- **Custom REST API**: Rejected due to increased complexity (server deployment, auth implementation, WebSocket setup)
- **PocketBase**: Considered but rejected due to requiring self-hosting (adds operational burden)

**Implementation Notes**:
- Use Supabase Auth with custom team_id/password authentication
- Implement RLS policies to enforce:
  - Teams can only read their own data during competition
  - Teams can only write ascents during active scoring window
  - Admins can access all data and override time restrictions
- Use Supabase Realtime for score updates (subscribe to ascents table)
- Store Cloudflare Turnstile token in session metadata for bot protection

### Authentication: Supabase Auth + Cloudflare Turnstile

**Decision**: Use Supabase Auth for session management with Cloudflare Turnstile for bot protection

**Rationale**:
- **Supabase Auth**: Provides secure session tokens, password hashing (bcrypt), JWT-based authentication
- **Custom Credentials**: Supports custom team_id/password without requiring email
- **Turnstile**: Cloudflare's CAPTCHA alternative provides bot protection without UX friction
- **Integration**: Turnstile token can be verified server-side via Supabase Edge Functions or stored in metadata

**Alternatives Considered**:
- **Supabase Email Auth**: Rejected due to requirement for team_id (not email) as username
- **Magic Links**: Rejected due to competition time constraints (teams need immediate access)
- **reCAPTCHA**: Rejected in favor of Turnstile (better privacy, no Google dependency)

**Implementation Notes**:
- Create custom `teams` and `administrators` tables linked to Supabase auth.users
- Use Supabase signInWithPassword with team_id mapped to email field (e.g., `team_001@internal.local`)
- Embed Turnstile widget on login page, validate token before calling Supabase auth
- Store user role (team/admin) in auth.users metadata for RLS policy checks

### Deployment: GitHub Pages

**Decision**: Deploy static frontend to GitHub Pages

**Rationale**:
- **Zero Cost**: Free hosting for static sites
- **Simplicity**: Direct deployment from Git repository via GitHub Actions
- **Reliability**: GitHub's CDN provides high availability
- **HTTPS**: Automatic SSL certificate for custom domains
- **GitHub Integration**: Seamless with version control workflow

**Alternatives Considered**:
- **Vercel/Netlify**: Rejected as overkill for static site (GitHub Pages is sufficient)
- **Cloudflare Pages**: Considered but GitHub Pages chosen for simpler team workflow

**Implementation Notes**:
- Configure Vite to build with correct base path for GitHub Pages subdirectory
- Set up GitHub Actions workflow to build and deploy on push to main branch
- Use environment variables for Supabase credentials (stored in GitHub Secrets)

## Best Practices Research

### Supabase Row Level Security (RLS) Patterns

**Score Privacy Enforcement**:
```sql
-- Teams can only read their own data during competition
CREATE POLICY "Teams read own data"
ON ascents FOR SELECT
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM climbers WHERE team_id = ascents.team_id
  )
  AND NOT EXISTS (
    SELECT 1 FROM scoring_windows WHERE ended_at IS NULL OR ended_at > NOW()
  )
);

-- Admins can always read all data
CREATE POLICY "Admins read all"
ON ascents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM administrators WHERE auth_user_id = auth.uid()
  )
);
```

**Time-Gated Write Access**:
```sql
-- Teams can only write during active scoring window
CREATE POLICY "Teams insert during window"
ON ascents FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT auth_user_id FROM climbers WHERE id = NEW.climber_id
  )
  AND (
    EXISTS (
      SELECT 1 FROM scoring_windows
      WHERE started_at <= NOW() AND ended_at > NOW()
    )
    OR EXISTS (
      SELECT 1 FROM team_overrides
      WHERE team_id = NEW.team_id AND is_active = true
    )
  )
);
```

### Mobile Performance Optimization

**Critical Rendering Path**:
- Inline critical CSS for above-the-fold content
- Defer non-critical JavaScript
- Use `loading="lazy"` for images (if any)
- Minimize Time to Interactive (TTI) for <30s ascent logging

**Network Resilience**:
- Implement optimistic UI updates (show ascent immediately, confirm asynchronously)
- Queue ascent submissions if offline, sync when reconnected
- Use Supabase client's automatic retry logic for failed requests
- Store scoring window state in localStorage to handle page refreshes

**Data Fetching**:
- Fetch routes once on login, cache in memory (static list)
- Use Supabase real-time subscriptions for score updates (avoid polling)
- Implement pagination for leaderboards (50 teams max, but plan for scale)

### Vanilla JavaScript Architecture

**Module Organization**:
```javascript
// src/team/ascent-logger.js
export class AscentLogger {
  constructor(supabase, scoringEngine) {
    this.supabase = supabase;
    this.scoringEngine = scoringEngine;
  }

  async logAscent(climberId, routeId) {
    // Optimistic UI update
    const points = await this.scoringEngine.calculatePoints(climberId, routeId);
    this.updateUIOptimistically(points);

    // Submit to Supabase
    const { data, error } = await this.supabase
      .from('ascents')
      .insert({ climber_id: climberId, route_id: routeId });

    if (error) this.revertOptimisticUpdate();
  }

  updateUIOptimistically(points) { /* ... */ }
  revertOptimisticUpdate() { /* ... */ }
}
```

**State Management**:
- Use custom event system for cross-module communication
- Store global state (current user, scoring window) in singleton services
- Leverage Supabase real-time for reactive updates without client-side state management

### Cloudflare Turnstile Integration

**Frontend Implementation**:
```html
<!-- Add Turnstile script -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- Turnstile widget container -->
<div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>
```

**Validation Approach**:
1. User completes Turnstile challenge on login page
2. Capture Turnstile token from widget callback
3. Include token in Supabase auth request metadata
4. Optional: Verify token server-side via Supabase Edge Function before allowing login

**Best Practices**:
- Use "managed" mode for automatic widget rendering
- Handle Turnstile timeout/error states gracefully
- Store site key in environment variables, not hardcoded

### Testing Strategy

**Unit Tests (Vitest)**:
- Test scoring engine logic (grade to points, trad bonus, repeat penalties)
- Test category classifier (team/climber categorization rules)
- Test utility functions (date/time helpers, validators)

**E2E Tests (Playwright)**:
- Critical path: Team login → select route → log ascent → verify score update
- Admin workflows: Create scoring window → verify teams read-only outside window
- Edge cases: Concurrent ascent submissions, network failures

**Manual Testing Checklist**:
- Mobile devices (iOS Safari, Chrome Android) at various screen sizes
- Admin override functionality (difficult to automate)
- 12-hour endurance test (simulate competition duration)

## Integration Patterns

### Supabase Client Initialization

```javascript
// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10 // Throttle real-time updates
    }
  }
});
```

### Real-Time Score Updates

```javascript
// Subscribe to ascents for current team
const subscription = supabase
  .channel('team-scores')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'ascents',
      filter: `team_id=eq.${teamId}`
    },
    (payload) => {
      // Recalculate and update score display
      updateScoreDisplay(payload.new);
    }
  )
  .subscribe();
```

### GitHub Pages Deployment

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_TURNSTILE_SITE_KEY: ${{ secrets.VITE_TURNSTILE_SITE_KEY }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

## Open Questions Resolved

**Q: How to handle team_id authentication with Supabase's email-based auth?**
**A**: Map team_id to email field using internal domain (e.g., `team_001@internal.local`). Create custom signup flow that accepts team_id and generates corresponding email. Users never see the email, only their team_id.

**Q: How to enforce scoring window time restrictions at database level?**
**A**: Use PostgreSQL RLS policies that check current timestamp against `scoring_windows` table. Include `OR` clause for `team_overrides` table to allow admin override functionality.

**Q: How to prevent score visibility during competition?**
**A**: RLS policy on `ascents` and `teams` tables that checks if scoring window is still active. Block SELECT queries for other teams' data unless current timestamp > `scoring_windows.ended_at` OR user is admin.

**Q: How to handle route data upload (CSV/JSON)?**
**A**: Admin page with file input → parse CSV/JSON client-side → batch insert via Supabase client. Validate data structure before insertion. Use `upsert` to allow re-uploading corrected data.

**Q: How to calculate scores efficiently for real-time updates?**
**A**: Implement scoring logic client-side for immediate feedback (optimistic updates). Store calculated points in `ascents.points_earned` column for efficient server-side aggregation. Use PostgreSQL computed view or Supabase RPC function for leaderboard queries.

**Q: How to handle GitHub Pages SPA routing (404 on refresh)?**
**A**: Create `404.html` that redirects to `index.html` with route preserved in URL hash. Vite router handles hash-based routing. Alternative: Use GitHub Pages custom domain with Cloudflare for proper SPA routing.

## Technology Constraints

### Supabase Free Tier Limits
- **Database**: 500 MB storage (sufficient for ~100k ascent records)
- **API Requests**: Unlimited
- **Auth Users**: Unlimited
- **Realtime Connections**: 500 concurrent (exceeds 50 user requirement)
- **File Storage**: Not needed for this project

### GitHub Pages Limits
- **Bandwidth**: 100 GB/month (sufficient for competition traffic)
- **Build Time**: 10 minutes max (Vite builds complete in <1 minute)
- **File Size**: 100 MB max per file (frontend bundle will be <5 MB)

### Cloudflare Turnstile
- **Free Tier**: Unlimited verifications
- **Verification Success Rate**: ~99% (industry standard)
- **Mobile Compatibility**: Fully supported on iOS/Android browsers

## Performance Benchmarks

**Target Metrics** (from spec success criteria):
- Ascent logging: <30 seconds (3 taps or less)
- Score update latency: <2 seconds
- Concurrent users: 50 without degradation
- Uptime: 12 hours continuous

**Expected Performance** (based on technology stack):
- **Vite Build**: ~500 KB gzipped JavaScript bundle
- **Tailwind CSS**: ~20 KB gzipped after PurgeCSS
- **Supabase Latency**: ~100-300ms for database queries (cloud hosted)
- **Real-time Updates**: ~50-200ms WebSocket message delivery
- **GitHub Pages CDN**: <100ms HTML delivery (global CDN)

**Bottleneck Analysis**:
- **Primary Bottleneck**: Supabase database query latency for leaderboard generation
- **Mitigation**: Use materialized view or cached aggregates for category rankings
- **Secondary Bottleneck**: Mobile network latency at venue
- **Mitigation**: Optimistic UI updates, offline queueing for ascent submissions

## Security Considerations

**Authentication Security**:
- Passwords hashed with bcrypt (Supabase default)
- JWTs for session tokens with configurable expiration
- HTTP-only cookies for token storage (CSRF protection)

**Data Security**:
- RLS policies enforce access control at database level (defense in depth)
- Supabase anon key is public-safe (RLS prevents unauthorized data access)
- Sensitive operations (admin overrides) require admin role verification

**Frontend Security**:
- No sensitive credentials in frontend bundle (use env vars)
- Turnstile prevents automated bot submissions
- Input validation on client (UX) and server (security via RLS)

**Deployment Security**:
- GitHub Secrets for Supabase credentials (not committed to repo)
- HTTPS enforced by GitHub Pages (automatic SSL)
- Supabase connection uses TLS 1.2+

## Conclusion

The technology stack (Vite + vanilla JS + Tailwind + Supabase + GitHub Pages + Turnstile) is well-suited for the Quarry Madness Scorekeeper requirements:

- **Performance**: Meets <30s ascent logging and <2s score update targets
- **Scalability**: Supports 50 concurrent users within free tier limits
- **Security**: RLS enforces score privacy and time-gated access
- **Maintainability**: Vanilla JS and managed backend minimize operational complexity
- **Cost**: Entirely free (Supabase + GitHub Pages + Turnstile free tiers)
- **Developer Experience**: Modern tooling (Vite, Tailwind) with excellent documentation

Next phase: Data model design and API contracts.
