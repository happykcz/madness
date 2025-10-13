# Quarry Madness 2025 - Scoring Rules

**Last Updated:** 2025-10-14

## Core Scoring Formula

```
Final Points = FLOOR(base_points × trad_multiplier × repeat_multiplier)
```

## Base Points

- **Type:** NUMERIC(5,2) - supports decimal values
- **No restrictions:** Can be any value from 0.00 to 999.99
- **Examples:**
  - `0.00` - Non-scoreable navigation/warm-up routes
  - `7.50` - Half-point routes
  - `12.00`, `15.00`, `20.00` - Standard point routes
  - `12.75` - Fractional point values allowed

## Trad Bonus Multiplier

- **Trad routes:** 1.5x (50% bonus)
- **Sport/Boulder routes:** 1.0x (no bonus)

## Repeat Multiplier (4 Scoring Attempts)

⚠️ **IMPORTANT:** Teams can score a route up to **4 times** with decreasing multipliers:

| Attempt | Multiplier | Percentage |
|---------|-----------|------------|
| 1st     | 1.00      | 100%       |
| 2nd     | 0.75      | 75%        |
| 3rd     | 0.50      | 50%        |
| 4th     | 0.25      | 25%        |
| 5th+    | 0.00      | 0% (no points) |

### Examples:

**Sport Route (base_points = 12.00):**
- 1st attempt: `FLOOR(12.00 × 1.0 × 1.00)` = **12 points**
- 2nd attempt: `FLOOR(12.00 × 1.0 × 0.75)` = **9 points**
- 3rd attempt: `FLOOR(12.00 × 1.0 × 0.50)` = **6 points**
- 4th attempt: `FLOOR(12.00 × 1.0 × 0.25)` = **3 points**
- 5th+ attempt: **0 points**

**Trad Route (base_points = 15.00):**
- 1st attempt: `FLOOR(15.00 × 1.5 × 1.00)` = **22 points** (trad bonus!)
- 2nd attempt: `FLOOR(15.00 × 1.5 × 0.75)` = **16 points**
- 3rd attempt: `FLOOR(15.00 × 1.5 × 0.50)` = **11 points**
- 4th attempt: `FLOOR(15.00 × 1.5 × 0.25)` = **5 points**
- 5th+ attempt: **0 points**

**Decimal Base Points (base_points = 12.50):**
- 1st attempt: `FLOOR(12.50 × 1.0 × 1.00)` = **12 points**
- 2nd attempt: `FLOOR(12.50 × 1.0 × 0.75)` = **9 points** (9.375 → 9)
- 3rd attempt: `FLOOR(12.50 × 1.0 × 0.50)` = **6 points** (6.25 → 6)
- 4th attempt: `FLOOR(12.50 × 1.0 × 0.25)` = **3 points** (3.125 → 3)

## Implementation

### Database Function

The scoring logic is implemented in the `calculate_ascent_points()` function:

```sql
CREATE OR REPLACE FUNCTION calculate_ascent_points(
  p_climber_id UUID,
  p_route_id UUID
)
RETURNS INTEGER
```

**Location:** 
- Original: `supabase/migrations/001_initial_schema.sql`
- Updated: `supabase/migrations/012_allow_zero_base_points.sql`

### Helper Function

A helper function exists for getting the tick multiplier:

```sql
CREATE OR REPLACE FUNCTION get_tick_multiplier(p_tick_number INTEGER)
RETURNS DECIMAL(3,2)
```

**Location:** `supabase/migrations/007_scoring_system_updates.sql`

## Database Schema

### Routes Table

```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  grade_numeric INTEGER NOT NULL,
  gear_type VARCHAR(20) NOT NULL,
  base_points NUMERIC(5,2) NOT NULL,  -- Changed from INTEGER
  sector VARCHAR(100),
  sector_order INTEGER DEFAULT 0,
  route_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Ascents Table

```sql
CREATE TABLE ascents (
  id UUID PRIMARY KEY,
  climber_id UUID REFERENCES climbers(id),
  route_id UUID REFERENCES routes(id),
  tick_number INTEGER,              -- Which attempt (1-10)
  tick_multiplier DECIMAL(3,2),     -- Scoring multiplier used
  trad_bonus_applied BOOLEAN,       -- Whether trad bonus was applied
  points_awarded INTEGER,           -- Final points calculated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Competition Settings

Scoring rules are also stored in `competition_settings` table for reference:

```json
{
  "tick_multipliers": [
    {"tick": 1, "multiplier": 1.00},
    {"tick": 2, "multiplier": 0.75},
    {"tick": 3, "multiplier": 0.50},
    {"tick": 4, "multiplier": 0.25},
    {"tick": 5, "multiplier": 0.00}
  ],
  "trad_bonus_percentage": 50
}
```

## Historical Changes

### Migration 001 (Initial)
- Base points: INTEGER with constraint CHECK (5, 8, 12, 16, 20)
- Scoring: 3 attempts (100%, 75%, 25%)
- **❌ INCORRECT** - Missing 4th attempt

### Migration 007 (Scoring Updates)
- Added `tick_number` and `tick_multiplier` columns to ascents
- Created `get_tick_multiplier()` helper function
- Documented correct scoring: 4 attempts (100%, 75%, 50%, 25%)
- Added tick_multipliers to competition_settings
- **✅ CORRECT** - Documented 4 scoring attempts

### Migration 012 (Current)
- Removed base_points constraint entirely
- Changed base_points: INTEGER → NUMERIC(5,2)
- Updated `calculate_ascent_points()` function
- **✅ CORRECT** - Implements 4 scoring attempts (100%, 75%, 50%, 25%)

## Testing Examples

To verify correct implementation, test these scenarios:

```sql
-- Sport route, 12 points base
INSERT INTO ascents VALUES (climber_id, route_id_sport);  -- 1st: 12 pts
INSERT INTO ascents VALUES (climber_id, route_id_sport);  -- 2nd: 9 pts
INSERT INTO ascents VALUES (climber_id, route_id_sport);  -- 3rd: 6 pts
INSERT INTO ascents VALUES (climber_id, route_id_sport);  -- 4th: 3 pts
INSERT INTO ascents VALUES (climber_id, route_id_sport);  -- 5th: 0 pts

-- Trad route, 15 points base
INSERT INTO ascents VALUES (climber_id, route_id_trad);   -- 1st: 22 pts (15 × 1.5)
INSERT INTO ascents VALUES (climber_id, route_id_trad);   -- 2nd: 16 pts
INSERT INTO ascents VALUES (climber_id, route_id_trad);   -- 3rd: 11 pts
INSERT INTO ascents VALUES (climber_id, route_id_trad);   -- 4th: 5 pts
```

## Notes

- Final points always rounded DOWN via `FLOOR()`
- This ensures integer point values in leaderboards
- Decimal base_points provide flexibility for competition organizers
- Maximum 4 scoring attempts prevents point farming
- 5th and subsequent attempts still trackable but award 0 points
