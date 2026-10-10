# Submission text for team review

Status: prepared text, not submitted. **Submission HOLD: do not submit until Aladdin gives a new explicit go-ahead, even if every readiness check passes or the deadline approaches.** Confirm team registration, the registered roster, final name, OrganizerHQ check-in and all required disclosures before submitting. Faye may revise the title and product wording.

The public release from main `4751ebf` includes Faye's visual direction, dated briefing exports and the resident Miami heat guide described below. Both routes and actual English/Spanish downloads were inspected at approximately 1:46–1:48 PM Eastern; see [verification evidence](VERIFICATION.md). Technical release verification does not establish organizer acceptance or authorize submission.

## Entry fields

**Project:** HeatShift (working name)

**One-line description:** Forecast-informed scheduling for Miami outdoor crews, with a resident guide to today's heat forecast and official cooling resources.

**Problem and user:** A Miami landscaping supervisor needs to plan outdoor work around forecast heat while respecting the crew's tasks, appointments, breaks and paid time. A weather forecast alone does not show how a particular work order could be rearranged. A second intended user is a Miami resident checking the day's forecast before an errand or visit and looking for official cooling resources. Both are product hypotheses that still need validation with users.

**Working solution:** HeatShift turns a text work order into editable tasks using Gemma 4 through the Gemini API. After supervisor confirmation, deterministic code compares feasible schedules against live National Weather Service data for Miami. It shows the original and proposed timelines, preserves the reviewed constraints and reports outdoor minutes within the shift's three hottest forecast hours. Gemma then prepares an explanation and crew briefing in English and Spanish. The crew-planner scope is one crew, one location, one day and up to four tasks. An unchanged or infeasible result is valid.

**Resident guide and dated exports:** The verified public Miami heat guide at `/community` gives residents today's available remaining forecast hours for the same Miami grid point, visible source and retrieval timestamps, and links to official Miami-Dade heat guidance and cooling sites. Missing hours stay marked; official resource links remain available if weather cannot be retrieved, as checked with a local simulated outage. The route needs no work order or account. It does not provide active alerts, personalized risk advice or confirmation that a cooling site is open. The crew briefing's date and Miami location are also included consistently in display, copy and download.

**Community value:** The intended benefit is a clearer planning conversation between a supervisor and crew, with work and paid time kept visible, plus a direct path for residents to dated forecast information and official local resources. This is forecast planning support, not a safety certification. The current crew scenario is fictional; worker/resident interviews and health, productivity or financial outcomes have not been established. Clothing assessment and effort scoring remain proposals.

**Original technical contribution:** A complete work-order-to-briefing flow; editable extraction with source references; deterministic constraint checking and schedule comparison; time-zone and forecast-coverage validation; and server-verified comparison data for the briefing. The project includes tests, synthetic evaluation cases, attribution and reproducible setup instructions.

**Build for Miami track:** Four Forces, One City — Fire.

**Additional challenges:** Best Open-Source AI Project; Best Use of Gemma 4. Select these explicitly in OrganizerHQ where available.

**Repository:** https://github.com/NaxeCode/heatshift

**Live app:** https://heatshift-naxecodes-projects.vercel.app

**Runtime technologies:** Next.js, React, TypeScript, Google Gen AI SDK, Gemini API, Gemma 4 (`gemma-4-26b-a4b-it`), Zod, National Weather Service API and Vercel.

**Source license:** MIT for original project code and docs. Dependencies, model and data retain their respective licenses or terms. The repository will need to remain public after the event.

**Team roles, pending roster/display-name confirmation:** Aladdin — implementation and integration; Faye — naming, creative direction and marketing; Nelson — worker needs and community impact; Nina — evaluation and product value.

## Required completion outside this draft

- Run a fresh preflight and rehearse the two-minute walkthrough; record and play back a backup. Release verification is recorded, but rehearsal and a usable recording remain unverified.
- Confirm OrganizerHQ check-in and the registered team of no more than four, including any organizer-approved roster changes.
- Confirm the public display names. Do not copy private contact details into this repository.
- Supply the complete, truthful development-tool and model disclosure in the organizer's required fields. The runtime-technology list above is not the full development-tool disclosure.
- Confirm all three category selections, source/app links and the final project title before final submission.
- Wait for Aladdin's explicit go-ahead before submitting. After an authorized submission, retain the actual receipt and record the submitted project URL privately if it contains account information.

Build ends at **3:30 PM Eastern on October 10, 2026**; submission is due by **3:45 PM**. The [official challenge guide](https://github.com/AI-Collective-Hackathons/hack-for-humanity-miami/blob/main/Challenge%20Guide.md) and any same-day organizer amendments control eligibility.

The [demo runbook](DEMO_RUNBOOK.md) covers the two-minute product walkthrough and truthful fallback handling. [Verification evidence](VERIFICATION.md) records completed checks; it does not establish organizer acceptance.
