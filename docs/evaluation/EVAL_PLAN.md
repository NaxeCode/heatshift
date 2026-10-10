# HeatShift evaluation plan

**Status: proposed. No case has been run against the application.** The application does not exist yet. Nothing in this document or in [`examples/evaluation-cases.json`](../../examples/evaluation-cases.json) is evaluation evidence, a benchmark or a result.

All work orders, crews, clients and forecast values in the cases are synthetic and written for evaluation. None is field-validated. The forecast fixture is not National Weather Service data and must never be shown as a live forecast.

## What this evaluation decides

Whether the two things we will say in the demo are true:

1. Gemma 4 turns a work order into task data the supervisor can trust after review, and explains the result without adding to it.
2. Deterministic code produces a schedule that keeps every confirmed constraint and reports the comparison correctly, including when the answer is "no change" or "not possible".

It does not measure health outcomes, injury rates, productivity or cost. HeatShift reports forecast exposure only.

## What counts as a useful result

A supervisor gets value from three outcomes, and all three count as success:

- **A better order.** Fewer outdoor minutes in the shift's three hottest forecast hours, with every task, the break, appointments, dependencies and paid hours intact.
- **A confirmed plan.** "Your plan already keeps outdoor work out of the hottest hours" is a useful answer. It should look like a normal result, not a failure.
- **A clear stop.** "This cannot be scheduled, and here is the conflict" or "I need these four details" saves the supervisor from finding out on site.

A result is harmful, not merely unhelpful, when it looks like one of these and is wrong. A wrong improvement costs more than no answer, because the supervisor acts on it. So the cases weight honesty over the size of any improvement.

Proposed threshold, to be confirmed with Aladdin: recommend a change only when the primary metric strictly improves. If only the tie-break improves (same hottest-hour minutes, slightly lower weighted temperature), show it as optional. Reshuffling a crew's day for a difference nobody would notice is not a benefit.

## What we check

| Dimension | Question | Judged against |
| --- | --- | --- |
| Task extraction | Did Gemma return the right tasks, durations, indoor/outdoor, fixed starts, dependencies and break? | Expected fields per case; titles by meaning |
| Preserved constraints | Does the proposed schedule keep durations, shift, break, fixed appointments and dependency order, with no overlaps? | Deterministic checks on the computed schedule |
| Honest uncertainty | When details are missing, contradictory or unsupported, does the product ask instead of guessing? When no schedule or no improvement exists, does it say so? | Planted issues in EVAL-03; outcomes in EVAL-04 and EVAL-05 |
| Explanation fidelity | Does every time and number in the explanation and both briefings appear in the computed result, with no added claims? | Computed result payload; English and Spanish compared line by line |

## Cases

Full inputs, expected values and pass/fail conditions are in [`examples/evaluation-cases.json`](../../examples/evaluation-cases.json). Summary:

| ID | Case | Expected outcome | The failure it is built to catch |
| --- | --- | --- | --- |
| EVAL-01 | Normal work order | Hottest-hour outdoor minutes 90 → 0 | A task shortened or dropped; a benefit claimed that was not computed |
| EVAL-02 | Fixed appointment, break, dependency | 120 → 60; the remaining 60 is the fixed appointment | Appointment or break moved; claiming all outdoor work avoids the heat |
| EVAL-03 | Missing and contradictory details | Scheduling blocked until four issues are resolved | Invented duration; 45 minutes silently rounded; indoor/outdoor guessed; shift quietly extended |
| EVAL-04 | Impossible schedule | Infeasible, with the specific conflict named | A capacity-only check accepting it (390 of 450 minutes fit); a task shortened to force a fit |
| EVAL-05 | No possible improvement | Proposed equals original; 0 → 0 | An invented improvement; a percentage shown for 0 to 0 |

A case passes only if every pass condition holds and no fail condition occurs. Fail conditions are automatic: one is enough.

### Results

| ID | Run | Result |
| --- | --- | --- |
| EVAL-01 | Not run | — |
| EVAL-02 | Not run | — |
| EVAL-03 | Not run | — |
| EVAL-04 | Not run | — |
| EVAL-05 | Not run | — |

Fill this in only from an actual run. Record the date, the commit, the model name and whether the forecast was the synthetic fixture or live. Set `run_status` and `actual_result` in the JSON at the same time.

## How to run a case

There is no harness yet; these steps are manual and can be automated later.

