export interface Trip {
  id: string;
  country: string;
  countryCode: string; // ISO 2-letter
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  isSchengen: boolean;
  purpose?: string;
  notes?: string;
}

export interface SchengenDayStatus {
  date: string; // YYYY-MM-DD
  inSchengen: boolean;
  daysUsedInWindow: number; // In the 180-day window ending on this date
  daysRemaining: number;    // 90 - daysUsedInWindow
  isOverstay: boolean;
}

export interface CountryTaxSummary {
  country: string;
  countryCode: string;
  isSchengen: boolean;
  daysCounted: number;
  threshold: number; // default 183
  taxRiskLevel: 'safe' | 'caution' | 'danger' | 'triggered';
  percentage: number;
}

export interface ForwardSimulationResult {
  entryDate: string;
  maxConsecutiveDays: number;
  exitDateIfMax: string;
  canStayRequested: boolean;
  requestedDays: number;
  firstViolationDate?: string;
}
