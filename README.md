# BiodataMatcher

Matrimonial biodata builder for Indian users — upload an old biodata or fill a
guided form, preview in an elegant template, and download a print-ready PDF.

## Status

- ✅ Project scaffold (Next.js 14 App Router, TypeScript, Tailwind, Prisma, NextAuth)
- ✅ Auth: Google sign-in + guest mode (session-scoped draft in `sessionStorage`,
  auto-attached to the account on first sign-in — see `src/components/auth/draft-attacher.tsx`)
- ✅ Prisma schema for the full data model (User, Biodata, Template, Message, Interest)
- ✅ 6-step manual entry form with live side-by-side preview (desktop) / Edit-Preview toggle (mobile)
- ✅ AI extraction of uploaded biodata files (PDF/DOCX/TXT/image) via `/api/extract`
  — gracefully degrades to "enter manually" if `ANTHROPIC_API_KEY` isn't set
- ✅ 15 templates (see `src/components/templates/theme.ts` for the 13 that run
  through the shared themed renderer, plus 2 bespoke ones)
- ✅ Live preview + PDF export (gated behind sign-in)
- ✅ Dashboard supporting multiple saved biodata per account
- ✅ Discover/Browse with filters, Profile Detail, Messaging (encrypted at
  rest), Settings (privacy toggle, data export, account deletion)

**Not yet built**: desktop-specific mockups beyond the responsive extensions
already in place, real-time messaging (currently polls every few seconds,
which was an explicit MVP choice), and payments/premium features.

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
- `ANTHROPIC_API_KEY` — powers the "Upload old biodata" AI extraction flow
  (`/start/upload`, `/api/extract`). Without it, that flow degrades
  gracefully to a clear "not set up yet" message and users can still enter
  details manually — nothing else in the app depends on this key.

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
  template, and PDF renderer is driven by, plus the `TEMPLATES` list.
- `src/components/templates/theme.ts` — one compact config per themed
  template (colors, frame, decoration, header layout). Add a 16th template
  by adding an entry here — `ThemedTemplate` (live preview) and `ThemedPdf`
  (PDF) both pick it up automatically. Only Traditional Floral and Modern
  Minimal are bespoke components, from before this system existed.
- `src/lib/draft-store.ts` — Zustand store, persisted to `sessionStorage`
  (guest/in-progress data only — real persistence happens once signed in
  and saved to the DB), that holds the in-progress biodata while editing.
- `src/lib/extract-biodata.ts` + `src/app/api/extract/route.ts` — the AI
  extraction flow (Claude tool-use for structured output; mammoth for
  `.docx` text extraction).
- `src/lib/crypto.ts` — AES-256-GCM encryption for message content at rest.
- `src/lib/public-profile.ts` — the single choke point deciding what's
  safe to expose about a member in Discover/Profile Detail; phone, email,
  full address, and Instagram handle never pass through it.
- `src/app/create/[step]/page.tsx` — the 6-step form, driven by `FORM_STEPS`
  in `src/types/biodata.ts`.
- `src/app/create/preview/page.tsx` — full live preview + PDF download (gated).
- `src/app/api/pdf/route.tsx` — server-side PDF rendering via `@react-pdf/renderer`.
- `prisma/schema.prisma` — full data model per the project brief.

## Design reference

Visual decisions follow `../design-extracted/13-design-tokens.html` (colors,
type scale, spacing, radii) and the screen mockups `01`–`12` in the same folder.
  

## Author -- Sarthak Patel