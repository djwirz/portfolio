# Turning mailed codes into enrollments, wave after wave

**Live:** none (employer work) · **Code:** none public · **Skills proven:** Node.js, Express, MongoDB, SFTP, Partner integrations

## The story
**Context.** Express Scripts, the pharmacy benefit manager, offered Propeller's inhaler sensors to eligible members through mailed campaigns aimed at an older population. Each mailer carried a code. A member who entered it started a partner-branded Propeller enrollment with their details already filled in, so they didn't have to type everything themselves.

**My role and constraints.** I owned the service behind the codes and kept it running as new mailers went out with new codes and new members. Waves were hundreds of members each, sometimes nearing a thousand, with several waves for Express Scripts and at one point a monthly cadence. Membership changed under us: people left the program, and some still wanted their sensor.

**How it works.**
1. Before each wave, Express Scripts sends a code list with its members over SFTP, and the service ingests it.
2. A member enters their code; the service validates it, finds the matching record and returns a payload that prefills partner-branded onboarding.
3. The member finishes enrolling and joins the Express Scripts program group.
4. Deactivations arrive the same way, as files over SFTP. A member who's no longer eligible is either deactivated or, if they want to keep using the sensor, moved to another group outside the program.

**Key decisions.**
1. **Make the code the whole front door.** The campaign reached an older audience by paper mail with one short code, so the service had to turn that code into a prefilled enrollment reliably, wave after wave.
2. **Eligibility as an ongoing job, not a one-time check,** so leaving the program didn't strand anyone or keep them in the wrong group.
3. **Track the people who still wanted in.** Members deactivated for reasons like wintering in another state still wanted their sensors, so we tracked them, and that pushed Propeller toward letting patients self-enroll without a sponsor.

**What went wrong.** Some code files arrived wrong and had to be corrected and re-sent: nothing major, but the plan changed with them. The real lesson was that eligibility kept moving after enrollment.

**Result.** Several waves of hundreds of members enrolled through mailed codes, members moved or deactivated cleanly as eligibility changed, and the people who fell out of sponsorship helped make the case for unsponsored self-enrollment.

## The evidence
- Flow diagram: SFTP code list → ingestion → code entry → prefilled onboarding → program group → SFTP deactivations
- What I'd do next: validate each incoming file against the last one before loading it, so an errant send is caught before members see it
