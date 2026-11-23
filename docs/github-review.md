# GitHub review (slice 5)

The GitHub side of "one record, many views" (spec §9). Every change below is outward-facing, so **each row is its own approval from Dan**: Claude shows the exact command or text, waits for a yes, runs it, then ticks the row here in a PR. Nothing runs as a batch.

State read on 2026-11-23 with `gh` (read-only): no bio, no website, location "Minneapolis, MN", no `djwirz/djwirz` repo, no website or topics on any project repo, 34 public repos.

## The outward changes

| # | Change | Exact value | Dan's yes | Done |
|---|---|---|---|---|
| 1 | Profile bio | Senior Software Engineer: healthcare integrations, payments and legacy modernization. | yes | yes |
| 2 | Profile website | https://djwirz.withered-smoke-b9b4.workers.dev | yes | yes |
| 3 | Profile location | Eau Claire, WI (Dan, 2026-11-23: currently in Eau Claire; was Minneapolis, MN) | yes | yes |
| 4 | Create public repo `djwirz/djwirz` | Description "Profile README", a one-line README to start | yes | yes |
| 5 | Profile README | A PR in `djwirz/djwirz`, from the kit's `templates/github-profile-readme.md` and the record only: [djwirz/djwirz#1](https://github.com/djwirz/djwirz/pull/1), done when Dan merges it | yes | |
| 6 | `holdfast`: website, topics | https://holdfast-production-ba968615.up.railway.app · typescript, nodejs, postgresql, stripe, redis, server-sent-events, playwright, opentelemetry | yes | yes |
| 7 | `token-keeper`: website, topics | the site's /work/token-keeper/ (until there's a live demo, go-live item 2) · python, aws-lambda, amazon-sqs, amazon-dynamodb, amazon-eventbridge, aws-kms, aws-cdk, oauth | yes | yes |
| 8 | `fhir-over-mcp`: website, topics | the site's /work/fhir-over-mcp/ · python, mcp, fhir, evals, llm | yes | yes |
| 9 | `coverage-check`: website, topics | the site's /work/coverage-check/ · python, fastapi, postgresql, fhir, kubernetes, docker | yes | yes |
| 10 | `holdfast-ex`: website, topics | the site's /work/holdfast-ex/ · elixir, otp, event-sourcing, postgresql, stripe | yes | yes |
| 11 | `portfolio`: website | https://djwirz.withered-smoke-b9b4.workers.dev | yes | yes |
| 12 | Pins | Already done by Dan: all five projects plus `portfolio` are pinned (read 2026-11-23). They show as coverage-check, fhir-over-mcp, holdfast, holdfast-ex, token-keeper, portfolio; matching the site's order (holdfast, token-keeper, fhir-over-mcp, coverage-check, holdfast-ex) means dragging them in the GitHub UI, if Dan wants that | yes | yes |

Topics come from each project's `skills[]` in `portfolio.json`, lowercased and hyphenated. A topic says what a repo uses; it doesn't claim the skill is proven (ADR 0006).

## Old public repos

Every public repo that isn't one of the five projects or this one: 28, three more than the spec first listed (the three 2015–2016 forks at the bottom). Suggestions use the least destructive option that does the job; deleting isn't suggested. Dan (2026-11-23): no per-row approval needed for these, "do what you think is best". Claude made the changes the same day; the last column is what was done.

| Repo | Fork | Archived | Last push | Suggested | Why | Done |
|---|---|---|---|---|---|---|
| bh-irv6 | | | 2026-04 | Make private | Recent but not part of the story; a reader can't tell what it is | Made private |
| padre-ginos | | | 2026-04 | Make private | Looks like a course project (verify), not Dan's own work | Made private |
| rogers-photo-gallery | | | 2025-05 | Archive | Personal project, finished | Archived |
| encore-workout-api | | | 2025-03 | Archive | One of five workout/Notion repos that overlap; reads as noise beside the five projects | Archived |
| faura-take-home | | | 2025-03 | Make private | A take-home for a company; better not public | Made private |
| workout-app-api-enco | | | 2025-03 | Archive | Workout set | Archived |
| workout-app-api | | | 2025-03 | Archive | Workout set | Archived |
| workout-app | | | 2025-03 | Archive | Workout set | Archived |
| notion-railway-api | | | 2025-03 | Archive | Workout set | Archived |
| notion-api | | | 2025-02 | Archive | Workout set | Archived |
| notion-workout-api | | yes | 2025-02 | Keep archived | Already archived | Kept archived |
| cover-letter-ai | | | 2025-01 | Archive | Superseded; the kit does this now | Archived |
| cover-letter-generation | | | 2025-01 | Archive | Same as cover-letter-ai | Archived |
| docker_postgres_with_data | yes | yes | 2022-02 | Keep archived | Fork, no changes shown; a public fork can't be made private (verify) | Kept archived |
| code-challenge-100-plus | | yes | 2021-12 | Keep archived | Already archived | Kept archived |
| smart-on-fhir-tutorial | yes | yes | 2019-08 | Keep archived | Fork, but SMART on FHIR is relevant to Respiratory view | Kept archived |
| techScreen | | | 2017-03 | Make private | Interview exercise, 2017 | Made private |
| sniptuck | | yes | 2017-02 | Keep archived | Already archived | Kept archived |
| DataStructures-Algorithms | yes | | 2016-11 | Archive | Fork, 2016; a public fork can't be made private (verify) | Archived |
| hyper | yes | | 2016-10 | Archive | Fork of someone else's product; a public fork can't be made private (verify) | Archived |
| Legit2.0 | yes | | 2016-09 | Archive | Fork, 2016; a public fork can't be made private (verify) | Archived |
| LoremIpsumElectron | | | 2016-09 | Archive | Early personal project | Archived |
| greenfield-1 | yes | | 2016-09 | Archive | Fork, bootcamp era; a public fork can't be made private (verify) | Archived |
| AWS_Tutorial | yes | | 2016-09 | Archive | Tutorial fork; a public fork can't be made private (verify) | Archived |
| react-tutorial | yes | | 2016-09 | Archive | Tutorial fork; a public fork can't be made private (verify) | Archived |
| recursion-prompts | yes | | 2016-04 | Archive | Fork, bootcamp prep; a public fork can't be made private (verify) | Archived |
| fullstack-course1-module2 | yes | | 2015-12 | Archive | Course fork; a public fork can't be made private (verify) | Archived |
| algo-time-complexity-review | yes | | 2015-10 | Archive | Fork; a public fork can't be made private (verify) | Archived |

Archiving makes a repo read-only and can be undone in its settings. Making one private can be undone too, but it drops the repo's stars and watchers, and they don't come back when it's made public again (verify).

## Checks (2026-11-23, after rows 1–11)

- `sync_check.py --portfolio portfolio.json --github djwirz`: 4 of 4 checks agree (the bio names the target role, the website links the site, both live projects are pinned). Acceptance §12 item 7 passes.
- `github_score.py --user djwirz --repos holdfast,token-keeper,fhir-over-mcp,coverage-check,holdfast-ex,portfolio --onet 15-1252.00`: 82 out of 100. The profile checks and every topic and website check this slice touched pass. What it still finds, none of it part of this slice:
  - **No license** on any of the six repos.
  - **Short READMEs, no tests or CI** on the in-flight repos (Coverage Check, holdfast-ex, and the FHIR over MCP README). Expected at depth 0–1; they grow as each project is built.
  - **No topics on `portfolio`.** Not planned in this slice.
  - **Lane skills the pins don't show** (Angular, Kafka, Azure, C#, C++): O*NET's broad lane, not Dan's target. Not chased (problem first).
