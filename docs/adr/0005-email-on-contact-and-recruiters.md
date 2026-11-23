# 5. Show the email on /contact/ and /recruiters/, with LinkedIn alongside

Date: 2026-11-23
Status: Accepted

## Context
A recruiter who decides in seconds needs one obvious way to reach Dan. The kit's portfolio scorer passes its contact check with a `mailto:` link, a link to a contact page, or a form, and it reads raw HTML, so whatever is chosen has to be in the HTML, not assembled by a script.

Jerome Hardaway's site, the model for this one, uses LinkedIn only. Dan's LinkedIn is the last surface to be updated (roadmap phase 8), so for now it's the weakest place to send people.

Dan's email is already public in the record (`profile.email` in `portfolio.json`, which becomes public in slice 1). The phone number is private (it's kept in `documents/archive/`, outside the record) and stays off the site.

The shaping session on 2026-11-23 recommended the email on /contact/ and /recruiters/, and Dan accepted it.

## Options considered
1. **LinkedIn only.** No address to scrape, and LinkedIn's messaging filters spam. But it sends people to the least current surface, and some recruiters prefer email.
2. **A plain `mailto:` link with the address visible**, on /contact/ and /recruiters/, with LinkedIn beside it. Works with no JavaScript, passes the scorer, and can be copied into an ATS by hand.
3. **An obfuscated address** (assembled by JavaScript, or written as "name at domain"). Slows some scrapers, but fails the no-JavaScript reading the site is built for (ADR 0003) and annoys the people it's meant for.
4. **A contact form** through a third-party form service. Hides the address, but adds a service that receives visitors' messages, a privacy notice, and spam handling, for a site that otherwise has no moving parts.

## Decision
Option 2. /contact/ and /recruiters/ show the email as visible text inside a `mailto:` link, with LinkedIn next to it. The footer on every page links to /contact/, so every page has a contact path. The address comes from `profile.email`; it's never typed into a page by hand. No phone number anywhere on the site.

Why: the address is already public, and making it easy to use is the point of the page. The spam cost is small and falls on Dan's inbox filters, not on the people the site is for.

## Consequences
- Expect some extra spam at that address. If it becomes a problem, switch `profile.email` to a forwarding alias; nothing else changes.
- The build fails if `portfolio.json` gains a `phone` field (spec §10), so the private number can't reach the site by accident. The kit's résumé rebuilder will keep printing `[ask: phone]`; résumés are made outside this repo, so the number is added there.
- LinkedIn sits beside the email from day one, so when phase 8 updates it, nothing on the site has to change.
