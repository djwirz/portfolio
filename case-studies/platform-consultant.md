# Speaking for the platform: an engineer between partners and a medical-device API

**Live:** none (employer work) · **Code:** none public · **Skills proven:** Node.js, Python, Pandas, AWS Lambda, Amazon SQS, DynamoDB, Serverless Framework, Webhooks, REST APIs, OAuth

## The story
**Context.** Propeller Health's inhaler-sensor platform grew through partners: pharmacies, payers, employers and a few dozen research programs at hospitals and clinics. New partners arrived through sales (CVS, for one) or through program managers' relationships (Express Scripts, a study with a Cleveland health system). Each brought big ideas and a technical team that had to make them real on Propeller's API.

**My role and constraints.** About a year in, after taking ownership of a large share of the API test suite, I became Platform Consultant on a clinical team with room for larger projects. I reported to the VP of Engineering and worked directly with program managers. I was the person brought in to say what the platform could and couldn't do, what a request would take, and then to build or support it, all in Class II medical-device software where every change was tied to a ticket and reviewed.

**What the work looked like.**
1. **Scoping with partners.** Non-technical stakeholders described what they hoped for; I worked with their engineers to find a version that could actually be built.
2. **Teaching the API.** I was the technical resource for anyone reading Propeller's API docs. The common sticking points were authentication (partners expected tokens; Propeller still used an API login then) and the webhook subscription model, which kept partners current on their population without polling.
3. **Standalone partner services.** I set up and deployed a separate AWS stack per partner service, using AWS services including Lambda, SQS and DynamoDB, later with the Serverless Framework, so each partner could take its service over or pay Propeller to maintain it. The Walgreens FHIR integration has its own case study.
4. **Reports when integration wasn't possible.** Many partners just wanted files. In my first production Python, with Pandas, I built reports in dozens of formats, mostly mirroring what API endpoints returned, run on cron or on request and delivered by SFTP, email and other routes.
5. **Research programs.** A few dozen over my time, usually 15–20 at once: some needed only a personalized enrollment page, some weekly or monthly files of every inhaler event for every patient, some an eligibility service like Express Scripts'.
6. **Pilots.** For CVS's attempt to fit several connected-medicine tools into one app, I worked on an external Bluetooth SDK for the sensors, writing native Android and iOS pieces with help from the Ionic team.

**Key decisions.**
1. **Say yes to the report, then show the API.** Every file request came with a walk-through of the API and webhooks. When contracts changed, several partners moved off files, and I guided each to webhooks, the API or both, depending on what they were doing.
2. **Keep partner code out of the device platform,** in standalone stacks with a clear handoff path.
3. **Watch how partners actually use the API.** When one partner's group started using it for a product they hadn't discussed with us, I raised it in person with executives from both companies.

**What went wrong.** The gap between what partners' leaders wanted and what their teams could use produced a steady stream of one-off reports, a "wild west" of formats. The Bluetooth SDK ran into a mobile Bluetooth ecosystem that wasn't ready for devices like ours.

**Result.** I supported a few dozen programs and partners, built the Walgreens FHIR integration, and moved several partners from files to the API. After ResMed's acquisition the partnership work changed shape, and the role was folded back into full-stack engineering. Back on the provider side, I worked on making Propeller's provider portal run inside Epic, whose desktop client showed embedded apps through old Internet Explorer: Babel for old IE while the portal moved from AngularJS to React, with Redux keeping the state for a provider's whole patient list.

## The evidence
- Partner map: sales or program-management intake → scoping → standalone stack, report, or API/webhook onboarding
- What I'd do next: token-based API auth first, since authentication was the most common reason partners fell back to files
