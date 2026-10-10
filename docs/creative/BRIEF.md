# Soft Signal — kruu design language

Light, airy, tactile, and clear enough to use outside. A warm utility for people coordinating real work.

This is kruu’s selected design system, derived from the five supplied references and its planning workflow. Faye selected the lowercase product name **kruu** and the **Soft Signal / Warm** direction. It describes visual and interaction decisions, not new product capabilities. The accompanying specimen uses illustrative data.

## Approved logo direction — October 10, 2026

![Kruu ripple-sun logo with smaller orange lettering on warm ivory, white, and cream](assets/kruu-warm-neutral-logo.png)

Use the ripple sun with exactly three separated, progressively shorter reflection bands. Pair it with the smaller lowercase **kruu** wordmark, vertically centered beside the symbol. Match the coral-to-orange treatment in the approved image; keep the icon and wordmark proportions, generous space, and quiet rounded surfaces.

The attached PNG is the approved visual mockup, including its presentation cards and background. It is not a transparent logo or production vector; do not use the whole board as an application header. Its lettering is illustrative rather than a verified font rendering. Manrope remains the heading font direction, with DM Sans for interface copy.

### Application implementation

The shared `src/components/brand.tsx` renders a geometric SVG reconstruction: a half sun and exactly three separated, progressively shorter rounded reflection bands. Both application routes use this mark beside a lowercase Manrope wordmark. `src/app/icon.svg` uses the same sun geometry as the browser icon. These are editable implementations of the approved direction, not a traced production export or an exact reproduction of the mockup's illustrative letterforms. The presentation PNG is not cropped or placed in the application header.

The brand keeps its fixed coral-to-orange gradient independently of forecast temperatures. `src/app/tokens.css` applies the warm-neutral tokens, including warm focus and shadow colors; timeline and hover states also use warm semantic colors. Existing repository and deployment URLs retain `heatshift` for continuity. Historical release evidence remains labeled with the name used at that time. Application visual verification belongs to its integration/release checks; the specimen checks below do not establish that verification.

The runtime and design tokens use `color-scheme: only light` to opt out of automatic browser darkening. In forced-colors accessibility mode, the wordmark uses system link text instead of transparent gradient text so it remains readable.

The foundation values below translate the approved no-green direction into reusable tokens. Keep the brand gradient fixed; temperature-driven colors belong to the forecast component only. Use dark text for small labels and controls rather than extending the logo gradient to operational text.

## The reference synthesis

- **Autonomous finance reference:** generous negative space and one dominant number. Borrow that hierarchy within the light palette.
- **Auro overview and settings references:** milk-colored surfaces, soft sand, compact rounded controls, human typography. These are the primary visual anchors: milky white, apricot, and gently diffused daylight.
- **Thermostat reference:** a contained warm glow and a large temperature with a clearly selected control. Use the glow only in the forecast panel, with explicit units and labels.
- **Daily-summary reference:** conversational introductions and a clear next action. Make the next task or planning action easy to find.

Do not inherit tiny labels, faint text, hidden double-tap gestures, decorative metrics, or indistinguishable toggles from the references.

## Foundations

| Role | Value | Use |
| --- | --- | --- |
| Canvas / warm ivory | #FBF6EF | Full-page background |
| Surface / cream | #FFFCF7 | Forms, task cards, dialogs |
| Secondary / sand | #F3E5D6 | Selected groups, supporting areas |
| Primary ink / cocoa | #3E2C23 | Text and icons |
| Primary action / apricot | #F2C4A8 | Button fill with cocoa text |
| Accent / terracotta | #985336 | Links, headline emphasis and focus rings |
| Secondary ink / clay | #766052 | Helper text and metadata |
| Control boundary | #A18470 | Essential input and control boundaries |
| Divider | #E7D6C6 | Decorative separators only |
| Warm accent / oat | #F2C4A8 | Forecast illustration, never small text |
| Warm wash | #FFF1DC | Forecast background |
| Indoor task / warm stone | #E5D6C4 | Comparative weather illustration |
| Warning ink / ochre | #76501F | Warning text on #FFF0D6 |
| Error ink / brick | #A13228 | Error text on #FBE9E5 |

