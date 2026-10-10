# Verification evidence

Recorded October 10, 2026. This is observed implementation evidence, not event submission or field validation.

## Current released build

- Public app: https://heatshift-naxecodes-projects.vercel.app
- Resident guide: https://heatshift-naxecodes-projects.vercel.app/community
- Production deployment: `dpl_7BgXgb9LZ8tr5YV1vZKtu4q5uqbi`, built from main `4751ebf4ccf6b10727f64c15187d714b1bc18b4b` after [PR #16](https://github.com/NaxeCode/heatshift/pull/16).
- The deployment command assigned the public alias despite `--skip-domain`. The public release was then verified; it was not a staged-then-promoted deployment.
- Runtime model: `gemma-4-26b-a4b-it`, through Google's Gemini API. No model substitution or canned-response fallback.

## Public release checks, approximately 1:46–1:48 PM Eastern

- The public browser completed real Gemma extraction, task confirmation, live NWS comparison and English/Spanish briefing generation. The fictional example returned **150 → 0 outdoor minutes** in the shift's three hottest forecast hours, preserving all 150 outdoor work minutes, the eight-hour paid shift and the fixed break. This is one forecast-dependent result, not a general outcome.
- Both actual downloaded briefing files were inspected: October 11 work date, task-to-time assignments, shift and break matched the displayed schedule. Exported evidence copies are retained outside the repository.
- A separate local production check of a fictional fixed schedule correctly displayed an unchanged **180 → 180** comparison. Its extraction returned the third task's name as `title`; the reviewer corrected it to `Indoor paperwork` before confirmation. The task times and constraints were extracted correctly. This observed error reinforces the review gate and is not included in a new accuracy claim.
- The public resident guide showed October 10 remaining forecast hours, a 105°F peak apparent temperature in the available hours, source timestamp `2026-10-10T08:06:36Z`, and official county guidance/cooling links. It covers one Miami grid point; it does not assess personal risk, provide active alerts or verify that a cooling site is open.
- Local crew views were inspected at 320, 768 and 1280 CSS-pixel widths, including the unchanged result. Detailed timelines intentionally scroll horizontally. Local resident checks covered 320 and 768 pixels. No browser console errors were found in the inspected public flow.
- A Vercel error-log query for a ten-minute window returned no logs. This limited observation is not a general service-health or availability claim.

## Integration and reproducibility checks

- Faye's [PR #14](https://github.com/NaxeCode/heatshift/pull/14) supplies the applied Soft Signal palette, typography and forecast-color direction. The release exposes task-field errors and includes the confirmed work date and Miami location in displayed, copied and downloaded briefings. Final name and logo remain Faye's decision.
- **39 tests, TypeScript, formatting and the production build passed locally.** A separate clean clone passed all 39 tests, TypeScript and the production build. PR and main CI passed.
- New tests cover temperature-color mapping, work-date formatting across host timezones, bilingual export headers, and community hours around missing coverage and Miami midnight.
- The resident route is dynamic and includes source/retrieval/check timestamps and explicit forecast gaps. In a separate local production process with a simulated NWS outage, `/community` returned HTTP 200 with the unavailable state, no forecast number and both official resource links retained. This was a local failure simulation, not an observed public outage.

## Earlier core release (historical evidence)

The earlier deployment `dpl_72buFnosaAgsKUgU56CimUjMxzpc` used source `7d8a2f4`; core implementation merged through [PR #10](https://github.com/NaxeCode/heatshift/pull/10) as `b100801`. Its public browser flow and API smoke test exercised real Gemma calls and live NWS data for October 11 at Miami grid `MFL/110,50`, with a 150 → 0 example and disclosed source age. The following checks belong to that earlier release, which the 39-test integration above supersedes:

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

Faye's final name and logo, worker/resident feedback, full crew-language review across all evaluation cases, confirmed team roster/check-in, organizer disclosures, demo rehearsal, playable backup recording and submission receipt remain unverified. Task effort and protective gear are not scored by the scheduler. No health, productivity or cost outcome has been measured. See [submission checklist](SUBMISSION.md).

**Submission HOLD:** nothing in this release evidence authorizes submission. Wait for Aladdin's new explicit go-ahead, even if all readiness checks pass or the deadline approaches.
