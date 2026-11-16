# Хөгжих Капитал ББСБ — Web

The project is split into two independent apps:

```
khugjikh-capital-web/
├── backend/    Express 5 + TypeScript REST API  (port 4000)
└── frontend/   Next.js 16 website + admin panel (port 3000)
```

| | Frontend | Backend |
|---|---|---|
| Role | UI only (SSR pages, forms) | All business logic, validation, data access |
| Supabase | **Auth only** (admin sign-in, publishable key) | Database, Storage, Auth admin (service-role key) |
| Secrets | none (only `NEXT_PUBLIC_*`) | `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, `CRON_SECRET`, `RATE_LIMIT_HASH_SECRET` |

```
Browser ──► Next.js (frontend) ──► Express API (backend) ──► Supabase
   │                                   ▲
   └──── client-side fetch (CORS) ─────┘
```

## Getting started

Requirements: Node.js ≥ 20.

```bash
cp backend/.env.example backend/.env           # fill in secrets
cp frontend/.env.example frontend/.env.local   # fill in public values
npm install            # installs root tooling (concurrently)
npm run install:all    # installs backend + frontend
npm run dev            # runs API on :4000 and web on :3000
```

Each app can also be run on its own (`cd backend && npm run dev`).

| Script | Description |
|---|---|
| `npm run dev` | Run both apps in watch mode |
| `npm run build` | Production build of both apps |
| `npm run typecheck` | `tsc --noEmit` in both apps |
| `npm run lint` | ESLint in both apps |

## Authentication

1. The admin signs in on `/admin/login` with Supabase Auth (frontend, publishable key).
2. The session lives in cookies; `frontend/proxy.ts` refreshes it on `/admin/*`.
3. Every admin request sends `Authorization: Bearer <supabase access token>` to the API.
4. The API verifies the token (`auth.getUser`) and calls the `is_admin()` RPC as that
   user before any handler runs (`backend/src/middleware/auth.ts`). RLS still applies,
   because admin queries use a client scoped to the caller's token.

## API overview (`/api/v1`)

Responses use `{ "data": ..., "meta"?: ..., "message"?: ... }` on success and
`{ "error": "..." }` on failure.

**Public**

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/server-time` | Current year in Asia/Ulaanbaatar |
| GET | `/site-settings` | Public site settings (branding, hero, contacts) |
| GET | `/loan-products` | Active loan products |
| GET | `/loan-products/:slug` | Active loan product detail |
| GET | `/calculator-settings` | Active loan calculator settings |
| GET | `/news/company?limit=` | Published company news |
| GET | `/news/company/:slug` | Published company news item |
| GET | `/news/external?category=&page=&pageSize=` | Mongolbank/FRC news (paginated, last 2 years) |
| POST | `/applications` | Submit a loan application (multipart, Turnstile + rate limit) |

**Admin** (Bearer token + `is_admin()`)

| Method | Path | Description |
|---|---|---|
| GET | `/admin/me` | Current admin |
| GET / PATCH | `/admin/site-settings` | Read / update settings |
| POST | `/admin/site-settings/logo` | Upload logo (`file`) |
| POST | `/admin/site-settings/hero-image` | Upload hero image (`file`) |
| GET / POST | `/admin/loan-products` | List / create |
| GET / PUT / DELETE | `/admin/loan-products/:id` | Read / update / delete |
| PUT | `/admin/loan-products/order` | Reorder (`{ ids: [...] }`) |
| GET / PATCH | `/admin/calculator-settings` | List / update one setting |
| GET / POST | `/admin/news/company` | List (filters `q`, `category`, `status`) / create (multipart) |
| GET / PUT / DELETE | `/admin/news/company/:id` | Read / update / delete |
| PUT | `/admin/news/company/:id/image` | Replace cover image (`image`) |
| GET | `/admin/news/external?limit=` | Latest synced external news |
| POST | `/admin/news/sync` | Run Mongolbank + FRC sync now |
| GET | `/admin/applications` | List applications |
| GET | `/admin/applications/:id` | Detail + documents + status history |
| PATCH | `/admin/applications/:id/status` | Change status |
| GET | `/admin/documents/:id/download` | Download a private document |

**Cron** (Bearer `CRON_SECRET`)

| Method | Path | Description |
|---|---|---|
| GET / POST | `/cron/news-sync` | Scheduled news sync (point your scheduler here) |

## Deployment notes

- Deploy the two apps separately (e.g. frontend on Vercel, backend on Render /
  Railway / Fly.io / a VPS).
- Set `CORS_ORIGINS` on the backend to the frontend's public origin(s).
- Set `NEXT_PUBLIC_API_URL` on the frontend to the backend's public URL.
- Set `TRUST_PROXY=true` on the backend when it runs behind a reverse proxy.
- Re-point the news-sync scheduler from the old `/api/cron/sync-mongolbank` to
  `GET <backend>/api/v1/cron/news-sync` with `Authorization: Bearer <CRON_SECRET>`.
