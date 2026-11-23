# From a dev shop's prototype to launch with two engineers and two contractors

**Live:** none (employer work) · **Code:** none public · **Skills proven:** TypeScript, Node.js, GraphQL, Next.js, PostgreSQL, Prisma, Docker, AWS ECS, AWS Lambda, CircleCI, GitHub Actions, Jest

## The story
**Context.** HYP sold limited brand and influencer collaborations through live auctions. A dev shop had built a proof of concept. The founder needed a real product: auctions, payments, Instagram-verified identities, and a site that looked as polished as the big resale platforms.

**My role and constraints.** One of two founding engineers, peers, reporting to the founder, with two contractors. We restarted from scratch. Little design support, one founder eager to launch, and a small team that had to own everything from the API to deploys.

**How we built it.**
1. **Planning:** the two of us talked through everything with the founder, wrote it up as Linear tickets, split work by who wanted what, and reviewed each other's pull requests under Git Flow. Both of us knew the whole system.
2. **Contractors:** the two contractors took a lane of tightly specced tickets around parts we'd already designed, discussed before work began and reviewed in small pieces.
3. **Stack:** a TypeScript GraphQL API (Apollo Server, TypeGraphQL, Prisma on PostgreSQL, Redis) and a Next.js and React frontend styled with Tailwind.
4. **Delivery:** three deployments: the frontend on Vercel, the backend in Docker on AWS ECS through an internal npm deploy package we wrote, and an Instagram token service on Lambda, SQS and DynamoDB. CircleCI built and deployed images; GitHub Actions ran tests and linting.
5. **Confidence:** Jest on the mission-critical paths (about 75% coverage), dozens of test auctions with about ten testers on multiple accounts simulating about 25 users, then two soft launches.

**Key decisions.**
1. **Restart instead of extending the prototype.** It had been hacked together quickly to run very small, short auctions in a walled garden, with some smoke and mirrors. It wasn't meant to be built on, and stretching it to what the founder wanted would have cost more than starting over.
2. **Containers on ECS with our own deploy package,** chosen for functionality, cost and what a two-person team could run.
3. **Small, well-specced tickets for contractors,** so misbuilds stayed small in a design-light startup.
4. **Trade scope for a safe release:** the founder's eagerness to launch made it easier to cut by utility.

**What went wrong.** To the founder, "cool" meant having everything other auction sites had. Time spent matching them sometimes came at the expense of iterating on the auctions themselves, which were what made HYP different.

**Result.** Launched in about 15 months, after two soft launches, right as my time at HYP ended, so there are no post-launch numbers.

## The evidence
- Deployment diagram: Vercel frontend, ECS backend, Lambda/SQS/DynamoDB token service
- What I'd do next: understand the founder's priorities at the start and ship simpler auctions early, iterating on them while the rest was built
