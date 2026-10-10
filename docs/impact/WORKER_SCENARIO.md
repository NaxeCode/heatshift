# Worker scenario and community impact — first pass

**Status:** Fictional planning example, 2026-10-10. Nelson and the team should review its realism with workers or a supervisor. No worker interview, live forecast, safety outcome, or app behavior is claimed here.

## What is established by the project

HeatShift is planned for one Miami landscaping crew, one location, one day, a paid shift, and up to four tasks. A supervisor enters a text work order, reviews AI-extracted task cards, and makes the final schedule decision. The proposed comparison must preserve durations, breaks, appointments, dependencies, and shift boundaries. Planned task fields distinguish indoor from outdoor work but do not yet record physical effort. Forecast exposure is a comparison measure, not a determination that work is safe. The application and its live integrations were still planned when this first pass was written. See [README.md](../../README.md), [docs/BUILD_PLAN.md](../BUILD_PLAN.md), [AGENTS.md](../../AGENTS.md), and [issue #3](https://github.com/NaxeCode/heatshift/issues/3).

## A fictional Miami workday

Imagine a four-person crew at one unnamed Miami property tomorrow. No real client, address, worker, or weather reading is used. The supervisor's *example* order is a 7:00 a.m.–3:30 p.m. shift with an 11:00–11:30 a.m. break. Whether that break is paid must be confirmed; the schedule must not reduce anyone's paid time.

| Original time | Task | Duration | Provisional effort | What the example assumes |
| --- | --- | --- | --- | --- |
| 7:00–9:00 | Mow and edge | 2 hours | Moderate | Outdoor; can move within the shift. |
| 9:00–11:00 | Trim shrubs | 2 hours | Moderate | Outdoor; property access is fixed for this appointment. |
| 11:30–2:30 | Spread mulch and clean beds | 3 hours | Heavy | Outdoor; follows trimming so clippings are cleared first. |
| 2:30–3:30 | Clean and inventory tools in an on-site utility room | 1 hour | Light | Indoors; the room and equipment are actually available. |

These effort labels are guesses, not ratings from workers. The supervisor could *consider* moving light tool work to 11:30–12:30 and heavy mulch to 12:30–3:30. That preserves the appointment, break, task lengths, dependency, and shift, but it may put the hardest work in more severe forecast conditions. A lower outdoor-minutes score alone would not justify that move. The result may be unchanged, worse, or infeasible. The crew should hear the confirmed plan before work starts and be able to flag a wrong effort rating, missing tool, locked room, access change, or other concern.

## Proposed intensity-aware scheduling question — not implemented

The supervisor already enters the tasks through a text work order. A useful next step would be for AI to **suggest** a light, moderate, or heavy effort rating for each extracted task, with an explicit “unknown” option. A worker or supervisor should confirm or correct each rating before comparison; the same task can demand different effort depending on tools, crew, terrain, and pace. Missing or contradictory details should trigger a question, not a guessed rating.

An intensity-aware comparison could use the sourced forecast to *prefer* lower forecast exposure for heavier outdoor tasks where the confirmed constraints allow it. The scheduling calculation, not AI prose, would have to show the tradeoff and preserve the same work, paid time, break, appointments, and dependencies. It should show when there is no feasible improvement. If heavy work remains in concerning conditions, the app should prompt supervisor review under the workplace's heat procedures; it cannot decide that the shift is safe or prescribe an effort level for a worker.

## Three constraints to preserve

1. **Time and pay:** Keep the agreed shift, full task durations, and the 11:00–11:30 break. Confirm the break's pay status; never present a shorter paid day as a heat improvement.
2. **Real work order:** Keep the 9:00–11:00 access appointment and complete trimming before mulch cleanup. Ask when an order is unclear or impossible instead of silently shortening or overlapping work.
3. **Human judgment:** A supervisor confirms the task data with the crew and the site's actual conditions. Forecast scores cannot replace workplace heat procedures, a worker's report of symptoms, or a decision to stop and get help.

## Worker concerns and possible benefit

**Assumptions to validate:** Workers may worry that a last-minute change means lost hours, a skipped break, rushed work, or blame for a forecast that does not match conditions on site. A worker may know that the utility room is locked, that the stated appointment is wrong, or that a task is more demanding than its label suggests; that knowledge needs a clear route into the plan. A worker should be able to raise a concern without the app treating it as resistance or a performance problem. English and Spanish output may help only if workers can understand and correct the wording; language preference must be asked, not inferred.

**Possible benefit, not a measured outcome:** A clear comparison could help supervisors discuss a workable order with the crew while keeping pay and commitments visible. Workers and the people receiving the service benefit only if the plan is feasible, understandable, and responsive to what happens on site. Do not claim that HeatShift prevents injury or makes a shift safe.

## Plain-language crew briefing example

This is a **draft for review**, not an app output or a live forecast recommendation. It illustrates an unchanged plan when a proposed move would put provisionally heavy work later; a real decision needs confirmed effort ratings and forecast data.

> **English:** “The plan stays the same for now: shrubs at 9:00, break at 11:00, mulch from 11:30 to 2:30, then tools until 3:30. Your paid shift stays the same. We listed mulching as hard work. Tell us if that rating, the job order, or conditions on site are wrong. We will review the plan together.”

> **Spanish draft:** “Por ahora, el plan sigue igual: arbustos a las 9:00, descanso a las 11:00, mantillo de 11:30 a 2:30 y luego herramientas hasta las 3:30. El turno pagado sigue igual. Marcamos el trabajo con mantillo como pesado. Avísennos si esa clasificación, la orden de trabajo o las condiciones en el lugar no son correctas. Revisaremos el plan juntos.”

Ask a Spanish-speaking crew member whether “mantillo,” “pesado,” the tone, and the time format sound natural before using this wording.

## Three validation questions

1. Which parts of this sample day or task order would be unrealistic, and which tasks would your crew call light, moderate, or heavy under the actual site conditions?
2. What must stay fixed when a schedule changes—pay, break timing, site access, equipment, travel, or something else—and who can correct the plan?
3. Would the English or Spanish briefing make the change clear enough to act on and challenge? What wording or way of sharing it would work better?

## Evidence boundary

**Sources:** The project documents and issue linked above establish current scope and intended behavior. The intensity-aware comparison is a proposal from this review, not a documented or tested feature. **Assumptions:** Every task, time, effort label, access window, room, worker concern, benefit, and briefing line in this fictional example awaits field validation. **Unknowns:** The actual crew workflow, break/pay policy, access rules, language preferences, heat procedures, and forecast on the day. Do not insert worker identities or real client information into a model prompt to fill these gaps.
