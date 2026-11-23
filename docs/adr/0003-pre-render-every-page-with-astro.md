# 3. Pre-render every page to static HTML, with Astro

Date: 2026-11-23
Status: Accepted

## Context
The template in this folder is Bun + React 19 + Tailwind 4 + shadcn/ui with React Router. It renders in the browser: the HTML Bun serves is an empty root `<div>` and a script.

That fails the people and tools this site is for:
- **The kit's portfolio scorer** (`scripts/portfolio_audit.py`) reads raw HTML. When a page has fewer than about forty words before scripts run, it fails "Content is in the HTML, readable without JavaScript" and **skips** the checks that need text: the H1, the role, GitHub and LinkedIn links, project pages, the résumé link, the contact path, and whether each deployed artifact is on the site.
- **Link previews, crawlers and some recruiter tools** read the raw HTML too.
- **A recruiter on a slow phone** should see the role and the work before any JavaScript loads.

The site's content is a JSON file and a few dozen Markdown files that change when a PR merges. Nothing on it needs a server, and almost nothing needs client-side JavaScript. (The shaping doc's open question 2 asked for this ADR.)

## Options considered
1. **Keep React and pre-render it ourselves.** A build script walks a route list, calls `react-dom/server`'s static rendering for each page and writes `dist/<route>/index.html`. It keeps the template's components as they are, ships no client JavaScript unless we hydrate, and adds no framework. But we'd be writing a small static site generator: routing, Markdown to HTML with front matter, head tags per page, `sitemap.xml`, `robots.txt`, asset hashing and a dev server with reload. None of that is the problem this repo exists to solve, and every piece is something to test and maintain.
2. **Astro (TypeScript), static output.** Static HTML is the default and client JavaScript is opt-in per component. Content collections read `portfolio.json` and the `case-studies/*.md` files with a typed schema (zod), so a bad record fails the build instead of rendering a broken card. File-based routes give `/work/<slug>/` from the case-study files directly. React components still work inside Astro pages and render to plain HTML at build time, so the template's `ProjectCard` and shadcn pieces can be kept where they help. Sitemap and Tailwind are first-party integrations. Cost: a framework dependency, and moving from Bun's bundler and React Router to Astro's build and file routes.
3. **Next.js with `output: "export"`.** Also React and also static, but it's built around a server and a client router, ships a React runtime to every page by default, and has more surface than this needs.
4. **A Python static generator** (Pelican, or a short Jinja2 script). Dan prefers Python where it fits, and the kit's own scripts are Python. But it throws away the template's components, and a site is where TypeScript fits. Holdfast already proves the Node and TypeScript side, so this would show nothing new either way.
5. **Eleventy.** Static and light, with good Markdown support, but templates are Nunjucks or Liquid rather than components, so the template's React work is lost and nothing is typed end to end.

## Decision
Option 2: Astro with static output, TypeScript throughout, and no client JavaScript by default. Tailwind carries over. The React integration is added only if a template component is worth keeping as is; otherwise the components are rewritten as `.astro` files, which are close to JSX.

Why: the problem is "turn a JSON record and Markdown files into fast, plain HTML that a script can read". Astro does exactly that as its default, so the work goes into the record, the pages and their honesty, not into a home-made generator. The typed collections also give the build a cheap way to reject a record that would put something wrong on the site (spec §10).

## Consequences
- **Every page is a real HTML file** in `dist/`, readable with `curl`. CI checks that in slice 2 (spec §11), so the scorer's "readable without JavaScript" check can't regress silently.
- **The template is replaced, not committed.** Its files stay untracked in the working tree until slice 2, which keeps what's worth keeping (Tailwind setup, the card's layout, copy that's still true) and deletes the rest along with `bun.lock` and `build.ts`.
- **Runtime and package manager:** Node LTS with pnpm, as in Holdfast, so CI and the deploy use the same well-trodden setup. Bun could run Astro too, but it's one more thing to verify for little gain. (Verify the current Astro and Node LTS versions in slice 2.)
- **Interactivity has to be asked for.** A theme toggle or a filter on /work/ becomes an island with its own small script. That's a feature: the pages stay readable without it.
- **Revisit** if the site ever needs per-request data (it shouldn't: the record changes through PRs).
