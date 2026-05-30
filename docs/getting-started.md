# Getting started

A complete setup walkthrough from a clean machine to a running dev server.

## 1. Prerequisites

You'll need:

- **Node.js 22 or newer** — `node --version`
- **pnpm 11** — installed via Corepack: `corepack enable && corepack prepare pnpm@11.1.3 --activate`
- **A Postgres database** — folio uses Neon by default ([sign up](https://neon.tech), free tier is plenty). Any Postgres works if you adjust `DATABASE_URL`.
- **Google OAuth credentials** — for the "Sign in with Google" button. Skip if you only want email/password auth.
- **A Resend API key** — for transactional emails (verification, password reset). [Sign up](https://resend.com).
- **A Groq API key** — for AI chat and inline transforms. [Sign up](https://console.groq.com).

If any of these feels heavy: the [configuration guide](./configuration.md) explains exactly where to click for each, with screenshots of the relevant dashboard sections.

## 2. Clone and install

```bash
git clone https://github.com/Arijit-mondal099/folio.git
cd folio
pnpm install
```

`pnpm install` activates the version pinned in `package.json` (`packageManager: pnpm@11.1.3`) via Corepack. If you see a Corepack error, run `corepack enable` and retry.

## 3. Environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values. Every variable is required at boot time (Zod validates the schema in [lib/env.ts](../lib/env.ts) and the app exits on missing values).

The shortest path: get the keys from each provider, paste them in, leave the URL-shaped vars at their `localhost:3000` defaults for dev.

Full detail on each variable — where to get it, what it controls — is in [configuration.md](./configuration.md).

## 4. Database schema

Push the schema to your fresh database:

```bash
pnpm db:push
```

This applies the schema in `db/schema.ts` directly to the database — fine for first-time setup and for prototyping. Once you have real data and want history, use the migration workflow instead: [development guide](./development.md#database-migrations).

Optional: open Drizzle Studio to inspect the tables visually.

```bash
pnpm db:studio
```

## 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page loads. The middleware in `proxy.ts` redirects authenticated users to `/dashboard` and unauthenticated users hitting `/dashboard` back to `/login`.

## 6. Create your first account

1. Click **Sign up — free** on the landing page.
2. Choose email/password or "Sign in with Google".
3. For email/password: click the verification link in the Resend email that lands in your inbox (or in the Resend dashboard for development domains).
4. You'll land on `/dashboard`. Create a notebook, then a note, and the AI sidebar via the icon in the editor toolbar.

## Troubleshooting

**`Error: Invalid environment variables`**
Zod found a missing or malformed env var. The error message lists which one. Open `.env` and confirm.

**`Corepack must be enabled`** when running `pnpm install`
Run `corepack enable` once, then `corepack prepare pnpm@11.1.3 --activate`. Restart your shell.

**Google OAuth redirect mismatch (`redirect_uri_mismatch`)**
The Google Cloud Console "Authorized redirect URIs" entry must exactly match `<BETTER_AUTH_URL>/api/auth/callback/google`. For local dev that's `http://localhost:3000/api/auth/callback/google`. Trailing slash matters.

**`DATABASE_URL` connection errors on Neon**
Make sure the URL ends with `?sslmode=require`. Neon's pooled connection string also includes `&channel_binding=require` — keep both.

**No emails arriving from Resend**
In test mode, Resend only delivers to verified addresses. Add the address that owns your Resend account, or check the Resend dashboard's "Emails" tab where send attempts are logged.

## Next steps

- [Development guide](./development.md) — daily workflows, scripts, db migrations
- [Architecture](./architecture.md) — how the pieces fit together
- [Deployment](./deployment.md) — when you're ready to ship
