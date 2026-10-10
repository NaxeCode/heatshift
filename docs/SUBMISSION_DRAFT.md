# Kruu submission draft

Prepared October 10, 2026. **Saved as a draft; not submitted.** Aladdin must explicitly authorize final submission. The saved browser form has the project name, source, description, technologies, live app and three prize categories prepared. Saving a draft is not a submission receipt.

The event page confirms Aladdin is checked in. Other members’ check-in and their association with the entry remain unverified. Aladdin authorized saving the draft and inviting all three teammates. The private invitation was sent in the team group at approximately 3:18 PM; acceptance remains unverified. The published guide locks teams at 10:45 AM; ask the organizer about any unrecorded roster rather than claiming it is approved.

## Deadline discrepancy

The [official guide](https://github.com/AI-Collective-Hackathons/hack-for-humanity-miami/blob/main/Challenge%20Guide.md) and event description say build ends at 3:30 PM and submission closes at **3:45 PM Eastern**. At approximately 3:16 PM, the [live form](https://www.mlh.com/events/hacktoberfest-hack-day-miami-x-the-ai-collective/submissions/new) displayed **5:30 PM EDT**. Prepare for the earlier deadline until an organizer confirms an extension.

## Prepared description

## Kruu — Plan the work. Work around the heat.

A Miami landscaping supervisor has a full workday to plan, but the hottest hours may fall in the middle of the outdoor work. Kruu turns that work order into a forecast-informed schedule while keeping the same work, paid shift and fixed break.

**Track 01: Four Forces, One City — Fire.** Built for Miami outdoor crews and their supervisors, with a resident heat guide as a second entry point.

### What works
- Paste a work order. Gemma 4 extracts editable tasks and flags missing details for supervisor review.
- Compare the confirmed plan against live National Weather Service data for Miami. Deterministic code preserves task durations, appointments, dependencies, breaks and paid time.
- See the change in outdoor minutes during the shift’s three hottest forecast hours. An unchanged or infeasible result is valid; the app does not manufacture an improvement.
- Generate an English/Spanish crew briefing, download it, or export the day to iCalendar or a prefilled Google Calendar event.
- Residents can check today’s available forecast and search Miami-Dade’s official cooling-site directory by name, city, ZIP and type. Source timestamps and missing data stay visible; site access and opening hours need confirmation.

### AI and open source
The application calls **Gemma 4 (`gemma-4-26b-a4b-it`) through the Gemini API** for work-order extraction and bilingual explanations. TypeScript computes feasibility and numerical comparisons; server-signed results prevent altered comparison data from reaching the briefing flow. Original code is public under MIT, with model terms, data sources and setup instructions in the README.

**Entered categories:** Track 01 — Four Forces, One City; Best Open-Source AI Project; Best Use of Gemma 4.

### Evidence and limits
The production workflow has been exercised with real Gemma calls and live NWS data. Latest implementation CI passes 45 tests, TypeScript checks and production build. This is a one-crew, one-Miami-location, one-day prototype with up to four tasks. It supports planning; it does not certify safety or claim measured health, productivity or financial outcomes.

**Team:** Aladdin — Engineering; Faye — Creative Direction; Nelson — Community Impact; Nina — Evaluation.

**Live app:** https://heatshift-naxecodes-projects.vercel.app
**Source:** https://github.com/NaxeCode/heatshift

## Remaining entry checks

- Confirm the four-person registered roster and each member’s check-in.
- Complete organizer-required development-tool/model disclosures accurately in the entry workflow; runtime technologies alone are not the full disclosure. The form labels coding-tool fields optional, while the guide asks teams to list tools used.
- Review all fields and obtain Aladdin’s separate authorization before submitting.
- After authorized submission, verify the receipt and final category selections.

The selected backup video is Faye’s cut with the contributor/link ending: 43.6 seconds, H.264/AAC, with corrected Creative Direction and Community Impact titles. It remains a local team handoff, not a hosted video link or a submitted entry.
