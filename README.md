# AgriTrace

Sample full-stack web app (mobile-friendly PWA) built as a **practice target for QA and
security audits** — for example with
[`sqa-audit-skill`](https://github.com/modalqa/sqa-audit-skill). It is an original demo,
not affiliated with or a copy of any real company's product.

**Scenario:** a palm-oil supply-chain portal. Farmers submit harvest batches; a mill
reviews and approves or rejects them.

## Stack

- **Backend** (`backend/`): Node.js + Express, JWT auth, bcrypt password hashing, role-based
  access (`farmer` / `mill`), file upload (Multer) for harvest photos, `helmet` security
  headers, rate-limited auth endpoints. Data is stored in a local JSON file
  (`backend/data/db.json`) — intentionally simple, with no production datastore, so it's
  easy to run anywhere with zero setup.
- **Frontend** (`frontend/`): React + Vite + Tailwind CSS, installable as a PWA
  (`vite-plugin-pwa`), responsive/mobile-first layout.

## Features

- Register / log in as a **farmer** or a **mill**.
- Farmer: submit a harvest batch (weight, location, date, notes, optional photo), view own
  submission history and status.
- Mill: view incoming batches (filter by status), approve or reject with a note.
- Role-based API access control; JWT-protected routes.

## Running locally

### 1. Backend

```bash
cd backend
cp .env.example .env   # then edit JWT_SECRET for anything beyond local testing
npm install
npm run dev             # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173, proxies /api to the backend
```

Open `http://localhost:5173`, register a farmer account and a mill account (two different
browsers or an incognito window works well), and try the flow end to end.

### Build for production

```bash
cd frontend && npm run build   # outputs dist/, including the PWA service worker
```

## Why this exists

This repo is deliberately small and self-contained so it can serve as a **sample
application under test**: a realistic surface (auth, role checks, file upload, a REST
API, a browser frontend) for practicing QA test design, writing Playwright/Cypress specs
against it, or running a security/quality audit skill over it — without needing access to
a real production codebase.

## Known limitations (by design)

- JSON-file storage has no transactions or concurrent-write locking — fine for a demo,
  not for production.
- No password-reset flow, no email verification, no refresh tokens.
- Uploaded photos are served statically without additional processing or scanning.

These gaps are left in place on purpose — they're part of what an audit of this sample is
meant to find.
