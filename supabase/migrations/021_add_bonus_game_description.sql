-- Add short description field for bonus games
alter table bonus_games
add column if not exists description text not null default '';
