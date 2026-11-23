# 8. Cloudflare Workers with static assets, not Pages

Date: 2026-11-23
Status: Accepted. Supersedes ADR 0004's choice of the Pages product (and ADR 0007's deploy settings for it). Cloudflare as the host, the free plan, a root URL and previews per branch all stand.

## Context
ADR 0004 picked Cloudflare Pages. When Dan connected the repo in Cloudflare's dashboard, it created a **Workers** project with static assets instead. Cloudflare's own Pages overview now recommends Workers for new projects. The project serves at `https://djwirz.withered-smoke-b9b4.workers.dev`.

Checked against Cloudflare's current docs (2026-11-23):
- Workers Builds runs a build command, then `npx wrangler deploy`, using the Wrangler version pinned in `package.json`.
- Node comes from `.nvmrc`, and pnpm from `packageManager`.
- Non-production branches get preview builds on `*.workers.dev`.
- Static asset requests are free and unlimited.
- `_headers` in the assets directory is honoured.
- A static Astro site needs no adapter and no Worker script.

## Options considered
1. **Workers with static assets,** as the dashboard set it up. One small config file (`wrangler.jsonc`) in the repo.
2. **Delete it and create a Pages project,** as ADR 0004 said. Same outcome for a static site, on the product Cloudflare is steering away from.

## Decision
Option 1. `wrangler.jsonc` declares an assets-only Worker serving `./dist`, with `not_found_handling: "404-page"` (so `src/pages/404.astro` is the not-found page). Wrangler is pinned as a dev dependency. Build settings live in the Workers project:
- build command `pnpm build`;
- deploy command `npx wrangler deploy` (the default);
- no build variables: the site URL comes from `links.site` in the record (`astro.config.mjs`), and `SITE_URL` only overrides it.

Why: it's what Cloudflare provisioned and now recommends, everything ADR 0004 needed still holds, and the config is in the repo rather than only in a dashboard.

## Consequences
- `PNPM_VERSION` isn't needed; Workers Builds reads `packageManager`.
- pnpm 12 refuses to install while packages' install scripts are undecided. `pnpm-workspace.yaml` declines them for esbuild and workerd, which an assets-only deploy doesn't use (checked with `wrangler deploy --dry-run`).
- The URL carries the account's workers.dev subdomain (`withered-smoke-b9b4`). Dan can rename that subdomain in the Cloudflare account settings for free; if so, `links.site` (in `documents/`) and `SITE_URL` change with it.
- Revisit if a custom domain is added: it attaches to the Worker the same way.
