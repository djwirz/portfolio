# Turning a billing search tool into the place the billing team did its work

**Live:** none (employer work) · **Code:** none public · **Skills proven:** React, TypeScript, PostgreSQL, SQL, Claim.MD, Medical billing

## The story
**Context.** Kyros billed insurers for substance use disorder services for 1,000–2,000 active patients. Claims went out through Claim.MD, a clearinghouse with its own dashboard. To do their job, billing staff searched Claim.MD for what had been filed automatically and tracked payments, figures and notes outside any system.

**My role and constraints.** I was the senior engineer on the redesign of Kyros's billing dashboard. The lead engineer, who was also covering project-manager duties, ran the project. We built it with the billing team through weekly feedback sessions and time working beside them; they sat right behind me. The decisions below were the team's. It lived inside a live React, TypeScript and PostgreSQL monolith that was mid-refactor, and not all of Claim.MD's data could be pulled in at first.

**How it works.**
1. Claims are filed through Claim.MD as X12 837 claim files.
2. Insurers' payments come back as X12 835 electronic remittance advice (ERA) files, via Claim.MD.
3. Inside the Kyros portal, staff match payments received against what was filed, work through ERA remittances, and mark claims to refile.
4. Early on, initial submissions still went through Claim.MD's own dashboard while the rest moved into Kyros.

**Key decisions.**
1. **Build with the users, weekly.** The billing team shaped each step; I learned their process by watching it, not from a spec.
2. **Accounting first, search second:** the dashboard became a place to reconcile and act, not just look things up.
3. **Sequence it before eligibility automation.** Cleaner filing and reconciliation came first; automated eligibility checks were the next step, to make filing more consistent and free up capacity.

**What went wrong.** Medical billing was new to me and full of unfamiliar terms. I mapped the process from scratch with no assumptions, the same way I'd read unfamiliar code. Billing queries inherited from earlier work were slow and produced only basic figures; I tested and rewrote many of them, especially ERA and billing searches, and added pagination as new dashboards put heavier use on older endpoints.

**Result.** Staff did real billing work inside Kyros instead of searching Claim.MD and tracking figures by hand, and the groundwork set up the eligibility automation that followed.

## The evidence
- Before/after workflow diagram
- What I'd do next: pull initial submission into Kyros too, so staff never had to leave the portal
