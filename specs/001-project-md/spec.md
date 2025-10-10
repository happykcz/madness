# Feature Specification: Quarry Madness Scorekeeper

**Feature Branch**: `001-project-md`
**Created**: 2025-10-10
**Status**: Draft
**Input**: User description: "@project.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Team Climb Logging (Priority: P1)

A team of two climbers attends the Quarry Madness competition. After completing a climb, one team member opens the web app on their smartphone, views the list of routes organized by sector, finds the route they just climbed, and logs it. The system immediately calculates and displays their updated team score, accounting for the route's grade, gear type (sport/trad/boulder), and any repeat penalties.

**Why this priority**: This is the core functionality of the entire system. Without the ability to log ascents and see scores, the competition cannot function. This delivers immediate value as an MVP.

**Independent Test**: Can be fully tested by logging in as a team, selecting routes from the list, submitting ascents, and verifying score calculations appear correctly. Delivers the fundamental value of tracking competition progress.

**Acceptance Scenarios**:

1. **Given** a team is logged in during the active scoring window, **When** they select a route and log an ascent, **Then** the system calculates base points from the grade, applies trad bonus if applicable, applies repeat penalties if this is not the first ascent of that route by that climber, and displays the updated team score
2. **Given** a climber logs the same route multiple times, **When** viewing their score, **Then** the first ascent shows 100% points, second shows 75%, third shows 25%, and fourth or more shows 0% points
3. **Given** a team logs a trad route graded 18, **When** the score is calculated, **Then** the base 12 points are multiplied by 1.5 to yield 18 points
4. **Given** two climbers on the same team each log different routes, **When** viewing the team score, **Then** both climbers' points are summed together

---

### User Story 2 - Team Authentication (Priority: P1)

Before the competition, each team receives a unique team ID and password. When arriving at the venue, team members open the web app, complete a human verification challenge (Cloudflare Turnstile), enter their team credentials, and gain access to the scoring interface showing their team's information.

**Why this priority**: Authentication is required before any scoring can occur. Without it, teams cannot access the system. This is a prerequisite for Story 1 and part of the essential MVP.

**Independent Test**: Can be tested by attempting login with valid and invalid credentials, verifying the human verification widget functions, and confirming successful login grants access to the scoring interface.

**Acceptance Scenarios**:

1. **Given** a user visits the web app, **When** they first see the login screen, **Then** a Cloudflare Turnstile or similar human verification widget is displayed
2. **Given** a user completes human verification, **When** they enter valid team ID and password, **Then** they are logged in and see the scoring interface
3. **Given** a user enters invalid credentials, **When** they attempt to log in, **Then** they see an error message and remain on the login screen
4. **Given** a user has not completed human verification, **When** they attempt to log in, **Then** they are prompted to complete verification first

---

### User Story 3 - Administrator Competition Control (Priority: P1)

The competition organizer logs in with admin credentials at the start of the competition day, sets the scoring window to active, and teams can now submit ascents. At the end of the 12-hour competition, the admin stops scoring, preventing any further submissions, and accesses real-time leaderboards showing category winners and the hardest send award.

**Why this priority**: Time-gating is critical to competition integrity—without it, teams could log ascents outside the official window. Admin access to results is necessary to announce winners. This completes the essential MVP by providing competition lifecycle management.

**Independent Test**: Can be tested by logging in as admin, starting/stopping the scoring window, verifying teams can only submit during active periods, and viewing leaderboards with correct category breakdowns.

**Acceptance Scenarios**:

1. **Given** admin is logged in, **When** they set start and end times for the scoring window, **Then** teams can only submit ascents during this active window
2. **Given** the scoring window is inactive, **When** a team attempts to log an ascent, **Then** their interface is read-only and they cannot submit
3. **Given** the competition has ended, **When** admin views leaderboards, **Then** they see teams grouped by category (Masters, Recreational, Intermediate, Advanced) with rankings
4. **Given** multiple climbers have logged high-grade routes, **When** admin views hardest send award, **Then** the system identifies the highest-graded route logged, breaking ties by counting ascents at that grade

---

### User Story 4 - Bonus Games Tracking (Priority: P2)

During the competition day, organizers announce 3-4 bonus games (e.g., "most creative sequence" or "fastest lap"). A climber participates in a bonus game, and their team member logs the bonus points earned. Each climber can earn bonus points once per game, and these points are added separately to the team's total score.

**Why this priority**: Bonus games add engagement and variety but are not essential for basic competition functionality. They enhance the experience but the competition can run without them.

**Independent Test**: Can be tested by logging bonus game participation, verifying each climber can only earn points once per game, and confirming bonus points are correctly added to team totals.

**Acceptance Scenarios**:

1. **Given** an organizer has announced a bonus game, **When** a climber participates and their teammate logs the bonus, **Then** the bonus points are added to the team score
2. **Given** a climber has already earned bonus points for a specific game, **When** they attempt to log bonus points for the same game again, **Then** the system prevents duplicate entries and shows an error
3. **Given** a team has earned bonus points from multiple games, **When** viewing their score breakdown, **Then** bonus game points are displayed separately from route ascent points

