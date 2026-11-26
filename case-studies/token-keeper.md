# Third-party account connections that stay alive: OAuth tokens refreshed safely under concurrency, on AWS

**Live:** demo URL to be added · **Code:** https://github.com/djwirz/token-keeper · **Skills proven:** Python, AWS Lambda, Amazon SQS, Amazon DynamoDB, Amazon EventBridge, AWS KMS, AWS CDK, OAuth, CI/CD, Observability

## The story
**Context.** Apps that act on a user's third-party account all need the same unglamorous machinery: run the OAuth consent, store tokens safely, refresh them before they expire, notice when the user revokes access, and tell the product what state each connection is in. Token Keeper is that machinery as a small connector service for one provider, GitHub. It's a public version of patterns I used for partner OAuth at Propeller Health and for Instagram handle verification at HYP. Instagram's long-lived token and GitHub's user tokens pose the same problem, a credential that lapses at a hard cliff unless it's renewed, and GitHub adds a twist: each refresh token works only once.

**My role and constraints.** Solo project, AI-assisted (Claude Code). Built on my own AWS account with a budget alarm created before the first deploy, and against my own GitHub account. The project had to prove four things: the refresh lifecycle survives concurrency, tokens stay safe, it's deployed and operable, and a viewer can see it working. One provider, one deployed environment, no token vending.

**Key decisions.**
1. **A GitHub App with expiring user tokens and no permissions.** Public data needs none, and the 8-hour and 6-month tokens give something real to keep alive. ([ADR 0002](https://github.com/djwirz/token-keeper/blob/main/docs/adr/0002-github-app-with-expiring-user-tokens.md))
2. **A scheduler, a planner, a queue and a worker, with a DynamoDB lease per account.** Because refresh tokens are single-use, two concurrent refreshes would lose the account, so the worker only refreshes under a lease and uses only the tokens the lease write returned. ([ADR 0004](https://github.com/djwirz/token-keeper/blob/main/docs/adr/0004-planner-sqs-worker-schedule.md))
3. **Field-level KMS encryption of tokens,** with a customer-managed key. ([ADR 0003](https://github.com/djwirz/token-keeper/blob/main/docs/adr/0003-field-level-kms-encryption.md))
4. **Standard Webhooks signing with full-state, versioned events,** so the main app can dedupe and reorder on the version alone. ([ADR 0005](https://github.com/djwirz/token-keeper/blob/main/docs/adr/0005-standard-webhooks-full-state-events.md))
5. **AWS CDK in Python instead of Terraform:** one language across the repo, with least-privilege IAM grants that are unit-tested. ([ADR 0006](https://github.com/djwirz/token-keeper/blob/main/docs/adr/0006-aws-cdk-python-for-iac.md))
6. **Instant revocation through GitHub's App webhook,** so revoking access in GitHub's settings flips the account within seconds. ([ADR 0010](https://github.com/djwirz/token-keeper/blob/main/docs/adr/0010-github-revocation-webhook.md))

**What went wrong.** The mistakes fell into patterns:
- **Tests that claimed more than they checked.** A concurrency test for a stale read had nothing stale in it; a deliberate mutation passed every test until it was rewritten, and mutation checks became routine after that. A token-in-logs test left third-party loggers below the level it claimed.
- **Confident claims about other systems that were wrong.** An OIDC trust scoped to both a branch and an environment couldn't work, because GitHub's token carries no branch when a job uses an environment. A claim that an AWS feature was free would have forced a paid plan; I caught it before clicking.
- **Bugs only a real deploy or browser showed,** such as a content security policy that blocked the redirect to GitHub, twice.
- **Design over-reach I cut:** a circuit breaker for day-long outages, and deploy-first slicing where local-first suited the project better.

**Result.** Spec to a deployed, alarmed system in under four days, against an appetite of one to two weeks. Proven live, not just tested: real refresh-token rotations; IAM conditions checked with real calls; revocation flipping the account within seconds and a reconnect flipping it back; and all three alarms fired on purpose and recovered.

## The evidence
- Tests and CI: lint, types and a few hundred tests on every pull request, CDK synth and a `cdk diff` posted to each PR, deploys from `main` through OIDC after an approval.
- A concurrency test of the refresh lease, and mutation checks against the important tests.
- Observability: structured logs with correlation ids, metrics, a dashboard, and three alarms, each with a runbook entry and a live drill.
- Trade-offs left out on purpose and written down: the bootstrap role's broad permissions, a hot index partition far beyond demo scale, and the lost-rotation risk GitHub's docs leave open.
- What I'd do next: the demo GIF and a public demo URL, then a second provider behind the same narrow interface.
