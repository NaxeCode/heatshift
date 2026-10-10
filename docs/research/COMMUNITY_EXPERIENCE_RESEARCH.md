# HeatShift resident experience: research and proposed next pass

**Checked:** 2026-10-10. **Status:** Research and design recommendation for review; no app behavior is implemented by this document. **Audience:** Nelson, Faye, Aladdin, and reviewers. This is about the resident `/community` view; the crew planner remains a separate, working use case.

The [resident-view visual concept](RESIDENT_VIEW_CONCEPT.html) illustrates the proposed hierarchy with prominently labeled fictional weather values. It is a static study, not the deployed app.

## What exists now (observed)

The [live resident page](https://heatshift-naxecodes-projects.vercel.app/community) has an inviting visual style, an NWS forecast and timestamps, an hourly conditions table, caveats about its one Miami grid point, and links to Miami-Dade cooling sites and heat guidance. At a narrow viewport, the 11-row table dominates the first screen; the county help links sit below it. The page does not yet ask what a resident needs to do, place a practical preparation step beside the forecast, or explain how to weigh a cooler hour against a thunderstorm forecast. These are observations of the deployed page on 2026-10-10, not a usability study.

**Problem to solve:** A person deciding whether to walk to a bus stop, get groceries, take a child to a park, or check on a neighbor needs an understandable next step. A peak “feels like” number and a table require the person to do the interpretation alone. The right resident product is a *plan → prepare → find help* flow, with the NWS detail still available for verification. It should not claim that any outdoor time is safe.

## Evidence and inspiration

| Source | Verified pattern | Implication for HeatShift |
| --- | --- | --- |
| [CDC HeatRisk launch](https://www.cdc.gov/media/releases/2024/p0422-heat-protection.html) and [NWS HeatRisk](https://www.weather.gov/safety/heat-index) | A location-specific heat outlook is paired with protective actions. NWS HeatRisk is a **daily, health-based measure** that uses more than the current heat-index number. | Put meaning and action beside the forecast. If we ever show HeatRisk, obtain the actual official value and label it separately; never manufacture a “risk level” from HeatShift's hourly apparent temperature. |
| [Miami-Dade heat tips](https://www.miamidade.gov/initiative/weather-ready/extreme-heat/heat-safety-tips.page) and [county cooling sites](https://www.miamidade.gov/initiative/weather-ready/extreme-heat/cooling-sites.page) | The county connects practical precautions and a directory with addresses, phones, and published hours. | Offer “Find a place to cool off” as a visible action. Until location matching and hours are verified, link the live county directory and say to check today's hours before traveling. |
| [CDC heat protection](https://www.cdc.gov/climate-health/php/resources/protect-yourself-from-the-dangers-of-extreme-heat.html) | Guidance includes loose, lightweight, light-colored clothing, fluids, and adjusting activity timing. | Add a short “What to bring / wear” block. For the worksite view, retain required PPE; resident clothing tips must never override job protection. |
| [NWS lightning guidance](https://www.weather.gov/safety/lightning-safety-overview) | Thunderstorms require an indoor shelter plan; cooler temperature is not enough to recommend an outdoor time. | A time-comparison component must check other relevant forecast hazards and warn when a seemingly cooler period has a storm forecast. |
| [CDC Clear Communication Index](https://www.cdc.gov/ccindex/tool/how-to-use.html) | Public health material should lead with a main message and action, use familiar words, state what is known and unknown, and be tested with its intended audience. | Move the next step above the table. Test English and Spanish versions with residents; model-written translation alone is not validation. |
| [The Weather Channel activity screen](https://mobbin.com/screens/9fe3a564-4bbe-4369-be90-8816f571b0fc) | An activity card shows a compact hour-by-hour strip and a “find best times” action. | Use one compact time strip tied to the chosen outing, with full hourly data behind “See forecast details.” Its “best” language should be softened to “compare times” for HeatShift. |
| [Apple Weather UV screen](https://mobbin.com/screens/932444de-875b-45e6-b56c-c1e2df20610f) | A colored day curve is followed immediately by a short sentence about what it means for that time span. | Put a one-sentence, source-linked interpretation directly under a compact forecast strip. Use text labels as well as color. |
| [AllTrails conditions sheet](https://mobbin.com/screens/79be39ce-fb91-444b-975a-a116f1dcb10c) | Temperature and air quality are distinct modules with their own labels and scale. | Keep “feels like,” storm conditions, and any future air-quality value separate; avoid one opaque combined danger score. |

The Mobbin observations are visual/interaction references, not evidence that their activity ratings are clinically valid for Miami. The CDC and NWS sources support public-facing content; the county source is authoritative for current local cooling resources. HeatShift's present grid-point forecast does **not** yet support neighborhood-level claims.

## Proposed screen hierarchy (first useful minute)

1. **Top line:** “Plan time outside in Miami” with location scope, forecast issue time, and a small “About this forecast” link. If only one grid point is used, say “Miami area forecast,” not “your exact neighborhood.”
2. **One-tap intent:** “What are you heading out for?” with options such as **Quick errand**, **Walk or transit**, **Time outdoors**, **Checking on someone**, and **Just the forecast**. Optional time and approximate duration; no account or precise address required. “Just the forecast” preserves a no-input path.
3. **Action card:** For the selected time, show the official forecast values, a plain-language explanation, and an honest alternative if one is supported by the same forecast. Example *illustrative copy, not a live forecast*: “For a 20-minute errand at 2 PM, the displayed forecast feels hotter than the morning hours. If your errand can move, compare those hours first. Afternoon thunderstorms are also forecast; check alerts before you leave.” A fixed appointment should get preparation guidance, not a “reschedule” instruction.
4. **Prepare card:** Three scannable steps drawn from county/CDC guidance: water, a place to cool down, and loose/lightweight/light-colored clothing or sun protection as relevant. Link “Why this advice?” to the cited guidance. For workers, show site-required PPE and work rules instead of generic clothing substitution.
5. **Cooling/help card:** Link to the official county directory with “Check current hours and access before leaving.” If a resident reports symptoms, direct them to appropriate official emergency information rather than having AI diagnose them. Maintain the county's 911 instruction for urgent medical assistance.
6. **Forecast details:** Collapse the existing full table below the action cards, retaining the NWS link, issue/retrieval time, grid-point explanation, and no-safety-guarantee caveat.

Visual treatment: keep Faye's warm cream/orange language, but reserve strong orange for a single key message. Add a slim horizontal 3–5-hour strip with time labels and written weather conditions. Use three distinct cards (“Plan,” “Prepare,” “Cool off”) and clear icon-plus-text labels. At mobile width, the primary action and one cooling link should be visible before the table. Avoid red/green “safe/unsafe” badges, color-only meaning, or unlabeled weather scores.

## AI components that would earn their place

The existing project requires Gemma 4 through Gemini API for meaningful application inference and deterministic code for constraints. A resident AI feature can fit that architecture without asking the model to invent weather or medical thresholds.

**A. Intent parser (first increment).** A resident may type “I have to walk to the pharmacy around two, 20 minutes.” Gemma extracts `{activity, start_time, duration_minutes, flexibility, needs_clarification}` into a strict schema. Present the parsed plan for confirmation. If it sees “appointment fixed at 10 AM; leave at 2 PM,” it asks which time is correct. Buttons remain available for people who do not want to type. The backend validates the schema and bounds, and does not store the text by default.

**B. Forecast interpreter (second increment).** Deterministic code fetches fresh NWS data, lists the hours actually available, checks forecast age, and flags relevant conditions (including thunderstorm wording). It compares *forecast conditions*, not personal medical risk. Gemma may then turn only those supplied values and a small, reviewed county/CDC guidance set into one or two plain-language sentences with source identifiers. Reject or fall back to templated copy if a value, source, time, or supported action is missing. The UI shows the original values, NWS issue time, and source links. No “safe hour,” diagnosis, individualized health rating, or AI-invented cooling-site hours.

**C. Bilingual explanation (after review).** Draft the same result in English and Spanish, preserve numbers and times exactly, and review key public-health phrases with a bilingual person. Keep a language switch visible; do not infer language from name or location. If the model fails, serve a reviewed static translation rather than mixed-language copy. The current worker briefing's English footer in Spanish mode is an example of why whole-screen QA matters.

Official [Gemma 4 function-calling guidance](https://ai.google.dev/gemma/docs/capabilities/text/function-calling-gemma4) says the application must validate model-generated calls before execution. [Gemini structured-output guidance](https://ai.google.dev/gemini-api/docs/structured-output.md) says JSON shape can be constrained, but application validation is still needed; correct JSON does not establish that an interpretation is true. This design deliberately makes the model a language and intent layer over verified inputs.

### Example AI contract and failure cases

Illustrative input: “I need to walk to the pharmacy at 2 PM for about 20 minutes; I can go earlier.”

Expected parse: `{ "activity": "walk to pharmacy", "start_time": "14:00", "duration_minutes": 20, "flexibility": "earlier_possible", "needs_clarification": false }`. The app then displays what it understood before comparing weather. This is a spec example, not a recorded model result.

Contradictory test: “My clinic appointment is fixed at 10 AM, but plan me to leave at 2 PM for it.” Expected response: `needs_clarification: true` and “Is the appointment at 10 AM or is your travel at 2 PM?” The app should not recommend a time until the conflict is resolved.

Other release tests: stale/missing NWS data → no time comparison; lower heat with thunderstorm wording → show storm warning, no “best time”; unknown cooling-site hours → county link plus check-hours cue; Spanish → all fixed and AI text in Spanish with numbers unchanged; no input → useful forecast and county resources without AI. Test these as behavior, not by matching a model's exact prose.

## What to ship for the hackathon versus later

**Now, highest return:** Put a concise Plan/Prepare/Cool off summary above the table using the existing forecast and reviewed guidance. Make the county cooling link visible immediately. Add source and timestamp beside any time-specific interpretation. This can be deterministic and avoids introducing a fragile new model path hours before a demo.

**If time permits and the team can verify it:** Add the constrained Gemma intent parser for an optional short request and a confirmation step. Demonstrate one everyday resident situation and one contradictory request that triggers clarification. Keep an always-working no-AI path.

**After resident testing:** Add bilingual explanation, neighborhood choice backed by an actual location-to-NWS-grid lookup, and a county-site finder that can verify hours and access. Consider other hazards, such as air quality, only with an authoritative fresh data source and a clear label. Do not claim individual safety from any forecast product.

## Assumptions, unknowns, and validation

- **Assumption:** A short resident task prompt will make the page more useful than a generic table. No resident has yet been observed using this prototype, so test with uncoached people.
- **Assumption:** One-task-first copy is appropriate for a hackathon demo. Ask a resident whether errands, transit, caregiving, outdoor recreation, or simply finding cooling is the most useful entry point.
- **Unknown:** Whether a specific site's hours, accessibility, transit access, and capacity are current. The county directory is a starting point, not a confirmed “open now” feed.
- **Unknown:** Whether neighborhood-level forecasts can be supported before submission; currently one Miami grid point is visible.
- **Unknown:** Who can review Spanish safety copy and whether the Gemini integration can support the proposed resident path reliably under demo conditions.

Three uncoached test questions: “What would you do next from this page?”, “Which statement tells you where the forecast applies and when it was issued?”, and “If the cooler hour shows storms, what would you do?” Observe where people hesitate; do not coach them to the intended answer. A useful success criterion is that people can find a practical action and the cooling directory quickly, and can explain that a forecast comparison is not a safety guarantee.

