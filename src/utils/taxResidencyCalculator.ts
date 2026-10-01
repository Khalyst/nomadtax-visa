import { Trip, CountryTaxSummary } from '../types';
import { addDays, parseDate } from './schengenCalculator';

export interface TaxAnalysisOptions {
  year?: number; // e.g. 2026
  mode?: 'calendar_year' | 'rolling_365';
  referenceDate?: string; // YYYY-MM-DD
}

/**
 * Calculates days spent per country either in a calendar year or rolling 365 days
 */
export function calculateTaxResidencySummary(
  trips: Trip[],
  options: TaxAnalysisOptions = {}
): CountryTaxSummary[] {
  const mode = options.mode || 'calendar_year';
  const targetYear = options.year || 2026;
  const refDate = options.referenceDate || new Date().toISOString().slice(0, 10);

  // Map country name to days count
  const countryCounts = new Map<string, { days: number; isSchengen: boolean; countryCode: string }>();

  for (const trip of trips) {
    if (!trip.startDate || !trip.endDate || !trip.country) continue;

    if (trip.startDate > trip.endDate) continue;

    let cur = trip.startDate;
    let safeguard = 0;
    while (cur <= trip.endDate && safeguard < 2000) {
      let shouldCount = false;

      if (mode === 'calendar_year') {
        const curYear = parseDate(cur).getUTCFullYear();
        if (curYear === targetYear) {
          shouldCount = true;
        }
      } else {
        // Rolling 365 days ending at refDate
        const windowStart = addDays(refDate, -364);
        if (cur >= windowStart && cur <= refDate) {
          shouldCount = true;
        }
      }

      if (shouldCount) {
        const key = trip.country.trim();
        const existing = countryCounts.get(key) || {
          days: 0,
          isSchengen: trip.isSchengen,
          countryCode: trip.countryCode || 'UN'
        };
        existing.days += 1;
        countryCounts.set(key, existing);
      }

      cur = addDays(cur, 1);
      safeguard++;
    }
  }

  const summaries: CountryTaxSummary[] = [];

  countryCounts.forEach((data, country) => {
    const threshold = 183;
    let taxRiskLevel: CountryTaxSummary['taxRiskLevel'] = 'safe';

    if (data.days >= threshold) {
      taxRiskLevel = 'triggered';
    } else if (data.days >= 150) {
      taxRiskLevel = 'danger';
    } else if (data.days >= 90) {
      taxRiskLevel = 'caution';
    }

    const percentage = Math.min(100, Math.round((data.days / threshold) * 100));

    summaries.push({
      country,
      countryCode: data.countryCode,
      isSchengen: data.isSchengen,
      daysCounted: data.days,
      threshold,
      taxRiskLevel,
      percentage
    });
  });

  // Sort descending by days spent
  return summaries.sort((a, b) => b.daysCounted - a.daysCounted);
}

/**
 * Sample trip presets for quick testing and exploration
 */
export const SAMPLE_TRIP_PRESETS: { id: string; name: string; description: string; trips: Trip[] }[] = [
  {
    id: 'digital-nomad-safe',
    name: 'Balanced EU Nomad (Compliant)',
    description: 'Smart hopping between Schengen (Spain, Portugal) and Non-Schengen (Croatia history / Albania, UK, Bali) staying safely under 90 days.',
    trips: [
      {
        id: 't-1',
        country: 'Spain',
        countryCode: 'ES',
        startDate: '2026-04-01',
        endDate: '2026-04-28',
        isSchengen: true,
        purpose: 'Coworking in Barcelona & Valencia'
      },
      {
        id: 't-2',
        country: 'United Kingdom',
        countryCode: 'GB',
        startDate: '2026-05-01',
        endDate: '2026-06-10',
        isSchengen: false,
        purpose: 'London client meetings & family'
      },
      {
        id: 't-3',
        country: 'Portugal',
        countryCode: 'PT',
        startDate: '2026-06-15',
        endDate: '2026-07-20',
        isSchengen: true,
        purpose: 'Lisbon & Ericeira surf'
      },
      {
        id: 't-4',
        country: 'Albania',
        countryCode: 'AL',
        startDate: '2026-07-25',
        endDate: '2026-08-30',
        isSchengen: false,
        purpose: 'Non-Schengen summer coastal stay'
      }
    ]
  },
  {
    id: 'schengen-warning-edge',
    name: 'Schengen High Alert (78 / 90 Days)',
    description: 'Demonstrates what happens when a traveler approaches the 90-day ceiling and needs strict forward calculation.',
    trips: [
      {
        id: 't-5',
        country: 'France',
        countryCode: 'FR',
        startDate: '2026-05-01',
        endDate: '2026-06-15',
        isSchengen: true,
        purpose: 'Paris & Nice summer stay (46 days)'
      },
      {
        id: 't-6',
        country: 'Italy',
        countryCode: 'IT',
        startDate: '2026-07-01',
        endDate: '2026-08-01',
        isSchengen: true,
        purpose: 'Tuscany retreat (32 days)'
      }
    ]
  },
  {
    id: 'tax-exile-juggler',
    name: '183-Day Tax Residency Danger',
    description: 'High-earner balancing days in Spain (158 days), UK (70 days), and UAE (Dubai non-tax base) to prevent tax residency triggering in Spain.',
    trips: [
      {
        id: 't-7',
        country: 'Spain',
        countryCode: 'ES',
        startDate: '2026-01-10',
        endDate: '2026-03-31',
        isSchengen: true,
        purpose: 'Winter residence in Mallorca (81 days)'
      },
      {
        id: 't-8',
        country: 'United Arab Emirates',
        countryCode: 'AE',
        startDate: '2026-04-01',
        endDate: '2026-05-30',
        isSchengen: false,
        purpose: 'Dubai residency maintenance (60 days)'
      },
      {
        id: 't-9',
        country: 'Spain',
        countryCode: 'ES',
        startDate: '2026-06-01',
        endDate: '2026-08-16',
        isSchengen: true,
        purpose: 'Summer with family (77 days - Total 158 in Spain!)'
      }
    ]
  }
];
