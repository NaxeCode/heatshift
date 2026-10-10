# Two-minute demo runbook

Working title: HeatShift. Faye owns the final name and narrative. This runbook describes the shipped crew planner; resident views, clothing assessment and effort scoring remain proposals.

## Before going on stage

- Open the [public app](https://heatshift-naxecodes-projects.vercel.app) and [public repository](https://github.com/NaxeCode/heatshift). Use the production URL, not a protected preview.
- Use the built-in fictional example. Confirm the date is covered by the live forecast, paid shift is 08:00–16:00 and fixed break is 12:00–12:30. The two indoor tasks are 90 minutes each; pruning is 60 minutes; mowing is 90 minutes. Original starts are 08:00, 09:30, 11:00 and 12:30. There are no task dependencies or fixed appointments in this example.
- Complete one live preflight. Read the actual before/after values and forecast timestamp. Do not promise the earlier 150 → 0 result: weather can change.
- Keep a completed result open in a separate tab and download both briefings. A completed result is a previously generated live result, not a new model call.
- Use a separate fresh tab for the on-stage run. Avoid unnecessary model calls immediately before presenting. Keep credentials and private chats off the projected screen.
- Proposed roles: Faye narrates, Aladdin operates; Nelson answers worker-context questions; Nina answers evaluation questions. Confirm these roles with the team.
- Record one successful run with narration as backup and check playback. This document does not establish that a recording exists or that the team has rehearsed.

## Script and clicks

| Time | Operator | Suggested narration |
| --- | --- | --- |
| 0:00–0:20 | Show the fictional work order; start **Turn work into a plan**. | “This is HeatShift, built for Hack for Humanity Miami. A landscaping supervisor needs to finish tomorrow's work without moving the burden onto the crew. We help compare when the work happens while keeping the paid shift and break intact.” |
| 0:20–0:45 | Review the four task cards. Show a source reference if time permits. Confirm the checkbox. | “Gemma 4 turns the work order into editable tasks. The supervisor checks duration, setting and timing. Missing details stay visible for correction. These are real model calls through the Gemini API.” |
| 0:45–1:15 | Click **Compare with the forecast**. Show timelines, source timestamp and actual values. | “Live National Weather Service data tells us which forecast hours are hottest. Code checks feasible schedules. Here, outdoor work in those hours changes from [before] to [after] minutes. The work, paid shift and break stay the same.” |
| 1:15–1:45 | Generate the crew briefing; switch English/Spanish. | “Gemma explains the computed result and prepares the crew briefing in English and Spanish. The supervisor reviews it before sharing. This compares forecast exposure; it does not certify that a shift is safe.” |
| 1:45–2:00 | Show the repository's model and license section. | “The source is public under MIT, with the exact model, data sources and setup instructions. Today we demonstrate one crew's complete workflow. The next step is validating it with workers and supervisors.” |

If the result is unchanged, say: “Under these constraints, the planner found no better feasible arrangement.” If it is an optional alternative, explain that hottest-hour minutes are unchanged and only the secondary temperature comparison improves. Never invent an improvement.

## Delay or failure during the demo

Spend at most about 10–15 seconds narrating an unexpected provider delay. Then switch to the completed result and say, “This result was generated in our live preflight; the new request is delayed.” Do not represent the saved tab, screenshots or a recording as a new live response. Explain the failure briefly and continue the working product walkthrough.

If weather is missing or stale, show the visible refusal rather than substituting a fabricated forecast. If no verified completed result is available, use the recorded evidence and describe its date and limits. A local copy still depends on the same external model and weather services; it is not an offline fallback.

## One-minute questions: answers we can support

- **Why AI?** Natural language work-order extraction and bilingual explanations. Deterministic code owns feasibility and numerical comparison.
- **Why this is more than a weather app?** It applies a forecast to a specific, reviewed workload and preserves its scheduling constraints.
- **What is open source?** Original code and docs are MIT-licensed. Gemma is an open-weight model under its provider terms. Users supply their own API key; using the API does not require us to host model weights.
- **What is proven?** The complete deployed flow, fresh-clone setup, 31 focused tests and limited synthetic extraction checks. We have not established field outcomes or a general model-accuracy percentage.
- **What is missing?** Worker validation, effort and protective-gear assessment, site-specific heat measurement, resident workflows and additional languages. We do not claim those are live features.
- **What happens to private information?** Work-order text is sent to the model service. The app asks users to omit personal/client details. The API credential stays server-side.

## Readiness record

See [verification evidence](VERIFICATION.md) for completed technical checks and [submission checklist](SUBMISSION.md) for unconfirmed registration and entry steps. A successful technical run does not mean the team has rehearsed or submitted.
