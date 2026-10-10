# Two-minute demo runbook

Working title: HeatShift. Faye owns the final name, logo and narrative. The crew planner, Faye's visual direction, dated briefing exports and resident **Miami heat guide** at `/community` were verified on the public release from main `4751ebf` at approximately 1:46–1:48 PM Eastern. See [release evidence](VERIFICATION.md). Clothing assessment, effort scoring, personal-risk assessment and active alerts are not implemented.

**Submission HOLD:** do not submit the project until Aladdin gives a new explicit go-ahead. Demo preparation, a successful release or the approaching deadline do not lift this hold.

## Before going on stage

- Open the [public app](https://heatshift-naxecodes-projects.vercel.app) and [public repository](https://github.com/NaxeCode/heatshift). Use the production URL, not a protected preview.
- Refresh both production routes before presenting. Recheck today's Miami date, available remaining resident forecast hours, source/retrieval times and official county links. Keep missing hours marked and describe an unavailable forecast honestly. The public integration passed release verification; a fresh preflight checks the current external services and data.
- Use the built-in fictional example. Confirm the date is covered by the live forecast, paid shift is 08:00–16:00 and fixed break is 12:00–12:30. The two indoor tasks are 90 minutes each; pruning is 60 minutes; mowing is 90 minutes. Original starts are 08:00, 09:30, 11:00 and 12:30. There are no task dependencies or fixed appointments in this example.
- Complete one live preflight. Read the actual before/after values and forecast timestamp. Do not promise the earlier 150 → 0 result: weather can change.
- Keep a completed result open in a separate tab and download both briefings. Check the confirmed date and Miami location in each displayed and downloaded language. A completed result is a previously generated live result, not a new model call.
- Use a separate fresh tab for the on-stage run. Avoid unnecessary model calls immediately before presenting. Keep credentials and private chats off the projected screen.
- Proposed roles: Faye narrates, Aladdin operates; Nelson answers worker-context questions; Nina answers evaluation questions. Confirm these roles with the team.
- A narrated two-minute backup was captured from the public app at approximately 2:03–2:05 PM Eastern on October 10. The local handoff file is `heatshift-demo-backup.mp4`; captions, narration text and recording notes accompany it. It uses actual browser frames with edited pauses and synthetic narration, not a continuous real-time capture. H.264 video, AAC audio and subtitle decoding passed; all six segments were visually checked and QuickTime playback opened successfully. This does not establish a team rehearsal or final approval of the narrative.

## Script and clicks

| Time | Operator | Suggested narration |
| --- | --- | --- |
| 0:00–0:15 | Show the fictional work order; start **Review tasks**. | “This is HeatShift, built for Miami. A landscaping supervisor needs to plan tomorrow's outdoor work while keeping the crew's tasks, paid shift and break intact.” |
| 0:15–0:40 | Review the four task cards. Show a source reference if time permits. Confirm the checkbox. | “Gemma 4 turns the work order into editable tasks. The supervisor checks duration, setting and timing. Missing details stay visible for correction. These are real model calls through the Gemini API.” |
| 0:40–1:10 | Click **Compare schedules**. Show timelines, source timestamp and actual values. | “Live National Weather Service data tells us which forecast hours are hottest. Code checks feasible schedules. Here, outdoor work in those hours changes from [before] to [after] minutes. The work, paid shift and break stay the same.” |
| 1:10–1:35 | Generate the crew briefing; show its date and switch English/Spanish. | “Gemma explains the computed result and prepares the crew briefing in English and Spanish. The supervisor reviews it before sharing. This compares forecast exposure; it does not certify that a shift is safe.” |
| 1:35–1:50 | Open the verified **Miami heat guide** tab. Show today's date, remaining hours and county links. | “Residents can also check today's available forecast hours and find official heat guidance and cooling sites. We show the source and missing data. Site hours and access still need confirmation.” |
| 1:50–2:00 | Show the repository's model and license section. | “The source is public under MIT, with the exact model and setup instructions. Our next step is validating both experiences with the people who would use them.” |

If the result is unchanged, say: “Under these constraints, the planner found no better feasible arrangement.” If it is an optional alternative, explain that hottest-hour minutes are unchanged and only the secondary temperature comparison improves. Never invent an improvement.

## Delay or failure during the demo

Spend at most about 10–15 seconds narrating an unexpected provider delay. Then switch to the completed result and say, “This result was generated in our live preflight; the new request is delayed.” Do not represent the saved tab, screenshots or a recording as a new live response. Explain the failure briefly and continue the working product walkthrough.

If weather is missing or stale, show the visible refusal rather than substituting a fabricated forecast. If no verified completed result is available, use the recorded evidence and describe its date and limits. A local copy still depends on the same external model and weather services; it is not an offline fallback.

## One-minute questions: answers we can support

- **Why AI?** Natural language work-order extraction and bilingual explanations. Deterministic code owns feasibility and numerical comparison.
- **Why this is more than a weather app?** It applies a forecast to a specific, reviewed workload and preserves its scheduling constraints.
- **What is open source?** Original code and docs are MIT-licensed. Gemma is an open-weight model under its provider terms. Users supply their own API key; using the API does not require us to host model weights.
- **What is proven?** The public crew flow and resident route were inspected, both downloaded briefing languages matched the selected date and task times, and 39 tests plus TypeScript/build passed locally, in a clean clone and in CI. Formatting also passed locally. One additional extraction produced an incorrect task title that was corrected during review. We have not established field outcomes or a general model-accuracy percentage.
- **What does the resident guide do?** Its verified public scope is today's available remaining forecast hours for one Miami grid point, source timestamps and links to official county heat guidance and cooling sites. It does not provide active alerts, assess personal risk or confirm that a site is open. A local simulated outage confirmed that official links remain available when weather cannot load.
- **What is missing?** Worker and resident validation, effort and protective-gear assessment, site-specific heat measurement, active alerts and additional languages beyond the crew briefing's English and Spanish. We do not claim those are live features.
- **What happens to private information?** Work-order text is sent to the model service. The app asks users to omit personal/client details. The API credential stays server-side.

## Readiness record

See [verification evidence](VERIFICATION.md) for completed technical checks and [submission checklist](SUBMISSION.md) for unconfirmed team registration, check-in, roster and entry steps. A successful technical run does not mean the team has rehearsed or submitted. The submission hold remains in effect until Aladdin explicitly releases it.

## Recorded backup evidence — October 10, 2026

The recorded app runs implementation `4751ebf`. The work date is October 11; the resident page is dated October 10. Real Gemma extraction produced the four expected tasks; the live forecast comparison was 150 → 0 hottest-hour minutes, preserving 150 outdoor minutes, the 08:00–16:00 paid shift and 12:00–12:30 break. English and Spanish downloaded briefings matched the displayed date, location, task times and comparison. These values describe this run only.

The backup is approximately 120 seconds at 1600 × 1080 with six sections: workday, task review, comparison, bilingual briefing, resident resources and public source/license. It is a local team handoff artifact, not a submitted entry. Faye retains final creative/narrative direction. Team speaking roles and a full live team rehearsal remain to be confirmed.
