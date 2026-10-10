import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crewBriefText, forecastColor, formatWorkDate } from '../src/lib/presentation';

test('forecast colors match the three design anchors and interpolate between them', () => {
  assert.equal(forecastColor(75), 'rgb(242, 207, 101)');
  assert.equal(forecastColor(90), 'rgb(242, 163, 79)');
  assert.equal(forecastColor(105), 'rgb(233, 130, 109)');
  assert.equal(forecastColor(82.5), 'rgb(242, 185, 90)');
  assert.equal(forecastColor(97.5), 'rgb(238, 147, 94)');
});

test('forecast colors clamp finite extremes and leave missing values uncolored', () => {
  assert.equal(forecastColor(-100), forecastColor(75));
  assert.equal(forecastColor(150), forecastColor(105));
  for (const missing of [null, NaN, Infinity, -Infinity])
    assert.equal(forecastColor(missing), null);
});

test('work dates stay on the selected calendar day regardless of the host timezone', () => {
  const previousTimezone = process.env.TZ;
  try {
    for (const timezone of ['America/Los_Angeles', 'Pacific/Kiritimati', 'UTC']) {
      process.env.TZ = timezone;
      assert.equal(formatWorkDate('2026-10-11'), 'Sunday, October 11, 2026');
      assert.equal(formatWorkDate('2026-01-01'), 'Thursday, January 1, 2026');
      assert.equal(formatWorkDate('2026-11-01'), 'Sunday, November 1, 2026');
      assert.equal(formatWorkDate('2026-10-11', 'spanish'), 'domingo, 11 de octubre de 2026');
    }
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});

test('work dates reject malformed or rolled-over calendar values', () => {
  for (const invalid of ['', '2026-2-01', '2026-02-29', '2026-04-31', '2026-13-01'])
    assert.throws(() => formatWorkDate(invalid), /valid YYYY-MM-DD/);
  assert.equal(formatWorkDate('2028-02-29'), 'Tuesday, February 29, 2028');
});

test('both briefing languages include the confirmed date and location without changing the body', () => {
  const english = '08:00–09:30 Mow the lawn.\nSupervisor review required.';
  const spanish = '08:00–09:30 Cortar el césped.\nRequiere revisión del supervisor.';
  assert.equal(
    crewBriefText('2026-10-11', 'english', english),
    `Work date: Sunday, October 11, 2026 · Miami, Florida\n\n${english}`,
  );
  assert.equal(
    crewBriefText('2026-10-11', 'spanish', spanish),
    `Fecha de trabajo: domingo, 11 de octubre de 2026 · Miami, Florida\n\n${spanish}`,
  );
});
