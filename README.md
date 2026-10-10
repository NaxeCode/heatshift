# kruu

**Plan the work. Work around the heat.**

A clearer workday for Miami's outdoor crews. Kruu turns a work order into a forecast-informed schedule, helping supervisors move flexible outdoor tasks away from the hottest hours while preserving the work, fixed commitments, breaks and paid shift.

[Open Kruu](https://heatshift-naxecodes-projects.vercel.app) · [Miami heat guide](https://heatshift-naxecodes-projects.vercel.app/community) · [Verification](docs/VERIFICATION.md) · [Run locally](#run-locally)

## From work order to crew briefing

1. **Describe the day.** Enter a work order, paid shift and fixed break.
2. **Confirm the details.** Gemma 4 extracts editable tasks and flags missing information. Review durations, indoor/outdoor work, original start times, time windows, appointments and dependencies.
3. **Compare the plans.** Live National Weather Service data and a deterministic scheduler show where flexible work can move. Original and proposed timelines use the same workload and constraints.
4. **See what changed.** Compare outdoor minutes during the shift's three hottest forecast hours. When no improvement is possible, Kruu says so.
5. **Brief the crew.** Review, copy or download the Gemma-generated explanation and crew briefing in English or Spanish.
6. **Take the plan with you.** Download an iCalendar file or open a prefilled Google Calendar event for review and saving.

Calendar exports include the full paid shift, proposed tasks, fixed break, paid availability and selected-language briefing. Times follow `America/New_York`, including daylight saving. Exports are snapshots; later changes do not sync automatically.

The prototype supports **one crew, one Miami forecast location, one date and up to four tasks**. The supervisor makes the final decision. Kruu supports planning; it does not certify that a shift is safe or claim a measured reduction in injuries.

## A heat guide for the community

The [Miami heat guide](https://heatshift-naxecodes-projects.vercel.app/community) gives residents a direct way to check today's available forecast and find county-listed places to cool down—without a work order or account.

- View available forecast hours and source timestamps for the same Miami grid point used by the planner.
- Search Miami-Dade's published cooling-site directory by name, city, ZIP or type.
- Read published hours and access phone and directions links, with the directory's last-check timestamp visible.

The server validates the county table and reuses successful checks for up to five minutes within a warm server process. If the source is unavailable or its structure changes, Kruu links directly to the official directory. Listings do not confirm current opening, accessibility or capacity. The guide does not assess personal risk or provide active alerts.

## Designed to feel clear and calm

Kruu follows the [Soft Signal design direction](docs/creative/BRIEF.md): warm ivory and cream surfaces, apricot controls, cocoa typography and a coral-to-orange ripple sun. The lowercase wordmark and generous spacing keep the interface approachable, while source timestamps, task constraints and uncertainty stay visible.

The application mark is a documented geometric reconstruction of the approved mockup, paired with a Manrope wordmark. The forecast gradient illustrates apparent temperature; its colors are not safety thresholds.

## AI that does specific work

**Runtime model: `gemma-4-26b-a4b-it`, through the Gemini API.** Kruu calls the model server-side using Google's official `@google/genai` SDK. There is no model substitution or canned-response fallback.

| Responsibility | Implementation |
| --- | --- |
| Extract editable tasks and flag missing details | Gemma 4, with schema validation and numbered work-order citations |
| Check feasibility and compare schedules | Deterministic TypeScript |
| Explain the computed result and prepare bilingual briefings | Gemma 4, using the confirmed schedule |
| Protect the comparison passed to the briefing endpoint | Server-signed results; altered or expired data is rejected |

The server copies cited source text from the original work order for review. Missing inputs and unsupported timing precision require supervisor correction. Gemma does not decide schedule feasibility or calculate the comparison metric.

Explore the [model integration](src/lib/gemma.ts), [schemas](src/lib/contracts.ts) and [scheduler](src/lib/scheduler.ts). Model documentation: [Gemma through the Gemini API](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api) and [Gemma 4 model card and license](https://ai.google.dev/gemma/docs/core/model_card_4).

## What the comparison measures

The primary metric is **outdoor minutes overlapping the three hottest hourly apparent-temperature periods that intersect the paid shift**. Tied temperatures select earlier hours consistently; partial hours count only the minutes inside the shift. This compares forecast exposure, not personal heat risk.

Every task is a contiguous block on a 30-minute grid. Tasks cannot overlap each other or the fixed break. The scheduler preserves durations, time windows, fixed appointments and dependencies. Ties favor lower duration-weighted apparent temperature during outdoor work, then fewer changed tasks, then less total movement. A change that improves only average temperature is labeled an optional alternative.

A valid original schedule is required for an honest comparison. Missing details, unsupported precision, conflicting appointments or incomplete weather coverage block the result. **Unchanged and infeasible plans are valid outcomes.** Open shift time remains paid availability.

## Live data, visible limits

Kruu uses the [National Weather Service API](https://www.weather.gov/documentation/services-web-api), with Miami grid **MFL/110,50**, derived from **25.7617, −80.1918**:

- [Hourly forecast](https://api.weather.gov/gridpoints/MFL/110,50/forecast/hourly) for hourly air temperature.
- [Grid data](https://api.weather.gov/gridpoints/MFL/110,50) for interval-based apparent temperature.
- [Gridpoint documentation](https://weather-gov.github.io/api/gridpoints) for source structure.

The adapter converts explicit Celsius/Fahrenheit units, maps timestamps to `America/New_York`, checks complete hourly coverage and displays the older source timestamp. Data older than 12 hours is refused. NWS responses may be reused for up to five minutes. Repeated or skipped local hours at daylight-saving transitions are refused rather than guessed.

Forecasts do not represent every job site's shade, exertion, equipment, humidity exposure or worker condition. Kruu does not replace workplace procedures or the supervisor's judgment. No worker interviews or health, productivity or financial outcomes have been measured.

### Privacy and operational limits

Work-order text is saved locally in the browser and sent to the configured model service for extraction. Avoid worker identities and private client information. Kruu includes no accounts, database, analytics or automatic crew messaging. Model request sizes and durations are bounded. Rate limiting is best-effort per instance, not a distributed abuse or billing control.

## Run locally

Use Node.js **24 LTS** (recommended), npm and a Gemini API key with access to `gemma-4-26b-a4b-it`.

```sh
git clone https://github.com/NaxeCode/heatshift.git kruu
cd kruu
npm ci
cp .env.example .env.local
# Add your own GEMINI_API_KEY to .env.local in an editor.
chmod 600 .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). Keep `.env.local` private: it is excluded from Git and deployment uploads. Never prefix the key with `NEXT_PUBLIC_`; it belongs on the server and is not sent to the browser.

### Check the build

```sh
npm run typecheck
npm test
npm run build
npm start
```

The complete input-to-result flow has been exercised with real Gemma calls and live NWS data, including a fresh-clone production run. The [verification record](docs/VERIFICATION.md) documents evidence and limits.

For a running server, `npm run smoke:live` exercises extraction → forecast → schedule → bilingual briefing and checks that tampered results are rejected. It makes real model calls. Set the existing `HEATSHIFT_BASE_URL` environment variable to target another deployment.

`npm run evaluate:live` runs five synthetic work orders three times each against the real model using `.env.local`. For a focused case, use `npm run evaluate:live -- --case=EVAL-02`. The runner spaces requests and stops on provider quota errors. Both commands write evidence under the ignored `work/` directory.

## Deploy and contribute

Kruu is a Next.js Node application. On Vercel, link the intended project, select the Next.js framework and configure `GEMINI_API_KEY` as an encrypted server environment variable. `.vercelignore` excludes local credentials. Use the public production URL for the demo; preview deployments can remain protected.

All changes to `main`, including administrator changes, go through a pull request. CI must pass type checks, focused tests and a production build before merge. Keep branch protection enabled.

## Built for Miami

**Hack for Humanity Miami · Track 01 — Four Forces, One City · Fire**

Kruu serves Miami outdoor landscaping crews and their supervisors, with a resident heat guide extending access to local forecast information and cooling-site listings. Its three intended competition categories are **Track 01 — Four Forces, One City**, **Best Open-Source AI Project** and **Best Use of Gemma 4**. Eligibility and submission status are tracked separately in the [submission checklist](docs/SUBMISSION.md), against the [official challenge guide](https://github.com/AI-Collective-Hackathons/hack-for-humanity-miami/blob/main/Challenge%20Guide.md).

### Contributors

| Contributor | Contribution |
| --- | --- |
| **Aladdin** | Engineering and Integration |
| **Faye** | Creative Direction, Branding and Demo Story |
| **Nelson** | Community Impact and Worker Needs |
| **Nina** | Evaluation and Product Insight |

Contribution credits are separate from the registered event roster.

[Build plan](docs/BUILD_PLAN.md) · [Worker scenario](docs/impact/WORKER_SCENARIO.md) · [Evaluation plan](docs/evaluation/EVAL_PLAN.md) · [Demo runbook](docs/DEMO_RUNBOOK.md)

## Open source

Original project code and documentation are available under the [MIT License](LICENSE). Gemma 4, dependencies and source data retain their respective licenses and attribution requirements. The public source and setup instructions let you inspect and run Kruu with your own API key.

Calendar export follows [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545) for UTC timestamps, text escaping and UTF-8 line folding. Google Calendar uses its event-template URL; no calendar account access or automatic event creation is required.
