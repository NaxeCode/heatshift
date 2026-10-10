# Worker scenario and community impact — first pass

**Status:** Fictional planning example, 2026-10-10. Nelson and the team should review its realism with workers or a supervisor. No worker interview, live forecast, safety outcome, or app behavior is claimed here.

## What is established by the project

HeatShift is planned for one Miami landscaping crew, one location, one day, a paid shift, and up to four tasks. A supervisor confirms extracted tasks and makes the final schedule decision. The proposed comparison must preserve durations, breaks, appointments, dependencies, and shift boundaries. Forecast exposure is a comparison measure, not a determination that work is safe. The application and its live integrations were still planned when this first pass was written. See [README.md](../../README.md), [docs/BUILD_PLAN.md](../BUILD_PLAN.md), [AGENTS.md](../../AGENTS.md), and [issue #3](https://github.com/NaxeCode/heatshift/issues/3).

## A fictional Miami workday

Imagine a four-person crew at one unnamed Miami property tomorrow. No real client, address, worker, or weather reading is used. The supervisor's *example* order is a 7:00 a.m.–3:30 p.m. shift with an 11:00–11:30 a.m. break. Whether that break is paid must be confirmed; the schedule must not reduce anyone's paid time.

| Original time | Task | Duration | What the example assumes |
| --- | --- | --- | --- |
| 7:00–9:00 | Mow and edge | 2 hours | Outdoor; can move within the shift. |
| 9:00–11:00 | Trim shrubs | 2 hours | Outdoor; property access is fixed for this appointment. |
| 11:30–2:30 | Spread mulch and clean beds | 3 hours | Outdoor; follows trimming so clippings are cleared first. |
| 2:30–3:30 | Clean and inventory tools in an on-site utility room | 1 hour | Indoors; the room and equipment are actually available. |

The supervisor could *consider* moving tool work to 11:30–12:30 and mulch to 12:30–3:30. The 9:00 appointment, break, task lengths, dependency, and shift would stay intact. Whether that change improves the project's forecast measure depends on a valid, current forecast; the result may be unchanged or worse. The crew should hear the confirmed plan before work starts and be able to flag a missing tool, locked room, access change, or concern that makes the paper schedule unrealistic.

## Three constraints to preserve

1. **Time and pay:** Keep the agreed shift, full task durations, and the 11:00–11:30 break. Confirm the break's pay status; never present a shorter paid day as a heat improvement.
2. **Real work order:** Keep the 9:00–11:00 access appointment and complete trimming before mulch cleanup. Ask when an order is unclear or impossible instead of silently shortening or overlapping work.
3. **Human judgment:** A supervisor confirms the task data with the crew and the site's actual conditions. Forecast scores cannot replace workplace heat procedures, a worker's report of symptoms, or a decision to stop and get help.

## Worker concerns and possible benefit

**Assumptions to validate:** Workers may worry that a last-minute change means lost hours, a skipped break, rushed work, or blame for a forecast that does not match conditions on site. A worker may know that the utility room is locked or that the stated appointment is wrong; that knowledge needs a clear route into the plan. A worker should be able to raise a concern without the app treating it as resistance or a performance problem. English and Spanish output may help only if workers can understand and correct the wording; language preference must be asked, not inferred.

**Possible benefit, not a measured outcome:** A clear comparison could help supervisors discuss a workable order with the crew while keeping pay and commitments visible. Workers and the people receiving the service benefit only if the plan is feasible, understandable, and responsive to what happens on site. Do not claim that HeatShift prevents injury or makes a shift safe.

## Plain-language crew briefing example

This is a **draft for review**, not an app output or a live forecast recommendation. Use it only if the supervisor confirms that the alternative schedule is feasible and the forecast comparison supports it.

> **English:** “We may do tool cleaning from 11:30 to 12:30 and mulch from 12:30 to 3:30. The 9:00 shrub appointment, your 11:00 break, and your paid shift stay the same. Tell us if the room is unavailable, the job order is wrong, or conditions feel unsafe. We will check the plan together.”

> **Spanish draft:** “Podríamos limpiar las herramientas de 11:30 a 12:30 y colocar el mantillo de 12:30 a 3:30. La cita de las 9:00 para los arbustos, el descanso de las 11:00 y el turno pagado siguen igual. Avísennos si el cuarto no está disponible, la orden de trabajo está equivocada o las condiciones no parecen seguras. Revisaremos el plan juntos.”

Ask a Spanish-speaking crew member whether “mantillo,” “cuarto,” the tone, and the time format sound natural before using this wording.

## Three validation questions

1. Which parts of this sample day or task order would be unrealistic for your crew, and what work have we left out?
2. What must stay fixed when a schedule changes—pay, break timing, site access, equipment, travel, or something else—and who can correct the plan?
3. Would the English or Spanish briefing make the change clear enough to act on and challenge? What wording or way of sharing it would work better?

## Evidence boundary

**Sources:** The project documents and issue linked above establish scope and intended behavior. **Assumptions:** Every task, time, access window, room, worker concern, benefit, and briefing line in this fictional example awaits field validation. **Unknowns:** The actual crew workflow, break/pay policy, access rules, language preferences, heat procedures, and forecast on the day. Do not insert worker identities or real client information into a model prompt to fill these gaps.
