# Project Title

“Quarry Madness Scorekeeper” – a mobile‑friendly web application for scoring the Quarry Madness climbing competition.

## Purpose

This app will run a one‑day climbing competition (12 hours) at Stathams Quarry. It allows registered teams to log ascents, track points, and compete for category prizes. Organisers can start and stop scoring, manage route lists, and view final results.

## Actors

Climbers (Team Members): Up to 50 concurrent users participate in teams of two. Each team has a team ID and password for login. Climbers are pre‑registered with their names, ages, categories and team associations.

Administrator: A designated admin logs in with a separate admin password. They control the scoring window (start/stop), manage route data and view the final results. Admin results are not visible to competitors.

## Functional Requirements

1. User Authentication

Each team logs in using a team ID and password. There is exactly one login per team. The app verifies the team’s credentials and, upon successful login, displays the scoring interface.

A special admin login grants access to an administrator dashboard. Admin credentials are separate from team accounts and allow management privileges.

To reduce spam and bots, the public site displays a Cloudflare Turnstile or similar human‑verification widget prior to login. Upon verification users see the login form.

2. Team and Climber Management

Teams are predefined with two climbers each. A team also has a category based on its stronger/older climber: Masters, Recreational, Intermediate or Advanced (based on climber grades). This category determines which leaderboard the team appears on.

Each climber is assigned an individual category according to their hardest redpoint (Recreational: up to grade 19; Intermediate: 20–23; Advanced: 24+). Climbers over 50 (or both over 45) create a Masters team category even if their climbing grade is lower.

3. Route List Display

The application shows a static list of routes (sport, trad and boulders) grouped by sectors and displayed in a specific order. Each route entry includes its name, Ewbank grade or V‑grade, gear type (sport/trad/boulder) and the associated base point value.

The route data will be manually extracted from thecrag.com and uploaded prior to the event. The app does not fetch data from external APIs.

4. Scoring Mechanism

Base Points: Each route grade corresponds to a base point value. Example: Ewbank 10–14 = 5 points; 15–17 = 8 points; 18–20 = 12 points; 21–22 = 16 points; 23+ = 20 points. Boulders V0–V2 = 8 points; V3–V4 = 16 points; V5+ = 20 points.

Trad Bonus: Trad routes earn a 50 % bonus on base points (e.g., grade 18 trad yields 12 × 1.5 = 18 points).

Repeats: Climbers may log repeats of the same route but with diminishing returns: 1st ascent = full points; 2nd = 75 %; 3rd = 25 %; 4th+ = 0 points.

Games: During the day there will be 3–4 bonus games announced by organisers. Each climber can earn bonus points once per game. These games and their point values should be recorded separately.

Team Score: A team’s score is the sum of its two climbers’ points. Scores update every time a climber submits an ascent.

5. Scoring Session Control

The admin can set start and end times for scoring. Teams can only submit ascents during the active window. Outside this window, the logging interface is read‑only.

Admin may override the time lock for individual teams if needed (e.g., to correct logs).

6. Leaderboard and Results

During the competition, teams see only their own scores. They do not see other teams’ scores to prevent strategic information leaks.

The admin dashboard provides real‑time leaderboards broken down by team categories and individual climber categories.

After the event, the admin can generate final results, including category winners and the hardest send award (the highest‑graded route logged by a climber; break ties by counting the number of ascents at that grade).

7. Usability

The web application will be mobile‑first to suit smartphone use. Interaction should be intuitive: route lists are scrollable, and logging an ascent should require minimal taps.

Use of Tailwind CSS for styling ensures responsive design and consistency with your existing projects.

## Non‑Functional Requirements

The system must handle up to 50 concurrent users with logging frequency of roughly once every five minutes per user.

The competition runs for 12 hours; the system should remain responsive over that period.

Data persistence must be reliable so no ascent is lost, even if the user refreshes or loses connectivity temporarily.