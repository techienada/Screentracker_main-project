create table if not exists admins (
  id bigserial primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id bigserial primary key,
  name text not null,
  age integer not null,
  role text not null,
  device text not null,
  wellbeing_score numeric(5,2) not null,
  risk_level text not null,
  screen_time_hours numeric(5,2) not null,
  focus_hours numeric(5,2) not null,
  sleep_hours numeric(5,2) not null,
  unlocks integer not null,
  scrolling_hours numeric(5,2) not null,
  typing_speed integer not null,
  heart_rate integer not null,
  hydration integer not null,
  main_issue text not null,
  tags jsonb not null default '[]'::jsonb,
  goals jsonb not null,
  recommendations jsonb not null,
  weekly_trend jsonb not null,
  app_usage jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activity_events (
  id bigserial primary key,
  user_id bigint references users(id) on delete cascade,
  user_name text not null,
  type text not null,
  tone text not null,
  title text not null,
  detail text not null,
  impact text not null,
  source text not null default 'api',
  action text not null,
  created_at timestamptz not null default now()
);

create table if not exists behavior_snapshots (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  behavior_score numeric(5,2) not null,
  behavior_profile text not null,
  strongest_signal text not null,
  trend_label text not null,
  trend_delta numeric(5,2) not null,
  why_it_matters text not null,
  next_action text not null,
  weekly_target text not null,
  created_at timestamptz not null default now()
);

create table if not exists ml_predictions (
  id bigserial primary key,
  user_id bigint references users(id) on delete set null,
  predicted_label text not null,
  confidence integer not null,
  probabilities jsonb not null,
  drivers jsonb not null,
  created_at timestamptz not null default now()
);
