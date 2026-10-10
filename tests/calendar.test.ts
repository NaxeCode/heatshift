import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calendarInstant,
  createCalendarEvent,
  googleCalendarUrl,
  toICalendar,
} from '../src/lib/calendar';
import type { Briefing, Comparison } from '../src/lib/contracts';

export const result = {
  plan: {
    date: '2026-10-11',
    shiftStart: '08:00',
    shiftEnd: '16:00',
    breakStart: '12:00',
    breakEnd: '12:30',
    tasks: [
      { id: 'mow', title: 'Mow, trim; tidy\\up', duration: 90 },
      { id: 'tools', title: 'Tool maintenance', duration: 60 },
    ],
  },
  proposed: [
    { id: 'tools', start: 780, end: 840 },
    { id: 'mow', start: 480, end: 570 },
  ],
  forecast: { location: 'Miami, Florida' },
  createdAt: '2026-10-10T18:30:00Z',
} as Comparison;
const brief: Briefing = {
  summary: 'Sample',
  english: 'English briefing\nKeep the break.',
  spanish: 'Preparación: revisión del césped.\n' + 'Árboles 🌴 '.repeat(30),
};

test('calendar time is Miami time across summer, winter and DST transition days', () => {
  assert.equal(calendarInstant('2026-10-11', '08:00'), '20261011T120000Z');
  assert.equal(calendarInstant('2026-01-11', '08:00'), '20260111T130000Z');
  assert.equal(calendarInstant('2026-03-08', '08:00'), '20260308T120000Z');
  assert.equal(calendarInstant('2026-11-01', '08:00'), '20261101T130000Z');
  assert.throws(() => calendarInstant('2026-03-08', '02:30'), /skipped or repeated/);
  assert.throws(() => calendarInstant('2026-11-01', '01:30'), /skipped or repeated/);
  assert.throws(() => calendarInstant('2026-02-30', '08:00'));
});
test('exports the full paid shift with ordered proposed tasks, fixed break and paid gaps', () => {
  const event = createCalendarEvent(result, brief, 'english');
  assert.equal(event.start, '20261011T120000Z');
  assert.equal(event.end, '20261011T200000Z');
  assert.match(event.description, /08:00–09:30 · Mow/);
  assert.match(event.description, /09:30–12:00 · Paid availability/);
  assert.match(event.description, /12:00–12:30 · Fixed break/);
  assert.match(event.description, /12:30–13:00 · Paid availability/);
  assert.match(event.description, /14:00–16:00 · Paid availability/);
  assert.match(event.description, /English briefing/);
  const revised = structuredClone(result);
  revised.proposed[1].start = 510;
  revised.proposed[1].end = 600;
  assert.match(createCalendarEvent(revised, brief, 'english').description, /08:30–10:00 · Mow/);
});
test('ICS safely escapes content, folds UTF-8 at 75 bytes, and preserves the selected language', () => {
  const event = createCalendarEvent(result, brief, 'spanish');
  const ics = toICalendar(event);
  const unfolded = ics.replace(/\r\n /g, '');
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
  assert.equal(ics.match(/BEGIN:VEVENT/g)?.length, 1);
  assert.match(unfolded, /Mow\\, trim\\; tidy\\\\up/);
  assert.match(unfolded, /Preparación: revisión del césped\.\\n/);
  assert.ok(!unfolded.includes('English briefing'));
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  assert.match(unfolded, /DTSTART:20261011T120000Z\r\nDTEND:20261011T200000Z/);
  const injection = toICalendar({ ...event, title: 'Title\r\nATTENDEE:intruder@example.com' });
  assert.ok(!injection.includes('\r\nATTENDEE:'));
});
test('Google Calendar and ICS contain the same event, with encoded special characters', () => {
  const event = createCalendarEvent(result, brief, 'spanish');
  const url = new URL(googleCalendarUrl(event));
  assert.equal(url.origin, 'https://calendar.google.com');
  assert.equal(url.searchParams.get('action'), 'TEMPLATE');
  assert.equal(url.searchParams.get('ctz'), 'America/New_York');
  assert.equal(url.searchParams.get('dates'), `${event.start}/${event.end}`);
  assert.equal(url.searchParams.get('details'), event.description);
  assert.equal(url.searchParams.get('text'), event.title);
  assert.equal(url.searchParams.get('location'), 'Miami, Florida');
});