1. **Scheduler (no model needed).** Feed the expected task list, shift, break and the synthetic forecast fixture directly to the scheduling module. Compare outcome, hottest hours and metrics with `expected.scheduling`. This isolates the math from the model and can become a unit test.
2. **Extraction (real Gemma call).** Paste `work_order_text` into the app. Compare the task cards with `expected.extraction` field by field before editing anything. Run each case three times; model output varies, and a case that passes once in three is a fail.
3. **Explanation and briefing (real Gemma call).** After step 2, correct the cards to the expected values if needed, run the schedule, and check the explanation and both briefings against the computed result. List every number and time in the text and find each one in the result.

Steps 2 and 3 count as evidence only with a real API call. A canned or fixture model response proves nothing about Gemma. The synthetic forecast is acceptable for steps 1 to 3 if it is labeled on screen; one additional run on a live NWS forecast is needed before claiming the live flow works, and its numbers will differ from this file.

## How the expected values were derived

Expected metrics follow the rules in [`BUILD_PLAN.md`](../BUILD_PLAN.md): 30-minute placements, outdoor minutes in the shift's three hottest forecast hours, then duration-weighted apparent temperature, then fewest changes. The numbers were cross-checked by enumerating every valid placement for each case with a throwaway script that is not part of this change. That confirms the file is internally consistent with those rules. It is not a test of the application.

The reference schedules are examples, not the only correct answer. EVAL-01 has 32 schedules that tie on both metrics, so the pass conditions assert metrics and constraints, not one exact timeline.

## Assumptions to confirm with implementation

The plan leaves these open. The expected values depend on them as noted in the JSON.

- **Tie-break scope.** Assumed: duration-weighted apparent temperature covers outdoor minutes only. If it includes indoor minutes, the weighted values change; the primary metric does not.
- **Task splitting.** Assumed: a task is one block and cannot span the break. The expected primary-metric values hold either way.
- **Ties among hottest hours.** The fixture avoids ties. The rule for tied hours is undefined and should be decided before a live forecast produces one.
- **Partial hours.** Every fixture shift starts and ends on the hour. A shift ending at 3:30 PM raises the question of whether a half-covered hour can be one of the three.
- **Approximate durations.** EVAL-03 expects "about 45 minutes" to be flagged, not rounded, per the plan's rule on unsupported precision.

## Supervisor value proposition

> The evening before a hot day, a landscaping supervisor pastes in tomorrow's work order and sees, on one screen, whether the same tasks in the same paid hours can be reordered so that less outdoor work falls in the forecast's three hottest hours, with a crew briefing in English and Spanish that explains the change. If no better order exists, or the plan cannot work as written, it says so.

This is a planning aid for a decision the supervisor already makes. It is grounded in what the product computes: an ordering and a forecast-exposure comparison.

Assumptions we would need to validate before relying on it:

1. Supervisors have the authority and enough flexibility to reorder tasks within a day. Client access windows, noise restrictions on early equipment use, deliveries and equipment sharing may fix more of the day than our examples suggest.
2. Supervisors do not already do this well by habit. If most plans look like EVAL-05, the product mostly confirms existing practice, which has some value but is a different pitch.
3. "Outdoor minutes in the three hottest forecast hours" is a measure supervisors and crews find meaningful. It ignores shade, exertion level, acclimatization and rest, and it is not a medical measure.
4. The day-ahead hourly forecast ranks the hottest hours reliably enough that a schedule built on it still makes sense the next day. We have not measured this.
5. Entering a work order and reviewing the task cards takes less effort than the supervisor judges the answer to be worth.
6. A written English/Spanish briefing is how crews would actually receive the plan, and the wording reads as respectful and clear to them. This needs review by Nelson and by real crew members.
7. Thirty-minute granularity, one crew and four tasks cover a realistic day closely enough to be useful.

None of these has been tested. They are questions for supervisors and crews, not findings.

## What we will not claim

- That any case passed, until it has been run and recorded.
- Any reduction in heat illness, injuries or medical risk.
- Any dollar savings, productivity gain or return on investment.
- That a schedule is safe. The product reports forecast exposure.
- Any accuracy percentage for Gemma. Five cases can show that specific failures do or do not occur; they cannot support a rate.

## Decisions needed

- Aladdin: confirm or correct the five assumptions under "Assumptions to confirm with implementation", and the threshold for recommending a change.
- Aladdin: which case is the demo scenario. EVAL-02 shows more of the product's honesty than EVAL-01, because it improves the plan and still reports the exposure it could not remove.
