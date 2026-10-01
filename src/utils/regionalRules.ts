import { RegionalVisaRule, USSubstantialPresenceResult, RegionalStaySummary, Region } from '../types/regional';
import { Trip } from '../types';
import { addDays, parseDate, countDaysInclusive } from './schengenCalculator';

/**
 * Curated Global Database of Visa & Tax Rules for Americas & Asia-Pacific (plus key European/Global hubs)
 */
export const GLOBAL_VISA_TAX_RULES: RegionalVisaRule[] = [
  // --- AMERICAS ---
  {
    id: 'usa',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    region: 'americas',
    visaType: 'ESTA / B1/B2 Visitor',
    standardStayLimitDays: 90, // ESTA 90 days, B1/B2 180 days per entry
    limitWindowType: 'consecutive',
    borderRunCaution: 'Crucial: Travel to Canada, Mexico or adjacent Caribbean islands does NOT reset your 90-day ESTA clock!',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: 'IRS Substantial Presence Test: 31 days in current year + weighted formula over 3 years (1 + 1/3 + 1/6) triggers worldwide US tax residency.',
    digitalNomadVisaAvailable: false
  },
  {
    id: 'mexico',
    country: 'Mexico',
    countryCode: 'MX',
    flag: '🇲🇽',
    region: 'americas',
    visaType: 'FMM Tourist Permit',
    standardStayLimitDays: 180,
    limitWindowType: 'consecutive',
    borderRunCaution: 'Immigration officers at entry decide exact days granted (often strictly 30-90 days unless requested).',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: '183 days consecutive or non-consecutive in a 12-month period establishes tax residency if permanent home is established.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'Temporary Resident Visa (Economic Solvency)',
    digitalNomadVisaDetails: '1-4 years. Requires approx. $3,500–$4,500 USD/month income or substantial savings.'
  },
  {
    id: 'colombia',
    country: 'Colombia',
    countryCode: 'CO',
    flag: '🇨🇴',
    region: 'americas',
    visaType: 'Entry Permit (PIP-5 / PTP-5)',
    standardStayLimitDays: 180,
    limitWindowType: 'calendar_year',
    borderRunCaution: 'Granted 90 days upon arrival, extendable online once for another 90 days. Absolute max 180 days per calendar year.',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: '183 days within any continuous or discontinuous 365-day rolling period creates worldwide tax residency.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'Visa V Nómadas Digitales',
    digitalNomadVisaDetails: 'Up to 2 years. Requires income of ~3x Colombian minimum wage (~$1,400 USD/mo).'
  },
  {
    id: 'costa_rica',
    country: 'Costa Rica',
    countryCode: 'CR',
    flag: '🇨🇷',
    region: 'americas',
    visaType: 'Tourist Stamp',
    standardStayLimitDays: 180,
    limitWindowType: 'consecutive',
    borderRunCaution: 'Max 180 days (recently expanded from 90). Proof of onward travel and funds required.',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: 'Territorial tax system: Costa Rica taxes local-source income only; foreign remote income is generally exempt.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'Estancia para Nómadas Digitales',
    digitalNomadVisaDetails: '1 year (extendable to 2). $3,000/mo income ($4,000 for families). Total income tax exemption.'
  },
  {
    id: 'brazil',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    region: 'americas',
    visaType: 'Tourist Exemption / VIVIS',
    standardStayLimitDays: 90,
    limitWindowType: 'rolling_365',
    borderRunCaution: 'Typically 90 days extendable to 180 days in a 12-month period depending on nationality.',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: 'Exceeding 183 days within any 12-month period triggers tax residency on worldwide income.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'Visto para Nômade Digital (RN 45)',
    digitalNomadVisaDetails: '1 year, renewable. Requires $1,500 USD/month income or $18,000 in bank balance.'
  },
  {
    id: 'canada',
    country: 'Canada',
    countryCode: 'CA',
    flag: '🇨🇦',
    region: 'americas',
    visaType: 'eTA / Visitor Visa',
    standardStayLimitDays: 180,
    limitWindowType: 'consecutive',
    borderRunCaution: 'Granted up to 6 months per entry. Canadian border officers may question frequent long back-to-back stays.',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: 'Deemed resident rule: 183 days in a calendar year makes you taxable on worldwide income under CRA rules.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'Tech Worker Digital Nomad Track',
    digitalNomadVisaDetails: 'Can work remotely for up to 6 months on standard visitor status with pathway to Canadian work permits.'
  },

  // --- ASIA-PACIFIC ---
  {
    id: 'japan',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    region: 'asia_pacific',
    visaType: 'Short-Term Stay Waiver',
    standardStayLimitDays: 90,
    limitWindowType: 'rolling_365',
    borderRunCaution: 'Max 90 days per entry. Japanese Immigration strictly enforces a de facto limit of 180 days per 365-day period for tourists.',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: 'Non-permanent tax resident rule applies for first 5 years; foreign-source income not remitted to Japan is generally untaxed.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'Specified Visa (Digital Nomad)',
    digitalNomadVisaDetails: '6-month stay. Requires ¥10,000,000 JPY annual income (~$65,000 USD) and private health insurance. Non-renewable consecutively.'
  },
  {
    id: 'thailand',
    country: 'Thailand',
    countryCode: 'TH',
    flag: '🇹🇭',
    region: 'asia_pacific',
    visaType: 'Visa Exemption / Tourist Visa',
    standardStayLimitDays: 60,
    limitWindowType: 'consecutive',
    borderRunCaution: 'Recently expanded to 60-day visa exemption. Land border runs capped at 2 per calendar year!',
    taxResidencyThresholdDays: 180,
    taxResidencyNotes: '180 days in a tax year triggers tax residency. Under new Thai Revenue Department rules (Jan 2024), foreign income remitted to Thailand is taxable.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'Destination Thailand Visa (DTV)',
    digitalNomadVisaDetails: '5-year multiple-entry visa. 180 days per entry, extendable for 180 days. Requires 500,000 THB (~$14,000 USD) bank balance.'
  },
  {
    id: 'indonesia',
    country: 'Indonesia (Bali)',
    countryCode: 'ID',
    flag: '🇮🇩',
    region: 'asia_pacific',
    visaType: 'e-VoA / B211A Visit Visa',
    standardStayLimitDays: 60,
    limitWindowType: 'consecutive',
    borderRunCaution: 'Visa on Arrival allows 30 days (+30 day extension = 60 days). B211A gives 60 days with two 60-day extensions (up to 180 days).',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: '183 days within any 12-month period establishes Indonesian tax residency.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'E33G Remote Worker KITAS',
    digitalNomadVisaDetails: '1-year stay. Requires contract with foreign company and min $60,000 USD annual salary. Remote income tax-free.'
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    countryCode: 'MY',
    flag: '🇲🇾',
    region: 'asia_pacific',
    visaType: 'Social Visit Pass',
    standardStayLimitDays: 90,
    limitWindowType: 'consecutive',
    borderRunCaution: 'Strict scrutiny on immediate return border runs to Singapore or Thailand after 90 days.',
    taxResidencyThresholdDays: 182,
    taxResidencyNotes: '182 days in a calendar year triggers tax residency. Foreign source income is largely exempt under territorial concession.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'DE Rantau Nomad Pass',
    digitalNomadVisaDetails: 'Up to 12 months, renewable for another 12. Requires $24,000 USD/year income for tech/digital workers.'
  },
  {
    id: 'vietnam',
    country: 'Vietnam',
    countryCode: 'VN',
    flag: '🇻🇳',
    region: 'asia_pacific',
    visaType: 'e-Visa',
    standardStayLimitDays: 90,
    limitWindowType: 'consecutive',
    borderRunCaution: '90-day multiple entry e-Visa available to all nationalities. Visa runs to Laos/Cambodia still common.',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: '183 days in a calendar year or 12 consecutive months triggers worldwide income tax.',
    digitalNomadVisaAvailable: false
  },
  {
    id: 'philippines',
    country: 'Philippines',
    countryCode: 'PH',
    flag: '🇵🇭',
    region: 'asia_pacific',
    visaType: 'Tourist Visa (9A)',
    standardStayLimitDays: 30,
    limitWindowType: 'consecutive',
    borderRunCaution: 'Extremely nomad-friendly extension policy: can be extended at Bureau of Immigration up to 36 months without leaving!',
    taxResidencyThresholdDays: 180,
    taxResidencyNotes: 'Aliens residing over 180 days are considered non-resident aliens engaged in trade/business for tax classification.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'Digital Nomad Visa Bill (Approved / Rollout)',
    digitalNomadVisaDetails: '12-month renewable visa for remote workers.'
  },
  {
    id: 'australia',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    region: 'asia_pacific',
    visaType: 'eVisitor (651) / ETA',
    standardStayLimitDays: 90,
    limitWindowType: 'consecutive',
    borderRunCaution: '12-month validity with 3-month max stays per entry.',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: 'Fiscal tax year: July 1 to June 30. The 183-day test is one of 4 statutory tests by the ATO alongside domicile/resides tests.',
    digitalNomadVisaAvailable: false
  },

  // --- MIDDLE EAST & OTHERS ---
  {
    id: 'uae',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    region: 'middle_east_africa',
    visaType: 'Tourist / Remote Work Visa',
    standardStayLimitDays: 90,
    limitWindowType: 'consecutive',
    borderRunCaution: 'Can be extended or switched easily to virtual work visa.',
    taxResidencyThresholdDays: 90,
    taxResidencyNotes: '0% personal income tax! Tax residency certificate available after 90 or 183 days with commercial/residential ties.',
    digitalNomadVisaAvailable: true,
    digitalNomadVisaName: 'Dubai 1-Year Virtual Working Programme',
    digitalNomadVisaDetails: '1 year, renewable. Requires $3,500 USD/month salary, 0% personal income tax in UAE.'
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    region: 'europe',
    visaType: 'Standard Visitor',
    standardStayLimitDays: 180,
    limitWindowType: 'rolling_365',
    borderRunCaution: 'Allowed up to 6 months. Border Force strictly assesses that visitors are not using frequent visits to live in the UK.',
    taxResidencyThresholdDays: 183,
    taxResidencyNotes: 'Tax year runs April 6 to April 5. Complex Statutory Residence Test (SRT): presence of just 16 to 90 days can trigger UK tax if you have ties.',
    digitalNomadVisaAvailable: false
  }
];

