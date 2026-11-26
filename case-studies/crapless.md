# A craps table for a few friends on their phones: open a link, take a seat, pass the dice

**Live:** https://crapless.onrender.com · **Code:** https://github.com/djwirz/crapless · **Skills proven:** Python, FastAPI, TypeScript, React, WebSockets, CI/CD

![Two phones at one table: one player invites, the other joins, and each takes a turn with the dice](https://raw.githubusercontent.com/djwirz/crapless/main/docs/demo.gif)

The recording is a script playing both phones against the real server, with fixed dice. In play the server rolls them.

## The story
**Context.** Crapless craps has few places to play it, and fewer to play it with particular people. This is a table for a handful of friends, with play money: no accounts, nothing to install, nothing sold and nothing to win. A for-fun project, built properly.

**Constraints.** Free hosting, play money only, nothing saved between restarts.

**Key decisions.**
1. **The server owns the table.** Phones send what they want to do; the server rolls, checks and settles. ([ADR 0002](https://github.com/djwirz/crapless/blob/main/docs/adr/0002-server-authoritative-tables.md))
2. **A pure rules engine,** with no randomness or I/O inside, so every case can be driven by a test. ([ADR 0007](https://github.com/djwirz/crapless/blob/main/docs/adr/0007-rules-engine-interface.md))
3. **Whole snapshots over one WebSocket,** so reconnecting is the same as connecting and the page holds no rules. ([ADR 0008](https://github.com/djwirz/crapless/blob/main/docs/adr/0008-protocol.md))
4. **Free hosting with tables in memory.** A restart resets them, and the page says so. ([ADR 0009](https://github.com/djwirz/crapless/blob/main/docs/adr/0009-render-free-memory-only.md))

**What went wrong.** Tests often shared the code's own assumptions. Layout faults passed them and were only caught by playing the table, and the first property tests passed while hardly ever settling some kinds of bet. Counting settlements showed it.

**Result.** Live. Up to eight players share a table by link, the dice rotate, and a dropped player can come back to their chips.

## The evidence
- Each bet's house edge, computed by driving the engine through every dice result, matches the textbook value.
- Property tests check that chips add up, no bet is settled twice and there is exactly one shooter.
- Server tests with several players, drops and duplicate messages, and a browser test with two phones; CI on every pull request.
- Logs, public counts and a runbook for a disputed roll.
- Known limits: tried on an iPhone, not yet on an Android phone; anyone with a table's link can sit down.
