# A dozen large refactors in a live healthcare monolith, without stopping features

**Live:** none (employer work) · **Code:** none public · **Skills proven:** TypeScript, React, Node.js, Express, PostgreSQL, SQL, Database migrations, Data modeling, Code review

## The story
**Context.** Kyros ran billing, scheduling and insurance in one React, TypeScript and Express monolith on PostgreSQL. It was halfway through moving its modules to a second version and tightening practices, while features still had to ship. Shortly after I joined as the only senior engineer, other senior people left, leaving two leads, one mid-level and three junior engineers.

**My role and constraints.** Hired to bring senior eyes to the codebase: make large refactors and add needed features alongside them, in production, on regulated patient data.

**What I changed.**
1. **About a dozen legacy modules moved to the second-version architecture,** including users, scheduling and billing (ERA remittances among them), so old and new code no longer had to coexist.
2. **Group sessions under state rules:** refactored users so a session could hold several patients with one counselor. Before any booking or reschedule was saved, the scheduler checked the counselor's and every patient's limits per day, week and month, which varied by state and session category, and told the user why a slot wasn't allowed. Reschedules were the hard part: in a group it could be ambiguous whose limit was tightest, so nudging one meeting time could push one person, or several, over a limit. This is what let the models support Ohio, Kyros's main new market.
3. **Queries:** tested and rewrote many inefficient billing SQL queries that walked through claims just to produce basic figures. Most speed-ups were in ERA and other billing searches, and pagination changes followed quickly as new dashboards leaned on older endpoints.
4. **Types:** types didn't match reality, since payloads often differed from what they claimed. I validated unchecked queries and audited data paths until TypeScript matched what records actually held.
5. **Frontend:** no style guide and several versions of the same visuals; I standardized on one shared component per use.
6. **People:** reviewed and paired constantly, did refactors ahead of time to unblock juniors, and shaped features so juniors could own pieces.

**Key decisions.**
1. **Tests first, then refactor:** strengthen the suite so it covers the old behavior and the new, then migrate, with generated production-like data as the safety net. Kyros was the only consumer of its own API, so changes didn't carry the versioning burden of a partner-facing API.
2. **Refactor ahead of features,** landing migrations before the dashboard work that needed them.
3. **Catch bugs as tests and hand them back** to the junior who owned the code, so they learned the fix.

**What went wrong.** Nothing broke in production during a refactor, and that was by design: before going far into one, I reinforced the test suite so the tests described the new behavior and still held the old. The pressure came from elsewhere: during a project-manager gap I became the de facto pace-setter, with unassigned tickets piling up while I was also the main contact for the eligibility project.

**Result.** About a dozen major refactors landed in a live system, and the codebase gained types and components the juniors could build on.

## The evidence
- One before/after ERA search query (synthetic), before and after pagination
- What I'd do next: a written style guide and type-checking gates in CI, so standards held without me reviewing every change
