# Data Import Instructions

## Teams & Climbers Import

### Step 1: Prepare Your CSV
Edit `teams_climbers_template.csv` with your data:
- **team_id**: Format as team_001, team_002, etc.
- **team_category**: masters, recreational, intermediate, or advanced
- **climber_category**: recreational (<= 19), intermediate (20-23), or advanced (24+)
- **climber_redpoint_grade**: Numeric grade (e.g., 22)

### Step 2: Convert CSV to SQL
Use this Python script or convert manually:

```python
import csv
import uuid

with open('teams_climbers_template.csv', 'r') as f:
    reader = csv.DictReader(f)

    for row in reader:
        team_id = str(uuid.uuid4())
        climber1_id = str(uuid.uuid4())
        climber2_id = str(uuid.uuid4())

        # Generate password hash for team_id (e.g., team_001 → use Supabase Auth)
        print(f"-- Team: {row['team_name']}")
        print(f"INSERT INTO teams (id, team_id, team_name, category) VALUES")
        print(f"('{team_id}', '{row['team_id']}', '{row['team_name']}', '{row['team_category']}');")
        print()
        print(f"INSERT INTO climbers (id, team_id, name, age, category, redpoint_grade) VALUES")
        print(f"('{climber1_id}', '{team_id}', '{row['climber1_name']}', {row['climber1_age']}, '{row['climber1_category']}', {row['climber1_redpoint_grade']}),")
        print(f"('{climber2_id}', '{team_id}', '{row['climber2_name']}', {row['climber2_age']}, '{row['climber2_category']}', {row['climber2_redpoint_grade']});")
        print()
```

### Step 3: Run in Supabase SQL Editor
Copy the generated SQL and run in Supabase SQL Editor.

---

## Routes Import

### Step 1: Prepare Your CSV
Edit `routes_template.csv` with your ~60 routes:
- **name**: Route name
- **grade**: Climbing grade (e.g., 18, V3)
- **grade_numeric**: Numeric value for sorting (e.g., 18)
- **gear_type**: sport, trad, or boulder
- **base_points**: Points for first ascent (supports decimals: 12.50, 0.00 for navigation routes)
- **sector**: Sector name (e.g., Main Area, Trad Section)
- **sector_order**: Order of sectors (0, 1, 2, ...)
- **route_order**: Order within sector (1, 2, 3, ...)

**Note:** `base_points` is now NUMERIC(5,2) - you can use any decimal value like 7.50, 12.75, or 0.00

### Step 2: Convert CSV to SQL

```python
import csv
import uuid

with open('routes_template.csv', 'r') as f:
    reader = csv.DictReader(f)

    print("INSERT INTO routes (id, name, grade, grade_numeric, gear_type, base_points, sector, sector_order, route_order) VALUES")

    rows = list(reader)
    for i, row in enumerate(rows):
        route_id = str(uuid.uuid4())
        comma = ',' if i < len(rows) - 1 else ';'

        print(f"('{route_id}', '{row['name']}', '{row['grade']}', {row['grade_numeric']}, '{row['gear_type']}', {row['base_points']}, '{row['sector']}', {row['sector_order']}, {row['route_order']}){comma}")
```

### Step 3: Run in Supabase SQL Editor
Copy the generated SQL and run in Supabase SQL Editor.

---

## Quick Import (Without Python)

### Manual SQL Generation
For each team in your CSV:

```sql
-- Example for team_001
INSERT INTO teams (id, team_id, team_name, category, auth_user_id) VALUES
(gen_random_uuid(), 'team_001', 'Example Team', 'intermediate',
 (SELECT id FROM auth.users WHERE email = 'team_001@12qm25.local'));

-- Get the team UUID for climbers
WITH team AS (SELECT id FROM teams WHERE team_id = 'team_001')
INSERT INTO climbers (id, team_id, name, age, category, redpoint_grade) VALUES
(gen_random_uuid(), (SELECT id FROM team), 'Alice Johnson', 28, 'intermediate', 22),
(gen_random_uuid(), (SELECT id FROM team), 'Bob Smith', 32, 'advanced', 25);
```

For routes:
```sql
INSERT INTO routes (id, name, grade, grade_numeric, gear_type, base_points, sector, sector_order, route_order) VALUES
(gen_random_uuid(), 'Dark Side of the Moon', '18', 18, 'sport', 12, 'Main Area', 0, 1),
(gen_random_uuid(), 'Crimson Tide', '19', 19, 'sport', 13, 'Main Area', 0, 2);
```

---

## Notes

- Team passwords are managed in Supabase Auth (create user with email: `team_001@12qm25.local`)
- Default password: `12qm2025` (set in Supabase Auth UI)
- Team category is auto-calculated but can be manually edited in admin interface
- Routes with `base_points = 0` are navigation routes (not scored)
