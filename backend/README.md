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
