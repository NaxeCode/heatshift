# Verification evidence

Recorded October 10, 2026. This is observed implementation evidence, not event submission or field validation.

## Soft Signal and resident-page integration

Locally verified October 10 at approximately 1:40 PM Eastern; deployment of this integration is still pending:

- Faye's PR #14 supplies the Soft Signal palette, typography and forecast-color direction. The app now applies those tokens, emphasizes the before/after measure, exposes task-field errors and puts the selected work date in both briefing languages and exports. Final name and logo remain Faye's decision.
- The approved `/community` route renders today's remaining Miami forecast hours at request time, including source/retrieval/check timestamps, explicit gaps, fixed-grid limitations and official county guidance/cooling links. The production build identifies the route as dynamic.
- **39 tests, TypeScript, formatting and the production build pass.** New tests cover temperature-color mapping, work-date formatting across host timezones, bilingual export headers, and community hours around missing coverage and Miami midnight.
- The local browser completed real Gemma extraction, live-NWS comparison and bilingual briefing generation. This forecast-dependent example again returned 150 → 0 minutes in the three hottest hours, preserving 150 outdoor minutes and the eight-hour shift. The downloaded Spanish file contains the correct October 11 date and inspected schedule times.
- Responsive inspection found and corrected a narrow comparison-number selector and a clipped resident table. The resident page fits 320 and 768 CSS-pixel widths; the crew comparison and dated briefing fit 320 pixels. Detailed crew timelines intentionally scroll horizontally.
- A separate local production process simulated an NWS outage. `/community` returned HTTP 200 with the unavailable state, no forecast number, and both official resource links still present.

This adds a bounded public information view, not a personal safety score, PPE assessment or live site-availability service. Production verification and final rehearsal remain release gates.

## Released build

- Public app: https://heatshift-naxecodes-projects.vercel.app
- Production deployment: `dpl_72buFnosaAgsKUgU56CimUjMxzpc`, built from `7d8a2f4` and promoted after verification.
- Core implementation merged through [PR #10](https://github.com/NaxeCode/heatshift/pull/10) as `b100801`. The merged application files match the tested deployment.
- Runtime model: `gemma-4-26b-a4b-it`, through Google's Gemini API. No model substitution or canned-response fallback.

## Complete live flow

The public browser flow and API smoke test exercised real Gemma extraction, task confirmation, live NWS data, deterministic comparison and real bilingual briefing generation. The fictional example's 150 outdoor minutes in the selected three hottest hours became 0; all 150 outdoor work minutes, the eight-hour paid shift and the fixed break were preserved. This is one forecast-dependent example, not a general outcome.

The observed forecast used Miami grid `MFL/110,50` for October 11. Its older source timestamp was `2026-10-10T08:06:36+00:00`; the interface disclosed its age. No synthetic forecast was passed off as live data.

English and Spanish output matched the task times, break, paid shift and 150 → 0 comparison in the inspected run. The public app's Spanish text download completed. Browser inspection found no console errors in the completed final flow. The layout fit a 390-pixel viewport without horizontal page overflow. Styling and naming remain provisional for Faye.

## Deterministic and setup checks

- **31 tests passed**, plus TypeScript and the production build in local and CI checks.
- Tests cover shift capacity, task duration, fixed appointments, dependencies, cycles, breaks, unsupported time precision, no improvement and incomplete forecasts.
- Nina's synthetic scheduler cases matched EVAL-01's 90 → 0, EVAL-02's 120 → 60, and EVAL-05's unchanged 0 → 0 expectations. EVAL-04 reports the 30-minute dependency/appointment shortfall even though total shift capacity fits.
- Forecast tests cover units, interval coverage, Miami time-zone normalization and stale/missing data.
- Request-origin and body-size checks passed. The live smoke test rejected a tampered comparison before briefing generation.
- A separate public Git clone completed `npm ci`, type checks, tests and a production build. With private local configuration, its production server completed the real-model/live-weather smoke test. Later extraction changes were pulled into that clone and its checks/build passed again.
- An opaque credential scan found no key in tracked files or the built client bundle. The local credential file is Git-ignored with mode `0600`; production configuration is encrypted and server-only.

## Repeated extraction

[Final per-case records](evaluation/EXTRACTION_RESULTS.json) contain three real-model completions per synthetic work order. These compare task count, duration, environment, fixed starts, explicitly expected original starts and dependency IDs. They do not prove every semantic property of arbitrary work orders.

| Case | Final recorded runs | Observed result |
| --- | --- | --- |
| EVAL-01 | 3 matching completions | Normal work order ready for supervisor confirmation |
| EVAL-02 | 3 matching completions | Fixed appointment and dependency preserved |
| EVAL-03 | 3 matching completions | Missing duration, 45-minute precision, unknown setting and out-of-shift work flagged; comparison blocked |
| EVAL-04 | 3 matching completions | Dependency preserved and 30-minute appointment conflict reported; missing original starts still require confirmation |
| EVAL-05 | 3 matching completions | Original starts retained; deterministic test separately confirms unchanged output |

Earlier exploratory calls exposed source-copying errors, inconsistent constraint extraction, an unsupported structured-output shape and provider quota/transient failures. Those calls are not hidden inside a claimed accuracy percentage: this table selects the final per-case records after changes. Source citations now use a supported single line number and code copies the original text. Deterministic review flags missing inputs and known constraint conflicts. The evaluation runner spaces requests and stops on quota errors; application requests retry selected transient errors once within a bounded time budget. Quota errors remain visible and do not substitute invented results.

The extraction records span `6e8ba3e` and `7d8a2f4`; the extraction prompt/schema/review logic is identical across them. The latter adds bounded provider retries. Human review remains required. These small synthetic runs are not field validation or a general accuracy/availability estimate. Full manual review of every bilingual briefing for all five cases remains outside this recorded test set.

## Remaining team and submission work

Faye's final name/creative direction, real worker feedback, full crew-language review, confirmed event roster/check-in, organizer disclosures, demo rehearsal and submission receipt are not completed by these checks. Task effort is documented in Nelson's proposal but is not scored by the scheduler. No health, productivity or cost outcome has been measured. See [submission checklist](SUBMISSION.md).
