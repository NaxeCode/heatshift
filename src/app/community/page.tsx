import type { Metadata } from 'next';
import { connection } from 'next/server';
import { ArrowLeft, ArrowUpRight, MapPin, RefreshCw, Sun, ThermometerSun } from 'lucide-react';
import ForecastSummary from '@/components/forecast-summary';
import { displayTime, type Forecast, ZONE } from '@/lib/contracts';
import { remainingCommunityHours } from '@/lib/community-hours';
import { getForecast, localTime } from '@/lib/weather';
import styles from './community.module.css';

export const metadata: Metadata = {
  title: 'Miami community forecast · HeatShift',
  description: 'Today’s available Miami heat forecast and official county cooling resources.',
};
export const runtime = 'nodejs';
export const maxDuration = 30;

function timestamp(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(value));
}

export default async function CommunityPage() {
  await connection();
  const requestedAt = new Date();
  const date = localTime(requestedAt.toISOString()).date;
  let forecast: Forecast | null = null;
  try {
    forecast = await getForecast(date);
  } catch {
    // Official resources remain usable when weather is unavailable, incomplete or stale.
  }
  const renderedAt = new Date();
  const periods = forecast ? remainingCommunityHours(forecast, renderedAt.getTime()) : [];
  const hours = periods.flatMap((period) => (period.forecast ? [period.forecast] : []));
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(requestedAt);

  return (
    <>
      <a className="skip-link" href="#community-forecast">
        Skip to the forecast
      </a>
      <header className="topbar">
        <a className="brand" href="/" aria-label="HeatShift crew planner">
          <span className="brand-symbol">
            <Sun size={25} aria-hidden="true" />
          </span>
          HeatShift <span className="prototype">PROTOTYPE</span>
        </a>
        <a href="/" className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden="true" /> Crew planner
        </a>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <p className="eyebrow">
            <MapPin size={14} aria-hidden="true" /> MIAMI COMMUNITY FORECAST
          </p>
          <h1>
            A look at the heat.
            <br />
            <span>Before you head out.</span>
          </h1>
          <p>
            Check today’s available forecast hours before an errand or a visit, then find official
            heat guidance and cooling resources.
          </p>
          <p className={styles.date}>
            <time dateTime={date}>{dateLabel}</time> · Eastern time
          </p>
        </section>

        <div className={styles.grid}>
          <section
            id="community-forecast"
            className={styles.forecast}
            aria-labelledby="forecast-heading"
          >
            <div className={styles.sectionHeading}>
              <h2 id="forecast-heading">Today’s remaining hours</h2>
              <a href="/community" className={styles.refresh}>
                <RefreshCw size={16} aria-hidden="true" /> Refresh
              </a>
            </div>
            {forecast && hours.length > 0 ? (
              <>
                <ForecastSummary
                  forecast={forecast}
                  hours={hours}
                  heading="Peak feels like in available hours"
                />
                <div className={styles.provenance}>
                  <p>{forecast.location} · one NWS forecast grid point</p>
                  <p>
                    Source issued{' '}
                    <time dateTime={forecast.generatedAt}>{timestamp(forecast.generatedAt)}</time>.
                    Retrieved{' '}
                    <time dateTime={forecast.fetchedAt}>{timestamp(forecast.fetchedAt)}</time>.
                  </p>
                </div>
                <p className={styles.explanation}>
                  “Feels like” is forecast apparent temperature, not an observed reading or a
                  personal safety rating. Available values appear below; missing hours stay marked.
                  The current hour may already be in progress.
                </p>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <caption className="sr-only">
                      Available hourly forecast for {dateLabel}, Eastern time
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Time · ET</th>
                        <th scope="col">Feels like</th>
                        <th scope="col">Forecast</th>
                      </tr>
                    </thead>
                    <tbody>
                      {periods.map((period) => (
                        <tr key={period.start}>
                          <th scope="row">
                            {displayTime(period.start)}–
                            {period.end === 1440 ? 'midnight' : displayTime(period.end)}
                          </th>
                          <td>
                            {period.forecast
                              ? `${Math.round(period.forecast.apparentF)}°F`
                              : 'Unavailable'}
                          </td>
                          <td>
                            {period.forecast?.label ||
                              (period.forecast
                                ? 'No description supplied'
                                : 'Missing forecast coverage')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <a
                  href={forecast.source}
                  className={styles.sourceLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  View NWS source data <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </>
            ) : (
              <div className={styles.unavailable}>
                <ThermometerSun size={28} aria-hidden="true" />
                <h3>Today’s forecast is unavailable here.</h3>
                <p>
                  We could not load fresh, complete values for any remaining hour. Try refreshing in
                  a few minutes. The official resources are still available on this page.
                </p>
                <a href="/community" className={styles.action}>
                  <RefreshCw size={16} aria-hidden="true" /> Try the forecast again
                </a>
              </div>
            )}
            <p className={styles.meta}>
              Page checked{' '}
              <time dateTime={renderedAt.toISOString()}>{timestamp(renderedAt.toISOString())}</time>
              . Refresh before relying on a page left open; source data may be reused for up to five
              minutes.
            </p>
          </section>

          <aside className={styles.resources} aria-labelledby="resources-heading">
            <p className="section-eyebrow">OFFICIAL LOCAL RESOURCES</p>
            <h2 id="resources-heading">Plan a cooling stop.</h2>
            <p>
              Use Miami-Dade County’s directory to explore cooling sites. Confirm a site’s current
              hours and access before going.
            </p>
            <a
              className={styles.action}
              href="https://www.miamidade.gov/initiative/weather-ready/extreme-heat/cooling-sites.page"
              target="_blank"
              rel="noreferrer"
            >
              Find county cooling sites <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <div className={styles.resourceDivider} />
            <h3>Read official heat guidance.</h3>
            <p>The county’s guidance covers hot-day precautions and links to additional help.</p>
            <a
              className={styles.secondaryAction}
              href="https://www.miamidade.gov/initiative/weather-ready/extreme-heat/heat-safety-tips.page"
              target="_blank"
              rel="noreferrer"
            >
              Miami-Dade heat guidance <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <p className={styles.meta}>
              These links open official county pages. HeatShift does not verify site availability or
              provide a live alert service.
            </p>
          </aside>
        </div>
        <footer className={styles.footer}>
          <p>
            This forecast represents one Miami grid point, not every neighborhood or individual’s
            conditions. Use official updates and your own circumstances when making plans.
          </p>
          <a href="/" className={styles.backLink}>
            <ArrowLeft size={16} aria-hidden="true" /> Planning for a crew? Open the crew planner.
          </a>
        </footer>
      </main>
    </>
  );
}
