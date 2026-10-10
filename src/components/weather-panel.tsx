'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  CloudSun,
  LoaderCircle,
  MapPin,
  RefreshCw,
  ThermometerSun,
} from 'lucide-react';
import { type Forecast, displayTime, minutes } from '@/lib/contracts';
import { forecastColor } from '@/lib/presentation';

export default function WeatherPanel({
  date,
  shiftStart,
  shiftEnd,
  verifiedForecast,
}: {
  date: string;
  shiftStart: string;
  shiftEnd: string;
  verifiedForecast?: Forecast;
}) {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    if (!date) return;
    const controller = new AbortController();
    setForecast(null);
    setError('');
    setSelected(null);
    if (verifiedForecast?.date === date) {
      setForecast(verifiedForecast);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('/api/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'The forecast is unavailable.');
        if (!controller.signal.aborted) setForecast(data);
      })
      .catch((cause) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : 'The forecast is unavailable.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [date, retry, verifiedForecast]);

  // Never display the previous day's data while a new date is loading.
  const current = forecast?.date === date ? forecast : null;
  const hours =
    current?.hours.filter(
      (hour) => hour.end > minutes(shiftStart) && hour.start < minutes(shiftEnd),
    ) || [];
  const peak = hours.reduce<(typeof hours)[number] | undefined>(
    (best, hour) => (!best || hour.apparentF > best.apparentF ? hour : best),
    undefined,
  );
  const hour = hours.find((item) => item.start === selected) || peak;
  const complete =
    hours.reduce(
      (sum, item) =>
        sum +
        Math.max(
          0,
          Math.min(item.end, minutes(shiftEnd)) - Math.max(item.start, minutes(shiftStart)),
        ),
      0,
    ) ===
    minutes(shiftEnd) - minutes(shiftStart);
  return (
    <section
      className={`weather-panel ${hour ? 'has-weather' : ''}`}
      aria-label="Shift forecast"
      style={
        {
          '--weather-color':
            forecastColor(hour?.apparentF ?? null) ?? 'var(--hs-surface-secondary)',
        } as CSSProperties
      }
    >
      <div className="weather-top">
        <span>
          <MapPin size={16} /> Miami, Florida
        </span>
        <CloudSun size={28} strokeWidth={1.4} />
      </div>
      <p className="weather-date">
        {date
          ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })
          : 'Your workday'}
      </p>
      {hour ? (
        <>
          <div className="weather-value" aria-live="polite">
            {Math.round(hour.apparentF)}
            <span>°F</span>
          </div>
          <p className="weather-description">Feels like at {displayTime(hour.start)}</p>
          <span className="weather-peak">
            <ThermometerSun size={15} />{' '}
            {peak && `Shift peak ${Math.round(peak.apparentF)}°F · ${displayTime(peak.start)}`}
          </span>
          <div className="weather-hours" aria-label="Hourly feels-like forecast">
            {hours.map((item) => (
              <button
                key={item.start}
                type="button"
                aria-pressed={item.start === hour.start}
                aria-label={`${displayTime(item.start)}, feels like ${Math.round(item.apparentF)} degrees Fahrenheit`}
                onClick={() => setSelected(item.start)}
              >
                <span>{displayTime(item.start)}</span>
                <strong>{Math.round(item.apparentF)}°</strong>
              </button>
            ))}
          </div>
          {!complete && (
            <p className="weather-coverage">
              Partial forecast. Full shift coverage is required before comparison.
            </p>
          )}
          <div className="weather-source">
            <a href={current!.source} target="_blank" rel="noreferrer">
              National Weather Service <ArrowUpRight size={13} />
            </a>
            <span>
              Issued{' '}
              {new Date(current!.generatedAt).toLocaleString('en-US', {
                timeZone: 'America/New_York',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}{' '}
              ET
            </span>
          </div>
        </>
      ) : (
        <div className="weather-empty" role="status">
          {loading ? (
            <LoaderCircle size={28} className="spin" />
          ) : (
            <CloudSun size={36} strokeWidth={1.3} />
          )}
          <h3>{loading ? 'Checking the forecast' : 'Forecast unavailable'}</h3>
          <p>
            {loading
              ? 'A little context for the day ahead.'
              : error || 'There are no forecast hours in this shift. Check your shift times.'}
          </p>
          {!loading && (
            <button className="secondary" onClick={() => setRetry((n) => n + 1)}>
              <RefreshCw size={15} /> Retry forecast
            </button>
          )}
        </div>
      )}
    </section>
  );
}
