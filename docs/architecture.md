# Architecture

A guide to where things live and how they fit together.

## Folder map

```
.
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Public auth pages (no header/footer chrome)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/              # Authenticated app interior
│   │   └── dashboard/
│   │       ├── change-password/
│   │       └── notebooks/[slug]/
│   │           └── notes/[noteId]/
│   ├── api/
│   │   ├── auth/[...all]/        # better-auth catch-all
│   │   └── ai/chat/              # Streaming AI chat endpoint
│   ├── layout.tsx                # Root layout, providers, metadata
│   ├── page.tsx                  # Landing page
│   ├── sitemap.ts                # Generates /sitemap.xml
│   └── robots.ts                 # Generates /robots.txt
│
├── components/
│   ├── ui/                       # shadcn primitives (vendored)
│   ├── form/                     # All form components (auth + notebook)
│   ├── emails/                   # React Email templates (sent via Resend)
│   ├── editor/                   # TipTap editor + bubble toolbar + AI sheet
│   ├── providers/                # React context (query, confirm)
│   └── *.tsx                     # Landing sections, sidebar, theme toggle
│
├── server/                       # "use server" actions, DB-bound, auth-checked
│   ├── note-books.ts
│   ├── notes.ts
│   ├── ai.ts                     # Inline text transforms
│   └── dashboard.ts              # Stats aggregations
│
├── db/
│   ├── drizzle.ts                # Connection (Neon HTTP driver)
│   └── schema.ts                 # Tables, types, exports
│
├── lib/
│   ├── auth.ts                   # better-auth server setup
│   ├── auth-client.ts            # better-auth browser client
│   ├── env.ts                    # Zod-validated env vars
│   ├── llm.ts                    # OpenAI SDK pointed at Groq
│   ├── constants.ts              # SITE_NAME, OG_IMAGE, etc.
│   ├── editor-content.ts         # TipTap JSON ↔ plain text helpers
│   ├── notebook-queries.ts       # React Query hooks
│   ├── note-queries.ts
│   ├── dashboard-queries.ts
│   └── utils.ts                  # cn() and friends
│
├── public/
│   ├── hero-light.png            # Landing hero in light theme
│   ├── hero-dark.png             # Landing hero in dark theme
│   └── logo.png                  # Used for apple-touch-icon
│
├── docs/                         # You are here
├── proxy.ts                      # Middleware (route guards)
├── next.config.ts                # output: "standalone" for Docker
├── drizzle.config.ts             # drizzle-kit configuration
├── Dockerfile                    # Multi-stage production image
└── docker-compose.yml            # Single web service
```

## Routing groups

Next.js route groups (parentheses) let layouts and middleware key off the URL prefix without affecting the URL itself.

- **`app/(auth)/*`** — `/login`, `/signup`, `/forgot-password`, `/reset-password`. Public, no chrome. Authed users are redirected away by the middleware.
- **`app/(dashboard)/*`** — `/dashboard` and everything below. Wrapped by [app/(dashboard)/layout.tsx](<../app/(dashboard)/layout.tsx>) which renders the sidebar + breadcrumb. Unauthed users are redirected to `/login` by the middleware.

## Middleware ([proxy.ts](../proxy.ts))

Next.js 16 calls middleware `proxy.ts`. Folio enforces both halves of the auth gate in a single file:

| User state | Pathname                                                        | Result                   |
| ---------- | --------------------------------------------------------------- | ------------------------ |
| Authed     | `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password` | Redirect to `/dashboard` |
| Unauthed   | `/dashboard/*`                                                  | Redirect to `/login`     |
| Anyone     | `/api/auth/*`, static assets, `/sitemap.xml`, `/robots.txt`     | Pass through             |

Session is read via `auth.api.getSession({ headers })` — Neon's HTTP driver makes this edge-runtime safe.

## Data layer

### Schema

[db/schema.ts](../db/schema.ts) declares two app tables (`notebooks`, `notes`) plus the better-auth tables (`user`, `session`, `account`, `verification`). Notebooks belong to a user; notes belong to a notebook (with a `notebook_id` foreign key).

### Connection

[db/drizzle.ts](../db/drizzle.ts) builds the `db` singleton from `DATABASE_URL`:

```ts
import { drizzle } from "drizzle-orm/neon-http";
export const db = drizzle(env.DATABASE_URL, { schema });
```

### Server actions

`server/*.ts` files start with `"use server"`. Every action follows the same shape:

