# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

BiodataMatcher — a matrimonial biodata builder for Indian users (Next.js 14
App Router, TypeScript, Tailwind, Prisma/Postgres, NextAuth). Users upload an
old biodata or fill a guided form, preview it in one of 15 templates, and
download a print-ready PDF. Signed-in users can also save multiple biodata,
browse Discover, send interests, and message matches.

## Commands

```bash
npm install
npx prisma generate                 # required after install / schema changes
npx prisma migrate dev --name init  # applies schema; needs DATABASE_URL set
npm run prisma:seed                 # optional — adds 3 sample public biodata

npm run dev                         # start dev server
npm run build                       # prisma generate + next build
npm run lint                        # next lint
```

There is no test suite in this repo currently. `npm run build` (which runs
`tsc` via Next's build) is the primary way to catch type errors.

### Environment

Copy `.env.local.example` to `.env.local`. Nothing works end-to-end without
`DATABASE_URL` (Postgres — Vercel/Neon). Other keys degrade gracefully when
unset:
- `MESSAGE_ENCRYPTION_KEY` — required for `/messages` (AES-256-GCM); losing
  it makes existing messages unreadable.
- `ANTHROPIC_API_KEY` — powers `/start/upload` AI extraction; without it the
  flow shows a clear "not set up yet" message and users fall back to manual
  entry.
- `BLOB_READ_WRITE_TOKEN` — without it, photo uploads fall back to a local
  data URL instead of Vercel Blob.

## Architecture

### Data flow: draft → save → render

`src/types/biodata.ts` defines `BiodataData`, the single shared shape that
every form step, template, and PDF renderer is driven by. Prisma stores each
section (`personal`, `family`, `education`, `astro`, `contact`,
`partnerPreference`) as JSON on `Biodata` rather than as relational columns —
the schema stays flexible; `biodata.ts` is the actual source of truth for
field shape in code.

While a biodata is being built, it lives in `src/lib/draft-store.ts`, a
Zustand store persisted to `sessionStorage` — this is intentionally
session-scoped, not permanent storage. Real persistence only happens once a
user signs in and the draft is saved to their account in the DB. Guest users
can start a biodata anonymously; on first sign-in, `draft-attacher.tsx`
auto-attaches the in-progress sessionStorage draft to the new account.

### Templates

`src/components/templates/theme.ts` holds one compact config per template
(colors, frame, decoration, header layout) — 13 of the 15 templates run
through this shared config via `ThemedTemplate` (live preview) and
`ThemedPdf` (PDF), so adding a 16th template usually means adding one entry
here rather than a new component. Only Traditional Floral and Modern Minimal
are bespoke components predating this system. Live preview and PDF export
must stay visually in sync — changes to a themed template's config affect
both automatically; bespoke templates require updating both the preview
component and its PDF counterpart in `src/components/pdf/`.

PDF rendering is server-side via `@react-pdf/renderer` in
`src/app/api/pdf/route.tsx`, gated behind sign-in.

### AI extraction

`src/lib/extract-biodata.ts` + `src/app/api/extract/route.ts` implement
"upload an old biodata" via Claude tool-use for structured output (mammoth
handles `.docx` text extraction). Extracted fields are merged into the draft
via `hydrateFromExtraction` in the draft store, which only overwrites empty
fields (`mergeNonEmpty`) — never clobbers what a user already typed.

### Public profile redaction

`src/lib/public-profile.ts` is the single choke point deciding what's safe
to expose about a member in Discover/Profile Detail. Phone, email, full
address, and Instagram handle must never pass through `toPublicCard` /
`toPublicDetail`. Any new field added to the Biodata contact/personal data
that shouldn't be public must be deliberately excluded here — don't
spread raw DB rows into public-facing API responses.

### Messaging

Message content is encrypted at rest with AES-256-GCM (`src/lib/crypto.ts`,
keyed by `MESSAGE_ENCRYPTION_KEY`). Messaging currently polls every few
seconds rather than using real-time transport — an explicit MVP choice, not
an oversight.

### Auth

NextAuth with Google OAuth + Prisma adapter (`src/lib/auth.ts`). Guests are
represented via `isGuest` on `User` and can use the app read/draft-only until
they sign in.

### Data model

`prisma/schema.prisma` is the full model: standard NextAuth tables
(Account/Session/VerificationToken), plus `User`, `Biodata`, `Template`,
`Message`, `Interest` (with a `PENDING/ACCEPTED/DECLINED` status enum and a
unique `[fromUserId, toUserId]` constraint).

## Design reference

Visual decisions (colors, type scale, spacing, radii) follow
`../design-extracted/13-design-tokens.html` and screen mockups `01`–`12` in
the same sibling folder, outside this repo.
