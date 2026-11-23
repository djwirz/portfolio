# portfolio: instructions for Claude

Dan's public portfolio repo: the career record (`portfolio.json`, `brag/`, `case-studies/`, `decisions/`) and the static site built from it, in one repo (ADR 0002). One record, many views: the site, the GitHub profile README, the résumé and LinkedIn are all built from the record. Use they/them for Dan.

## Status
PR #1: the spec, the artifact spec and ADRs 0001–0006. Nothing built yet. The slice plan is `docs/spec.md` §13; open questions are §14. The Bun + React template files in the working tree are untracked on purpose and get replaced in slice 2 (ADR 0003).

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
- **The record here is a mirror** of `~/projects/documents/portfolio/`, the one place it's edited (ADR 0002). Never edit the mirrored files by hand: a record change is made in `documents/` (by Dan or a documents session), then synced here with the sync script in a PR. **Never edit, move or delete anything under `~/projects/documents` or `~/projects/ai-era-job-kit`.** Read the kit's templates and scripts; never change them.
- **The site isn't shared yet.** Build the structure; missing URLs and an unfinished read-through are warnings, not blockers. Everything that must be true before sharing is in the go-live check (spec §14).
- **`~/projects/documents/archive/` is private.** Read it (especially the guardrails and the never-claim list) before writing or rewording anything about employer work, and never copy, quote or summarize it here, in PR descriptions included.
- `brag/inbox/` is git-ignored and never committed. Only curated entries (`status: curated`) feed the site.
- No phone number anywhere in the repo or on the site. The email comes only from `profile.email` (ADR 0005).
- Projects that aren't deployed go in `in_flight[]`, never in `artifacts[]` (ADR 0006). A project moves to `artifacts[]` in the PR that makes it depth 2, live, with a case study.
- Every `highlights` ref in `portfolio.json` must match a `### heading` in `brag/entries` (file#slug), and every `backs[].story` a file in `case-studies/`.

## Constraints
- Never employer code, data or names beyond what's public and in the record. Synthetic or public data only.
- TypeScript here (a site is where it fits); Python is fine for small record scripts if it fits better.
- Every page is static HTML, readable without JavaScript (ADR 0003). Client JavaScript only as an opt-in island.
- Free tiers only. If a payment method is ever added to a host, a budget alarm comes first.
- Secrets never in the repo, logs or PR text.
- Target depth: deployed, checks on every build, ADRs.
- Numbers in docs and pages: honest estimates in words, never false precision, and only numbers already in the record.
