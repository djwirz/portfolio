# Getting consented inhaler data into a pharmacy's brand-new FHIR server

**Live:** none (employer work) · **Code:** none public · **Skills proven:** Node.js, OAuth, FHIR, Webhooks, AWS Lambda, Amazon SQS, DynamoDB

## The story
**Context.** Propeller Health made sensors that clip onto prescription inhalers and track every use for people with asthma and COPD. Walgreens wanted those patients inside its own experience: when a customer bought a sponsored medication on Walgreens' site, they were offered a free Propeller sensor and could enroll right there, in a Walgreens-branded version of Propeller's onboarding, before checkout. Patients who agreed to share their data with Walgreens needed that data to land in Walgreens' FHIR server.

**My role and constraints.** The team built the embedded enrollment; I built and owned the service that moved consented data to Walgreens. It had to live outside Propeller's core platform as a standalone service Walgreens could take over or pay Propeller to maintain. It carried regulated health data under patient consent. Walgreens' FHIR server was brand new, we were its first integration, and there was no test environment to work against.

**How it works.**
1. A patient opts to share during enrollment; the service runs the OAuth authorization flow with Walgreens and stores that patient's access and refresh tokens.
2. Propeller's webhooks, its subscription model for partners, fire as things happen: about a dozen event types, from the sensor's Bluetooth heartbeat to onboarding, inhaler events and changes to patient details.
3. For each event, the service fetches a valid token, refreshing it if needed, maps the event to the matching FHIR resource (Patient for patient details, Device for the sensor, Observation for inhaler events) and posts it to Walgreens.
4. It ran as its own AWS stack: webhooks received by Lambda, events buffered on SQS, tokens kept in DynamoDB.

**Key decisions.**
1. **Standalone, not in the platform.** Keeping it separate made the handoff-or-maintenance deal possible and kept partner-specific code out of the medical-device codebase.
2. **Webhooks over polling.** Riding Propeller's existing subscription events meant no new load on the core API and near-real-time delivery.
3. **Token handling as a first-class job.** Refreshing and validating tokens before every post, so an expired token never silently dropped a patient's data.

**What went wrong.** Being first on a new server with no test environment meant the documentation described what the server would do, not what it did. The server was written in Java and leaked internal errors in its responses, so I debugged from those. Its encryption only accepted an even number of bytes, padded with a trailing space. At go-live, every inhaler event failed: a field the FHIR documentation described hadn't been added on the server side. Each fix meant working out the real contract from the server's behavior, through some long weekends and late nights.

**Result.** The integration reached go-live, and the Walgreens enrollment funnel stayed in service for a long time. I came out of it fluent in OAuth and FHIR: I reused the token pattern for Instagram at HYP and FHIR's shapes for insurance data at Kyros.

## The evidence
- Architecture diagram: Propeller webhooks → Lambda → SQS → token store (DynamoDB) → FHIR post
- What I'd do next: take a stronger hand from the start. I knew the FHIR standard well enough to hand the partner detailed schemas and guidance on setting up their side, instead of trusting their readiness. And I'd keep a written record of every expectation and change, so gaps showed up as decisions, not surprises at go-live.
