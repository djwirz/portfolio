# Blue checks from Instagram handles: a small serverless service beside a startup's backend

**Live:** none (employer work) · **Code:** none public · **Skills proven:** AWS Lambda, Amazon SQS, DynamoDB, Amazon API Gateway, OAuth, Instagram API, Node.js, TypeScript

## The story
**Context.** HYP ran live auctions for influencer and brand collaborations, and much of an auction's value was the attention it drew on Instagram. Bidders were often people from other auctions lending their name and following by bidding and posting about it. HYP wanted to know which bidders really owned the Instagram accounts they claimed, reward them for bringing their audience, and mark them with a blue check.

**My role and constraints.** I designed and built this service alone; it was the one HYP system that wasn't co-built, because it was squarely what I'd done for Propeller's partner services. Instagram offered no "verify this account" call for a third party, its login tokens expire, and anything that depended on Instagram's API could fail in ways outside our control.

**How it works.**
1. **Connect.** A bidder taps "Connect Instagram" during onboarding. Instagram login runs through API Gateway; a Lambda exchanges the one-hour token for a 60-day token and reads the account's ID and @ handle.
2. **Store and report.** The token and the service's state go in DynamoDB. The service calls one endpoint on HYP's main API, protected by a shared secret, to mark the user connected and, if their HYP handle matches their Instagram handle, give them a blue check. Handles were namespaced: your Instagram @ was yours to claim on HYP.
3. **Reward.** The user lands on HYP's new-account screen showing the credit earned so far. Linking Instagram and sharing were steps in an onboarding funnel that paid out HYP credits, each one confirmed through the APIs rather than codes.
4. **Re-check weekly.** A schedule fans the connected accounts out onto SQS. Separate Lambdas take discrete tasks from the queues: one confirms the account still holds its handle, another refreshes the token as long as it hasn't been revoked.
5. **Fail safe.** A revoked, expired or changed account loses its blue check and connected status, and the user can reconnect. An alert flagged anything unexpected so the team could look by hand.

**Key decisions.**
1. **A separate service, not a backend module.** The main API needed only one endpoint, so the service stayed out of the main deploy. Its failures depended mostly on what Instagram's API allowed, which didn't belong in the core backend even behind an abstraction. The cost was one more piece to set up locally.
2. **One-way traffic.** After the initial OAuth exchange, the service never needed anything new from the main API; it only reported results. That kept the contract to a single endpoint and a shared secret.
3. **Keep the token to keep the check honest.** A blue check meant "still owns this handle", so the service held a live token and re-confirmed weekly, well inside the 60-day token life.
4. **Weekly, not constant.** The founder wanted some wiggle room, and a weekly check was enough to catch handle changes and revoked access without hammering Instagram.
5. **Small queued tasks.** Verifying and refreshing were separate Lambdas on SQS, so one account's failure didn't hold up the rest and each step could retry on its own.

**What went wrong.** Instagram's API had thin support, and we accepted that up front. The alert for handle problems only ever fired in test auctions and testing, never for a real user.

**Result.** Verified Instagram accounts, blue checks and onboarding credits ran on a service the main backend only had to hear from through one endpoint.

## The evidence
- Flow diagram: Connect Instagram → API Gateway → token exchange Lambda → DynamoDB → main API endpoint (connected, blue check) → new-account screen with credit; weekly schedule → SQS → verify Lambda / refresh Lambda → DynamoDB → main API endpoint
- What I'd do next: not much, on purpose. Users already had a path to reconnect and revalidate, and the same reason it was a separate service applies here: it didn't make sense to put more weight on a limited API outside our control.
