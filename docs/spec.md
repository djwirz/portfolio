# Portfolio: spec

Status: Draft for PR #1 · Date: 2026-11-23 · Owner: Dan

The shape comes from a shaping session on 2026-11-23 (build-plan's `research/portfolio-shaping-2026-11-23.md`), modelled on the general idea of Jerome Hardaway's GitHub profile and site, not their look. Dan accepted all of its recommendations. The judgment behind the project is in [artifact-spec.md](artifact-spec.md).

## 1. Problem
Dan's strongest work (Walgreens and Express Scripts integrations at Propeller, Stripe-held real-time bidding at HYP, eligibility automation at Kyros) can't be shown: no public code, no live links. Since 2026-11-18, Dan has been building public projects that solve the same problems again in the open, each with a spec, ADRs, tests, CI and a deploy. Two are live and four more are on the way.

Nothing yet ties them together. The career record that tells the story lives in a private folder, the GitHub profile is mostly old tutorials, and there's no site. A recruiter has no single place to see the role, the proof and a way to get in touch; a hiring manager can't see which public project backs which résumé line; and the kit's scorers have no site to read.

This repo is that place: **one record, many views.** `portfolio.json`, `case-studies/` and `brag/entries/` are the source; the site, the GitHub profile README, the résumé and (last) LinkedIn are views of it. Adding a project means one entry in the record and one case study, and it then shows up everywhere.

## 2. Non-goals (v1)
- **A blog or writing section.** /writing/ waits for roadmap phase 8. Until then the scorer's "links to writing" check fails, on purpose.
- **Testimonials or press**, until there are some.
- **Role pages per job family**, until kit step 1 shows which lanes to target.
- **A contact form** (ADR 0005), comments, or analytics beyond the host's own.
- **Client-side interactivity by default** (ADR 0003). Anything interactive is an island and the page works without it.
- **Editing the kit** or anything under `~/projects/documents`. The record is copied in; the kit is read, never changed.
- **Résumé files** (PDF, DOCX). /resume/ is an HTML page that prints to PDF; tailored résumés are made with the kit, outside any git repo.

## 3. Appetite
- **Time:** about a day or so of sessions after ADR 0007's trims (the roadmap's phase 6 said two to three days), including each project's case study. With the spec-first, thin-slice method the build so far has gone faster than planned, but the parts that don't compress here are Dan's read-through of the record, writing the deep dives honestly, and each outward GitHub step.
- **Money:** nothing. Free hosting tier, no domain at first.
- **Shape:** five PRs after the spec (§13), each reviewable on its own preview URL once deploys are connected. Tooling is kept small (ADR 0007): what already exists does the checking.
- **If time runs short, cut in this order:** the /decisions/ index; /how-i-build/ beyond one page of prose; the custom-domain step; the old-repo review (it's a list for Dan; doing it can wait).
  **Never cut:** static HTML for every page, the schema and privacy checks in the build, the "Backs" link on every card, /recruiters/, /resume/, the contact path, and Dan's approval on every outward GitHub change.

## 4. The record
### Layout (from the kit's `templates/portfolio-repo/README.md`)
```
portfolio.json          master record: profile, links, experience, artifacts, in_flight, education, brag paths
brag/
  entries/*.md          curated, public-safe accomplishments (committed)
  inbox/                raw Friday Setup pulls and unconfirmed claims (git-ignored, never committed)
case-studies/*.md       employer stories, and one deep dive per public project
decisions/*.md          the record's decision notes about employer work
src/                    the site (Astro, ADR 0003)
docs/                   this spec, the artifact spec, ADRs
```

### Where it comes from
`~/projects/documents/portfolio/` is the one place the record is edited (ADR 0002). This repo holds a mirror of `portfolio.json`, `brag/entries/`, `case-studies/` and `decisions/`, refreshed by one copy command in the README that Claude runs in a PR (ADR 0007). The mirror is never edited by hand; a record change is made in `documents/`, then copied here. The command only reads `documents/`, and never edits, moves or deletes anything there. `brag/inbox/` isn't mirrored, and `.gitignore` ignores it whatever lands there. **`documents/archive/` is never copied, quoted or summarized here.** It's read only to keep the site honest (§10).

Fields the site needs that the record doesn't have yet (`status`, `backs`, `in_flight[]`, `profile.availability`) are added in `documents/` too, by Dan or a documents session. Slice 1 writes out the exact additions for that.

### Additions to the kit's format (ADR 0006)
- **`status`** and **`backs`** on every project entry.
- **`in_flight[]`**: Building, Planned and Next projects, with the same entry shape as `artifacts[]`. The kit's scripts ignore it, so planned work never reaches a résumé, LinkedIn score or screen grade as proof. A project moves to `artifacts[]` when it's deployed.

An entry, for example:
```json
{
  "name": "Holdfast",
  "one_liner": "Real-time auctions where a bid counts only once a Stripe hold covers it",
  "status": "live",
  "backs": [{ "story": "real-time-bidding-stripe-holds", "org": "HYP", "label": "Stripe holds and real-time bidding" }],
  "url": "https://holdfast-production-ba968615.up.railway.app",
  "repo": "https://github.com/djwirz/holdfast",
  "depth": 3,
  "skills": ["TypeScript", "Node.js", "PostgreSQL", "Stripe", "Redis", "Playwright", "OpenTelemetry"],
  "evidence": ["load test of near-simultaneous bids with an invariant checker", "end-to-end trace of one bid", "ADRs 0001–0007", "CI with E2E"],
  "case_study": "case-studies/holdfast.md"
}
```
Skill names on cards use the same names as the résumé (the kit's lexicon), so the scorers match them.

## 5. Site map
| Page | What's on it | Comes from |
|---|---|---|
| **Home** `/` | One H1 with the role ("Senior Software Engineer"), "Eau Claire, WI · remote", a two-line summary, buttons for "See the work" (/work/) and "Recruiter fast lane" (/recruiters/), the project cards in lineup order | `profile`, `artifacts`, `in_flight` |
| **/work/** | Every project as a card, live ones first, then Building, Planned, Next | `artifacts`, `in_flight` |
| **/work/&lt;slug&gt;/** | The project's deep dive: its case study (kit `templates/case-study.md`: outcome-first title; live, code and skills line; context, role and constraints, key decisions with ADR links, what went wrong including where AI was wrong, result; evidence). In-flight projects get a short page: the one-liner, the status, what it backs, the repo and its spec | `case-studies/<slug>.md`, the entry |
| **/experience/&lt;slug&gt;/** | An employer story (the nine case studies in the record), with a "Proved in public by" line linking back to the projects that back it | `case-studies/<story>.md`, reverse of `backs` |
| **/resume/** | HTML résumé, generated from the record, that prints to PDF. Email, no phone. Projects from `artifacts[]` only | `profile`, `experience` with `highlights` → `brag/entries`, `artifacts`, `education` |
| **/recruiters/** | Key facts (role, location, remote, availability from `profile.availability`: full time, open to contract, can start any time, ideally remote, core skills), three proof links (Holdfast live, Token Keeper, FHIR over MCP's eval results once they exist), email and LinkedIn | `profile`, `artifacts`, `links` |
| **/about/** | Bio: Propeller, HYP, Kyros, the family business, teaching at Reboot Kamp, the UW research and poster | `profile`, `experience`, `education` |
| **/contact/** | Email (`mailto:`) and LinkedIn (ADR 0005) | `profile.email`, `links` |
| **/how-i-build/** | The method: spec and ADRs as PR #1, thin local-first slices, a live proof for each deploy step, Claude Code writing and Dan reviewing, and where AI was wrong (with links to real PR descriptions) | written once |
| *Later:* /shipped/, /decisions/, /writing/ | A Shipped log of curated wins with a public proof link, once Friday Setup is in use (ADR 0007); an index of every ADR across the project repos; case-study posts (phase 8) | `brag/entries`, each repo's `docs/adr/` |

Every page has the same header (Work, Résumé, Recruiters, About, Contact) and a footer linking to GitHub, LinkedIn and /contact/, so every page has a contact path and a résumé link.

### A project card
| Shows | From |
|---|---|
| Name and one line | `name`, `one_liner` |
| Status badge: Live · Building · Planned · Next | `status` |
| "Backs: Stripe holds and real-time bidding at HYP" → /experience/&lt;story&gt;/ | `backs` |
| Stack tags | `skills` |
| Up to three proof bullets | `evidence` |
| Links: Live · Code · Deep dive (only those that exist) | `url`, `repo`, `/work/<slug>/` |

## 6. Build
- **Astro, static output, TypeScript, Tailwind** (ADR 0003). No client JavaScript by default.
- **The record** is loaded once in `src/lib/record.ts`: `portfolio.json` parsed with zod, and the brag entries and case studies read as raw text at build time (`import.meta.glob`). Brag entries go through a small parser of the kit's format (`## Org`, `### Accomplishment`, `- Impact:`, `- Skills:`, `- Portfolio artifact:`, `- Proof:`), for the highlight check and /resume/. The schema and checks are the record check (§10). Slice 2 may move the case studies into a content collection, to render their Markdown.
- **Slugs** come from the record: a project's from its `name`, a story's from its file name.
- **Head tags on every page:** `<html lang="en">`, a title of at least a few words, a description of a sentence or two, the viewport meta, an Open Graph title, description and image, and on home a JSON-LD `Person` built from `profile` and `links`.
- **Generated files:** `sitemap.xml` from a small endpoint over `src/lib/routes.ts`, and `robots.txt` allowing everything and pointing at it. Not Astro's sitemap integration: it writes `sitemap-index.xml`, and the kit's scorer fetches `/sitemap.xml` exactly (found in slice 1).
- **Output:** `dist/<route>/index.html` for every page, plus assets.

## 7. What the kit's portfolio scorer checks, and how the site passes
From `scripts/portfolio_audit.py` (read 2026-11-23). It fetches the home page, then up to five same-site pages whose link matches `project|case|work|portfolio|artifact`, all as raw HTML.

| Check | How the site passes it |
|---|---|
| Site loads over HTTPS; HTML in under two seconds | Static files on Cloudflare Pages (ADR 0004) |
| Page title; viewport meta; `lang` | Head tags on every page (§6) |
| Content readable without JavaScript (about forty words or more in the raw HTML) | Pre-rendered pages (ADR 0003) |
| One clear H1 | One H1 per page, in the shared layout |
| States the role in the text | "Senior Software Engineer" in the home H1 |
| Links to GitHub, LinkedIn | Header or footer on every page |
| Has project or case-study pages | Home links to `/work/<slug>/`, which match the scorer's pattern |
| Mentions live demos or deployed apps | Cards for live projects say "Live demo" |
| Mentions decisions, tradeoffs or results; tests, CI or evals | Deep dives have "Key decisions" and "Result" and name the tests and CI |
| All images have alt text | Images only through a component that requires `alt` |
| Résumé link; contact path | `/resume/` in the header; `/contact/` in the footer |
| Meta description (fifty characters or more); Open Graph image | Head tags (§6); one shared OG image |
| JSON-LD Person | On home (§6) |
| Not blocked from search; `robots.txt`; `sitemap.xml` at the host root | Generated (§6); served at the root (ADR 0004) |
| Each deployed artifact is on the site and its live link loads | Every `artifacts[]` entry has a card on home, and the scorer itself loads each `url` |
| **Links to writing, talks or press** | **Fails until /writing/ exists** (phase 8). Accepted |
| **Testimonials or endorsements** | **Fails** (a non-goal). Accepted |

The judgment pass (the VWC Portfolio Checklist, read live when the scorer runs) happens in the deploy slice (slice 4) and again at go-live.

## 8. The lineup (as of 2026-11-23)
| Project | Status | Where in the record | Depth | Backs (employer story → case study) |
|---|---|---|---|---|
| **Holdfast** | Live on Railway | `artifacts` | 3 | HYP: Stripe holds and real-time bidding → `real-time-bidding-stripe-holds` |
| **Token Keeper** | Live on AWS | `artifacts` | 3 | Propeller: Walgreens OAuth → `walgreens-fhir-integration`; HYP: Instagram verification → `instagram-handle-verification` |
| **FHIR over MCP** | Building (slice 1 when this was planned) | `in_flight` | 1 | Propeller: Walgreens FHIR → `walgreens-fhir-integration` |
| **Coverage Check** | Planned (PR #1 open when this was planned) | `in_flight` | 0 | Kyros: eligibility checks → `insurance-eligibility-automation` |
| **holdfast-ex** | Planned (PR #1 open when this was planned) | `in_flight` | 0 | HYP, told a second way → `real-time-bidding-stripe-holds` |
| **Respiratory view** | Next (not planned yet) | `in_flight` | 0 | Propeller: the provider portal and Epic → `platform-consultant`; inhaler data → `walgreens-fhir-integration` |

As Dan put it: most of the FHIR work is Propeller's, and the billing and eligibility projects are Kyros's.

Statuses move fast: by the time this PR was written, FHIR over MCP had merged slice 2 and Coverage Check's and holdfast-ex's PR #1 had merged. Slice 1 records each project's status from its repo at that time, not from this table.

## 9. GitHub (slice 5)
**Every outward change is a separate step Dan approves**: creating a repo, changing a repo's settings, changing visibility, pinning. Claude prepares the exact change (the file, the command, the setting) and waits for a yes on each.

- **Profile README:** a new public repo, `djwirz/djwirz`, with a README from the kit's `templates/github-profile-readme.md`: one line on who Dan is; **What I've shipped** (Holdfast, Token Keeper, each with its live link and code); **Building now** (FHIR over MCP, Coverage Check, holdfast-ex); **How I work** in one line, linking to /how-i-build/; **Find me:** Portfolio · LinkedIn. Written by hand from the record, and updated by Claude when a project ships (ADR 0007). That repo is worked through PRs too.
- **Profile settings:** the website field set to the site's URL (so `sync_check.py` passes "portfolio site on GitHub"); the bio checked against `profile.headline` and `target_role`.
- **Pins:** the five project repos, in the site's order: Holdfast, Token Keeper, FHIR over MCP, Coverage Check, holdfast-ex.
- **The five project repos:** a website URL on each (the live demo where there is one, otherwise its deep dive on the site) and topics named the way the market names the skills. Each repo is its own approval.
- **Old public repos:** a review list, one row per repo, with a suggested action (archive, make private, keep) and why. Dan decides each one, and each change is its own approval. The list covers every public repo that isn't one of the five projects: the twelve the shaping doc named (padre-ginos, bh-irv6, workout-app, workout-app-api, workout-app-api-enco, encore-workout-api, notion-api, notion-workout-api, notion-railway-api, rogers-photo-gallery, faura-take-home, cover-letter-ai) and about a dozen more that `gh repo list` also shows as public (cover-letter-generation, docker_postgres_with_data, code-challenge-100-plus, smart-on-fhir-tutorial, techScreen, sniptuck, DataStructures-Algorithms, hyper, Legit2.0, LoremIpsumElectron, greenfield-1, AWS_Tutorial, react-tutorial). Forks are flagged as forks.

## 10. Privacy and honesty
**Rules:**
- Only what's in the public-safe record goes on the site. Employer names and facts only as the record states them.
- `documents/archive/` (the guardrails, the never-claim list, the role files, private contact details) is read to keep the site honest and is never copied, quoted or summarized here, not even in PR descriptions.
- No phone number, anywhere.
- No employer code. Synthetic or public data only.
- Numbers as honest estimates in words, never falsely precise figures. A number on the site must already be in the record.
- In-flight projects never claim their skills as proven (ADR 0006).
- Every page that retells employer work (deep dives, /about/, /experience/) is checked against the guardrails before its PR is opened, and the PR says it was.

**What the build enforces** (in Astro's content config, ADR 0007; CI runs the build on every PR):
- `portfolio.json` matches its schema, including the ADR 0006 rules for `artifacts[]` and `in_flight[]`.
- No `phone` key anywhere in the record.
- Every `experience[].highlights` ref (`brag/entries/<file>#<slug>`) resolves to a `### heading`, and every `backs[].story` to a file in `case-studies/`.
- No tracked file under `brag/inbox/`, and no brag file with `status: raw` outside it.
- Missing URLs and case studies don't fail the build. The card just leaves the link out, and the go-live checklist catches them (§14).

## 11. Testing, CI and deploy
- **CI** (`.github/workflows/ci.yml`): gitleaks on every PR and push to `main` (from PR #1), and `astro build` on every PR from slice 1, so a bad record or a privacy hit fails before merge.
- **Deploy:** Cloudflare Pages' Git integration builds on push to `main` and gives each PR a preview (ADR 0007). No deploy workflow and no secrets.
- **Page checks:** the kit's `portfolio_audit.py` against the live site, in the deploy slice and at go-live. Lighthouse once by hand on home, /work/ and /resume/.
- **Unit tests:** only if a piece of logic earns them. The résumé projection is the likeliest candidate.

## 12. Acceptance criteria (v1 "done", depth 3)
1. The record is in the repo, validated on every build; `brag/inbox/` has never been committed.
2. Every page in §5 (except Later) exists as static HTML, with its text readable by `curl`.
3. Every project in §8 has a card with its status and "Backs" link; the live ones have deep dives.
4. /resume/ is generated from the record and prints to PDF.
5. The site is deployed on HTTPS at the root of its host, with PR previews.
6. The kit's portfolio scorer, automated and judgment passes, has been run on the live site; every fix it found is done or written down as deferred, with why.
7. `sync_check.py --github djwirz` finds no mismatch for the portfolio site link or the pins.
8. The profile README is live, the five repos are pinned with website URLs and topics, and the old-repo review list has Dan's decision on each row.

## 13. Slice plan (one PR each, after this spec)
1. **The record and the site skeleton.** Write out the exact `documents/` additions (`status`, `backs`, `in_flight[]`, `profile.availability`; ADR 0006) for Dan or a documents session to apply, then copy the record in with the README's command. Astro with Tailwind; the shared layout (header, footer, head tags); `robots.txt` and `sitemap.xml`; the content schemas with the privacy checks (§10); `astro build` in CI. Delete the template's files, keeping what's worth keeping (ADR 0003). Not gated on the read-through (§14).
2. **Home, /work/ and the deep dives.** Cards from `artifacts[]` and `in_flight[]`. `/work/<slug>/` from each project's case study; the two live projects get case studies written here, from the kit template and their repos' READMEs, ADRs and PR descriptions. Short pages for in-flight projects, and `/experience/<story>/` for the employer stories.
3. **The rest of the pages:** /resume/ generated from the record (with a print stylesheet), /recruiters/, /about/, /contact/ and /how-i-build/. Each page about employer work is checked against the guardrails before the PR (§10).
4. **Deploy, then a kit scorer run.** Connect Cloudflare Pages to the repo (Dan's steps, one at a time). Set `links.site` in `documents/`, then copy it in. Run `portfolio_audit.py --url <site> --portfolio portfolio.json` and the VWC checklist pass, then make the top fixes.
5. **GitHub.** The `djwirz/djwirz` profile README, the profile website and bio, the pins, a website URL and topics on each of the five project repos, and the old-repo review list in `docs/github-review.md` (§9). **Each outward change is its own approval from Dan.**

## 14. Decisions, the go-live check, and what's still open
### Dan's answers (2026-11-23)
The site is being built to get the structure in place; **it isn't being shared with anyone yet.** So nothing below blocks building. What has to be true before it's shared goes in the go-live check.

1. **The read-through** of the mirrored record isn't a gate on any slice. It's a blocking item in the go-live check.
2. **One source of truth:** `documents/portfolio/` stays the one place the record is edited, and this repo mirrors it with one copy command (ADR 0002, ADR 0007). No second copy to keep up by hand.
3. **URLs:** a missing URL (Token Keeper's live demo, for one) doesn't block a slice. The card shows only the links that exist, and filling them is a go-live item.
4. **Respiratory view backs Propeller** (`platform-consultant` for the provider portal and Epic, `walgreens-fhir-integration` for the inhaler data). Most of the FHIR work is Propeller's; the billing and eligibility projects are Kyros's.
5. **Availability**, for /recruiters/ and `profile.availability`: full time, open to contract, can start any time, ideally remote but willing to discuss.
6. **The Shipped log** was planned as structure now. ADR 0007 moved it to Later, since there's nothing to show until Friday Setup is in use.
7. **Domain:** free tiers only. The site stays on its `pages.dev` address.
8. **Friday Setup and this repo:** Dan isn't using Friday Setup for a few weeks. When they start, keep this repo in (site work is real work), and have brag-curator drop PRs that only sync the record. Revisit if they crowd the inbox.
9. **The kit's depth-filter finding** (ADR 0006): noted, not raised yet. Dan is staying practical and getting the pieces in place before committing to the full kit system. ADR 0006 works around it either way.

### The go-live check (blocking before the site is shared)
A walkthrough with Dan before the site's URL goes anywhere: a résumé, LinkedIn, the GitHub profile, an application. Dan and Claude walk through this list; it's a checklist, not a script (ADR 0007).
1. **Read-through:** every mirrored record file has its read-log box checked (in `documents/archive/read-log.md`), or Dan names the exceptions.
2. **URLs:** every project card's live, code and deep-dive links filled in, starting with Token Keeper's live demo, and `links.site` set.
3. **Guardrails:** every page about employer work checked against the private guardrails.
4. **Statuses:** each project's status and depth match its repo on the day.
5. **Kit run:** the portfolio scorer (automated and checklist passes) run on the live site, with its fixes done or deferred with a reason.
6. **GitHub:** the profile website, pins and repo website URLs point at the live site (slice 5 steps, each one approved).

### Still open
- **Which Propeller story leads** on Respiratory view's card, if only one fits on it. Defaulting to `platform-consultant`.
