export type Region = 'europe' | 'americas' | 'asia_pacific' | 'middle_east_africa';

export interface RegionalVisaRule {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  region: Region;
  visaType: string;
  standardStayLimitDays: number;
  limitWindowType: 'rolling_180' | 'calendar_year' | 'consecutive' | 'rolling_365';
  borderRunCaution?: string;
  taxResidencyThresholdDays: number;
  taxResidencyNotes: string;
  digitalNomadVisaAvailable: boolean;
  digitalNomadVisaName?: string;
  digitalNomadVisaDetails?: string;
}

export interface USSubstantialPresenceResult {
  currentYearDays: number;
  priorYear1Days: number;
  priorYear2Days: number;
  weightedScore: number;
  is31DayMet: boolean;
  isSubstantialPresenceMet: boolean; // weighted >= 183 AND currentYear >= 31
  daysToAvoidTrigger: number; // Max days user could stay in current year without triggering
}

export interface RegionalStaySummary {
  country: string;
  countryCode: string;
  region: Region;
  flag: string;
  daysCounted: number;
  stayLimitDays: number;
  windowType: 'rolling_180' | 'calendar_year' | 'consecutive' | 'rolling_365';
  remainingStayDays: number;
  isStayOverstay: boolean;
  taxThresholdDays: number;
  taxRiskLevel: 'safe' | 'caution' | 'danger' | 'triggered';
  ruleNotes: string;
  nomadVisaInfo?: string;
}
