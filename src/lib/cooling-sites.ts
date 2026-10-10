export const COUNTY_COOLING_SITES_URL =
  'https://www.miamidade.gov/initiative/weather-ready/extreme-heat/cooling-sites.page';

export type CoolingSite = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  type: string;
};

export type CoolingDirectory = {
  sites: CoolingSite[];
  checkedAt: string;
};

let cachedDirectory: Promise<CoolingDirectory> | null = null;
let cacheExpiresAt = 0;

const HEADERS = [
  'Name',
  'Address',
  'City',
  'State',
  'ZIP',
  'Phone',
  'Hours of Operation',
  'Type',
];

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    amp: '&',
    nbsp: ' ',
    quot: '"',
    apos: "'",
    lt: '<',
    gt: '>',
    ndash: '–',
    mdash: '—',
  };
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith('#')) {
      const point = code[1]?.toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isInteger(point) && point > 0 && point <= 0x10ffff
        ? String.fromCodePoint(point)
        : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function cellText(html: string) {
  return decodeEntities(html.replace(/<br\s*\/?\s*>/gi, '; ').replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Parse only the county's observed eight-column table. Any schema drift fails closed. */
export function parseCoolingSites(html: string): CoolingSite[] {
  const table = html.match(
    /<table\b(?=[^>]*\bid\s*=\s*["']locations-table["'])[^>]*>([\s\S]*?)<\/table>/i,
  )?.[1];
  if (!table) throw new Error('Cooling-site table missing');

  const headerHtml = table.match(/<thead\b[^>]*>([\s\S]*?)<\/thead>/i)?.[1];
  const headers = [...(headerHtml ?? '').matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => cellText(m[1]));
  if (headers.length !== HEADERS.length || headers.some((header, i) => header !== HEADERS[i])) {
    throw new Error('Cooling-site columns changed');
  }

  const body = table.match(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i)?.[1];
  if (!body) throw new Error('Cooling-site rows missing');
  const rows = [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  if (rows.length < 20) throw new Error('Cooling-site directory unexpectedly short');

  return rows.map((row) => {
    const values = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => cellText(m[1]));
    if (values.length !== HEADERS.length) throw new Error('Cooling-site row shape changed');
    const [name, address, city, state, zip, phone, hours, type] = values;
    if (
      !name || !address || !city || state !== 'FL' || !/^\d{5}$/.test(zip) ||
      phone.replace(/\D/g, '').length !== 10 || !hours || !type
    ) {
      throw new Error('Cooling-site row contains missing or invalid fields');
    }
    return { name, address, city, state, zip, phone, hours, type };
  });
}

async function fetchCoolingDirectory(): Promise<CoolingDirectory> {
  const response = await fetch(COUNTY_COOLING_SITES_URL, {
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  });
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
    throw new Error('County cooling-site page unavailable');
  }
  const html = await response.text();
  if (html.length > 1_000_000) throw new Error('County cooling-site page unexpectedly large');
  return { sites: parseCoolingSites(html), checkedAt: new Date().toISOString() };
}

/** Reuse a successful check for five minutes within a warm server process. */
export async function getCoolingDirectory(): Promise<CoolingDirectory> {
  if (cachedDirectory && Date.now() < cacheExpiresAt) return cachedDirectory;
  const pending = fetchCoolingDirectory();
  cachedDirectory = pending;
  cacheExpiresAt = Date.now() + 5 * 60_000;
  try {
    return await pending;
  } catch (error) {
    if (cachedDirectory === pending) {
      cachedDirectory = null;
      cacheExpiresAt = 0;
    }
    throw error;
  }
}

