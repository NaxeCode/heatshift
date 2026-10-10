export type BriefingLanguage = 'english' | 'spanish';

// Visual anchors only; these colors do not represent safety thresholds.
const temperatureAnchors = [
  { temperature: 75, rgb: [242, 207, 101] },
  { temperature: 90, rgb: [242, 163, 79] },
  { temperature: 105, rgb: [233, 130, 109] },
] as const;

export function forecastColor(apparentF: number | null): string | null {
  if (apparentF === null || !Number.isFinite(apparentF)) return null;
  const temperature = Math.max(75, Math.min(105, apparentF));
  const lowerIndex = temperature <= 90 ? 0 : 1;
  const lower = temperatureAnchors[lowerIndex];
  const upper = temperatureAnchors[lowerIndex + 1];
  const fraction = (temperature - lower.temperature) / (upper.temperature - lower.temperature);
  const rgb = lower.rgb.map((channel, index) =>
    Math.round(channel + (upper.rgb[index] - channel) * fraction),
  );
  return `rgb(${rgb.join(', ')})`;
}

export function formatWorkDate(date: string, language: BriefingLanguage = 'english'): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new RangeError('Work date must be a valid YYYY-MM-DD date.');
  const value = new Date(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(value.getTime()) || value.toISOString().slice(0, 10) !== date)
    throw new RangeError('Work date must be a valid YYYY-MM-DD date.');
  return new Intl.DateTimeFormat(language === 'spanish' ? 'es-US' : 'en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(value);
}

export function crewBriefText(date: string, language: BriefingLanguage, body: string): string {
  const label = language === 'spanish' ? 'Fecha de trabajo' : 'Work date';
  return `${label}: ${formatWorkDate(date, language)} · Miami, Florida\n\n${body}`;
}