1. Read the session via `auth.api.getSession({ headers: await headers() })`. Return `{ success: false, message }` if absent.
2. Verify ownership of the parent resource (e.g. for a note action, confirm the notebook belongs to the user).
3. Run the Drizzle query.
4. Return `{ success: true, message, data? }`.

Callers (React Query hooks in `lib/*-queries.ts`) throw if `success: false`.

### React Query

`lib/*-queries.ts` exports a key factory plus typed hooks. Example:

```ts
export const notebookKeys = {
  all: ["notebooks"] as const,
  detail: (id: string) => [...notebookKeys.all, id] as const
};
```

Mutations invalidate the relevant keys on success — the dashboard, the sidebar, and the notebook page all re-fetch automatically.

## Auth flow (better-auth)

- **Server config** in [lib/auth.ts](../lib/auth.ts): drizzle adapter + Google provider + email/password + Resend for transactional emails.
- **Client SDK** in [lib/auth-client.ts](../lib/auth-client.ts): used by form components for `signIn`, `signUp`, `signOut`.
- **API catch-all** at [app/api/auth/[...all]/route.ts](../app/api/auth/[...all]/route.ts) handles every better-auth endpoint, including the Google OAuth callback at `/api/auth/callback/google`.

The Google flow: user clicks the button → redirects to Google → user authorises → Google redirects back to `/api/auth/callback/google?code=...` → better-auth exchanges the code for tokens, creates a session, redirects to `/dashboard`.

## AI flow

Two surfaces, one model.

### Inline transforms

Triggered from the bubble toolbar in [components/editor/bubble-toolbar.tsx](../components/editor/bubble-toolbar.tsx). Sends the selection to [server/ai.ts](../server/ai.ts)'s `transformText` server action, which calls Groq, strips Qwen3 `<think>` blocks from the response, and returns the cleaned text. The editor replaces the selection with the result.

Actions are typed in `TransformAction` — fix-typos, fix-grammar, improve-clarity, shorten, expand, summarize, tone-{professional,casual,friendly}, translate-{english,spanish,french}, plus a custom-instruction escape hatch.

### Chat sidebar

Triggered from the editor toolbar. Streams from [app/api/ai/chat/route.ts](../app/api/ai/chat/route.ts) — a Next.js Route Handler that returns a `ReadableStream` of model output. The chat sheet ([components/editor/ai-chat-sheet.tsx](../components/editor/ai-chat-sheet.tsx)) parses the stream for `<<<note-action:append>>>` / `<<<note-action:replace>>>` blocks and exposes them as Apply / Dismiss proposals — the user is always in the loop before the editor changes.

### Swap models

Edit `DEFAULT_MODEL` in [lib/llm.ts](../lib/llm.ts). The SDK is OpenAI-compatible pointed at Groq's endpoint — any Groq-served model works, and a different provider works with a `baseURL` change.

## SEO and metadata

- **Site-wide defaults** in [app/layout.tsx](../app/layout.tsx)'s `metadata` export — title template, description, OG, Twitter card, icons. Values come from [lib/constants.ts](../lib/constants.ts) so renaming the app is one edit.
- **Per-page metadata** on each `app/.../page.tsx` — `export const metadata` for static, `generateMetadata` for dynamic (notebook detail, note detail).
- **Dashboard noindex** — every authed page sets `robots: { index: false, follow: false }`.
- **`/sitemap.xml`** generated by [app/sitemap.ts](../app/sitemap.ts) — only public routes (`/`, `/login`, `/signup`).
- **`/robots.txt`** generated by [app/robots.ts](../app/robots.ts) — disallows `/dashboard/` and `/api/`.

## Theming

`next-themes` is wired with `attribute="class"` in [app/layout.tsx](../app/layout.tsx) — when dark mode is active, the `.dark` class is on `<html>` and Tailwind's `dark:` variants take over.

The hero image uses pure-CSS theme switching: both PNGs are rendered, one is `dark:hidden` and the other is `hidden dark:block`. No hydration mismatch, no flash on first paint, no `"use client"` needed.

## Env validation

[lib/env.ts](../lib/env.ts) parses `process.env` against a Zod schema at boot. On failure the process exits with a clear message — the app never starts with a half-baked configuration. The Dockerfile builder sets `SKIP_ENV_VALIDATION=1` because the build doesn't need real secrets; the runtime container then supplies them.

## What's missing (intentionally)

- **No GraphQL layer** — server actions + React Query cover the same ground with less ceremony.
- **No state management library** — React Query is the cache; ephemeral UI state is `useState` and React Context.
- **No test suite yet** — open issue; contributions welcome.
- **No telemetry / analytics** — by design.
