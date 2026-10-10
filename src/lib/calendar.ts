import { type Briefing, type Comparison, clockTime, minutes, ZONE } from './contracts';

export type CalendarEvent = {
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  stamp: string;
  uid: string;
};
const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});
function localKey(date: Date) {
  const parts = Object.fromEntries(formatter.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
function utcStamp(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}
/** Resolve local wall time without depending on the browser's time zone. */
export function calendarInstant(date: string, time: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))
    throw new Error('Check the schedule date and time before adding it to a calendar.');
  const target = `${date}T${time}`;
  const base = Date.parse(`${target}:00Z`);
  if (!Number.isFinite(base)) throw new Error('The schedule date is invalid.');
  const matches: Date[] = [];
  // All contemporary IANA offsets are multiples of 15 minutes, within ±14 hours.
  for (let offset = -14 * 60; offset <= 14 * 60; offset += 15) {
    const candidate = new Date(base - offset * 60000);
    if (localKey(candidate) === target) matches.push(candidate);
  }
  if (matches.length !== 1)
    throw new Error(
      'This time is skipped or repeated by daylight saving. Choose an unambiguous shift time.',
    );
  return utcStamp(matches[0]);
}

export function createCalendarEvent(
  result: Comparison,
  briefing: Briefing,
  language: 'english' | 'spanish',
): CalendarEvent {
  const { plan } = result;
  const es = language === 'spanish';
  const blocks = result.proposed.map((placement) => {
    const task = plan.tasks.find((task) => task.id === placement.id);
    if (!task) throw new Error('A calendar task is missing from the reviewed plan.');
    return { ...placement, title: task.title };
  });
  blocks.push({
    id: 'break',
    start: minutes(plan.breakStart),
    end: minutes(plan.breakEnd),
    title: es ? 'Descanso fijo' : 'Fixed break',
  });
  blocks.sort((a, b) => a.start - b.start);
  const lines: string[] = [];
  let cursor = minutes(plan.shiftStart);
  const paidAvailability = es ? 'Disponibilidad remunerada' : 'Paid availability';
  for (const block of blocks) {
    if (block.start < cursor || block.end <= block.start || block.end > minutes(plan.shiftEnd))
      throw new Error('Review conflicting schedule times before adding them to a calendar.');
    if (block.start > cursor)
      lines.push(`${clockTime(cursor)}–${clockTime(block.start)} · ${paidAvailability}`);
    lines.push(`${clockTime(block.start)}–${clockTime(block.end)} · ${block.title}`);
    cursor = block.end;
  }
  if (cursor < minutes(plan.shiftEnd))
    lines.push(`${clockTime(cursor)}–${plan.shiftEnd} · ${paidAvailability}`);
  const start = calendarInstant(plan.date, plan.shiftStart);
  const end = calendarInstant(plan.date, plan.shiftEnd);
  if (end <= start) throw new Error('The shift must end after it starts.');
  const stamp = utcStamp(new Date(result.createdAt));
  return {
    title: es ? 'kruu · Turno de la cuadrilla' : 'kruu · Crew shift',
    location: result.forecast.location,
    description: [
      `${es ? 'Horario propuesto' : 'Proposed schedule'} · ${plan.date} · ${ZONE}`,
      ...lines,
      '',
      es ? 'Resumen para la cuadrilla' : 'Crew briefing',
      briefing[language],
      '',
      es
        ? 'Copia del horario al exportar; los cambios posteriores no se sincronizan.'
        : 'Schedule snapshot at export; later changes do not sync.',
    ].join('\n'),
    start,
    end,
    stamp,
    uid: `${plan.date}-${new Date(result.createdAt).getTime()}@kruu`,
  };
}
function escapeText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}
/** RFC 5545 folds at 75 UTF-8 octets without splitting a character. */
function foldLine(line: string) {
  const encoder = new TextEncoder();
  let result = '',
    length = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (length + size > 75) {
      result += '\r\n ';
      length = 1;
    }
    result += char;
    length += size;
  }
  return result;
}
export function toICalendar(event: CalendarEvent) {
  return (
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//kruu//Crew planner//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${escapeText(event.uid)}`,
      `DTSTAMP:${event.stamp}`,
      `DTSTART:${event.start}`,
      `DTEND:${event.end}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description)}`,
      `LOCATION:${escapeText(event.location)}`,
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR',
    ]
      .map(foldLine)
      .join('\r\n') + '\r\n'
  );
}
export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${event.start}/${event.end}`,
    ctz: ZONE,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