/**
 * IRS Substantial Presence Test Calculator
 * Days in Year 3 (Current) * 1 +
 * Days in Year 2 (Prior 1) * 1/3 +
 * Days in Year 1 (Prior 2) * 1/6 >= 183
 * AND Current Year Days >= 31
 */
export function calculateUSSubstantialPresence(
  trips: Trip[],
  currentYear: number = 2026
): USSubstantialPresenceResult {
  const usTrips = trips.filter(
    t => t.countryCode === 'US' || t.country.toLowerCase().includes('united states') || t.country.toLowerCase() === 'usa'
  );

  let currentYearDays = 0;
  let priorYear1Days = 0;
  let priorYear2Days = 0;

  const yCurrent = currentYear;
  const yPrior1 = currentYear - 1;
  const yPrior2 = currentYear - 2;

  for (const trip of usTrips) {
    if (!trip.startDate || !trip.endDate || trip.startDate > trip.endDate) continue;

    let cur = trip.startDate;
    let safeguard = 0;
    while (cur <= trip.endDate && safeguard < 2000) {
      const year = parseDate(cur).getUTCFullYear();
      if (year === yCurrent) currentYearDays++;
      else if (year === yPrior1) priorYear1Days++;
      else if (year === yPrior2) priorYear2Days++;
      cur = addDays(cur, 1);
      safeguard++;
    }
  }

  const weightedScore = Number(
    (currentYearDays * 1 + (priorYear1Days * (1 / 3)) + (priorYear2Days * (1 / 6))).toFixed(2)
  );

  const is31DayMet = currentYearDays >= 31;
  const isSubstantialPresenceMet = is31DayMet && weightedScore >= 183;

  // Maximum days allowed in current year without crossing 183 weighted score
  const priorWeight = (priorYear1Days * (1 / 3)) + (priorYear2Days * (1 / 6));
  const maxSafeCurrentYear = Math.max(0, Math.floor(182.99 - priorWeight));

  return {
    currentYearDays,
    priorYear1Days,
    priorYear2Days,
    weightedScore,
    is31DayMet,
    isSubstantialPresenceMet,
    daysToAvoidTrigger: maxSafeCurrentYear
  };
}

