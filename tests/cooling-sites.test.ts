import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCoolingSites } from '../src/lib/cooling-sites';

const headers = ['Name', 'Address', 'City', 'State', 'ZIP', 'Phone', 'Hours of Operation', 'Type'];

function directory(rowCount = 20, headerNames = headers) {
  const rows = Array.from(
    { length: rowCount },
    (_, index) => `
    <tr>
      <td data-label="Name">${index === 0 ? 'Grapeland Water Park' : `Library ${index}`}</td>
      <td data-label="Address">${100 + index} Main Street</td>
      <td data-label="City">Miami</td><td data-label="State">FL</td>
      <td data-label="ZIP">33125</td>
      <td data-label="Phone"><a href="tel:+13059602950">305-960-2950</a></td>
      <td data-label="Hours">${index === 0 ? 'Open daily, May 23 – Aug. 16: 10 a.m. to 5 p.m.' : 'Monday: 9 a.m. to 6 p.m.<br>Sunday: Closed'}</td>
      <td data-label="Type">${index === 0 ? 'City Park' : 'Public Library'}</td>
    </tr>`,
  ).join('');
  return `<table id="locations-table"><thead><tr>${headerNames.map((name) => `<th>${name}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
}

test('reads the county table while preserving seasonal and multi-line published hours', () => {
  const sites = parseCoolingSites(directory());
  assert.equal(sites.length, 20);
  assert.deepEqual(sites[0], {
    name: 'Grapeland Water Park',
    address: '100 Main Street',
    city: 'Miami',
    state: 'FL',
    zip: '33125',
    phone: '305-960-2950',
    hours: 'Open daily, May 23 – Aug. 16: 10 a.m. to 5 p.m.',
    type: 'City Park',
  });
  assert.equal(sites[1].hours, 'Monday: 9 a.m. to 6 p.m.; Sunday: Closed');
});

test('fails closed when the county table schema or listing count changes', () => {
  assert.throws(() =>
    parseCoolingSites(directory(20, [...headers.slice(0, 6), 'Open now', 'Type'])),
  );
  assert.throws(() => parseCoolingSites(directory(3)));
  assert.throws(() => parseCoolingSites('<table><tr><td>Unrelated</td></tr></table>'));
});
