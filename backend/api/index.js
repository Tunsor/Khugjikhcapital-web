// Vercel serverless entry. `npm run build` compiles src/ → dist/ first;
// vercel.json rewrites every request here, and Express sees the original
// URL (e.g. /api/v1/health), so routing is unchanged from local dev.
import { createApp } from "../dist/app.js";

export default createApp();
