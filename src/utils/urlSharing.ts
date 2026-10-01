import { Trip } from '../types';

/**
 * Compact representation of a Trip for URL hash encoding
 * [country, countryCode, startDate, endDate, isSchengen (1 or 0), purpose]
 */
type CompactTrip = [string, string, string, string, number, string?];

/**
 * Compresses an array of Trips and reference date into a base64url string
 */
export function encodeItineraryToUrl(trips: Trip[], referenceDate?: string): string {
  try {
    const compactTrips: CompactTrip[] = trips.map(t => [
      t.country,
      t.countryCode || '',
      t.startDate,
      t.endDate,
      t.isSchengen ? 1 : 0,
      t.purpose || ''
    ]);

    const payload = {
      v: 1,
      r: referenceDate || '',
      t: compactTrips
    };

    const json = JSON.stringify(payload);
    // Use base64 encoding safe for URLs
    const base64 = btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return `${window.location.origin}${window.location.pathname}#plan=${base64}`;
  } catch (err) {
    console.error('Failed to encode itinerary', err);
    return window.location.href;
  }
}

/**
 * Parses trips and reference date from the window URL hash (#plan=...)
 */
export function decodeItineraryFromUrl(): { trips: Trip[]; referenceDate?: string } | null {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('plan=')) {
      return null;
    }

    const match = hash.match(/plan=([A-Za-z0-9_-]+)/);
    if (!match || !match[1]) return null;

    let base64 = match[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const json = decodeURIComponent(escape(atob(base64)));
    const payload = JSON.parse(json);

    if (payload && Array.isArray(payload.t)) {
      const trips: Trip[] = payload.t.map((item: CompactTrip, idx: number) => ({
        id: `shared_${Date.now()}_${idx}`,
        country: item[0],
        countryCode: item[1] || 'XX',
        startDate: item[2],
        endDate: item[3],
        isSchengen: item[4] === 1,
        purpose: item[5] || undefined
      }));

      return {
        trips,
        referenceDate: payload.r || undefined
      };
    }
  } catch (err) {
    console.warn('Could not decode shared itinerary from URL', err);
  }
  return null;
}
