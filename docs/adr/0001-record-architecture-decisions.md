# 1. Record architecture decisions

Date: 2026-11-23
Status: Accepted

## Context
This repo holds Dan's career record and the site built from it, and it's built in the open with Claude Code. Decisions made in chat are lost, and decisions made silently in code are hard to review or explain later. The same rule already works in token-keeper and holdfast.

## Options considered
1. **ADRs in the repo**, reviewed in pull requests like code.
2. **Decisions in PR descriptions only.** No extra files, but scattered and hard to find once merged.
3. **A single design doc kept up to date.** One place to read, but the history of why things changed is lost.

## Decision
Option 1. Every decision that would be expensive to reverse gets a short ADR in `docs/adr/`, numbered in order, with the sections Context, Options considered, Decision (including why) and Consequences. That's the kit's `templates/adr.md` with its "Why" folded into Decision, matching the other project repos.

An ADR is written with `Status: Accepted` in the pull request that introduces it. The PR is where it's debated, and merging is the acceptance. A merged ADR isn't rewritten: to change a decision, a new ADR supersedes it, and the old one stays, marked "Superseded by N". Typos and broken links can be fixed in place.

## Consequences
- Reviewers, later Claude sessions and the site's /how-i-build/ page can all point at why the site looks the way it does.
- No status bookkeeping after merge, and the record of changed minds stays intact.
- Small cost per decision; trivial choices don't need one.
- Career-record decisions that predate this repo (for example `decisions/adr-001-eligibility-workers.md` in the record) are a different thing: they describe employer work and come in with the record in slice 1, outside `docs/adr/`.