---

### User Story 5 - Pre-Competition Setup (Priority: P2)

Before the competition, the admin uploads route data extracted manually from thecrag.com, including route names, grades, sectors, and gear types. The admin also registers all teams with their climbers' names, ages, grades, and assigns team categories based on the stronger/older climber's attributes.

**Why this priority**: Setup is necessary but happens before the competition starts. It's a prerequisite for the event but doesn't need to be completed simultaneously with core scoring features.

**Independent Test**: Can be tested by uploading route data, registering teams, verifying category assignments follow the rules (Masters for 50+, grade-based for others), and confirming route lists display correctly.

**Acceptance Scenarios**:

1. **Given** admin has route data from thecrag.com, **When** they upload it to the system, **Then** routes are organized by sector with names, grades, and gear types stored
2. **Given** admin registers a team with two climbers, **When** both climbers are over 45 (or one is over 50), **Then** the team is assigned to Masters category regardless of climbing grade
3. **Given** admin registers a team where the stronger climber redpoints grade 24+, **When** the system assigns categories, **Then** the team is placed in Advanced category
4. **Given** all teams are registered, **When** the competition begins, **Then** each team can log in with their assigned credentials

---

### User Story 6 - Admin Override Capabilities (Priority: P3)

During the competition, a team discovers they forgot to log an ascent from earlier in the day. They contact the admin, who verifies the claim and uses the override function to enable that specific team to edit their logs outside the normal scoring window.

**Why this priority**: Override capabilities handle exceptional cases but are not core to normal competition flow. Most teams won't need this feature, making it lower priority.

**Independent Test**: Can be tested by stopping the scoring window, using admin override to enable a specific team's access, verifying they can submit ascents, and confirming other teams remain locked out.

**Acceptance Scenarios**:

1. **Given** the scoring window is closed, **When** admin overrides the time lock for a specific team, **Then** that team can submit ascents while other teams remain in read-only mode
2. **Given** admin has granted an override, **When** the team completes their corrections, **Then** admin can revoke the override and return the team to normal status

---

### User Story 7 - Score Privacy During Competition (Priority: P3)

During the competition, a climber is curious about how other teams are performing. When they view their team's interface, they only see their own team's score and cannot access any information about other teams' progress, preventing strategic gaming based on competitors' performance.

**Why this priority**: Score privacy enhances competition fairness but is a "nice to have" rather than essential. The competition can function without this privacy feature, though it may affect competitive dynamics.

**Independent Test**: Can be tested by logging in as different teams and verifying each can only view their own scores, with no leaderboard visible until after the event.

**Acceptance Scenarios**:

1. **Given** a team is logged in during the competition, **When** they view the scoring interface, **Then** they see only their own team's score and climbers' individual points
2. **Given** the competition is ongoing, **When** a team attempts to access leaderboards, **Then** they are prevented from viewing other teams' scores
3. **Given** the admin has ended the competition, **When** teams access the app, **Then** they can now view final results and leaderboards

---

### Edge Cases

- What happens when a team logs an ascent at exactly the end time of the scoring window?
- How does the system handle two climbers from the same team attempting to log different ascents simultaneously?
- What happens if a climber logs a route that doesn't exist in the route database?
- How does the system handle team members who attempt to log ascents for each other (wrong climber attribution)?
- What happens when the admin changes a team's category after ascents have already been logged?
- How does the system handle network connectivity loss during ascent submission?
- What happens if the hardest send tie-breaker still results in multiple climbers with identical records?
- How does the system handle climbers who reach 100+ ascents in a single day?
- What happens when the scoring window duration is changed while the competition is active?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate teams using a unique team ID and password combination
- **FR-002**: System MUST authenticate administrators using separate admin credentials distinct from team accounts
- **FR-003**: System MUST display a human verification widget (Cloudflare Turnstile or equivalent) before allowing access to login forms
- **FR-004**: System MUST store and display a static list of routes grouped by sectors, including route name, grade (Ewbank or V-grade), gear type (sport/trad/boulder), and base point values
- **FR-005**: System MUST calculate base points according to grade: Ewbank 10-14 = 5pts, 15-17 = 8pts, 18-20 = 12pts, 21-22 = 16pts, 23+ = 20pts; Boulders V0-V2 = 8pts, V3-V4 = 16pts, V5+ = 20pts
- **FR-006**: System MUST apply a 50% bonus to base points for trad routes
- **FR-007**: System MUST apply diminishing returns for repeated ascents of the same route by the same climber: 1st = 100%, 2nd = 75%, 3rd = 25%, 4th+ = 0%
- **FR-008**: System MUST allow administrators to set start and end times for the scoring window
- **FR-009**: System MUST prevent teams from submitting ascents outside the active scoring window by making the interface read-only
- **FR-010**: System MUST allow administrators to override the time lock for individual teams
- **FR-011**: System MUST calculate team scores as the sum of both climbers' individual points
- **FR-012**: System MUST update team and climber scores immediately upon ascent submission
- **FR-013**: System MUST prevent teams from viewing other teams' scores during the active competition
- **FR-014**: System MUST provide administrators with real-time leaderboards broken down by team categories (Masters, Recreational, Intermediate, Advanced)
- **FR-015**: System MUST provide administrators with real-time leaderboards for individual climber categories based on hardest redpoint grade
- **FR-016**: System MUST identify the hardest send award winner as the climber who logged the highest-graded route, using number of ascents at that grade as tiebreaker
- **FR-017**: System MUST allow logging of bonus game points separately from route ascents
- **FR-018**: System MUST enforce that each climber can earn bonus points only once per bonus game
- **FR-019**: System MUST assign team categories based on the stronger/older climber: Masters if any climber is over 50 (or both over 45), otherwise by grade (Recreational up to 19, Intermediate 20-23, Advanced 24+)
- **FR-020**: System MUST assign individual climber categories based on hardest redpoint: Recreational up to grade 19, Intermediate 20-23, Advanced 24+
- **FR-021**: System MUST persist all ascent data reliably even if users refresh or temporarily lose connectivity
- **FR-022**: System MUST provide a mobile-first responsive interface optimized for smartphone use
- **FR-023**: System MUST minimize the number of taps required to log an ascent
- **FR-024**: System MUST handle up to 50 concurrent users with logging frequency of approximately once every five minutes per user
- **FR-025**: System MUST remain responsive over a 12-hour competition period
- **FR-026**: System MUST allow administrators to upload route data including sector, name, grade, and gear type
- **FR-027**: System MUST allow administrators to register teams with climber names, ages, climbing grades, and team passwords
- **FR-028**: System MUST support 3-4 bonus games per competition with configurable point values

