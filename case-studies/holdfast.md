# A bid counts only once a card hold covers it: live auctions that stay correct under a storm of near-simultaneous bids

**Live:** https://holdfast-production-ba968615.up.railway.app · **Code:** https://github.com/djwirz/holdfast · **Skills proven:** TypeScript, Node.js, PostgreSQL, Stripe, Redis, Server-Sent Events, Playwright, OpenTelemetry, CI/CD

## The story
**Context.** Timed auctions with real money have to make two things true at the same moment: the highest bid wins, and the winner can pay. The usual shortcuts each break one of them. Taking bids first and charging later leaves unpaid winners; a flat deposit doesn't cover a bid bigger than the deposit; and check-then-insert code under load lets two bids at the same price both "win". Holdfast is a public rebuild of a problem I worked on as a founding engineer at HYP, solved from scratch with synthetic data and Stripe test mode.

**My role and constraints.** Built by me with Claude Code, in the open. Stripe test mode only, synthetic auctions only, free or hobby hosting tiers with a hard spending limit, and a narrow, testable claim: a bid is accepted only after a Stripe authorization hold for its full amount exists, bids are ordered by one Postgres transaction under a row lock, and every hold that stops mattering is released. Five written invariants say it precisely, and everything in the project exists to keep them true or to prove they are.

**Key decisions.**
1. **Hold, then commit.** The hold is placed at Stripe outside any transaction; only then does one short transaction lock the auction row and accept or refuse the bid. A bid that loses the race keeps nothing. ([ADR 0002](https://github.com/djwirz/holdfast/blob/main/docs/adr/0002-hold-then-commit-bid-flow.md))
2. **Side effects through a transactional outbox, plus a reconciler.** Releasing holds, capturing the winner and announcing changes are rows written with the decision, carried out by a worker with retries; the reconciler finishes anything a crash left half done. ([ADR 0003](https://github.com/djwirz/holdfast/blob/main/docs/adr/0003-transactional-outbox-and-reconciler.md))
3. **Live updates over Server-Sent Events, fanned out through Redis.** Redis is only a doorbell and Postgres holds the content, so a missed message costs a refetch, never a wrong price. ([ADR 0004](https://github.com/djwirz/holdfast/blob/main/docs/adr/0004-sse-with-redis-fanout.md))
4. **One PaymentIntent per bid, and a stateful Stripe fake for load tests.** Incremental authorization would have been neater; tried in test mode, a standard account isn't eligible. ([ADR 0006](https://github.com/djwirz/holdfast/blob/main/docs/adr/0006-one-paymentintent-per-bid-and-stripe-fake.md))
5. **Railway, all in one:** two replicas, Postgres and Redis on one bill with a hard spending limit. ([ADR 0007](https://github.com/djwirz/holdfast/blob/main/docs/adr/0007-host-the-demo-on-railway.md))

**What went wrong.** The mistakes clustered in two places, and most of them were the AI's:
- **Stale assumptions about outside systems.** It assumed a Stripe idempotency key always replays the original result; Stripe's docs say a server error is replayed for a day and a concurrent request gets a conflict, which would have left bids pending for a day. Caught by reading the docs in the real-Stripe slice; the fake now models both. It also assumed Railway's config file applied to a new service, so migrations never ran on the first deploys, which was caught in production.
- **Tests that passed for the wrong reason.** Two load runs "passed" with no bids at all, because a sign-in rate limit stopped the setup. Runs now require accepted bids, and every test that could pass vacuously has a non-triviality check.
- **Real bugs the design's own checks found.** The invariant checker caught a double cancellation about one run in forty, and a Stripe fake per server process that couldn't cancel a hold placed through the other instance.

**Result.** Live, with two replicas, traced and alerted. A storm of about three thousand near-simultaneous bids at one auction, through two instances, ends with the invariant checker finding no violations, and CI runs a smaller storm with the same checker on every pull request.

## The evidence
- Load test: the storm chart and the invariant checker, in the repo's README.
- One production bid traced end to end, from the request through the card hold and the locked decision to the live update on the other replica.
- Alerts for orphaned holds, outbox work that gave up, and winners never charged, each fired once on purpose and resolved by its runbook.
- Tests and CI: unit, integration (real Postgres and Redis), Playwright with two bidders, and a short load test with the invariant checker on every pull request; a smoke test after every deploy.
- A demo GIF recorded by a script against real Stripe test mode, which fails unless Stripe's own record shows every losing hold released and the winner's captured.
- What I'd do next: a soft close (a late bid extends the auction), proxy bidding, and a small Go bid-storm CLI for load runs from outside Node.
