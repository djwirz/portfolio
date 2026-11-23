# Record additions for `documents/portfolio/portfolio.json`

The record is edited in `~/projects/documents/portfolio/` and mirrored here (ADR 0002). These are the fields the site needs that the record doesn't have yet (ADR 0006, spec §8 and §14). Apply them there, by hand or in a documents session, then run `pnpm record:copy` here and open a PR.

Statuses were read from each project's repo on 2026-11-23. Skill names follow the kit's lexicon where it has one.

## 1. `profile.availability` (add inside `profile`)
```json
"availability": "Full time, open to contract. Can start any time. Ideally remote, willing to discuss."
```

## 2. `artifacts` (replace the empty list)
Live projects only (depth 2 or more). `case_study` gets added when slice 2 writes the deep dives. Token Keeper's `url` is empty on purpose: its public demo URL isn't recorded anywhere yet, so filling it in is a go-live item.
```json
"artifacts": [
  {
    "name": "Holdfast",
    "one_liner": "Real-time auctions where a bid counts only once a Stripe test-mode hold covers it",
    "status": "live",
    "backs": [
      { "story": "real-time-bidding-stripe-holds", "org": "HYP", "label": "Stripe holds and real-time bidding" }
    ],
    "url": "https://holdfast-production-ba968615.up.railway.app",
    "repo": "https://github.com/djwirz/holdfast",
    "depth": 3,
    "skills": ["TypeScript", "Node.js", "PostgreSQL", "Stripe", "Redis", "Server-Sent Events", "Playwright", "OpenTelemetry", "CI/CD"],
    "evidence": [
      "Load test of near-simultaneous bids with an invariant checker",
      "End-to-end trace of one bid",
      "ADRs 0001 to 0007",
      "CI with unit, integration and Playwright tests"
    ]
  },
  {
    "name": "Token Keeper",
    "one_liner": "Keeps third-party account connections alive: OAuth tokens refreshed and re-verified on a schedule, state reported through one signed webhook",
    "status": "live",
    "backs": [
      { "story": "walgreens-fhir-integration", "org": "Propeller Health", "label": "Partner OAuth with Walgreens" },
      { "story": "instagram-handle-verification", "org": "HYP", "label": "Instagram handle verification" }
    ],
    "url": "",
    "repo": "https://github.com/djwirz/token-keeper",
    "depth": 3,
    "skills": ["Python", "AWS Lambda", "Amazon SQS", "Amazon DynamoDB", "Amazon EventBridge", "AWS KMS", "AWS CDK", "OAuth", "CI/CD", "Observability"],
    "evidence": [
      "Concurrency test of the refresh lease",
      "Alarm drills fired live against the deployed stack",
      "ADRs 0001 to 0019",
      "CI with OIDC deploys"
    ]
  }
]
```

## 3. `in_flight` (new top-level list, beside `artifacts`)
The kit's scripts ignore this list, so planned work never shows up on a résumé as proof (ADR 0006).
```json
"in_flight": [
  {
    "name": "FHIR over MCP",
    "one_liner": "A read-only, patient-scoped MCP server over synthetic FHIR data, with an eval suite that checks every claim",
    "status": "building",
    "backs": [
      { "story": "walgreens-fhir-integration", "org": "Propeller Health", "label": "Walgreens FHIR integration" }
    ],
    "url": "",
    "repo": "https://github.com/djwirz/fhir-over-mcp",
    "depth": 1,
    "skills": ["Python", "MCP", "FHIR", "Evals", "LLM APIs"],
    "evidence": []
  },
  {
    "name": "Coverage Check",
    "one_liner": "Bulk insurance eligibility checks against an unreliable, rate-limited payer, with FHIR output, on Kubernetes",
    "status": "planned",
    "backs": [
      { "story": "insurance-eligibility-automation", "org": "Kyros", "label": "Monthly insurance eligibility checks" }
    ],
    "url": "",
    "repo": "https://github.com/djwirz/coverage-check",
    "depth": 0,
    "skills": ["Python", "FastAPI", "PostgreSQL", "FHIR", "Kubernetes", "Docker"],
    "evidence": []
  },
  {
    "name": "holdfast-ex",
    "one_liner": "Holdfast's problem solved again in Elixir/OTP: one process per auction, an append-only event log, holds derived from state",
    "status": "planned",
    "backs": [
      { "story": "real-time-bidding-stripe-holds", "org": "HYP", "label": "Stripe holds and real-time bidding, told a second way" }
    ],
    "url": "",
    "repo": "https://github.com/djwirz/holdfast-ex",
    "depth": 0,
    "skills": ["Elixir", "OTP", "Event sourcing", "PostgreSQL", "Stripe"],
    "evidence": []
  },
  {
    "name": "Respiratory view",
    "one_liner": "A SMART on FHIR app showing asthma and COPD patients' controller and rescue medication use, with an AI summary measured by evals",
    "status": "next",
    "backs": [
      { "story": "platform-consultant", "org": "Propeller Health", "label": "Provider portal and Epic" },
      { "story": "walgreens-fhir-integration", "org": "Propeller Health", "label": "Inhaler data over FHIR" }
    ],
    "url": "",
    "repo": "",
    "depth": 0,
    "skills": ["SMART on FHIR", "OAuth", "FHIR"],
    "evidence": []
  }
]
```

## Checks after applying
- `pnpm record:copy && pnpm build` here. The build fails if an `artifacts` entry isn't `live` at depth 2 or more, an `in_flight` entry is `live` or above depth 1, or a `backs[].story` has no file in `case-studies/`.
- The kit's `sync_check.py` will start expecting Holdfast and Token Keeper on the résumé, on LinkedIn and pinned on GitHub. That's correct; those surfaces get updated in later slices and phases.
