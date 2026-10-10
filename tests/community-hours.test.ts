import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Forecast, Hour } from '../src/lib/contracts';
import { remainingCommunityHours } from '../src/lib/community-hours';

const hour = (start: number): Hour => ({
  start,
  end: start + 60,
  apparentF: 90,
  temperatureF: 85,
  label: 'Sunny',
});
function forecast(date: string, hours: Hour[]): Forecast {
  return {
    date,
    hours,
    generatedAt: '2026-10-10T16:00:00Z',
    fetchedAt: '2026-10-10T17:00:00Z',
    source: 'https://api.weather.gov/gridpoints/MFL/110,50',
    location: 'Miami',
    timeZone: 'America/New_York',
  };
}

test('community hours discard completed periods and retain the current partial hour', () => {
  const result = remainingCommunityHours(
    forecast('2026-10-10', [hour(720), hour(780), hour(840)]),
    Date.parse('2026-10-10T17:31:00Z'),
  );
  assert.equal(result[0].start, 780);
  assert.equal(result[0].forecast?.apparentF, 90);
  assert.equal(result.at(-1)?.end, 1440);
  assert.equal(
    result.some((item) => item.start === 720),
    false,
  );
  const nextHour = remainingCommunityHours(
    forecast('2026-10-10', [hour(780), hour(840)]),
    Date.parse('2026-10-10T18:00:00Z'),
  );
  assert.equal(nextHour[0].start, 840);
});

test('community hours show gaps instead of filling missing forecast temperatures', () => {
  const result = remainingCommunityHours(
    forecast('2026-10-10', [hour(780), hour(900)]),
    Date.parse('2026-10-10T17:31:00Z'),
  );
  assert.equal(result[1].start, 840);
  assert.equal(result[1].forecast, null);
  assert.equal(result[2].forecast?.start, 900);
});

test('community hours use Miami date at midnight and handle the winter offset', () => {
  const late = forecast('2026-10-10', [hour(1380)]);
  assert.equal(remainingCommunityHours(late, Date.parse('2026-10-11T03:59:00Z')).length, 1);
  assert.deepEqual(remainingCommunityHours(late, Date.parse('2026-10-11T04:00:00Z')), []);
  const winter = remainingCommunityHours(
    forecast('2026-12-10', [hour(1380)]),
    Date.parse('2026-12-11T04:30:00Z'),
  );
  assert.equal(winter[0].start, 1380);
  assert.deepEqual(
    remainingCommunityHours(forecast('2026-10-11', [hour(0)]), Date.parse('2026-10-10T17:00:00Z')),
    [],
  );
});
