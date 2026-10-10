import type { CSSProperties } from 'react';
import { ArrowUpRight, ThermometerSun } from 'lucide-react';
import type { Forecast, Hour } from '@/lib/contracts';
import { forecastColor, formatWorkDate } from '@/lib/presentation';

export default function ForecastSummary({
  forecast,
  hours,
  heading = 'Peak feels like during this shift',
}: {
  forecast: Forecast;
  hours: Hour[];
  heading?: string;
}) {
  const finite = hours.filter((hour) => Number.isFinite(hour.apparentF));
  const peak = finite.length ? Math.max(...finite.map((hour) => hour.apparentF)) : null;
  const color = forecastColor(peak);
  return (
    <section
      className={`forecast-summary ${color ? '' : 'forecast-unavailable'}`}
      aria-label={heading}
      style={color ? ({ '--hs-forecast-color': color } as CSSProperties) : undefined}
    >
      <div>
        <ThermometerSun size={24} aria-hidden="true" />
        <h3>{heading}</h3>
        <p className="forecast-date">{formatWorkDate(forecast.date)}</p>
        <p>Miami · National Weather Service</p>
      </div>
      <div className="forecast-number">
        {peak === null ? (
          'Unavailable'
        ) : (
          <>
            {Math.round(peak)}
            <span>°F</span>
          </>
        )}
      </div>
      <div>
        <p>
          Forecast issued{' '}
          <time dateTime={forecast.generatedAt}>
            {new Date(forecast.generatedAt).toLocaleString('en-US', {
              timeZone: 'America/New_York',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}{' '}
            ET
          </time>
        </p>
        <p>Forecast temperature, not a personal safety rating.</p>
        <a href={forecast.source} target="_blank" rel="noreferrer">
          View NWS source <ArrowUpRight size={12} />
        </a>
      </div>
    </section>
  );
}
