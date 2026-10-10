# HeatShift delivery plan

## Product objective

A Miami landscaping supervisor can enter tomorrow's work order, confirm the tasks, compare two feasible schedules and share a clear crew briefing. The visible proof is a before-and-after timeline that preserves the work and constraints while reducing exposure to the hottest forecast periods when the constraints permit it.

## Scope

October 10 integration update: the verified crew flow remains the main demonstration. Aladdin approved a bounded `/community` page with today's available Miami forecast and official county guidance/cooling links, using the same forecast adapter and Faye's Soft Signal design. No new model flow, account, map, geolocation or personal safety assessment is included. Clothing/PPE and effort scoring remain proposals. Faye's final name and logo are still pending.

- One crew, one Miami location, one date, one paid shift and at most four tasks.
- Task fields: title, duration, indoor/outdoor, earliest start, latest finish, fixed start if applicable, and dependencies.
- Preserve shift boundaries, task durations, breaks, fixed appointments and dependency order.
- Text work orders and English/Spanish briefing output.
- One screen with task review, schedule comparison and crew briefing.
- No authentication, payments, multi-crew routing, automatic messaging, map, image upload or voice interface in the initial build.

## Architecture

```text
Work order
  -> server route -> Gemma 4 extraction -> schema validation
  -> editable task cards -> supervisor confirmation
  -> NWS forecast adapter + deterministic scheduler
  -> original/proposed timelines + computed metrics
  -> server route -> Gemma 4 explanation and crew briefing
```

Keep API keys on the server. Bound task count, input length, request duration and model output size. Validate model responses and return actionable errors. Do not send worker identities or unrelated personal data to the model.

Forecast normalization must explicitly handle America/New_York time, daylight-saving boundaries, units and intervals. Do not interpolate away missing forecast coverage. Preserve source and generation/retrieval timestamps.

## Scheduling and evidence

Use 30-minute placements, rejecting inputs whose timing precision is not supported rather than silently rounding. Enumerate feasible placements for up to four tasks with pruning. Preserve all confirmed constraints and reject overlaps. Use the same workload, shift and constraints for both schedules.

Primary comparison: outdoor minutes in the shift's three hottest forecast hours. Break ties using duration-weighted apparent temperature, then minimize changes to the original plan. If there are fewer than three hours of valid coverage, disclose that limitation and avoid a misleading comparison. Explain the chosen metric in the interface.

The result can legitimately be unchanged or infeasible. Show why, and never manufacture a positive improvement. Report forecast-based exposure metrics, not a guarantee that a shift is safe.

## Delivery sequence

