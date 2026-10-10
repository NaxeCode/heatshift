'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, MapPin, Phone, Search } from 'lucide-react';
import type { CoolingDirectory, CoolingSite } from '@/lib/cooling-sites';
import styles from './community.module.css';

const COUNTY_COOLING_SITES_URL =
  'https://www.miamidade.gov/initiative/weather-ready/extreme-heat/cooling-sites.page';

type Filter = 'all' | 'library' | 'park' | 'other';

function category(site: CoolingSite): Exclude<Filter, 'all'> {
  const type = site.type.toLowerCase();
  if (type.includes('library')) return 'library';
  if (type.includes('park')) return 'park';
  return 'other';
}

function phoneLink(phone: string) {
  return `tel:+1${phone.replace(/\D/g, '')}`;
}

function directionsLink(site: CoolingSite) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${site.address}, ${site.city}, ${site.state} ${site.zip}`,
  )}`;
}

export default function CoolingSiteFinder({ directory }: { directory: CoolingDirectory | null }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState(false);
  const filtered = useMemo(() => {
    if (!directory) return [];
    const needle = query.trim().toLocaleLowerCase('en-US');
    return directory.sites.filter((site) => {
      const text = `${site.name} ${site.city} ${site.zip} ${site.type}`.toLocaleLowerCase('en-US');
      return (filter === 'all' || category(site) === filter) && text.includes(needle);
    });
  }, [directory, query, filter]);
  const visible = expanded ? filtered : filtered.slice(0, 6);
  const checked = directory
    ? new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      }).format(new Date(directory.checkedAt))
    : null;

  return (
    <section id="cooling-sites" className={styles.finder} aria-labelledby="cooling-heading">
      <div className={styles.finderHeader}>
        <div>
          <p className="section-eyebrow">MIAMI-DADE COOLING SITES</p>
          <h2 id="cooling-heading">Find a place to cool off.</h2>
          <p>
            Explore the county’s published directory here, then call to confirm today’s hours and
            access before you go.
          </p>
        </div>
        <a
          href={COUNTY_COOLING_SITES_URL}
          target="_blank"
          rel="noreferrer"
          className={styles.finderSource}
        >
          Official county directory <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>

      {directory ? (
        <>
          <div className={styles.finderControls}>
            <label className={styles.finderSearch}>
              <span>Site, city or ZIP</span>
              <span className={styles.finderInputWrap}>
                <Search size={18} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  placeholder="Try 33130 or library"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setExpanded(false);
                  }}
                />
              </span>
            </label>
            <div className={styles.finderFilters} role="group" aria-label="Filter by site type">
              {(
                [
                  ['all', 'All sites'],
                  ['library', 'Libraries'],
                  ['park', 'Parks'],
                  ['other', 'Other'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => {
                    setFilter(value);
                    setExpanded(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.finderStatus}>
            <p role="status" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'site' : 'sites'} in this search
            </p>
            <p>
              Directory checked <time dateTime={directory.checkedAt}>{checked}</time>
            </p>
          </div>

          {filtered.length > 0 ? (
            <>
              <div className={styles.siteGrid}>
                {visible.map((site) => (
                  <article key={`${site.name}-${site.zip}`} className={styles.siteCard}>
                    <p className={styles.siteType}>{site.type}</p>
                    <h3>{site.name}</h3>
                    <p className={styles.siteAddress}>
                      <MapPin size={16} aria-hidden="true" />
                      <span>
                        {site.address}, {site.city}, {site.state} {site.zip}
                      </span>
                    </p>
                    <div className={styles.siteHours}>
                      <strong>Published hours</strong>
                      <span>{site.hours}</span>
                    </div>
                    <div className={styles.siteActions}>
                      <a href={phoneLink(site.phone)}>
                        <Phone size={15} aria-hidden="true" /> Call {site.phone}
                      </a>
                      <a href={directionsLink(site)} target="_blank" rel="noreferrer">
                        Directions <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
              {!expanded && filtered.length > 6 && (
                <button className={styles.showMore} type="button" onClick={() => setExpanded(true)}>
                  Show all {filtered.length} sites
                </button>
              )}
            </>
          ) : (
            <div className={styles.finderEmpty}>
              No match here. Try a different ZIP, city or site name, or use the full county
              directory.
            </div>
          )}
        </>
      ) : (
        <div className={styles.finderEmpty}>
          We could not load the county listings on this page right now. Use the official directory
          to find a site and confirm details before traveling.
        </div>
      )}

      <p className={styles.finderCaution}>
        Published hours may change for holidays, seasons or closures. These listings do not confirm
        that a site is open, accessible or has space right now. If you need urgent medical
        assistance, call 911.
      </p>
    </section>
  );
}