Keep the overall interface predominantly warm ivory and cream with apricot controls. The weather panel is the concentrated warm-color area. Keep this direction light regardless of system appearance. This is a composition guide, not a quota. White or pale text must not sit directly on a pale gradient. Keep a solid text zone inside atmospheric cards.

Use semantic color names in code. Apricot identifies ordinary actions; it is not a universal warning. Sand indicates selection or an ordinary completed action, never a guarantee of safe working conditions. Pair every status with a label and, where useful, an icon.

## Typography and spacing

Use **DM Sans** for body text and **Manrope** for headings. Use system sans-serif fallbacks. Body text is 16px/1.5, labels 14px/1.4, metadata at least 12px/1.5. Headlines are 32–48px at weight 500, section headings 22px at 500–600. Temperature or result values are 56–72px at 400, with visible units and explanatory labels. Use tabular numbers for aligned times and comparison values.

Use a 4px spacing base: 4, 8, 12, 16, 24, 32, 48. Mobile page gutters are 20px; desktop gutters are 32–48px. Card padding is 20–24px. Keep 24–32px between major groups. Give controls a minimum 48px touch height and separate nearby actions by at least 8px.

Cards use 24px corners; featured forecast panels use 32px; fields use 12px; short buttons and chips may use pill shapes. Long labels wrap. Avoid rounded containers inside every rounded container. Use a quiet border or a soft shadow, not multiple competing depth effects.

## Signature components