/**
 * Calculate regional summary statistics for any selected region
 */
export function calculateRegionalSummaries(
  trips: Trip[],
  region: Region,
  referenceDate: string = '2026-09-30'
): RegionalStaySummary[] {
  const rules = GLOBAL_VISA_TAX_RULES.filter(r => r.region === region);
  const targetYear = parseDate(referenceDate).getUTCFullYear();

  return rules.map(rule => {
    // Count days spent in this country
    const relevantTrips = trips.filter(
      t => t.countryCode?.toUpperCase() === rule.countryCode || 
           t.country.toLowerCase().trim() === rule.country.toLowerCase().trim()
    );

    let daysCounted = 0;

    for (const trip of relevantTrips) {
      if (!trip.startDate || !trip.endDate || trip.startDate > trip.endDate) continue;

      let cur = trip.startDate;
      let count = 0;
      while (cur <= trip.endDate && count < 2000) {
        let shouldCount = false;

        if (rule.limitWindowType === 'calendar_year') {
          shouldCount = parseDate(cur).getUTCFullYear() === targetYear;
        } else if (rule.limitWindowType === 'rolling_365') {
          const windowStart = addDays(referenceDate, -364);
          shouldCount = cur >= windowStart && cur <= referenceDate;
        } else if (rule.limitWindowType === 'rolling_180') {
          const windowStart = addDays(referenceDate, -179);
          shouldCount = cur >= windowStart && cur <= referenceDate;
        } else {
          // consecutive / calendar year fallback
          shouldCount = parseDate(cur).getUTCFullYear() === targetYear;
        }

        if (shouldCount) daysCounted++;
        cur = addDays(cur, 1);
        count++;
      }
    }

    const remainingStayDays = Math.max(0, rule.standardStayLimitDays - daysCounted);
    const isStayOverstay = daysCounted > rule.standardStayLimitDays;

    let taxRiskLevel: RegionalStaySummary['taxRiskLevel'] = 'safe';
    if (daysCounted >= rule.taxResidencyThresholdDays) {
      taxRiskLevel = 'triggered';
    } else if (daysCounted >= rule.taxResidencyThresholdDays - 30) {
      taxRiskLevel = 'danger';
    } else if (daysCounted >= Math.round(rule.taxResidencyThresholdDays / 2)) {
      taxRiskLevel = 'caution';
    }

    return {
      country: rule.country,
      countryCode: rule.countryCode,
      region: rule.region,
      flag: rule.flag,
      daysCounted,
      stayLimitDays: rule.standardStayLimitDays,
      windowType: rule.limitWindowType,
      remainingStayDays,
      isStayOverstay,
      taxThresholdDays: rule.taxResidencyThresholdDays,
      taxRiskLevel,
      ruleNotes: rule.taxResidencyNotes,
      nomadVisaInfo: rule.digitalNomadVisaDetails ? `${rule.digitalNomadVisaName}: ${rule.digitalNomadVisaDetails}` : undefined
    };
  });
}
