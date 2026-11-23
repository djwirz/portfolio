# 4. Host on Cloudflare Pages, deployed from GitHub Actions

Date: 2026-11-23
Status: Accepted

## Context
The site is static files (ADR 0003). The host needs to be free, serve HTTPS, and allow a custom domain later without moving. Two details matter more than they look:

- **The site has to live at the root of its host.** The kit's portfolio scorer fetches `robots.txt` and `sitemap.xml` from `https://<host>/`, not from under a path. A site served from `https://djwirz.github.io/portfolio/` fails both checks, and every link has to carry a `/portfolio/` base path.
- **Previews per PR are worth having.** Every change here is a PR, and the thing to review is how the page looks and reads, not just the diff.

Facts about free tiers below are from Claude's knowledge, not checked against current pricing pages: verify them in the deploy slice.

## Options considered
1. **GitHub Pages, from this repo.** No new account; HTTPS on `github.io`; custom domains supported. But a project repo is served under `/portfolio/`, which fails the scorer's root checks until a custom domain is bought. No PR previews, and no control over headers.
2. **GitHub Pages from a `djwirz.github.io` repo.** Served at the root, but it means a second repo or renaming this one, against ADR 0002.
3. **Cloudflare Pages.** Free tier with generous limits; a root URL on `<project>.pages.dev` with HTTPS; a preview URL for every branch; custom domains with automatic certificates; static files served from Cloudflare's edge, so the "HTML in under two seconds" check is easy. Needs a Cloudflare account (no payment method on the free plan, verify) and an API token in GitHub secrets.
4. **Netlify or Vercel.** Both serve at the root with previews and HTTPS. Their free tiers have changed shape more than once (build-minute and credit limits; Vercel's Hobby plan is for non-commercial use), so there's more to keep an eye on for no gain over option 3.
5. **AWS S3 and CloudFront.** Dan already has an AWS account with a budget alarm from Token Keeper. But HTTPS needs an ACM certificate and a CloudFront distribution, previews need building by hand, and it costs a little each month instead of nothing. More moving parts than a static site deserves.

## Decision
Option 3: Cloudflare Pages. GitHub Actions builds the site and uploads `dist/` with Wrangler's Pages deploy command (direct upload), using an API token scoped to Pages only. Merges to `main` deploy to production; PR branches deploy to their preview URL, and the workflow posts it on the PR. The site starts at its `pages.dev` address. A custom domain is optional and can be added later without changing the build.

Why: it's the free option that serves at the root (so the scorer's checks can pass without buying a domain), gives a preview for every PR, and keeps the build in this repo's CI rather than in a dashboard.

## Consequences
- **Outward steps for Dan, one at a time, in the deploy slice:** creating the Cloudflare account and the Pages project, creating the scoped API token, and adding it and the account id as GitHub secrets. Claude prepares each step; Dan does or approves it.
- **No paid account, so no budget alarm.** If a payment method is ever added (for example to buy a domain through Cloudflare), CLAUDE.md's budget-alarm rule applies first.
- **`links.site` in `portfolio.json`** gets the production URL once it exists, so the resume, LinkedIn and GitHub can point at it, and `sync_check.py` can check they do.
- **Fork PRs get no preview** (the secret isn't available to them). Fine for a personal repo.
- **Revisit** if Cloudflare's free tier changes, or once a custom domain is bought (GitHub Pages becomes viable again at that point, but previews would still be missing).
- Exact Wrangler command names, the free-tier limits and the "no payment method" detail are from memory: verify in the deploy slice.
