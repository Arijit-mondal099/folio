# folio docs

The full documentation for [folio](../README.md). Each page is focused and short — pick the one that matches the question.

| Doc                                     | Read it for                                                          |
| --------------------------------------- | -------------------------------------------------------------------- |
| [Getting started](./getting-started.md) | First-time setup. Prereqs, install, environment, your first sign-in. |
| [Configuration](./configuration.md)     | What every env variable does and where to get its value.             |
| [Development](./development.md)         | Day-to-day scripts, database commands, lint and commit conventions.  |
| [Deployment](./deployment.md)           | Vercel, Docker, and VPS deployment walkthroughs.                     |
| [Architecture](./architecture.md)       | Folder map, request lifecycle, auth and AI flows, theming.           |

## Where things live

```
.
├── app/                # Next.js App Router (pages, layouts, API routes)
├── components/         # React components (UI + section blocks + forms)
├── server/             # Server actions (DB-bound, auth-checked)
├── db/                 # Drizzle schema + connection
├── lib/                # Cross-cutting helpers (auth, env, query keys, llm)
├── public/             # Static assets (hero images, logo, favicon)
├── docs/               # You are here
└── proxy.ts            # Middleware (route guards)
```

If you can't find something in a doc, open an [issue](https://github.com/Arijit-mondal099/folio/issues) — gaps are bugs.
