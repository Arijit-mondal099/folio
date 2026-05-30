# Configuration

Every environment variable folio reads, where it's used, and how to obtain it.

A canonical template lives in [.env.example](../.env.example) at the project root — `cp .env.example .env` to start.

Most variables are validated at boot time by Zod in [lib/env.ts](../lib/env.ts). If anything is missing or malformed, the process exits with a clear message instead of misbehaving at runtime.

## Auth

### `BETTER_AUTH_SECRET`

Server-only signing key for better-auth session tokens.

- **Required**: yes
- **Format**: ≥ 32 characters, random
- **Generate**: `openssl rand -base64 32`
- **Used in**: [lib/auth.ts](../lib/auth.ts)

### `BETTER_AUTH_URL`

The absolute URL where the app is served — better-auth uses it to build OAuth callback URLs and cookie domains.

- **Required**: yes
- **Format**: full URL with scheme, no trailing slash
- **Example**: `http://localhost:3000` for dev, `https://your-domain.com` in production

## Database

### `DATABASE_URL`

Postgres connection string used by Drizzle.

- **Required**: yes
- **Format**: `postgresql://user:password@host/db?sslmode=require`
- **Where to get it**:
  1. Sign in to [Neon](https://console.neon.tech)
  2. Open your project
  3. **Connection Details** panel → copy the pooled connection string
- **Used in**: [db/drizzle.ts](../db/drizzle.ts) (via `drizzle-orm/neon-http`)

Any Postgres instance works; Neon is the default because of the free tier and HTTP-friendly driver.

## Google OAuth

### `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

OAuth credentials for the "Sign in with Google" button.

- **Required**: yes (better-auth registers the Google provider unconditionally)
- **Where to get them**:
  1. Open the [Google Cloud Console](https://console.cloud.google.com)
  2. Create or select a project
  3. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**
  4. Application type: **Web application**
  5. Authorized redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google` (must match exactly)
- **Used in**: [lib/auth.ts](../lib/auth.ts)

For local dev that redirect URI is `http://localhost:3000/api/auth/callback/google`. For production it's `https://your-domain.com/api/auth/callback/google`.

## Email

### `RESEND_API_KEY`

API key for Resend, used to deliver verification and password-reset emails.

- **Required**: yes
- **Where to get it**: [Resend → API Keys](https://resend.com/api-keys)
- **Used in**: [lib/email.ts](../lib/email.ts)

In Resend's free / test mode you can only deliver to verified addresses. For real sending, verify your sending domain in the Resend dashboard.

## AI

### `GROQ_API_KEY`

API key for Groq, used for the chat sidebar and the inline transform toolbar.

- **Required**: yes
- **Where to get it**: [Groq Console → API Keys](https://console.groq.com/keys)
- **Used in**: [lib/llm.ts](../lib/llm.ts) (singleton OpenAI client pointed at Groq's compatible endpoint), [server/ai.ts](../server/ai.ts) (inline transforms), [app/api/ai/chat/route.ts](../app/api/ai/chat/route.ts) (streaming chat)

The default model is `qwen/qwen3-32b`. Swap it by editing `DEFAULT_MODEL` in `lib/llm.ts`.

## Public (browser-visible)

These are prefixed `NEXT_PUBLIC_*` and are inlined into the client bundle at build time. Do not put secrets here.

### `NEXT_PUBLIC_SITE_URL`

Absolute URL of the deployed site. Used by Next.js metadata, the sitemap, and the robots file to emit absolute URLs.

- **Required**: yes
- **Validated**: yes (Zod)
- **Used in**: [app/layout.tsx](../app/layout.tsx) (`metadataBase`), [app/sitemap.ts](../app/sitemap.ts), [app/robots.ts](../app/robots.ts)

### `NEXT_PUBLIC_BASE_URL`

Base URL for the better-auth client — telling the browser-side SDK where the API routes live.

- **Required**: yes, in practice
- **Validated**: **no** (see the inconsistency note below)
- **Used in**: [lib/auth-client.ts](../lib/auth-client.ts)

### `NEXT_PUBLIC_REDIRECT_TO`

Where the password-reset email link points. better-auth attaches `?token=...` to this URL.

- **Required**: yes, in practice
- **Validated**: **no** (see the inconsistency note below)
- **Used in**: [components/form/forgot-password-form.tsx](../components/form/forgot-password-form.tsx)
- **Example**: `http://localhost:3000/reset-password`

## Known inconsistency

`NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_REDIRECT_TO` are read by code but **not in the Zod schema** in [lib/env.ts](../lib/env.ts). That means a missing value will fail silently at runtime — the better-auth client will get `undefined` as its `baseURL`, the reset email will navigate to `undefined`.

This is pre-existing and worth folding into the schema in a follow-up. Until then, fill both in `.env` even though Zod doesn't enforce them.

## Build-time only

### `SKIP_ENV_VALIDATION`

When set to any truthy value, [lib/env.ts](../lib/env.ts) bypasses Zod validation and returns `process.env` as-is. Used by the Dockerfile builder stage so that the build doesn't require real secrets — the runtime container has them.

Not something you should set in normal development.

### `NEXT_TELEMETRY_DISABLED`

Set to `1` in CI and the Dockerfile to opt the build out of Next.js's anonymous telemetry. Optional everywhere else.
