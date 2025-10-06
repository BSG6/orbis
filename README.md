# orbis
Orbis

Orbis is a playful, modern learning app MVP designed as a daily coding mentor. It delivers a smooth UI, clean build pipeline, and Vercel-ready deployment flow so you can focus on features (like AI coaching) without build headaches.

✨ Features (MVP)

Next.js App Router structure

Tailwind + shadcn/ui components

Dark/light mode toggle

Collapsible right-rail “Coach” panel

Responsive layout + icons with lucide-react

TypeScript-first DX

🧰 Tech Stack

Framework: Next.js (App Router)

Styling: Tailwind CSS + shadcn/ui

Icons: lucide-react

Language: TypeScript

Linting & Formatting: ESLint + Prettier

🚀 Deployment

Deployed on Vercel.

Required environment variables (Vercel → Project Settings → Environment Variables):

- GOOGLE_API_KEY or GEMINI_API_KEY
- Optional: GEMINI_MODEL or GOOGLE_GEMINI_MODEL (default: gemini-2.5-flash)

Notes:
- API routes under `app/api/gemini/*` return 503 if keys are missing.
- Health check: GET `/ok` → `{ ok: true }`.
- CSP is configured in `next.config.js` for the in-browser code runner worker.
