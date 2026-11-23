# Artifact spec: Portfolio (record and site)

Filled from the kit's `templates/artifact-spec.md` before any agent builds code. Draft for PR #1, 2026-11-23.

## One line
Dan's career record and the site built from it: each public project shown beside the employer story it retells, so a recruiter sees the role, the proof and a way to reach Dan within a few seconds.

## Market skills it proves
Provisional until kit step 1 produces `resume-score.json`. Few skills on its own, by design: the site is the map to the proof, and the projects are the proof.
- **HTML and CSS**, with accessibility (one of the lane's high-lift skills in the 2026-11-16 baseline).
- **TypeScript** and a static build with typed content (ADR 0003).
- **CI/CD** with secret scanning and per-PR previews (ADR 0004).
- **AI-assisted development**, shown on /how-i-build/ and in every PR's "How AI was used".

## Problem and users
- **Who has the problem:**
  - **Recruiters** with a few seconds per candidate, who need the role, location, availability, core skills and one contact path.
  - **Hiring managers and engineers**, who want to see how Dan decides: specs, ADRs, tests, what went wrong.
  - **Screening tools and the kit's scorers**, which read raw HTML and the record.
- **What they do today:** Dan's employer work can't be shown (no public code, no live links), and Dan's public GitHub is mostly old tutorials and bootcamp work. The record that tells the real story is in a private folder. There's no site.
- **Why it matters:** in the kit, a skill is proven only when a resume bullet is backed by public work. The projects now exist; without a site and a profile that point at them in order, nobody sees the connection between "what Dan did at HYP" and "here's the same problem solved in public".

## Scope
- **Must have:**
  - The record mirrored into the repo from `documents/portfolio/`: `portfolio.json`, `brag/entries/`, `case-studies/`, `decisions/` (slice 1), with `brag/inbox/` git-ignored.
  - Every page pre-rendered to static HTML (ADR 0003).
  - Home, /work/ with a card for each project, /work/<slug>/ deep dives, /experience/<slug>/ employer stories, /resume/ generated from the record, /recruiters/, /about/, /contact/, /how-i-build/, and a Shipped log from `brag/entries/`.
  - Cards with status and "Backs" (ADR 0006).
  - Head tags the scorer reads: title, description, viewport, `lang`, Open Graph image, JSON-LD `Person`; `robots.txt` and `sitemap.xml`.
  - Deployed on a free host with HTTPS and PR previews (ADR 0004).
  - A kit portfolio-scorer run, with its fixes.
  - The GitHub profile README (`djwirz/djwirz`), pins, and a website URL and topics on the five project repos, each step approved by Dan.
- **Nice to have:**
  - /decisions/: an index of every ADR across the project repos.
  - /writing/: case-study posts (roadmap phase 8). This also passes the scorer's "links to writing" check.
  - A custom domain.
  - A light/dark toggle (an island; the pages work without it).
- **Non-goals (on purpose):**
  - A blog engine, comments or analytics beyond what the host gives for free.
  - Testimonials or press, until there are some (shaping doc).
  - Role pages per job family, until kit step 1 shows which lanes to target.
  - A contact form (ADR 0005).
  - Jerome's SVG "mission brief" graphics: too much upkeep.
  - Anything from `documents/archive/`.

## Success metric
- **The kit's portfolio scorer** reads every page's text from raw HTML (no "drawn by JavaScript" note) and passes every automated check the site can control. The ones it can't pass yet are named, not hidden: testimonials (a non-goal) and writing links (until /writing/ exists).
- **The eight-second test:** someone who has never seen the site can say Dan's role, where they work from and one project within a few seconds of the home page loading. Checked by hand with a fresh pair of eyes, and in the checklist pass.
- **Sync:** `sync_check.py` finds no site or GitHub mismatch against the record.
- **Cost:** nothing a month.

## Constraints
- **Time:** about two to three days of sessions (roadmap phase 6), including the project case studies.
- **Budget:** free tiers only.
- **Data:** only what's in the public-safe record. Employer names and facts only as the record states them. No employer code. Never anything from `documents/archive/`. No phone number.
- **Approvals:** the site isn't shared until the go-live check passes, including Dan's read-through of the mirrored record (spec §14). Every outward GitHub change (creating a repo, changing settings or visibility, pinning) is approved by Dan one at a time.
- **Hosting:** a static host that serves at the root of its domain (ADR 0004).

## Quality plan
- **Tests:**
  - Record validation at build time: schema, `backs` targets exist, `highlights` refs resolve to brag headings, status and depth agree, no `phone` (spec §10).
  - A post-build check over `dist/`: every page has its text in the HTML, one H1, a title, a description, `lang`; every internal link resolves.
  - Unit tests for the record-to-page helpers (the resume projection, the Shipped log parser).
- **Evals:** none; there's no AI feature.
- **Observability:** the host's built-in request analytics only. Nothing runs, so there's nothing else to watch.
- **Accessibility and performance:**
  - Semantic HTML, keyboard reachable, visible focus, alt text on every image, colour contrast that passes WCAG AA.
  - Lighthouse accessibility, SEO and performance in the green on home, /work/ and /resume/.
  - /resume/ prints cleanly to PDF on one or two pages.
- **Security basics:** no secrets in the repo (gitleaks in CI from PR #1); the deploy token scoped to Pages only; no third-party scripts.
- **CI/CD:** every PR runs gitleaks, then (from slice 2) the record check, the build, the post-build check and a preview deploy. Merges to `main` deploy to production.

## Depth target
Current rung: 0 · Target rung: 3 (engineered: deployed, CI, ADRs, checks on every build)

## Build stack (in order)
1. The record: `portfolio.json` and Markdown, validated with zod.
2. Astro (static output), TypeScript, Tailwind (ADR 0003). Node LTS and pnpm.
3. GitHub Actions: gitleaks, build, checks, Wrangler deploy.
4. Cloudflare Pages (ADR 0004).
