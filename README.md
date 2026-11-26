# Wortgarten (web platform)

Next.js 16, React 19, Tailwind 4, Supabase (Postgres, Auth, RLS).

## Run
    npm install
    cp .env.example .env.local   # fill in your Supabase URL and anon key
    npm run dev

Without the env vars, the login page says accounts are not connected. There is no fake sign-in.

## Database
Run `supabase/schema.sql` in the Supabase SQL editor. It creates tables, roles and row-level security. It has no seed content.
To make someone an admin, change `profiles.role` from the SQL editor (the app cannot do it).

See `docs/PLAN.md` for phases, limits and costs.