Implementation is tracked in [five GitHub issues](https://github.com/NaxeCode/heatshift/issues) under the [Hackathon MVP milestone](https://github.com/NaxeCode/heatshift/milestone/1).

Times are working targets for October 10, 2026, Eastern, not completed milestones. Build closes at 3:30 PM and submission is due at 3:45 PM.

| Target | Deliverable | Acceptance evidence |
| --- | --- | --- |
| By 12:45 PM | Runnable shell and real Gemma extraction | Fresh setup runs; work order becomes editable validated cards using a real API call |
| By 1:35 PM | Forecast adapter and deterministic scheduler | Live NWS data; tests preserve constraints and handle infeasible/no-improvement cases |
| By 2:10 PM | Before/after comparison and bilingual briefing | Full live input-to-result flow; visible computed metric and sourced forecast |
| By 2:40 PM | Deployment and focused validation | Deployed flow works; server keys stay private; errors are clear |
| By 3:15 PM | Documentation and demo rehearsal | Fresh-clone instructions verified; two-minute demo rehearsed; submission checklist complete |
| 3:30–3:45 PM | OrganizerHQ submission | Entry and selected challenges verified; submission receipt retained |

If time contracts, cut optional polish and extra interactions first. The real Gemma API call, valid scheduling, live core flow and public licensed source remain required. A manual-input or fixture fallback may support development and demo resilience but cannot be presented as proof of the required live model integration.

## Verification

- Real Gemma extraction with malformed-output handling and editable confirmation.
- Feasible rescheduling preserves duration, shift, breaks, dependencies and fixed tasks.
- Infeasible input and no-improvement schedules are surfaced accurately.
- Forecast gaps, stale data, API failure and temperature units are handled explicitly.
- Comparison math is independently checked on small known cases.
- Gemma explanations match supplied computed values without introducing new claims.
- English and Spanish briefings are reviewed for consistency.
- Deployed flow and fresh-clone setup are exercised with a real API key.

## Team contribution

Four complementary responsibilities feed one working demonstration. Nelson’s scenario and intensity-review proposal (PRs #8 and #11) and Nina’s evaluation specification (PR #9) have been reviewed and merged. Their unvalidated assumptions remain labeled. Faye retains naming and visual direction; current styling is provisional. The table below preserves the original handoff plan.

| Owner | Responsibility | First handoff by 12:40 PM Eastern | Final contribution |
| --- | --- | --- | --- |
| Aladdin | Implementation and integration | Target: runnable shell, task contract and Gemma access check; first live extraction remains the 12:45 target | Working app, reliable demo, source and deployment |
| Faye | Naming, creative direction, UX and marketing | Three name options and a recommendation, one visual direction, suggested headline and three screen priorities; rough references or bullets are sufficient | Select the final product name, review the built interface, polish product wording and prepare the two-minute demo narrative |
| Nelson | Worker needs and community impact | One clearly labeled example workday for a Miami landscaping crew, with up to four tasks and three constraints we must preserve | Review the scenario and briefing for usefulness, dignity and accessibility; articulate who benefits and how |
| Nina | Model evaluation, product value and operational assumptions | Three evaluation cases with expected behavior: ordinary work order, missing/contradictory details and impossible schedule; one concrete supervisor benefit | Check model outputs and computed comparisons, challenge unsupported claims and prepare product/AI answers for judges |

Nina's ML product experience informs evaluation and product judgment. HeatShift does not require training a new model or adding financial forecasting. Nelson's social-work expertise informs the problem and language; do not label a scenario as field-validated without actual evidence. Faye owns naming, a clear visual decision and the story without needing to produce a full design system during the event. HeatShift is the prototype name; coordinate any repository or deployment rename after the team selects the final name.

Aladdin remains responsible for application implementation and integration. Teammates can use their own AI tools to produce the scoped artifacts below. Use the existing fictional sample and provisional styling until better input arrives.

### Independent branches and pull requests

Start each branch from the latest `origin/main`. If a teammate does not have write access, fork the public repository, create the named branch in the fork and open a pull request to this repository's `main`. Submit the PR link in the group. Aladdin reviews integration; teammates should leave their PRs open and avoid modifying application code or one another's files.

| Owner | Branch | Owned files |
| --- | --- | --- |
| Faye | `faye/creative-direction` | `docs/creative/BRIEF.md`: naming shortlist and recommendation, visual direction, interface wording, screen priorities and two-minute demo story |
| Nelson | `nelson/worker-impact` | `docs/impact/WORKER_SCENARIO.md`: labeled example, confirmed versus assumed needs, constraints, worker-facing language and validation questions |
| Nina | `nina/evaluation` | `docs/evaluation/EVAL_PLAN.md` and `examples/evaluation-cases.json`: model/algorithm evaluation cases, expected behavior, evidence boundaries and product value |

Each handoff should state what changed, its assumptions, how the artifact was checked and any decision needed. Test cases are proposed inputs until actually run; do not present generated results as evaluation evidence. Domain sources should be cited where external facts are used.

### Handoffs and decision points

1. **12:40 PM:** Each teammate posts their first pass in the group. Keep it to one artifact or a few bullets. Mark assumptions and open questions.
2. **12:45 PM:** Aladdin selects the demo scenario and incorporates the highest-value constraints and visual choices. Park additional features until the core flow works.
3. **First working comparison:** Faye reviews clarity, Nelson reviews the worker experience, and Nina checks expected versus actual results. Each reports one must-fix issue and optional refinements separately.
4. **2:40 PM target:** Freeze optional scope and run the complete demo. The build status, not the clock alone, determines what can honestly be claimed.
5. **3:00 PM target:** Rehearse with one narrator and one operator. Proposed: Faye narrates and Aladdin drives the app; Nelson and Nina prepare for community-impact and model/product questions. Confirm roles in rehearsal.

All three workstreams converge on the same scenario, task cards, timeline and crew briefing. Faye shapes how the proof is understood, Nelson shapes why it matters, and Nina checks whether the proof holds up.

## Coordination

Send a compact status digest in the authorized hackathon WhatsApp group every 15 minutes during the event, including active branches, open and newly merged PRs, current CI results, deployment state, blockers and next steps. Distinguish local, pushed, merged and deployed work. Routine digests are explicitly requested, even when status is unchanged; avoid duplicate sends within an interval. Each update should contain verified progress, the next milestone and a specific decision only when needed. Avoid repetitive unchanged updates. Keep development-tool attribution out of product messaging and team updates. Keep required organizer disclosures in the submission workflow.

Group messages are not a substitute for issue status or verified build evidence. Do not publish chat transcripts or private contact information in the public repository.

Changes to `main` require a pull request, including administrator changes. Use a short-lived branch and review the diff before merging. Force pushes and deletion of `main` are blocked; independent reviewer approval is currently optional.
