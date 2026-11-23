# Portfolio

Dan Wirz's career record and the site built from it. The record (`portfolio.json`, curated brag entries and case studies) is the source; the site, the GitHub profile, the résumé and LinkedIn are views of it. Each public project is shown beside the employer story it retells.

**Status:** planning. PR #1 holds the spec and ADRs; nothing is built yet. Design: [docs/spec.md](docs/spec.md), [docs/artifact-spec.md](docs/artifact-spec.md) and [docs/adr/](docs/adr/).

## How it fits together
- **The record:** the [ai-era-job-kit](https://github.com/Vets-Who-Code/ai-era-job-kit)'s portfolio format, with two extra fields (`status`, `backs`) and an `in_flight` list for projects that haven't shipped ([ADR 0006](docs/adr/0006-status-and-backs-fields-and-in-flight-projects.md)).
- **The site:** every page pre-rendered to static HTML with Astro ([ADR 0003](docs/adr/0003-pre-render-every-page-with-astro.md)), hosted on Cloudflare Pages ([ADR 0004](docs/adr/0004-host-on-cloudflare-pages.md)).
- **The projects:** [Holdfast](https://github.com/djwirz/holdfast), [Token Keeper](https://github.com/djwirz/token-keeper), [FHIR over MCP](https://github.com/djwirz/fhir-over-mcp), [Coverage Check](https://github.com/djwirz/coverage-check) and [holdfast-ex](https://github.com/djwirz/holdfast-ex), each its own repo.

## Layout (once slices 1 and 2 land)
| Path | What |
|---|---|
| `portfolio.json` | The master record: profile, links, experience, artifacts, in-flight projects, education |
| `brag/entries/` | Curated, public-safe accomplishments |
| `brag/inbox/` | Raw pulls; git-ignored, never committed |
| `case-studies/` | Employer stories and one deep dive per project |
| `decisions/` | Decision notes about employer work |
| `src/` | The site |
| `docs/` | Spec, artifact spec, ADRs |

## Checks
Secret scan with [gitleaks](https://github.com/gitleaks/gitleaks) on every PR. The record check, build and page checks arrive in slices 1 and 2.
