# 7. Keep the tooling small: Cloudflare's Git integration, the build as the record check, the kit's scorer as the page check

Date: 2026-11-23
Status: Accepted. Supersedes ADR 0004's deploy method (Actions and Wrangler) and ADR 0002's mirror check. Cloudflare Pages as the host (ADR 0004) and the mirror itself (ADR 0002) stand.

## Context
Reviewing the plan after PR #1 merged, Dan asked whether it was over-engineered. It was, in one layer. The core holds up: one repo, static Astro pages, the record mirrored from `documents/portfolio/`, and `in_flight[]`. But the checking and automation around it was sized for a team making frequent changes:
- a sync script, plus a CI check that the mirror matches `documents/` (which CI can't see, so that check could never run there);
- a separate record-check script with unit tests and a `--go-live` mode;
- a custom checker over the built pages, axe in CI, and an external link check;
- deploys from Actions with Wrangler, an API token and two GitHub secrets;
- a script to generate the GitHub profile README;
- a Shipped log page, with nothing to show until Friday Setup is in use (weeks away).

The real shape of the work: a handful of record changes and a few project launches, almost all made by Claude in a chat session and reviewed by Dan in a PR.

## Options considered
1. **Keep the plan as written.** Every check is automated, but it means about as much tooling code as site code, all of it to maintain.
2. **Lean on what already exists:** Astro's content schema as the record check, the kit's `portfolio_audit.py` as the page check, Cloudflare's own Git integration for deploys and previews, and checklists in the spec for what a person checks.
3. **No checks at all.** Least work, but a bad record or a phone number could reach the site unnoticed.

## Decision
Option 2:
- **Mirror:** one copy command in the README, which Claude runs in a PR. No sync script, no mirror check.
- **Record check:** the zod schema in Astro's content config (it fails the build on a bad record), plus a few lines in the same config that fail on a `phone` key, a `status: raw` brag file, or a `highlights` or `backs` ref that doesn't resolve. Missing URLs show on the page as missing links, not as warnings in a script.
- **Page check:** the kit's `portfolio_audit.py` against the live site, at the deploy slice and at go-live. Lighthouse once by hand on home, /work/ and /resume/.
- **Deploy:** Cloudflare Pages' Git integration builds on push to `main` and gives PR previews. No workflow, no API token, no secrets. Connecting it is one approval from Dan.
- **CI:** gitleaks, plus `astro build` on every PR so a bad record fails before merge.
- **Profile README:** hand-written from the kit's template, and updated by Claude when a project ships.
- **Shipped log:** cut until Friday Setup is in use.
- **The go-live check:** a checklist in the spec that Dan and Claude walk through, not a script mode.

Why: each of these replaces code we'd write and maintain with something that already exists, and the checks that matter (a bad record, private data, the scorer's view of the site) are still made.

## Consequences
- The slice plan drops from nine slices to five (spec §13). Slice numbers in ADRs 0002–0006 refer to the old plan; spec §13 is current.
- The build config lives partly in Cloudflare's dashboard (the build command and output folder). It's two settings, written down in the README.
- The scorer checks the live site, not each PR. A regression in a page's HTML can merge and get caught at the next scorer run. That's an acceptable risk for a site with one author.
- **Revisit** if the record starts changing often or someone else contributes: that's when the scripts would earn their place.
