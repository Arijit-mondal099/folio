# Development

Day-to-day developer ergonomics — scripts, database commands, lint and commit conventions.

## Scripts

Every script in [package.json](../package.json), grouped by purpose.

### App

| Command      | What it does                                                            |
| ------------ | ----------------------------------------------------------------------- |
| `pnpm dev`   | Start the Next.js dev server on `http://localhost:3000` with hot reload |
| `pnpm build` | Production build (uses `output: "standalone"` for Docker)               |
| `pnpm start` | Run the production build locally                                        |
| `pnpm lint`  | ESLint over the whole tree                                              |

### Database

| Command            | What it does                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `pnpm db:push`     | Apply [db/schema.ts](../db/schema.ts) directly to the database. Fast, lossy. First-time setup and prototyping only |
| `pnpm db:generate` | Diff `schema.ts` against the previous snapshot and write a SQL migration to `drizzle/`                             |
| `pnpm db:migrate`  | Apply pending migrations from `drizzle/` to the database                                                           |
| `pnpm db:studio`   | Open Drizzle Studio in the browser for visual table inspection                                                     |

### Docker

| Command               | What it does                                                |
| --------------------- | ----------------------------------------------------------- |
| `pnpm docker:build`   | `docker compose build` — rebuild the `web` image            |
| `pnpm docker:up`      | `docker compose up -d` — start the stack in the background  |
| `pnpm docker:down`    | `docker compose down` — stop and remove containers          |
| `pnpm docker:logs`    | `docker compose logs -f web` — tail the web service logs    |
| `pnpm docker:restart` | `docker compose restart web` — restart just the web service |

See [deployment.md](./deployment.md) for the full Docker setup walkthrough.

## Types, lint, and format

- **Types**: `pnpm exec tsc --noEmit` — strict TypeScript check, no emit
- **Lint**: `pnpm lint` — uses the Next.js ESLint config + import sorting
- **Format**: Prettier is wired through `lint-staged` and runs on commit. To format the whole tree on demand: `pnpm exec prettier --write .`

Husky runs `lint-staged` on `pre-commit`, which runs `eslint --fix` and `prettier --write` against staged files. If a hook fails, fix the underlying issue and re-stage — don't use `--no-verify`.

## Commit conventions

[commitlint](../commitlint.config.js) enforces the [Conventional Commits](https://www.conventionalcommits.org) spec on the `commit-msg` hook. Use one of:

| Prefix      | When                                    |
| ----------- | --------------------------------------- |
| `feat:`     | User-visible new functionality          |
| `fix:`      | Bug fix                                 |
| `refactor:` | Internal cleanup, no behaviour change   |
| `chore:`    | Tooling, config, dependency bumps       |
| `docs:`     | Documentation changes                   |
| `style:`    | Whitespace, formatting, no logic change |
| `test:`     | Adding or updating tests                |
| `perf:`     | Performance work                        |
| `ci:`       | CI workflow changes                     |

Optional scope in parens: `feat(landing): rewrite hero`, `fix(editor): drop trailing newline on paste`.

Keep the subject line short (≤ 72 chars), in the imperative present tense.

## Database migrations

For day-to-day prototyping `pnpm db:push` is fine — it diffs your schema against the database and applies the result directly. But that workflow leaves no history.

Once you have real data and want reproducible migrations:

1. Edit [db/schema.ts](../db/schema.ts)
2. Generate the migration:
   ```bash
   pnpm db:generate
   ```
   This writes a numbered SQL file under `drizzle/` and updates the snapshot in `drizzle/meta/`.
3. Inspect the SQL — make sure it does what you expect (renames, drops, defaults).
4. Apply it:
   ```bash
   pnpm db:migrate
   ```

Commit the generated `drizzle/` files along with your `schema.ts` change so other developers and CI apply the same migrations.

## Adding a database column — worked example

Say you want to add a `pinned` boolean to notes:

```ts
// db/schema.ts
export const notes = pgTable("notes", {
  // ...existing columns
  pinned: boolean("pinned").default(false).notNull()
});
```

```bash
pnpm db:generate     # writes drizzle/0001_pinned_column.sql
pnpm db:migrate      # applies it
```

Then update the server action in [server/notes.ts](../server/notes.ts) to read/write the new column, and the React Query hooks in [lib/note-queries.ts](../lib/note-queries.ts) if the new field is part of the wire shape.

## Project conventions

- **No emojis in source files** unless requested per-file.
- **Server actions** live in `server/*.ts` with `"use server"` at the top, always check the session, always check ownership of the parent resource.
- **React Query keys** are factory functions in `lib/*-queries.ts` (e.g. `notebookKeys.detail(id)`); never inline strings.
- **Brand atoms** (the name "folio", logo path, OG image) come from [lib/constants.ts](../lib/constants.ts) — don't hardcode.
- **shadcn primitives** under `components/ui/*` are vendored; treat them like source you can edit, not a library.

## CI

The [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) workflow runs on every push and PR to `main`:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm exec tsc --noEmit`
4. `pnpm build` with dummy env vars (so missing real secrets don't break the build)

If CI fails locally, run the same three commands to reproduce.

## Next steps

- [Deployment guide](./deployment.md) — ship it
- [Architecture](./architecture.md) — where things live