**Forecast panel.** One large apparent-temperature value, labeled “Feels like,” with °F or °C. Put location, forecast date, source and update time nearby. Use a richer sun-colored gradient in this panel while keeping the rest of the interface light. Interpolate continuously from golden yellow (#F2CF65) at 75°F through orange (#F2A34F) at 90°F to warm red (#E9826D) at 105°F. These are visual anchors, not medical or safety thresholds. Clamp the color outside that range while always displaying the actual temperature. Normalize Celsius to Fahrenheit before interpolation. Use the displayed apparent (feels-like) temperature, not air temperature. Missing values use a neutral panel and an unavailable label. Keep text dark brown (#382B22) throughout the gradient. Color reinforces the labeled numeric temperature; an hourly strip in the app carries the actual forecast values. Mark the selected hour with a solid outline or filled pill and a text label. Label hottest-hour highlights relative to the selected shift; do not invent clinical risk thresholds.

**Task card.** Lead with task title. Group start–end time, duration and indoor/outdoor state beneath it. Show fixed appointments and dependencies explicitly. Keep editing accessible through a visible “Edit task” control. Expanded details use the same surface. Missing required values get a field-level message and an error summary.

**Schedule comparison.** Keep Original and Proposed on the same time scale with the same task identities. Use solid, readable blocks with direct labels. Breaks and paid availability remain visible. Show the actual metric as “Outdoor minutes in the three hottest forecast hours,” followed by original → proposed. Show “No reduction found” when appropriate. Never replace this measure with “safety score,” “risk reduced,” or an unsupported percentage.

**Primary action.** Apricot fill (#F2C4A8) with cocoa text (#3E2C23), 48px minimum height, one primary action per stage. Use concrete labels: “Review tasks,” “Compare schedules,” “Review crew briefing,” and “Copy briefing.” Loading keeps the button width stable and replaces its label with the actual operation. Secondary actions use neutral surfaces and a visible boundary.

**Crew briefing.** Put the date and proposed schedule first. Make English and Español explicit text choices. Present times and tasks in a scan-friendly list; maintain room for Spanish copy expansion. Keep copy/download actions near the content. A success message must describe what actually happened: “Briefing copied,” not “Crew notified.”

## Layout and behavior

Desktop planning uses a main work column and a narrower forecast column, approximately 2:1. Comparison can span the content width. Mobile stacks the same workflow in reading order; the forecast summary comes before decisions that depend on it. Keep the current stage and one clear next step visible. Do not add an ornamental bottom navigation or account area solely to resemble the references.

Use 160ms feedback for buttons and selection, and 240ms for expanding cards, with ease-out motion. No looping glow, animated thermometer, or decorative number counting. Respect reduced motion. Native inputs and visible focus rings remain intact. Keyboard users must reach every action.

## Required states

- Empty work order: one clear prompt, a labeled example option if available, and the next action.
- Loading: operation-specific text; preserve entered values and layout.
- Missing task details: identify the exact field and correction needed.
- Unavailable or stale forecast: show the reason and retry action; do not leave stale values looking current.
- No improvement: neutral result with an explanation and original plan retained.
- Infeasible schedule: name the conflicting constraints and point back to editing.
- Illustrative fixtures: persistent “Demo data” label adjacent to fixture forecast and result content. Live NWS weather retains its actual source and timestamp; identify the prefilled work order as a fictional example without labeling live weather as a fixture.

## Implementation handoff

`src/app/tokens.css` is the canonical active palette. The app imports it, and `docs/creative/tokens.css` mirrors it for handoff. Use the semantic tokens in the application stylesheet, keep operational text at the sizes specified above, standardize component spacing, and constrain atmospheric effects to the forecast panel. Reuse the application icon family with consistent stroke weight and visible labels where meaning is ambiguous.

Review final screens at 320px, 390px, 768px and desktop widths, at 200% text zoom, and with keyboard focus. Verify contrast on actual rendered gradients, not only token pairs. The palette's small-text pairs are intended to meet at least 4.5:1; essential control boundaries should meet 3:1. This guide is not a claim that the existing app has passed an accessibility audit.

Reusable direction: “Use Soft Signal: warm ivory canvas, cream cards, sand selections, cocoa typography, a contained yellow-to-orange-to-red temperature-driven forecast glow, generous spacing, readable operational text, 24px cards, 48px controls, and one clear next action. Preserve all scheduling facts and label forecast uncertainty.”

## Review assets and checks

- [Standalone visual specimen](preview.html): open the downloaded file in a browser. Values are illustrative. The task button expands example details; the demo temperature slider previews the sun spectrum. The specimen stays light in both system appearances.
- [CSS tokens](tokens.css): a handoff copy of the active application variables.
- The original specimen passed layout and task-expansion checks at 320, 390, 768 and 1100px. Those checks predate this palette revision. The revised application was visually checked at 1100px and 390px, including the calendar controls in a labeled UI fixture.

### Temperature-color implementation

Linearly interpolate each RGB channel between the two surrounding temperature anchors and round to the nearest integer. Assign the resulting color to `--hs-forecast-color` on the forecast component. Keep the original value and unit in the numeric label, even outside the visual range. Do not apply this scale to error messages or imply that yellow conditions are safe. The specimen slider changes illustrative values only; it does not change the forecast.

Temperature specimen checks: 75°F, 90°F and 105°F map to the specified anchor colors and update the displayed value. Earlier specimen layout checks passed at 320, 390, 768 and 1100px. Dark-brown weather text contrast is 9.04:1 on yellow, 6.59:1 on orange, 5.13:1 on red and 12.15:1 on the pale gradient endpoint.

## Warm palette revision — October 10, 2026

Faye selected the cream-to-apricot-to-coral weather card as the color reference. Extend its warmth into the whole product: warm ivory canvas, cream cards, sand supporting surfaces, apricot buttons, terracotta emphasis and cocoa text. Keep the same layout, typography, and interactions. Warm neutrals dominate; the weather card carries the strongest color and still follows the displayed feels-like temperature.

Use terracotta #985336 for links, focus rings and headline emphasis, and apricot #F2C4A8 for primary actions (hover #EAB18D). Keep separate labeled states for errors and warnings. Indoor tasks use warm stone #E5D6C4, outdoor tasks use apricot, and breaks use taupe #D9C8B8 with their existing hatch pattern and labels. Missing forecasts use neutral sand, never a temperature color.

Warm palette contrast checks: cocoa/ivory 12.29:1; clay/cream 5.76:1; clay/sand 4.77:1; cocoa/apricot 8.33:1; terracotta/ivory 5.39:1; control border/cream 3.39:1. These are calculated token-pair checks, complemented by desktop and mobile visual review.

**Calendar export.** Once the briefing is ready, offer an iCalendar download and a Google Calendar event draft. Include the paid shift, proposed task times, fixed break, paid availability, and the selected-language briefing. Explain that the user reviews and saves it, and that later changes do not sync.
