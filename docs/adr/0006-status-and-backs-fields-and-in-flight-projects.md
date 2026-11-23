# 6. `status` and `backs` on project entries; in-flight projects go in `in_flight[]`, not `artifacts[]`

Date: 2026-11-23
Status: Accepted

## Context
The site's project cards need two things the kit's artifact format doesn't have (shaping doc, "A project card"):
- **`status`:** Live, Building, Planned or Next, so a card can be shown before its project ships and move along as it does.
- **`backs`:** which employer story the project retells in public. Each public project exists because an employer story can't be shown (Holdfast backs HYP's Stripe holds; Token Keeper backs Walgreens OAuth at Propeller and Instagram verification at HYP; and so on). The card says so and links to that story's case study.

The shaping doc assumed in-flight projects could sit in `artifacts[]` at depth 0 or 1, because the portfolio scorer only checks artifacts at depth 2 or more, and asked to confirm the extra fields don't upset `sync_check.py` or the résumé rebuilder.

**What reading and running the kit's scripts showed** (read only, 2026-11-23; run against a throwaway record in a scratch folder, nothing in the kit changed):

| Script | Reads from each artifact | Depth filter? | Effect of a depth-0 entry |
|---|---|---|---|
| `portfolio_audit.py` | `name`, `url` | yes, depth 2+ | none |
| `sync_check.py` | `name`, `url`, `repo`, `skills` | yes, depth 2+ | none |
| `resume_rebuild.py` | `name`, `url`, `one_liner`, `skills` | **no** | **listed under PROJECTS as "Built with …", and its skills added to SKILLS** |
| `linkedin_score.py` | `skills` | **no** | its skills count as "proven" |
| `github_score.py` | `repo`, `name` | no | expects its repo pinned (harmless: all five are to be pinned) |
| `screen_grade.py` | `skills`, `summary` | no (prints the depth) | counts as a portfolio hit for a qualification |

Unknown fields such as `status` and `backs` are ignored everywhere: every script reads only the keys it knows. So **the extra fields are safe, but in-flight entries in `artifacts[]` are not.** In the test run, a planned project at depth 0 came out of the rebuilder as a project "Built with Kubernetes, FastAPI", and Kubernetes landed in the SKILLS line. That's a claim nothing yet proves, on the surface where false claims cost the most.

## Options considered
1. **In-flight projects in `artifacts[]` at depth 0 or 1**, as the shaping doc assumed. One list, but the rebuilder, LinkedIn scorer and screen grader treat planned work as proof. Every résumé rebuild would need hand-editing to take it back out.
2. **Change the kit** so every script filters by depth. The right fix in the long run, but the kit isn't this repo's to edit, and it's Dan's call whether and when to change it.
3. **A sibling top-level array, `in_flight[]`,** with the same entry shape as `artifacts[]`. The kit's scripts ignore top-level keys they don't know (the record already has `_artifacts_note` and `education`), so in-flight projects reach the site and nothing else. A project moves into `artifacts[]` when it's deployed (depth 2).
4. **Keep in-flight projects out of the record**, in a site-only data file. Keeps the kit clean, but splits the record in two, against "one record, many views".

## Decision
Option 3, plus the two fields on both arrays:

- **`status`**: `"live"` for every entry in `artifacts[]`; `"building"`, `"planned"` or `"next"` for entries in `in_flight[]`.
- **`backs`**: a list of `{ "story", "org", "label" }`, where `story` is the file name (without `.md`) of an employer case study in `case-studies/`, `org` is the employer as the record names it, and `label` is the short line on the card, for example `{ "story": "real-time-bidding-stripe-holds", "org": "HYP", "label": "Stripe holds and real-time bidding" }`.
- **`name`** is the display name ("Token Keeper", "FHIR over MCP"). The site derives each slug from it, and the scorer's and brag-curator's name matching (lower case, hyphens as spaces) still works.
- **Moving a card** from `in_flight[]` to `artifacts[]` happens in the PR that sets its depth to 2 and its status to `live`, with its live `url` and its case study.

Like the rest of the record, these fields are edited in `documents/portfolio/portfolio.json` and mirrored here (ADR 0002).

The build validates this (spec §10): an `artifacts[]` entry must have `status: "live"` and depth 2 or more, and should have a `url` and a `case_study` (a warning while the site is being built, an error in the go-live check, spec §14); an `in_flight[]` entry must have depth 0 or 1 and a status other than `live`; every `backs[].story` must name a file in `case-studies/`.

Why: it keeps the record honest on every surface the kit builds from it, with no change to the kit, and the cost is one extra key.

## Consequences
- **The kit sees only shipped work.** The résumé, LinkedIn score and screen grade can't pick up a skill from a project that isn't deployed.
- **The site shows everything**, with the status on each card.
- **Brag-curator's "Portfolio artifact:" line** can name an in-flight project, since the name is in the record. The rebuilder only attaches brag bullets to `artifacts[]` names, so those bullets wait until the project ships, which is the right behaviour.
- **If the kit later filters by depth everywhere** (option 2), a new ADR can fold `in_flight[]` back into `artifacts[]`.
- **Raise the finding with the kit** (the rebuilder, LinkedIn scorer and screen grader don't filter by depth) in a kit session, if Dan wants it fixed there. Not from here.
