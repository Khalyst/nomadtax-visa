import { SCHENGEN_COUNTRIES } from './schengenCalculator';

export interface GlobalCountryOption {
  code: string;
  name: string;
  region: 'europe' | 'americas' | 'asia_pacific' | 'middle_east_africa';
  isSchengen: boolean;
  flag: string;
}

export const WORLDWIDE_COUNTRIES: GlobalCountryOption[] = [
  // Europe (Schengen)
  ...SCHENGEN_COUNTRIES.map(c => ({
    code: c.code,
    name: c.name,
    region: 'europe' as const,
    isSchengen: true,
    flag: '🇪🇺'
  })),

  // Europe (Non-Schengen)
  { code: 'GB', name: 'United Kingdom', region: 'europe', isSchengen: false, flag: '🇬🇧' },
  { code: 'IE', name: 'Ireland', region: 'europe', isSchengen: false, flag: '🇮🇪' },
  { code: 'AL', name: 'Albania', region: 'europe', isSchengen: false, flag: '🇦🇱' },
  { code: 'ME', name: 'Montenegro', region: 'europe', isSchengen: false, flag: '🇲🇪' },
  { code: 'RS', name: 'Serbia', region: 'europe', isSchengen: false, flag: '🇷🇸' },
  { code: 'GE', name: 'Georgia', region: 'europe', isSchengen: false, flag: '🇬🇪' },
  { code: 'CY', name: 'Cyprus', region: 'europe', isSchengen: false, flag: '🇨🇾' },

  // Americas (North, Central, South)
  { code: 'US', name: 'United States', region: 'americas', isSchengen: false, flag: '🇺🇸' },
  { code: 'MX', name: 'Mexico', region: 'americas', isSchengen: false, flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', region: 'americas', isSchengen: false, flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', region: 'americas', isSchengen: false, flag: '🇨🇷' },
  { code: 'BR', name: 'Brazil', region: 'americas', isSchengen: false, flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', region: 'americas', isSchengen: false, flag: '🇨🇦' },
  { code: 'AR', name: 'Argentina', region: 'americas', isSchengen: false, flag: '🇦🇷' },
  { code: 'PA', name: 'Panama', region: 'americas', isSchengen: false, flag: '🇵🇦' },
  { code: 'CL', name: 'Chile', region: 'americas', isSchengen: false, flag: '🇨🇱' },

  // Asia-Pacific
  { code: 'JP', name: 'Japan', region: 'asia_pacific', isSchengen: false, flag: '🇯🇵' },
  { code: 'TH', name: 'Thailand', region: 'asia_pacific', isSchengen: false, flag: '🇹🇭' },
  { code: 'ID', name: 'Indonesia', region: 'asia_pacific', isSchengen: false, flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', region: 'asia_pacific', isSchengen: false, flag: '🇲🇾' },
  { code: 'VN', name: 'Vietnam', region: 'asia_pacific', isSchengen: false, flag: '🇻🇳' },
  { code: 'PH', name: 'Philippines', region: 'asia_pacific', isSchengen: false, flag: '🇵🇭' },
  { code: 'SG', name: 'Singapore', region: 'asia_pacific', isSchengen: false, flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', region: 'asia_pacific', isSchengen: false, flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', region: 'asia_pacific', isSchengen: false, flag: '🇳🇿' },
  { code: 'KR', name: 'South Korea', region: 'asia_pacific', isSchengen: false, flag: '🇰🇷' },
  { code: 'TW', name: 'Taiwan', region: 'asia_pacific', isSchengen: false, flag: '🇹🇼' },

  // Middle East & Africa
  { code: 'AE', name: 'United Arab Emirates', region: 'middle_east_africa', isSchengen: false, flag: '🇦🇪' },
  { code: 'ZA', name: 'South Africa', region: 'middle_east_africa', isSchengen: false, flag: '🇿🇦' },
  { code: 'TR', name: 'Turkey', region: 'middle_east_africa', isSchengen: false, flag: '🇹🇷' },
  { code: 'MA', name: 'Morocco', region: 'middle_east_africa', isSchengen: false, flag: '🇲🇦' }
];

export function findCountryData(countryNameOrCode: string): GlobalCountryOption | undefined {
  const query = countryNameOrCode.toLowerCase().trim();
  return WORLDWIDE_COUNTRIES.find(
    c => c.name.toLowerCase() === query || c.code.toLowerCase() === query
  );
}
