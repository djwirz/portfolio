# Many bids at once, one agreed order: recording a bid storm and showing what happened

**Live:** https://bid-storm.pages.dev · **Code:** https://github.com/djwirz/bid-storm · **Skills proven:** Go, Load testing, Server-Sent Events, Python, DuckDB, TypeScript, CI/CD

![Price staircase of one recorded storm: accepted bids climb in steps, with the bids that did not count marked around them](https://raw.githubusercontent.com/djwirz/bid-storm/main/docs/img/staircase.png)

## The story
**Context.** [Holdfast](https://github.com/djwirz/holdfast) is my auction project, where a bid counts only once a card hold covers it. A load test can say that held up and leave you to take its word. bid-storm records each stage of a storm of simultaneous bids, so the claim can be looked at.

**My role and constraints.** Solo project, AI-assisted (Claude Code). Synthetic users and auctions, local targets, a stand-in for Stripe, free hosting.

**Key decisions.**
1. **Send on schedule, whether or not replies have come back.** The schedule is seeded and saved, so a slow target can't slow the load and flatter itself. ([ADR 0004](https://github.com/djwirz/bid-storm/blob/main/docs/adr/0004-open-model-seeded-schedule.md))
2. **Watch card holds from a proxy** between the target and the payment fake, so the target needs no changes. ([ADR 0003](https://github.com/djwirz/bid-storm/blob/main/docs/adr/0003-recording-proxy-for-holds.md))
3. **One gate for every recording.** A run that can't show a claim fails, so "passed" never includes "not checked". ([ADR 0008](https://github.com/djwirz/bid-storm/blob/main/docs/adr/0008-end-of-run-evidence-and-checks.md))
4. **Prepared data for the first views.** The in-browser database was over the host's file size limit, so the page reads a small file built from the recording. ([ADR 0009](https://github.com/djwirz/bid-storm/blob/main/docs/adr/0009-prepared-json-for-the-first-views.md))

**What went wrong.** The converter stored bidder numbers as text, and its tests passed because none checked column types. The site's data showed it.

**Result.** The page is live and shows one recorded storm: a few hundred bids from a few dozen synthetic bidders, one agreed order, and every accepted bid held before any subscriber heard of it.

## The evidence
- The recording passes every check, and the page says beside each one what it can't show.
- CI storms a pinned Holdfast on every pull request, checks the recording, then breaks a copy and requires the check to fail.
- Unit tests in Go, Python and TypeScript, browser and accessibility tests on the page, and a secret scan.
- Known limits: one run on one laptop, a payment fake rather than Stripe, and nothing measured about capacity or the network.
- Next: latency, then failures and recovery, then sweeps.
