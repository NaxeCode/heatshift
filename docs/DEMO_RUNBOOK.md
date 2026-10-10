# Kruu final demo runbook

**Submission remains on hold.** This runbook prepares a live demonstration; it does not authorize entry submission.

## Ready evidence

- Application implementation: main `5c0cdd4`, including Faye’s Kruu design/calendar exports and Nelson’s intake/cooling-site finder.
- CI: 45 tests, typecheck and production build passed.
- A new public-production smoke test during final submission preparation passed real Gemma extraction → live NWS comparison → English/Spanish briefing, plus tampered-signature rejection. It returned 150 → 0 hottest-hour outdoor minutes for that run; do not promise those values for a later forecast.
- Selected video: Faye’s original 36-second cut with an eight-second contributor/link ending and 0.4-second crossfade; total 43.6 seconds. Three LinkedIn portraits and Nina’s generic illustrated avatar. The final MP4 is in the local `outputs/faye-final-demo` handoff; it is not hosted by this repository.

## Two-minute live sequence

| Time | Show | Say |
| --- | --- | --- |
| 0:00–0:15 | Work order in the public app | “Kruu helps a Miami landscaping supervisor plan the same paid workday around forecast heat. Our force is Fire.” |
| 0:15–0:40 | Review tasks | “Gemma 4 turns the work order into editable tasks. The supervisor confirms the details before planning.” |
| 0:40–1:10 | Compare timelines and source timestamp | “Live National Weather Service data identifies the hottest forecast hours. Code checks the schedule constraints. Here the overlap changes from [actual before] to [actual after] minutes.” |
| 1:10–1:35 | English/Spanish briefing and calendar export | “Gemma explains the computed result. The supervisor can review and share the briefing, then export the day to a calendar.” |
| 1:35–1:50 | Resident guide | “Residents can also see today’s forecast and search Miami-Dade’s official cooling-site directory. Hours and access still need confirmation.” |
| 1:50–2:00 | Public source/model section | “Our source is MIT-licensed. The runtime is gemma-4-26b-a4b-it through the Gemini API. Our next step is validation with actual crews.” |

## Before presenting

Open the [production app](https://heatshift-naxecodes-projects.vercel.app), [resident guide](https://heatshift-naxecodes-projects.vercel.app/community), and [source/model details](https://github.com/NaxeCode/heatshift#ai-inside-the-application). Keep private chats and credentials off the projected screen. Use the fictional built-in example, inspect the forecast date, and read actual metrics.

Suggested roles: Faye narrates, Aladdin operates, Nelson handles community-context questions and Nina evaluation questions. Team rehearsal is not yet confirmed.

Keep a completed preflight result open separately. If a new provider call stalls for 10–15 seconds, identify the preflight result or recording honestly rather than presenting it as a fresh live response. Missing or stale weather must remain unavailable. Unchanged and infeasible schedules are valid outcomes.

## Claims to keep precise

One crew, one Miami grid point, one date and up to four tasks. Paid shift, breaks, appointments and dependencies are preserved. Hottest-hour overlap is a forecast comparison, not a safety certification. No field-validated injury, productivity or financial outcome is claimed. Cooling sites are published listings, not verified real-time availability. Calendar exports are snapshots, not ongoing synchronization. Gemma performs extraction and explanation; deterministic code owns the numerical schedule comparison.
