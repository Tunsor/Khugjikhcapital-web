# Frontend — Next.js

Public website and admin panel. Holds **no business logic and no secrets**:
every read/write goes through the REST API in `../backend`.

```
app/            Routes (customer site under (customer)/, admin under admin/)
components/     UI components
lib/api/        Typed API client
  http.ts         fetch wrapper → ApiResult<T> ({ data, error, status, meta })
  server.ts       apiGet / adminGet for Server Components (forwards session token)
  client.ts       api / adminApi / adminDownload for Client Components
lib/data/       Request-scoped cached loaders (e.g. site settings)
lib/supabase/   Supabase Auth clients (sign-in / session only)
proxy.ts        Refreshes the admin session cookie, redirects to /admin/login
```

```bash
cp .env.example .env.local
npm ci
npm run dev        # http://localhost:3000 (expects the API on :4000)
```