### Key Entities

- **Team**: Represents a pair of climbers competing together, has a unique team ID, password, assigned category (Masters/Recreational/Intermediate/Advanced), and accumulated total score from both climbers
- **Climber**: An individual participant, belongs to exactly one team, has name, age, hardest redpoint grade, individual category assignment, and personal point accumulation
- **Route**: A climbing challenge, organized within a sector, has name, Ewbank or V-grade, gear type (sport/trad/boulder), and associated base point value
- **Ascent**: A logged climb by a specific climber on a specific route, includes timestamp, calculated points based on route grade and repeat count for that climber-route combination
- **Bonus Game**: A special competition event announced during the day, has a name, point value, and tracks which climbers have earned points for it
- **Scoring Window**: The official competition timeframe, has start and end timestamps, controls when teams can submit ascents
- **Administrator**: The competition organizer account, has privileged access to control scoring windows, view all leaderboards, manage route and team data, and override team access

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Teams can log an ascent in under 30 seconds from opening the app (3 taps or less after login)
- **SC-002**: System supports 50 concurrent users with ascent logging every 5 minutes without performance degradation
- **SC-003**: System remains continuously available and responsive for 12 consecutive hours
- **SC-004**: 95% of ascents are successfully logged on the first submission attempt
- **SC-005**: Team scores update and display within 2 seconds of ascent submission
- **SC-006**: Zero score calculation errors across all grade categories, trad bonuses, and repeat penalties
- **SC-007**: No team can view another team's score during the active competition period (100% score privacy enforcement)
- **SC-008**: Admin can generate complete leaderboards for all categories within 10 seconds
- **SC-009**: Zero data loss occurs even with page refreshes or temporary connectivity interruptions
- **SC-010**: Mobile interface is fully usable on screens from 320px to 768px width without horizontal scrolling
- **SC-011**: Users successfully complete login and first ascent logging within 3 minutes on their first use
- **SC-012**: Admin can upload route data and register all teams within 30 minutes for a 50-team event

## Assumptions

- **Route data structure**: Route data from thecrag.com can be manually extracted and formatted into a standardized structure (CSV or JSON) for upload
- **Authentication complexity**: Team authentication requires only username/password without multi-factor authentication, as this is a one-day event with pre-registered participants
- **Connectivity**: Climbers have mobile internet connectivity throughout the venue for the 12-hour period, though the system should handle brief disconnections gracefully
- **Device compatibility**: Participants will access the system primarily via modern smartphones (iOS/Android) using current browser versions
- **Team composition**: Teams always consist of exactly two climbers, no solo entries or teams of other sizes
- **Bonus game administration**: Bonus games and their point values are manually configured by admin as they are announced, not pre-configured
- **Route database**: The route list is static once uploaded and does not change during the competition (no dynamic route additions)
- **Admin access**: Only one admin account is needed, as a single organizer manages the competition
- **Data retention**: Competition data needs to be retained for at least 30 days post-event for verification and record-keeping
- **Security level**: As a one-day competition with pre-registered participants and no financial transactions, security requirements focus on access control rather than advanced threat protection
- **Peak usage**: Maximum concurrent usage occurs during mid-competition (hours 4-8), with lower activity at start and end
- **Error recovery**: Manual admin intervention is acceptable for resolving edge cases and exceptional situations during the 12-hour window
