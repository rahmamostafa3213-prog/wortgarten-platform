-- Wortgarten platform schema (phase 1). No seed content: tables are empty until real content is imported.

create type app_role as enum ('learner','editor','admin');
create type cefr as enum ('A1','A2','B1','B2','C1','C2');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  ui_lang text not null default 'ar' check (ui_lang in ('ar','en','de')),
  role app_role not null default 'learner',
  current_level cefr not null default 'A1',
  created_at timestamptz not null default now()
);

create table levels (code cefr primary key, title text not null, gate_pass_percent int not null default 70 check (gate_pass_percent between 1 and 100));
create table units (id uuid primary key default gen_random_uuid(), level cefr not null references levels(code), position int not null, title_de text not null, title_ar text not null, published boolean not null default false, unique(level, position));
create table lessons (id uuid primary key default gen_random_uuid(), unit_id uuid not null references units(id) on delete cascade, position int not null, title_ar text not null, body_ar text, skill text check (skill in ('lesen','hoeren','schreiben','sprechen','wortschatz','grammatik')), published boolean not null default false);
create table vocab (id uuid primary key default gen_random_uuid(), unit_id uuid references units(id) on delete set null, de text not null, article text check (article in ('der','die','das')), plural text, ar text not null, example_de text, example_ar text, level cefr not null);
create index on vocab using gin (to_tsvector('simple', de));
create table grammar_topics (id uuid primary key default gen_random_uuid(), level cefr not null references levels(code), topic text not null check (topic in ('artikel','kasus','verben','perfekt','konjunktiv','passiv','satzbau','praepositionen','adjektive','other')), title_ar text not null, body_ar text not null, published boolean not null default false);
create table exercises (id uuid primary key default gen_random_uuid(), lesson_id uuid references lessons(id) on delete cascade, grammar_id uuid references grammar_topics(id) on delete cascade, kind text not null check (kind in ('mcq','fill','order','match','listen','write','speak','true_false')), prompt jsonb not null, answer jsonb not null, xp int not null default 10 check (xp >= 0));
create table attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade, exercise_id uuid not null references exercises(id) on delete cascade, correct boolean not null, created_at timestamptz not null default now());
create table progress (user_id uuid not null references profiles(id) on delete cascade, lesson_id uuid not null references lessons(id) on delete cascade, completed_at timestamptz not null default now(), primary key (user_id, lesson_id));
create table level_tests (id uuid primary key default gen_random_uuid(), level cefr not null references levels(code), kind text not null check (kind in ('placement','gate')));
create table level_test_results (id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade, test_id uuid not null references level_tests(id), score_percent int not null check (score_percent between 0 and 100), passed boolean not null, created_at timestamptz not null default now());
create table xp_events (id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade, amount int not null, reason text not null, created_at timestamptz not null default now());
create table badges (code text primary key, title_ar text not null, rule text not null);
create table user_badges (user_id uuid not null references profiles(id) on delete cascade, badge_code text not null references badges(code), earned_at timestamptz not null default now(), primary key (user_id, badge_code));
-- Videos: only links to sources that allow sharing/embedding, or our own material. License is mandatory.
create table videos (id uuid primary key default gen_random_uuid(), level cefr not null references levels(code), title text not null, source_url text not null, source_kind text not null check (source_kind in ('own','youtube_embed','licensed')), license text not null, captions_de_url text, captions_ar_url text, published boolean not null default false);
-- Exam practice is independent and never official.
create table exam_items (id uuid primary key default gen_random_uuid(), exam text not null check (exam in ('goethe','telc','oesd','testdaf')), level cefr not null, skill text not null, content jsonb not null, is_official boolean not null default false check (is_official = false), published boolean not null default false);
create table admin_audit_log (id bigint generated always as identity primary key, actor uuid references profiles(id), action text not null, target text, at timestamptz not null default now());

-- Roles
create function is_role(r app_role[]) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from profiles where id = auth.uid() and role = any(r)) $$;

-- New users always start as learner (role is never taken from client input).
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as
$$ begin insert into profiles (id, display_name) values (new.id, split_part(new.email,'@',1)); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- Stop users promoting themselves.
create function guard_role() returns trigger language plpgsql as
$$ begin if new.role <> old.role and not is_role(array['admin']::app_role[]) then raise exception 'only admins change roles'; end if; return new; end $$;
create trigger profiles_guard_role before update on profiles for each row execute function guard_role();

alter table profiles enable row level security;
create policy profiles_self_read on profiles for select using (id = auth.uid() or is_role(array['admin']::app_role[]));
create policy profiles_self_update on profiles for update using (id = auth.uid() or is_role(array['admin']::app_role[]));

do $$ declare t text; begin
  foreach t in array array['levels','units','lessons','vocab','grammar_topics','exercises','level_tests','badges','videos','exam_items'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for select using (true)', t||'_read', t);
    execute format('create policy %I on %I for all using (is_role(array[''editor'',''admin'']::app_role[])) with check (is_role(array[''editor'',''admin'']::app_role[]))', t||'_write', t);
  end loop;
  foreach t in array array['attempts','progress','level_test_results','xp_events','user_badges'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for select using (user_id = auth.uid() or is_role(array[''admin'']::app_role[]))', t||'_read', t);
    execute format('create policy %I on %I for insert with check (user_id = auth.uid())', t||'_ins', t);
  end loop;
end $$;
alter table admin_audit_log enable row level security;
create policy audit_admin on admin_audit_log for all using (is_role(array['admin']::app_role[])) with check (is_role(array['admin']::app_role[]));
