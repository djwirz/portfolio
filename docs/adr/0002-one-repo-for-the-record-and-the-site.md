# 2. One public repo holds the record and the site

Date: 2026-11-23
Status: Accepted

## Context
The ai-era-job-kit expects one portfolio repo holding `portfolio.json`, `brag/` and `case-studies/`, with the site behind it (the kit's `templates/portfolio-repo/README.md`). Friday Setup writes into `brag/inbox/`, brag-curator promotes to `brag/entries/`, and the scorers read `portfolio.json`.

Today the record sits in `~/projects/documents/portfolio/`, which isn't a git repo, and `~/projects/portfolio/` is an unstarted Bun + React site template. In build-plan's BACKLOG this was decision 1. The shaping session on 2026-11-23 recommended option (b) below, and Dan accepted it.

The record was written to be public-safe from the start. Everything that isn't (the never-claim list, sensitive context, private contact details, the raw role files) lives in `documents/archive/`, which stays private and is never copied here.

## Options considered
1. **(a) Two repos:** a private record repo and a public site repo that copies from it at build time. Keeps the record private, but the site build then needs access to a private repo (a deploy key or token in CI), the kit's layout is split across two places, and every change is two PRs.
2. **(b) One public repo, `djwirz/portfolio`,** holding `portfolio.json`, `brag/`, `case-studies/`, `decisions/` and the site. The kit's own layout. One PR changes the record and the pages that show it, and the site's source of truth is visible to anyone who wants to check a claim.
3. **(c) The record stays in `documents/`; the site repo reads it from a local path.** Nothing to move, but CI can't build the site, and the record has no history.

## Decision
Option (b): one public repo. Its layout follows the kit's: the record at the root (`portfolio.json`, `brag/entries/`, `case-studies/`, `decisions/`), the site under `src/`, and project docs under `docs/`. `brag/inbox/` is git-ignored and never committed.

**The record here is a mirror, not a second source** (Dan, 2026-11-23). `~/projects/documents/portfolio/` stays the one place the record is edited. A one-way sync script in this repo copies it in, and the copy is never edited by hand. The record files live in the repo only so CI can build the site and the kit's tools find the layout they expect.

Why: the record is already public-safe, the kit's tools assume this layout, and a public record behind a public site is itself a signal: every card on the site traces to a line in a file anyone can read. Mirroring rather than moving keeps one place to edit, with only Dan in the loop.

## Consequences
- **Bringing the record in is slice 1, not this PR.** The sync script only reads `documents/portfolio/`; it never edits, moves or deletes anything there. A change to the record is made in `documents/`, then synced here in a PR.
- **Fields the site needs go in `documents/` too.** `status`, `backs`, `in_flight[]` (ADR 0006) and `profile.availability` are added there, by Dan or a documents session, not here. Slice 1 writes out the exact additions for that.
- **The CI check guards the mirror:** it fails if a mirrored file differs from what the sync script would write, given a path to `documents/` locally. In CI, where `documents/` isn't available, it checks the record's validity only (spec §10).
- **The record becomes public when slice 1 merges.** Dan isn't sharing the site yet, so the read-through isn't a gate on building. It is a gate on the go-live check (spec §14): nothing is shared until every mirrored file is one Dan has read and approved.
- **Friday Setup's own PRs land here too.** Merged PRs to this repo are pulled into `brag/inbox/` like any other repo's. That's fine for site work, which is real work, but record-only PRs (a new brag entry) would be noise; run Friday Setup with `--exclude-repo portfolio` if they crowd the inbox.
- **Private things stay out by rule, and the build checks it** (spec §10): no phone number, no `brag/inbox/` content, nothing from `documents/archive/`.
- The repo's history is public, so a mistake can't be fully taken back by a later commit. Squash merges keep `main` clean, but anything pushed to a PR branch should be treated as published.
