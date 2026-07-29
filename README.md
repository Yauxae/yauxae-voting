# YAUXAÉ

A luxury fashion voting site. Browse a gallery of dresses, vote for your
favorite look, and watch the standings shift — built with Next.js 15 (App
Router), Tailwind CSS, and Supabase.

**Theme:** matte burgundy surfaces, muted gold typography, and leopard-print
accents used sparingly (badges, dividers) rather than as a full pattern —
kept quiet so the imagery stays the hero.

## Stack

- Next.js 15 (App Router, Server Components, TypeScript)
- Tailwind CSS (custom burgundy/gold/leopard design tokens)
- Supabase (Postgres + RLS) for dresses and votes
- Deploys cleanly to Vercel

## Project structure

```
app/
  layout.tsx            Root layout, fonts, Navbar/Footer shell
  page.tsx               Homepage — hero, leaderboard preview, "how it works"
  gallery/page.tsx        Full gallery grid with sorting
  dress/[slug]/page.tsx   Dress detail page with VoteButton
  admin/page.tsx          Passcode-gated admin dashboard
  not-found.tsx / loading.tsx
components/
  Navbar.tsx, Footer.tsx, DressCard.tsx, VoteButton.tsx, LeopardBadge.tsx
lib/
  supabase/client.ts      Browser Supabase client (anon key)
  supabase/server.ts      Server Supabase client (service role, falls back to anon)
  types.ts                 Shared types
  voter.ts                 Anonymous per-browser voter fingerprint (localStorage)
supabase/
  schema.sql               Tables, RLS policies, cast_vote() RPC, seed data
```

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run the contents of `supabase/schema.sql`. This
   creates the `dresses` and `votes` tables, enables Row Level Security,
   creates the `cast_vote()` function (atomic insert + increment, one vote
   per visitor per dress), and seeds six sample looks.
3. Grab your Project URL, `anon` public key, and (optionally) the
   `service_role` key from **Project Settings → API**.
4. Replace the seed `image_url` values with your own hosted product imagery
   when you're ready — Unsplash placeholders are used out of the box.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only — used for admin/server reads)
- `NEXT_PUBLIC_ADMIN_PASSCODE` — a shared passcode gating `/admin`. This is a
  **demo-level** gate, not real auth (it's a public env var checked
  client-side). For production, swap it for Supabase Auth with an
  `is_admin` claim and an RLS-protected admin read path.

## 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` in the Vercel
   project's **Settings → Environment Variables**.
4. Deploy — no build config changes needed.

## How voting works

- Each browser gets a random UUID stored in `localStorage`
  (`lib/voter.ts`) — no login required.
- Voting calls the `cast_vote(p_dress_id, p_voter_fingerprint)` Postgres
  function via `supabase.rpc()`, which inserts into `votes` (unique on
  `dress_id, voter_fingerprint`) and increments `dresses.votes` atomically,
  so a dress's counter can never drift from its vote rows.
- The button also checks `localStorage` locally so an already-voted state
  renders instantly without a round trip.

## Notes for production hardening

- Replace the admin passcode with real authentication.
- Consider rate-limiting `cast_vote` (e.g. via a Supabase Edge Function or
  Vercel middleware) if abuse resistance beyond the per-browser fingerprint
  is needed.
- Add your own dress photography and update `supabase/schema.sql` or insert
  rows directly via the Supabase table editor.
