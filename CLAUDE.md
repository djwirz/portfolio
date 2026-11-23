# portfolio: instructions for Claude

Dan's public portfolio repo: the career record (`portfolio.json`, `brag/`, `case-studies/`, `decisions/`) and the static site built from it, in one repo (ADR 0002). One record, many views: the site, the GitHub profile README, the résumé and LinkedIn are all built from the record. Use they/them for Dan.

## Status
Slice 4 of 5 (spec §13): live at https://djwirz.withered-smoke-b9b4.workers.dev (Cloudflare Workers static assets, ADR 0008), not shared until the go-live check (spec §14). The first kit scorer run: 100 automated, 68 with the VWC checklist pass; the gaps are go-live item 8. Next: slice 5 (GitHub profile, pins, repo settings, old-repo list).

## Commands
- Node 22.23+ (`.nvmrc` for CI), pnpm from `packageManager`.
- `pnpm dev`, `pnpm build` (`astro check && astro build`; the build also runs the record checks in `src/lib/record.ts`), `pnpm preview`.
- `pnpm record:copy`: mirrors the record from `~/projects/documents/portfolio/` (or `RECORD_SRC`). The only way record files change here.
- New static pages go in `src/lib/routes.ts` so they're in `sitemap.xml` (the kit's scorer fetches that exact path); pages built from the record are derived there already.
- Deploys: Cloudflare Workers with static assets (`wrangler.jsonc`, ADR 0008); `pnpm exec wrangler deploy --dry-run` checks the bundle without deploying. `pnpm-workspace.yaml` declines install scripts pnpm 12 asks about.
- The preview server for the browser pane is `.claude/launch.json` (`portfolio-preview`).
- `reading/*.md` holds /reading/ entries (front matter: title, author, kind, read as YYYY-MM, optional link; the body is Dan's thoughts). It's site content written here, not mirrored. `reading/_example.md` shows the format and is never published.
- Case studies render through the `caseStudies` collection (`src/content.config.ts`). Each one's own `# ` title is its page's H1, so the page doesn't add another.

## How we work
- Pull requests only; never push to `main`. Merged PRs are the project's record, and Friday Setup pulls them.
- Spec first, then one thin slice per PR (spec §13). Start each slice in plan mode.
- **Problem first.** Every page, dependency and tool earns its place through the problem: a reader in spec §1, a scorer check in §7, or an acceptance criterion in §12. Never add something just to show a skill.
- Every decision that would be expensive to reverse gets an ADR in `docs/adr/` (format: ADR 0001). Don't decide silently in code.
- ADRs are written as `Accepted` in the PR that adds them; merging is the acceptance. Never rewrite a merged ADR's decision: add a new ADR that supersedes it.
- When the spec and the code disagree, stop and ask; update the spec in the same PR if the decision changes.
- Built with Claude Code in the open: /how-i-build/ and each case study get a section on how AI was used and where it was wrong, so note real mistakes in PR descriptions. Mark anything written from memory rather than current docs as "verify".
- **Every outward-facing GitHub change is its own approval from Dan:** creating a repo, changing a repo's settings or visibility, pinning, setting the profile. Prepare the exact change and wait for a yes on each one. The same goes for creating accounts or tokens on the host.

## The record
- **The record here is a mirror** of `~/projects/documents/portfolio/`, the one place it's edited (ADR 0002). Never edit the mirrored files by hand: a record change is made in `documents/` (by Dan or a documents session), then copied here with the README's copy command in a PR (ADR 0007). **Never edit, move or delete anything under `~/projects/documents` or `~/projects/ai-era-job-kit`.** Read the kit's templates and scripts; never change them.
- **The site isn't shared yet.** Build the structure; missing URLs and an unfinished read-through don't block a slice. Everything that must be true before sharing is in the go-live check (spec §14).
- **`~/projects/documents/archive/` is private.** Read it (especially the guardrails and the never-claim list) before writing or rewording anything about employer work, and never copy, quote or summarize it here, in PR descriptions included.
- `brag/inbox/` is git-ignored and never committed. Only curated entries (`status: curated`) feed the site.
- No phone number anywhere in the repo or on the site. The email comes only from `profile.email` (ADR 0005).
- Projects that aren't deployed go in `in_flight[]`, never in `artifacts[]` (ADR 0006). A project moves to `artifacts[]` in the PR that makes it depth 2, live, with a case study.
- Every `highlights` ref in `portfolio.json` must match a `### heading` in `brag/entries` (file#slug), and every `backs[].story` a file in `case-studies/`.

- **Keep the tooling small** (ADR 0007): lean on Astro's schemas, the kit's scorer and Cloudflare's Git integration before writing a script or a CI job.

## Constraints
- Never employer code, data or names beyond what's public and in the record. Synthetic or public data only.
- TypeScript here (a site is where it fits); Python is fine for small record scripts if it fits better.
- Every page is static HTML, readable without JavaScript (ADR 0003). Client JavaScript only as an opt-in island.
- Free tiers only. If a payment method is ever added to a host, a budget alarm comes first.
- Secrets never in the repo, logs or PR text.
- Target depth: deployed, checks on every build, ADRs.
- Numbers in docs and pages: honest estimates in words, never false precision, and only numbers already in the record.
