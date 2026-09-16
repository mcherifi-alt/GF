# Galien Guest Lists

Internal tool for Fondation Galien to consolidate and consult event guest
lists — critical use case: front-desk staff verifying a registration in
seconds on event day. V1 scope: Prix USA 2026 (Forum, Ceremony, Patient
Summit, VIP Dinner). Full context, decisions and the visual direction:
see the project synthesis document and mockup shared alongside this repo.

## Non-negotiable principle

This app never recomputes Edouard's extraction/dedup/scope logic. It
reads a source he already computed (his HubDB output table, or his daily
Google Sheet — integration point still being confirmed) and nothing
else. The only file that should change once that's confirmed is
`src/lib/data/source.ts`.

## Status

This is a scaffold, not a finished app:

- **Data**: `src/lib/data/fixtures.ts` holds sample guest data shaped
  exactly like Edouard's script output. `src/lib/data/source.ts` is the
  single seam to swap for the real HubDB table or Google Sheet read.
- **Persistence**: none yet. Capacity edits on the Overview page and
  reminder tracking are client-side only (reset on reload). They need a
  real database once the integration point is settled — the Overview
  and Config screens are already built to read/write through that same
  `source.ts` seam.
- **Auth**: Google OAuth via Auth.js (`next-auth@beta`), restricted to
  `ALLOWED_EMAIL_DOMAIN` (see `.env.example`). Reuses the same SSO
  provider already gating HubSpot login — no separate credentials for
  the team. `/login` is a fallback screen only; the normal path is a
  link added to HubSpot's own navigation.
- **Not built yet** (deferred to V2, once a second Prix edition needs
  onboarding): the program picker and the per-edition admin/permissions
  screen. Both exist in the mockup for direction, not as routes here.

## Development

```bash
npm install
cp .env.example .env.local   # fill in AUTH_SECRET / Google OAuth creds
npm run dev
```

Routes: `/login` (fallback), `/desk`, `/overview`, `/config`. All three
protected routes require a session (checked in `src/proxy.ts` and again
in `src/app/(app)/layout.tsx`).

## Structure

```
src/
  auth.ts                 NextAuth config (Google, domain-restricted)
  proxy.ts                Route protection (Next.js 16 — formerly middleware)
  lib/
    types.ts              Guest / EventConfig / Category shapes
    data/
      fixtures.ts          Sample data — never edit the shape without
                            checking it still matches the script's CSV columns
      source.ts             The integration seam — swap this, not the pages
    export.ts              CSV / Excel(-as-HTML) / print export helpers
    fuzzy.ts                Levenshtein "did you mean" for desk search
  components/               Shared UI (nav, badges) + per-page client components
  app/
    login/
    (app)/                 Session-gated route group
      desk/  overview/  config/
```
