# Portfolio

Dan Wirz's career record and the site built from it. The record (`portfolio.json`, curated brag entries and case studies) is the source; the site, the GitHub profile, the résumé and LinkedIn are views of it. Each public project is shown beside the employer story it retells.

**Status:** slice 4 of 5: live at https://djwirz.withered-smoke-b9b4.workers.dev, not shared until the go-live check (spec §14). Design: [docs/spec.md](docs/spec.md), [docs/artifact-spec.md](docs/artifact-spec.md) and [docs/adr/](docs/adr/).

## How it fits together
- **The record:** the [ai-era-job-kit](https://github.com/Vets-Who-Code/ai-era-job-kit)'s portfolio format, with two extra fields (`status`, `backs`) and an `in_flight` list for projects that haven't shipped ([ADR 0006](docs/adr/0006-status-and-backs-fields-and-in-flight-projects.md)).
- **The site:** every page pre-rendered to static HTML with Astro ([ADR 0003](docs/adr/0003-pre-render-every-page-with-astro.md)), hosted on Cloudflare Pages ([ADR 0004](docs/adr/0004-host-on-cloudflare-pages.md)).
- **The projects:** [Holdfast](https://github.com/djwirz/holdfast), [Token Keeper](https://github.com/djwirz/token-keeper), [FHIR over MCP](https://github.com/djwirz/fhir-over-mcp), [Coverage Check](https://github.com/djwirz/coverage-check) and [holdfast-ex](https://github.com/djwirz/holdfast-ex), each its own repo, plus [synthetic-cohort](https://github.com/djwirz/synthetic-cohort), the synthetic patient data that FHIR over MCP and Coverage Check are to share.

## Run it locally
Needs Node 22.23 or later (CI uses `.nvmrc`) and pnpm (`corepack enable`, or any install of the version in `package.json`).

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # astro check, then the static site in dist/
```

`pnpm build` also checks the record (`src/lib/record.ts`): it fails on a schema error, a phone number, a brag file that isn't curated, a highlight ref with no matching brag heading, a `backs` story with no case study, or a project in the wrong list (ADR 0006).

## The record
The record is edited in `~/projects/documents/portfolio/` and mirrored here (ADR 0002). Never edit the mirrored files by hand. After a change there:

```bash
pnpm record:copy   # copies portfolio.json, brag/entries, case-studies and decisions; set RECORD_SRC to copy from elsewhere
pnpm build
```

Then open a PR. `brag/inbox/` is never copied and is git-ignored. Fields the site needs that the record doesn't have yet are in [docs/record-additions.md](docs/record-additions.md).

## Deploy
Cloudflare Workers with static assets, built by Workers Builds from this repo (ADR 0008). Merges to `main` deploy to production at https://djwirz.withered-smoke-b9b4.workers.dev; other branches get preview builds on `*.workers.dev`. `wrangler.jsonc` serves `dist/`, with `src/pages/404.astro` as the not-found page. Settings in the Worker's Build settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `pnpm build` |
| Deploy command | `npx wrangler deploy` (the default; uses the Wrangler pinned in `package.json`) |
| Build variable `SITE_URL` | Not needed: the build reads `links.site` from `portfolio.json`. Set it only to override |

Node comes from `.nvmrc`, and pnpm from `packageManager`. Response headers are in `public/_headers`. The link-preview image is `public/og.png`, drawn from `docs/og.svg`.

## Layout
| Path | What |
|---|---|
| `portfolio.json` | The master record (mirrored): profile, links, experience, artifacts, in-flight projects, education |
| `brag/entries/` | Curated, public-safe accomplishments (mirrored) |
| `brag/inbox/` | Raw pulls; git-ignored, never committed |
| `case-studies/` | Employer stories, and later one deep dive per project (mirrored) |
| `decisions/` | Decision notes about employer work (mirrored) |
| `reading/` | /reading/ entries: one Markdown file per read, written here (copy `_example.md`) |
| `src/lib/` | Record loading and checks (`record.ts`), brag parser, routes for the sitemap |
| `src/layouts/`, `src/pages/` | The site |
| `docs/` | Spec, artifact spec, ADRs, record additions |

## Checks
CI runs gitleaks and `pnpm build` on every PR. The kit's portfolio scorer checks the live site from slice 4 (ADR 0007).
