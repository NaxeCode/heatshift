# HeatShift

**Plan the work. Work around the heat.**

HeatShift helps a Miami landscaping supervisor turn a work order into a practical crew schedule. It compares the original plan with an alternative that moves flexible outdoor tasks into cooler forecast windows while preserving task duration, appointments, breaks, dependencies and the paid shift.

HeatShift is the prototype name. Faye owns the final naming and creative direction.

## Working experience

1. Enter tomorrow's work order and confirm the paid shift and fixed break.
2. **Gemma 4** extracts editable tasks, flags missing information, and preserves unsupported durations for correction rather than rounding them.
3. Review every task's environment, duration, original start, optional time window, fixed appointment and dependencies.
4. A deterministic scheduler compares feasible placements using live **National Weather Service** data for Miami.
5. Review the timelines and the computed change in outdoor minutes within the shift's three hottest forecast hours.
6. Gemma explains the result and prepares a crew briefing in English and Spanish. Review, copy or download it.

**Live prototype:** https://heatshift-naxecodes-projects.vercel.app

The full input-to-result flow has been exercised with real Gemma calls and live NWS data, including a fresh-clone production run. See [verification](docs/VERIFICATION.md) for recorded evidence and limits.

The scope is one crew, one Miami forecast location, one date and up to four tasks. The supervisor makes the final decision. This is forecast planning support, not a medical safety determination or a proven reduction in injuries.

## Run locally

Requirements: Node.js 24 LTS recommended, npm, and a Gemini API key with access to `gemma-4-26b-a4b-it`.

```sh
git clone https://github.com/NaxeCode/heatshift.git
cd heatshift
npm ci
cp .env.example .env.local
# Add your own GEMINI_API_KEY to .env.local in an editor.
chmod 600 .env.local
npm run dev
```

Open http://localhost:3000. Keep `.env.local` private: it is excluded from Git and deployment uploads. Do not use a `NEXT_PUBLIC_` prefix for the key. The server reads it; the browser never receives it.

```sh
npm run typecheck
npm test
npm run build
npm start
```

`npm run smoke:live` exercises extraction → forecast → schedule → bilingual briefing against a running local server and checks that tampered results are rejected. It makes real model calls. Set `HEATSHIFT_BASE_URL` to test another deployment. `npm run evaluate:live` runs the five synthetic evaluation work orders three times each against the real model, using `.env.local`. Both commands write evidence under ignored `work/`. The evaluation runner spaces requests and stops on provider quota errors. Use `npm run evaluate:live -- --case=EVAL-02` for a focused retest.

## AI inside the application

Exact runtime model: **`gemma-4-26b-a4b-it`**, accessed server-side through the **Gemini API** using Google's official `@google/genai` SDK. There is no model substitution or canned-response fallback.

Gemma extracts task data and generates the explanation and bilingual briefing. Task citations identify numbered work-order lines; the server copies the original source text for review. It does not decide feasibility or calculate exposure. Missing inputs require supervisor confirmation. Numeric comparisons are computed in TypeScript. The briefing endpoint accepts only server-signed comparison results and rejects altered or expired data.

- [Gemma through the Gemini API](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api)
- [Gemma 4 model card and license](https://ai.google.dev/gemma/docs/core/model_card_4)
- Implementation: [Gemma integration](src/lib/gemma.ts), [schemas](src/lib/contracts.ts), [scheduler](src/lib/scheduler.ts)

## What the comparison means

The primary metric is **outdoor minutes overlapping the three hottest hourly apparent-temperature periods that intersect the paid shift**. Tied temperatures select earlier hours consistently; partial hours count only the minutes inside the shift. This ranks forecast exposure, not personal heat risk.

Every task is a contiguous block on a 30-minute grid. Tasks cannot overlap each other or the fixed break. The optimizer preserves durations, time windows, fixed appointments and dependencies. Ties favor lower duration-weighted apparent temperature during outdoor work, then fewer changed tasks, then less total movement. A change that improves only average temperature is labeled an optional alternative. Unchanged and infeasible plans are valid outcomes.

A valid original schedule is required for an honest comparison. Missing details, unsupported precision, conflicting appointments or incomplete weather coverage block the result. Open shift time remains paid availability.

## Data and limitations

- [NWS API](https://www.weather.gov/documentation/services-web-api): Miami grid **MFL/110,50**, derived from **25.7617, −80.1918**.
- [Hourly forecast](https://api.weather.gov/gridpoints/MFL/110,50/forecast/hourly) and [grid data](https://api.weather.gov/gridpoints/MFL/110,50): hourly air temperature plus interval-based apparent temperature.
- [Gridpoint documentation](https://weather-gov.github.io/api/gridpoints).

The adapter converts explicit Celsius/Fahrenheit units, maps timestamps to `America/New_York`, checks complete hourly coverage and displays the older source timestamp. Data older than 12 hours is refused. Requests may reuse NWS responses for up to five minutes. Repeated/skipped local hours at a daylight-saving transition are refused instead of guessed.

Forecasts do not represent every job site's shade, exertion, equipment, humidity exposure or worker condition. The app does not replace workplace procedures or the supervisor's judgment. No worker interviews or health, productivity or financial outcomes have been measured.

Work-order text is saved in this browser only and sent to the configured model service for extraction. Avoid worker identities and private client information. No accounts, database, analytics or automatic crew messaging are included. Model request sizes and durations are bounded. The demo includes best-effort per-instance rate limiting; it is not a distributed abuse or billing control.

## Deploy

The app is a standard Next.js Node application. On Vercel, link the intended project, select the Next.js framework, and configure `GEMINI_API_KEY` as an encrypted server environment variable. `.vercelignore` excludes local credentials. Use the public production URL for the demo; preview deployments can remain protected.

All changes to `main` require a pull request, including administrator changes. Passing CI is required before merge and runs type checks, focused tests and a production build. Do not disable branch protection to deliver a change.

## Hack for Humanity Miami

Primary track: **Four Forces, One City / Fire**. Intended users: Miami outdoor landscaping crews and their supervisors.

Built toward **Build for Miami**, **Best Open-Source AI Project**, and **Best Use of Gemma 4**. Eligibility and submission are separate from implementation; see the [submission checklist](docs/SUBMISSION.md) and [official challenge guide](https://github.com/AI-Collective-Hackathons/hack-for-humanity-miami/blob/main/Challenge%20Guide.md).

Team: **Aladdin** leads implementation; **Faye** leads naming, creative direction and marketing; **Nelson** contributes worker needs and community-impact expertise; **Nina** contributes ML product evaluation and product value. The registered submission roster still needs confirmation.

- [Build plan and team handoffs](docs/BUILD_PLAN.md)
- [Worker scenario](docs/impact/WORKER_SCENARIO.md)
- [Evaluation plan](docs/evaluation/EVAL_PLAN.md)

## License

Original project code and documentation are available under the [MIT License](LICENSE). Gemma 4, dependencies and source data retain their respective licenses and attribution requirements. The public repository and real model integration make the project inspectable and reproducible with your own API key.
