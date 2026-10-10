# Cooling sites inside the resident view — implementation proposal

**Checked:** 2026-10-10. **Status:** The source parser and on-page finder are staged in PR #21 for review; they are not merged or deployed. The accompanying [visual concept](COOLING_SITE_FINDER_CONCEPT.html) remains a separate four-listing design sample.

## Why bring the directory into HeatShift?

The deployed `/community` page sends a person to an external county link just when they need to act. That preserved the official source during the first, time-limited release, but it creates another navigation step and leaves the resident to scan a long table. A searchable, on-page finder can make “Where could I cool off?” an immediate part of the resident journey while still linking back to the county.

## Verified sources and limits

- [Miami-Dade's cooling-site page](https://www.miamidade.gov/initiative/weather-ready/extreme-heat/cooling-sites.page) publishes an HTML table with **name, address, city, state, ZIP, phone, hours of operation and type**, plus an interactive county map. Its page is the source to check before travel. On 2026-10-10 it included libraries, parks, a government building and a health clinic.
- The same directory includes **Grapeland Water Park** with a May 23–August 16 operating season. It therefore cannot support a blanket “open now” label in October. Holiday closures, temporary changes, accessibility and capacity are not supplied as reliable live status in the table.
- A public [ArcGIS Cooling Centers layer](https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/Cooling_Centers/FeatureServer/0) exposes point geometry and name, address, ZIP, phone, type and hours fields. Its service page reports the **last data edit as January 5, 2026**. We have **not verified** that it is the exact layer behind the county's linked map or that its records match the current HTML directory. Do not silently substitute it for the county page or call it live availability.

## Recommended resident experience

Show a **“Find a place to cool off”** section above the long hourly forecast table. Start with a list rather than a map so names, hours, phone numbers and keyboard navigation work well on a small screen. A map can be an optional second view after its data source and accessibility are verified.

1. Search by **ZIP, city or site name** and filter by **library / park / other**. No account or precise location is required. If permission-based geolocation is added later, make it opt-in and do not retain the coordinates.
2. Each result card shows site type, name, full address, **published hours as written**, phone, “Call to confirm” and “Directions” actions. A link back to the individual county source or directory and a visible **“Directory checked at”** timestamp belong beside the results.
3. Say **“Check today's hours and access before traveling”** beside every result set. Do not infer “open now,” wheelchair access, cooling capacity or a guaranteed place from the hours text. A seasonal or ambiguous listing should carry an explicit **“Seasonal / confirm first”** label, not appear as an available recommendation.
4. Show helpful empty and failure states: no ZIP match → widen search to county; official source unavailable or stale → show the county directory link and phone information only if separately verified; never present an old cache as current without its age.
5. Keep emergency guidance separate: the county says a person feeling unwell and needing medical assistance should call 911. HeatShift must not diagnose symptoms or turn cooling-site listings into a safety guarantee.

## Data path for Aladdin to evaluate

The county page is HTML, not a verified public availability API. A browser-only fetch of that page may face cross-origin restrictions and would make schema changes hard to detect. The staged implementation **fetches server-side**, requires the observed `locations-table` identifier and eight exact headers, validates every row, and passes only `{name,address,city,state,zip,phone,hours,type}` plus a fetch timestamp to the client. React escapes source strings on render. A successful response is reused for five minutes within a warm server process; failures show the direct county link instead of partial or malformed listings. The production server's ability to reach the county page has not yet been verified.

Before implementation, inspect the county map's actual layer and compare its row count, fields, coordinates and update time with the HTML table. If a current, matching official geospatial feed is confirmed, it could supply points for an optional map and distance sort. **ZIP filtering works without coordinates; “nearest” does not.** Do not geocode or rank by distance from ZIP alone as if it were precise.

Suggested acceptance checks: at least one library and one park card match the official page; seasonal Grapeland is not called open in October; an unknown ZIP widens to county results; a broken or changed table falls back to the county link; timestamps and full published hours remain visible; keyboard and screen-reader users can operate search and filters; mobile result cards expose call and directions without horizontal scrolling. Confirm actual phone and directions targets before release. If the team cannot validate a live integration before demo close, show the county link and clearly label this as a next increment.

## Assumptions and open questions

- **Assumption:** On-page search reduces friction for residents. No resident usability test has yet established that; ask someone unfamiliar with HeatShift to find a cooling site and explain whether they know it is open.
- **Unknown:** County site's reuse rules, update frequency and whether its linked ArcGIS map shares this table's data. Verify before automating a sync or using the map layer.
- **Unknown:** Temporary closures, accessibility, indoor cooled space at each site and transit access. Ask the county or site operator rather than inferring them.
- **Design decision for Faye:** The [concept](COOLING_SITE_FINDER_CONCEPT.html) uses a location search, labeled type chips and clean cards with phone and directions. Its entries are a dated, incomplete sample, not a live finder.

