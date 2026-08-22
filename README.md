# BiodataMatcher

Matrimonial biodata builder for Indian users — upload an old biodata or fill a
guided form, preview in an elegant template, and download a print-ready PDF.

## Status: Phase 1

This is the **Phase 1** slice of the build plan in
`../biodatamatcher-claude-code-prompt.md`:

- ✅ Project scaffold (Next.js 14 App Router, TypeScript, Tailwind, Prisma, NextAuth)
- ✅ Auth: Google sign-in + guest mode (unauthenticated draft in `localStorage`,
  auto-attached to the account on first sign-in — see `src/components/auth/draft-attacher.tsx`)
- ✅ Prisma schema for the full data model (User, Biodata, Template, Message, Interest)
- ✅ 7-step manual entry form with live Edit/Preview toggle
- ✅ 2 templates (Traditional Floral, Modern Minimal) — 4 more shown as "Coming soon"
  in the template picker, ready to add as new components (see below)
- ✅ Live preview + PDF export (gated behind sign-in, matching the "Download Gate" design)

**Not yet built** (Phases 2–5 of the plan): AI extraction of uploaded biodata files,
the remaining 4 templates, Discover/Browse + filters, profile detail view,
messaging/inbox, dashboard, and deployment polish.

## Setup

```bash
npm install
cp .env.local.example .env.local   # already done; fill in real values below
npx prisma generate
```

Fill in `.env.local`:

- `DATABASE_URL` — a Postgres connection string (Vercel/Neon). Nothing in the
  app works end-to-end without this — `npx prisma migrate dev` creates the
  tables once it's set.
- `NEXTAUTH_SECRET` — any random 32-byte string (`openssl rand -base64 32`).
- `MESSAGE_ENCRYPTION_KEY` — any random 32-byte string (`openssl rand -base64 32`).
  Messaging encrypts content at rest with this key (AES-256-GCM) — required
  for `/messages` to work, and losing it makes existing messages unreadable.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from a Google Cloud OAuth
  client (console.cloud.google.com → APIs & Services → Credentials). Add
  `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
- `BLOB_READ_WRITE_TOKEN` — optional for local dev; without it, photo uploads
  fall back to storing a local data URL instead of Vercel Blob.
- `ANTHROPIC_API_KEY` — not used yet (Phase 2, AI extraction of uploaded biodata).

Once `DATABASE_URL` is set:

```bash
npx prisma migrate dev --name init
npm run prisma:seed   # optional — adds 3 sample public biodata profiles
```

Then:

```bash
npm run dev
```

## Structure

- `src/types/biodata.ts` — the shared `BiodataData` type every form step,
  template, and PDF renderer is driven by. Add a 7th template by adding an
  entry to `TEMPLATES` and a new component in `src/components/templates/`
  (+ a PDF counterpart in `src/components/pdf/`).
- `src/lib/draft-store.ts` — Zustand store, persisted to `localStorage`, that
  holds the in-progress biodata for both guests and signed-in users while editing.
- `src/app/create/[step]/page.tsx` — the 7-step form, driven by `FORM_STEPS`
  in `src/types/biodata.ts`.
- `src/app/create/preview/page.tsx` — full live preview + PDF download (gated).
- `src/app/api/pdf/route.tsx` — server-side PDF rendering via `@react-pdf/renderer`.
- `prisma/schema.prisma` — full data model per the project brief.

## Design reference

Visual decisions follow `../design-extracted/13-design-tokens.html` (colors,
type scale, spacing, radii) and the screen mockups `01`–`12` in the same folder.
