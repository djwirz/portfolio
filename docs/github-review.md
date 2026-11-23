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
| 9 | `coverage-check`: website, topics | the site's /work/coverage-check/ · python, fastapi, postgresql, fhir, kubernetes, docker | | |
| 10 | `holdfast-ex`: website, topics | the site's /work/holdfast-ex/ · elixir, otp, event-sourcing, postgresql, stripe | | |
| 11 | `portfolio`: website | https://djwirz.withered-smoke-b9b4.workers.dev | | |
| 12 | Pins | Already done by Dan: all five projects plus `portfolio` are pinned (read 2026-11-23). They show as coverage-check, fhir-over-mcp, holdfast, holdfast-ex, token-keeper, portfolio; matching the site's order (holdfast, token-keeper, fhir-over-mcp, coverage-check, holdfast-ex) means dragging them in the GitHub UI, if Dan wants that | yes | yes |

Topics come from each project's `skills[]` in `portfolio.json`, lowercased and hyphenated. A topic says what a repo uses; it doesn't claim the skill is proven (ADR 0006).

## Old public repos

Every public repo that isn't one of the five projects or this one: 28, three more than the spec first listed (the three 2015–2016 forks at the bottom). Suggestions use the least destructive option that does the job; deleting isn't suggested. **Dan decides each row, and each change is its own approval.**

| Repo | Fork | Archived | Last push | Suggested | Why | Dan's decision |
|---|---|---|---|---|---|---|
| bh-irv6 | | | 2026-04 | Make private | Recent but not part of the story; a reader can't tell what it is | |
| padre-ginos | | | 2026-04 | Make private | Looks like a course project (verify), not Dan's own work | |
| rogers-photo-gallery | | | 2025-05 | Archive | Personal project, finished | |
| encore-workout-api | | | 2025-03 | Archive | One of five workout/Notion repos that overlap; reads as noise beside the five projects | |
| faura-take-home | | | 2025-03 | Make private | A take-home for a company; better not public | |
| workout-app-api-enco | | | 2025-03 | Archive | Workout set | |
| workout-app-api | | | 2025-03 | Archive | Workout set | |
| workout-app | | | 2025-03 | Archive | Workout set | |
| notion-railway-api | | | 2025-03 | Archive | Workout set | |
| notion-api | | | 2025-02 | Archive | Workout set | |
| notion-workout-api | | yes | 2025-02 | Keep archived | Already archived | |
| cover-letter-ai | | | 2025-01 | Archive | Superseded; the kit does this now | |
| cover-letter-generation | | | 2025-01 | Archive | Same as cover-letter-ai | |
| docker_postgres_with_data | yes | yes | 2022-02 | Make private | Fork, no changes shown | |
| code-challenge-100-plus | | yes | 2021-12 | Keep archived | Already archived | |
| smart-on-fhir-tutorial | yes | yes | 2019-08 | Keep archived | Fork, but SMART on FHIR is relevant to Respiratory view | |
| techScreen | | | 2017-03 | Make private | Interview exercise, 2017 | |
| sniptuck | | yes | 2017-02 | Keep archived | Already archived | |
| DataStructures-Algorithms | yes | | 2016-11 | Make private | Fork, 2016 | |
| hyper | yes | | 2016-10 | Make private | Fork of someone else's product | |
| Legit2.0 | yes | | 2016-09 | Make private | Fork, 2016 | |
| LoremIpsumElectron | | | 2016-09 | Archive | Early personal project | |
| greenfield-1 | yes | | 2016-09 | Make private | Fork, bootcamp era | |
| AWS_Tutorial | yes | | 2016-09 | Make private | Tutorial fork | |
| react-tutorial | yes | | 2016-09 | Make private | Tutorial fork | |
| recursion-prompts | yes | | 2016-04 | Make private | Fork, bootcamp prep | |
| fullstack-course1-module2 | yes | | 2015-12 | Make private | Course fork | |
| algo-time-complexity-review | yes | | 2015-10 | Make private | Fork | |

Archiving makes a repo read-only and can be undone in its settings. Making one private can be undone too, but it drops the repo's stars and watchers, and they don't come back when it's made public again (verify).
