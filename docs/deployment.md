# Deployment

Three options, in order of effort: Vercel, Docker, or a plain VPS.

All three need the same environment variables — see [configuration.md](./configuration.md). Set them in the platform's secret manager, not in a checked-in file.

## Option 1: Vercel

The fastest path. Vercel handles the build, edge network, and TLS for you. Free tier is plenty for folio's footprint.

1. Push your fork to GitHub.
2. [Import the repo](https://vercel.com/new) into Vercel.
3. **Framework Preset** auto-detects as Next.js. Leave it.
4. **Environment Variables** — add every variable from your `.env`. You can paste them in bulk via Vercel's CLI or the dashboard.
5. Click **Deploy**.

For the Google OAuth redirect URI to work, update the Authorized redirect URI in the Google Cloud Console to `https://<your-vercel-domain>/api/auth/callback/google` and set `BETTER_AUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your deployed URL.

The `output: "standalone"` flag in [next.config.ts](../next.config.ts) is harmless on Vercel — Vercel uses its own bundling.

## Option 2: Docker

A single self-contained container. Bring your own `DATABASE_URL` (Neon, RDS, anywhere) — the compose file does not bundle Postgres.

### Files

- [Dockerfile](../Dockerfile) — multi-stage build, `node:22-alpine`, runs as non-root, final image ~150 MB
- [docker-compose.yml](../docker-compose.yml) — single `web` service, pulls env vars from the shell or `.env`
- [.dockerignore](../.dockerignore) — keeps `node_modules`, `.env*`, `.git`, and editor cruft out of the build context

### Run it

```bash
cp .env.example .env       # fill in real values
pnpm docker:build          # docker compose build
pnpm docker:up             # docker compose up -d
pnpm docker:logs           # tail web logs
```

Open `http://localhost:3000`.

### Stop and rebuild

```bash
pnpm docker:down           # stop and remove
pnpm docker:build          # rebuild after code changes
pnpm docker:up
```

### Required env vars at runtime

`docker-compose.yml` uses `${VAR:?required}` syntax for every required variable — compose will refuse to start if any are missing. The full list is in [configuration.md](./configuration.md).

### Why no Postgres in compose

Folio uses Neon's HTTP-friendly driver (`drizzle-orm/neon-http`) which talks to Neon over HTTP, not standard Postgres TCP. A bundled `postgres:16-alpine` container wouldn't speak that protocol. Point `DATABASE_URL` at your Neon project (or any Postgres reachable over the network) and the container takes care of the rest.

If you'd rather run Postgres locally, the driver swap (`drizzle-orm/node-postgres` + `pg`) is a small follow-up — open an issue if you want it.

## Option 3: Self-host on a VPS

Plain Node, no containers.

### Requirements

- Node.js 22 or newer
- pnpm 11 (Corepack)
- A reverse proxy that terminates TLS in front (nginx, Caddy, Cloudflare Tunnel)
- A process manager (systemd, pm2)

### Build and run

```bash
git clone https://github.com/Arijit-mondal099/folio.git
cd folio
pnpm install --frozen-lockfile
pnpm db:push                # one-time, first deploy
pnpm build
pnpm start                  # starts on $PORT or 3000
```

Export the env vars before `pnpm start`. The simplest way is a `.env` file plus `dotenv-cli`, but most process managers have native env-var support — systemd's `EnvironmentFile=`, pm2's `ecosystem.config.js`, etc.

### systemd unit example

```ini
# /etc/systemd/system/folio.service
[Unit]
Description=folio
After=network.target

[Service]
Type=simple
User=folio
WorkingDirectory=/srv/folio
EnvironmentFile=/srv/folio/.env
ExecStart=/usr/bin/pnpm start
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now folio
sudo journalctl -u folio -f
```

### Reverse proxy

Point your reverse proxy at `http://127.0.0.1:3000` and terminate TLS at the proxy. Update Google OAuth's Authorized redirect URI and the `BETTER_AUTH_URL` / `NEXT_PUBLIC_BASE_URL` / `NEXT_PUBLIC_SITE_URL` env vars to your public HTTPS URL.

## Post-deploy checklist

- [ ] Sign up with email/password — verification email arrives
- [ ] Sign in with Google — lands on `/dashboard`
- [ ] Create a notebook, then a note
- [ ] Open the AI chat, ask it to draft a section, click Apply
- [ ] Export the note as PDF — the file downloads with formatting intact
- [ ] Browse to `/sitemap.xml` — lists `/`, `/login`, `/signup`
- [ ] Browse to `/robots.txt` — disallows `/dashboard/` and `/api/`

## Updating a deployment

```bash
git pull
pnpm install --frozen-lockfile
pnpm db:migrate            # if any new drizzle migrations
pnpm build
# restart the service:
# pnpm docker:restart   (docker)
# sudo systemctl restart folio   (systemd)
```

For zero-downtime upgrades, run two instances behind your reverse proxy and roll one at a time.
