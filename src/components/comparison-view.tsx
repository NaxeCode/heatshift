import {
  ShieldCheck,
  ThermometerSun,
  Sun,
  ChevronDown,
  Wind,
  ArrowUpRight,
  Sparkles,
  LoaderCircle,
  Check,
  Copy,
  Download,
} from 'lucide-react';
import { Briefing, Comparison, displayTime, minutes } from '@/lib/contracts';
import { crewBriefText, forecastColor, formatWorkDate } from '@/lib/presentation';
import ForecastSummary from './forecast-summary';
export type Envelope = { result: Comparison; signature: string };
function Timeline({ result, kind }: { result: Comparison; kind: 'original' | 'proposed' }) {
  const start = minutes(result.plan.shiftStart),
    end = minutes(result.plan.shiftEnd),
    span = end - start;
  const percent = (n: number) => `${(n / span) * 100}%`;
  const placements = result[kind];
  return (
    <div className="timeline-row">
      <div className="timeline-label">
        <strong>{kind === 'original' ? 'Original plan' : 'Proposed plan'}</strong>
        <span>
          {kind === 'original' ? result.before.hotMinutes : result.after.hotMinutes} min in hottest
          hours
        </span>
      </div>
      <div
        className="timeline-track"
        role="img"
        aria-label={`${kind} schedule. ${placements.map((p) => `${result.plan.tasks.find((t) => t.id === p.id)!.title}, ${displayTime(p.start)} to ${displayTime(p.end)}`).join('. ')}. Break ${result.plan.breakStart} to ${result.plan.breakEnd}.`}
      >
        {result.hottestHours.map((h) => (
          <div
            key={h.start}
            className="hot-window"
            style={{
              left: percent(Math.max(start, h.start) - start),
              width: percent(Math.min(end, h.end) - Math.max(start, h.start)),
            }}
          />
        ))}
        <div
          className="break-block"
          style={{
            left: percent(minutes(result.plan.breakStart) - start),
            width: percent(minutes(result.plan.breakEnd) - minutes(result.plan.breakStart)),
          }}
          title={`Fixed break ${result.plan.breakStart}–${result.plan.breakEnd}`}
        />
        {placements.map((p) => {
          const t = result.plan.tasks.find((t) => t.id === p.id)!;
          return (
            <div
              key={p.id}
              className={`time-block ${t.environment}`}
              style={{ left: percent(p.start - start), width: percent(p.end - p.start) }}
              title={`${t.title} · ${displayTime(p.start)}–${displayTime(p.end)} · ${t.duration} min`}
            >
              <span>{t.title}</span>
              <small>{displayTime(p.start)}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default function ComparisonView({
  envelope,
  onBrief,
  busy,
  briefing,
  language,
  setLanguage,
  copied,
  onCopy,
  onDownload,
}: {
  envelope: Envelope;
  onBrief: () => void;
  busy: string | null;
  briefing: Briefing | null;
  language: 'english' | 'spanish';
  setLanguage: (v: 'english' | 'spanish') => void;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}) {
  const r = envelope.result,
    removed = r.before.hotMinutes - r.after.hotMinutes;
  const start = minutes(r.plan.shiftStart),
    end = minutes(r.plan.shiftEnd);
  const hours = r.forecast.hours.filter((h) => h.end > start && h.start < end);
  const hottest = new Set(r.hottestHours.map((h) => h.start));
  const peak = Math.max(...hours.map((h) => h.apparentF));
  const low = Math.min(...hours.map((h) => h.apparentF));
  const age = Math.max(0, Math.round((Date.now() - Date.parse(r.forecast.generatedAt)) / 60000));
  return (
    <section className="result-section" aria-label="Schedule comparison">
      <div className="section-eyebrow">
        <span className="live-dot" /> LIVE FORECAST · VERIFIED SCHEDULE
      </div>
      <div className="result-heading">
        <div>
          <h2>
            {removed > 0
              ? 'Same work. Better timing.'
              : r.status === 'alternative'
                ? 'An optional cooler arrangement.'
                : 'No reduction found.'}
          </h2>
          <p>
            {r.status === 'unchanged'
              ? 'No better feasible arrangement was found with these constraints.'
              : 'Flexible tasks move. Your commitments stay in place.'}
          </p>
        </div>
        <span className="verified-badge">
          <ShieldCheck size={16} /> Constraints preserved
        </span>
      </div>
      <div className="result-overview">
        <div className="metrics">
          <div className="metric-feature">
            <span>Outdoor minutes in the three hottest forecast hours</span>
            <strong>
              {r.before.hotMinutes} → {r.after.hotMinutes}
              <small> min</small>
            </strong>
            <p>
              {removed > 0
                ? `${removed} fewer minutes · Original → proposed`
                : 'No reduction in this measure · Original → proposed'}
            </p>
          </div>
          <div>
            <span>Outdoor work preserved</span>
            <strong>
              {r.after.outdoorMinutes}
              <small> min</small>
            </strong>
            <p>Every confirmed task stays</p>
          </div>
          <div>
            <span>Paid shift preserved</span>
            <strong>
              {(end - start) / 60}
              <small> hrs</small>
            </strong>
            <p>Including your fixed break</p>
          </div>
        </div>
        <ForecastSummary forecast={r.forecast} hours={hours} />
      </div>
      <div className="chart-card">
        <div className="chart-title">
          <h3>Your day, rearranged</h3>
          <div className="legend">
            <span>
              <i className="legend-outdoor" />
              Outdoors
            </span>
            <span>
              <i className="legend-indoor" />
              Indoors
            </span>
            <span>
              <i className="legend-break" />
              Break
            </span>
          </div>
        </div>
        <div className="chart-scroll">
          <div className="chart-inner">
            <div className="forecast-row">
              <div className="forecast-caption">
                <ThermometerSun size={18} />
                <strong>Feels like</strong>
                <span>NWS · °F</span>
              </div>
              <div className="forecast-bars">
                {hours.map((h) => (
                  <div
                    key={h.start}
                    className={`weather-column ${hottest.has(h.start) ? 'hottest' : ''}`}
                    style={{
                      width: `${((Math.min(end, h.end) - Math.max(start, h.start)) / (end - start)) * 100}%`,
                    }}
                  >
                    <span>{Math.round(h.apparentF)}°</span>
                    <div
                      style={{
                        height: `${35 + ((h.apparentF - low) / Math.max(1, peak - low)) * 45}px`,
                        background: forecastColor(h.apparentF) ?? undefined,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Timeline result={r} kind="original" />
            <Timeline result={r} kind="proposed" />
            <div className="time-axis">
              <span />
              <div>
                {Array.from({ length: Math.floor((end - start) / 60) + 1 }, (_, i) => (
                  <span key={i} style={{ left: `${((i * 60) / (end - start)) * 100}%` }}>
                    {displayTime(start + i * 60)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="chart-note">
          <Sun size={15} />
          <span>
            Shaded windows mark the shift’s three hottest forecast hours. Open time remains paid
            availability.
          </span>
        </div>
      </div>
      <details className="method">
        <summary>
          See the schedule & how we compare <ChevronDown size={16} />
        </summary>
        <div className="method-content">
          <p>
            We compare outdoor minutes within the same three hottest apparent-temperature forecast
            hours. Ties favor lower duration-weighted apparent temperature, then the smallest change
            to the original plan. {r.candidates.toLocaleString()} feasible schedules checked in
            30-minute steps.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Original</th>
                  <th>Proposed</th>
                  <th>Minutes</th>
                </tr>
              </thead>
              <tbody>
                {r.proposed.map((p) => {
                  const t = r.plan.tasks.find((t) => t.id === p.id)!,
                    o = r.original.find((o) => o.id === p.id)!;
                  return (
                    <tr key={p.id}>
                      <td>
                        {t.title}
                        <small>{t.environment}</small>
                      </td>
                      <td>
                        {displayTime(o.start)}–{displayTime(o.end)}
                      </td>
                      <td>
                        {displayTime(p.start)}–{displayTime(p.end)}
                      </td>
                      <td>{t.duration}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p>
            Average feels-like temperature during outdoor work:{' '}
            {r.before.averageApparentF === null
              ? 'no outdoor work'
              : `${r.before.averageApparentF}°F → ${r.after.averageApparentF}°F`}
            . This is a forecast exposure comparison, not a safety rating or a prediction of health
            outcomes.
          </p>
        </div>
      </details>
      <div className="source-line">
        <Wind size={15} />
        <span>
          NWS forecast issued{' '}
          {age < 60 ? `${age} min` : `${Math.floor(age / 60)} hr ${age % 60} min`} ago ·{' '}
          {new Date(r.forecast.generatedAt).toLocaleString('en-US', {
            timeZone: 'America/New_York',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}{' '}
          ET ·{' '}
          <a href={r.forecast.source} target="_blank" rel="noreferrer">
            View source <ArrowUpRight size={12} />
          </a>
        </span>
      </div>
      <section className="brief-card">
        <div className="brief-heading">
          <div className="brief-icon">
            <Sparkles size={23} />
          </div>
          <div>
            <h3>Bring the crew with you.</h3>
            <p>{formatWorkDate(r.plan.date)} · English and Spanish</p>
          </div>
          {!briefing && (
            <button className="primary" onClick={onBrief} disabled={!!busy}>
              {busy === 'brief' ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <Sparkles size={17} />
              )}
              Prepare briefing
            </button>
          )}
        </div>
        {briefing && (
          <>
            <p className="brief-summary">{briefing.summary}</p>
            <div className="brief-toolbar">
              <div className="language-toggle" aria-label="Briefing language">
                <button
                  aria-pressed={language === 'english'}
                  onClick={() => setLanguage('english')}
                >
                  English
                </button>
                <button
                  aria-pressed={language === 'spanish'}
                  onClick={() => setLanguage('spanish')}
                >
                  Español
                </button>
              </div>
              <div className="brief-actions">
                <button className="icon-button" onClick={onCopy} aria-label="Copy briefing">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button className="icon-button" onClick={onDownload} aria-label="Download briefing">
                  <Download size={18} />
                  Download
                </button>
              </div>
            </div>
            <p className="brief-text" lang={language === 'spanish' ? 'es' : 'en'}>
              {crewBriefText(r.plan.date, language, briefing[language])}
            </p>
            <span role="status" className="sr-only">
              {copied ? 'Briefing copied' : ''}
            </span>
            <p className="fine-print">
              Prepared by Gemma 4. Review the wording and confirmed schedule before sharing.
            </p>
          </>
        )}
      </section>
    </section>
  );
}
