# Wortgarten platform plan

Free, Arabic-first German learning, A1 to C2. No paid tiers. Nothing is marked "ready" unless it works.

## Phases
1. Structure, database schema, home screen, login shell, PWA (done).
   Also done without accounts: A1/A2 content import, dictionary, lessons, tests and gates, practice drills (phases 2 to 4), 26 own videos (phase 5), AI tutor client (phase 6). Progress is local to the device until Supabase is connected.
2. Import real A1/A2 content (28 units, 359 words, dialogs, verbs) from the Android app into the database, plus the German-Arabic dictionary built from it.
3. Placement test and level-gate tests, with progress, XP, streak and badges saved per account.
4. Grammar library (Artikel, Kasus, Verben, Perfekt, Konjunktiv, Passiv) with exercises.
5. Video library: only our own videos and YouTube links to channels that allow embedding. Licence field is mandatory.
6. AI tutor using free-tier options only, with the user's own key.
7. Admin dashboard (roles: learner, editor, admin; role changes are admin-only, enforced in the database).
8. B1 to C2 content and exam practice (Goethe, TELC, ÖSD, TestDaF). Independent practice, always marked not official.

## Honest limits
- B1 to C2 have no lessons yet. Writing them is the biggest job and needs review by a German teacher to be trustworthy.
- Exam practice is not official material and is not affiliated with the exam bodies.
- Copyrighted videos cannot be copied. Only own or embeddable links.
- Audio is synthetic speech until real recordings exist.

## Running costs (all can stay at zero at small scale)
- Supabase free tier: limited database size; projects pause after a week of inactivity.
- Hosting: Vercel or Cloudflare free tier.
- Gemini free tier: daily limits, and Google may use free-tier messages to improve its products.

## Needed from the owner
Supabase project (URL and anon key), a hosting account, optionally a Gemini key. Secrets are shared through vault links, never in chat.
