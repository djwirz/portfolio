# ADR-001: Run insurance eligibility workers on pg-boss inside the monolith

- Status: accepted (Kyros, 2023–2024; I wrote the RFC recommending option 1, the team chose option 2)
- Date: 2023–2024 (open for review for about a week)

## Context
Kyros needed to re-verify insurance every month for 1,000–2,000 active patients through the Inovalon eligibility API, which was already contracted. Each patient is a separate request. Responses ranged from about 200 ms to five minutes, slow ones were usually about to fail on the vendor's side, and the vendor was wary of more than 200 requests per minute. The product was a React, TypeScript and Express monolith on PostgreSQL (AWS RDS), deployed to ECS through Travis CI. The engineering team was two leads, one senior (me), one mid-level and three junior engineers. The manager already favored pg-boss.

## Options considered
1. **AWS SQS with Lambda workers, potentially with a database for results** (my recommendation)
   - Pros: queueing and worker behavior visible out of the box; dead-letter queues built in; isolated from the monolith's workers and deployment instances; keeps queue load off a PostgreSQL database that already had cleanup work in progress; a pattern I had used before.
   - Cons: a new deployment path and new infrastructure the team would have to learn and own; more moving parts for junior engineers to reason about.
2. **pg-boss inside the monolith** (chosen)
   - Pros: a PostgreSQL-backed queue that fits the existing stack and deployment; its abstractions can be hidden behind simple interfaces, so more of the team can pick up the work confidently.
   - Cons: adds queue load to the main database; worker and deployment-instance concerns move into the monolith; retries and dead-lettering have to be designed rather than configured.

## Decision
Run the eligibility jobs on pg-boss inside the monolith.

## Why
The two lead engineers, who gave most of the RFC feedback, judged that pg-boss would let the whole team, most of it junior, work on the system confidently. I recommended SQS and Lambda, but I agree the tradeoff was valid: sometimes the best answer is the one the most people on the team can work with confidently.

## Consequences
- I designed the workflows within pg-boss: one job per patient, a cap of 20 concurrent workers (125–150 requests per minute under the vendor's 200-per-minute ceiling), graceful failure that marks a patient for retry, and batch reruns when the vendor had problems.
- Misses and unresolved cases surfaced on the exception dashboard staff already used.
- To trust the error handling, I pushed past the vendor's rate limits in its test environment to surface every failure mode before rollout.
