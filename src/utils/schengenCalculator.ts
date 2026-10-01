import { Trip, SchengenDayStatus, ForwardSimulationResult } from '../types';

// List of all Schengen member states (as of 2026)
export const SCHENGEN_COUNTRIES = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NO', name: 'Norway' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
];

export const SCHENGEN_SET = new Set(SCHENGEN_COUNTRIES.map(c => c.name.toLowerCase()));

export function isCountrySchengen(countryName: string): boolean {
  return SCHENGEN_SET.has(countryName.toLowerCase().trim());
}

/**
 * Format Date object to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse YYYY-MM-DD into a localized UTC-noon Date to avoid timezone shift
 */
export function parseDate(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') {
    return new Date();
  }
  const parts = dateStr.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return new Date();
  }
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
}

/**
 * Add days to a date string
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDate(d);
}

/**
 * Difference in days between two YYYY-MM-DD dates inclusive (+1)
 */
export function countDaysInclusive(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = parseDate(startDate).getTime();
  const end = parseDate(endDate).getTime();
  if (end < start) return 0;
  return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Generates a Set of date strings (YYYY-MM-DD) spent in Schengen
 */
export function getSchengenDatesSet(trips: Trip[]): Set<string> {
  const dates = new Set<string>();

  for (const trip of trips) {
    if (!trip.isSchengen) continue;
    if (!trip.startDate || !trip.endDate) continue;
    if (trip.startDate > trip.endDate) continue;

    let cur = trip.startDate;
    let safeguard = 0;
    while (cur <= trip.endDate && safeguard < 2000) {
      dates.add(cur);
      cur = addDays(cur, 1);
      safeguard++;
    }
  }

  return dates;
}

/**
 * Calculate Schengen days used in the 180-day window ending on referenceDate
 * Interval: [referenceDate - 179 days, referenceDate] (180 days total)
 */
export function getDaysUsedInWindow(referenceDate: string, schengenDates: Set<string>): number {
  let count = 0;
  let cur = referenceDate;
  for (let i = 0; i < 180; i++) {
    if (schengenDates.has(cur)) {
      count++;
    }
    cur = addDays(cur, -1);
  }
  return count;
}

/**
 * Calculate Schengen status for a specific reference date
 */
export function calculateSchengenStatusOnDate(
  referenceDate: string,
  trips: Trip[]
): SchengenDayStatus {
  const schengenDates = getSchengenDatesSet(trips);
  const daysUsed = getDaysUsedInWindow(referenceDate, schengenDates);
  const inSchengen = schengenDates.has(referenceDate);

  return {
    date: referenceDate,
    inSchengen,
    daysUsedInWindow: daysUsed,
    daysRemaining: Math.max(0, 90 - daysUsed),
    isOverstay: daysUsed > 90
  };
}

/**
 * Calculate forward simulation:
 * How many consecutive days can a user stay in Schengen starting on entryDate?
 */
export function simulateForwardStay(
  entryDate: string,
  requestedDays: number,
  existingTrips: Trip[]
): ForwardSimulationResult {
  const existingSchengenDates = getSchengenDatesSet(existingTrips);
  const simulatedDates = new Set(existingSchengenDates);

  let maxConsecutive = 0;
  let firstViolationDate: string | undefined = undefined;
  let canStayRequested = true;

  // Simulate day by day from entryDate up to 180 days forward
  for (let i = 0; i < 180; i++) {
    const dayStr = addDays(entryDate, i);
    simulatedDates.add(dayStr);

    const daysUsed = getDaysUsedInWindow(dayStr, simulatedDates);

    if (daysUsed > 90) {
      if (!firstViolationDate) {
        firstViolationDate = dayStr;
      }
      if (i < requestedDays) {
        canStayRequested = false;
      }
      break;
    }

    maxConsecutive = i + 1;
  }

  const exitDateIfMax = addDays(entryDate, Math.max(0, maxConsecutive - 1));

  return {
    entryDate,
    maxConsecutiveDays: maxConsecutive,
    exitDateIfMax,
    canStayRequested,
    requestedDays,
    firstViolationDate
  };
}

/**
 * Generate a timeline window of SchengenDayStatus around referenceDate
 */
export function computeTimelineAroundDate(
  referenceDate: string,
  trips: Trip[],
  pastDays: number = 30,
  futureDays: number = 30
): SchengenDayStatus[] {
  const results: SchengenDayStatus[] = [];
  const schengenDates = getSchengenDatesSet(trips);

  const startDate = addDays(referenceDate, -pastDays);
  const totalDays = pastDays + futureDays;

  let cur = startDate;
  for (let i = 0; i <= totalDays; i++) {
    const daysUsed = getDaysUsedInWindow(cur, schengenDates);
    const inSchengen = schengenDates.has(cur);

    results.push({
      date: cur,
      inSchengen,
      daysUsedInWindow: daysUsed,
      daysRemaining: Math.max(0, 90 - daysUsed),
      isOverstay: daysUsed > 90
    });

    cur = addDays(cur, 1);
  }

  return results;
}
