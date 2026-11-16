# Backend — Express REST API

```
src/
├── server.ts              HTTP server + graceful shutdown
├── app.ts                 Express app (helmet, CORS, logging, routes, errors)
├── config/                env (zod-validated), logger (pino), Supabase clients
├── middleware/            auth (requireAdmin), cron-auth, upload (multer), errors
├── modules/<feature>/     routes → controller → service (+ zod schema)
│   ├── applications/      loan applications + status
│   ├── calculator/        loan calculator settings
│   ├── documents/         private document download
│   ├── loan-products/
│   ├── news/              company news, external news, sync, cron
│   ├── site-settings/
│   └── system/            health, server-time
├── services/              rate-limit, turnstile, storage, news-sync/
├── routes/index.ts        /api/v1 router (public, /admin, /cron)
└── utils/                 HttpError, validation, file signatures
```

```bash
cp .env.example .env
npm ci
npm run dev        # http://localhost:4000/api/v1/health
npm run build && npm start
```

See the root README for the endpoint list and auth flow.

## Deploying to Vercel

Create a separate Vercel project with **Root Directory = `backend`**. `vercel.json`
handles the rest: `npm run build` compiles `src/` → `dist/`, `api/index.js`
exports the Express app as a single function, and every path is rewritten to it.

- Set all variables from `.env.example` in the Vercel project, plus
  `NODE_ENV=production` and `TRUST_PROXY=true`.
- `CORS_ORIGINS` must contain the frontend's Vercel/production URL.
- The news sync cron runs daily at 01:00 UTC (Hobby plan allows daily only).
  Vercel sends `Authorization: Bearer $CRON_SECRET` automatically.
- Vercel limits request bodies to **4.5 MB**, so loan applications with larger
  documents will be rejected there.
