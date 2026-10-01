export interface AffiliatePartner {
  id: string;
  category: 'insurance' | 'banking' | 'esim' | 'vpn' | 'hosting';
  badge: string;
  name: string;
  tagline: string;
  description: string;
  keyBenefits: string[];
  nomadFit: string;
  dealHighlight: string;
  promoCode?: string;
  ctaText: string;
  url: string;
  iconType: 'shield' | 'creditCard' | 'wifi' | 'lock' | 'server';
}

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  {
    id: 'airalo',
    category: 'esim',
    badge: '200+ Countries Global Connectivity',
    name: 'Airalo Global & Regional eSIMs',
    tagline: 'Instant local data when you touch down in any airport worldwide without swapping physical SIMs.',
    description: 'Keep your primary phone number active for bank 2FA SMS while getting high-speed 5G local data packages across Schengen, the US, and Asia.',
    keyBenefits: [
      'Regional plans covering 39 European countries under one eSIM',
      'Instant QR code activation before boarding your flight',
      'Zero international roaming shock bills'
    ],
    nomadFit: 'Never get stuck without navigation or taxi apps at customs arrivals.',
    dealHighlight: 'Use referral code AKAY3659 for $3 USD discount on your first eSIM!',
    promoCode: 'AKAY3659',
    ctaText: 'Claim $3 Off with Code AKAY3659',
    url: 'https://www.airalo.com/profile/referral',
    iconType: 'wifi'
  },
  {
    id: 'hostinger',
    category: 'hosting',
    badge: 'Top Nomad Business & Cloud Infrastructure',
    name: 'Hostinger Cloud & Web Hosting',
    tagline: 'Fast, secure website & domain hosting for remote businesses, digital portfolios, and nomad projects.',
    description: 'Power your custom domain, email boxes, and high-performance web projects with 99.9% uptime, free SSL, and worldwide CDN locations.',
    keyBenefits: [
      'Up to 75% off premium web and cloud hosting packages',
      'Free custom domain name, corporate email & automated SSL included',
      'Global server centers in the US, Europe, Singapore, Brazil & more'
    ],
    nomadFit: 'Host client sites or launch your remote businesses from anywhere with zero friction.',
    dealHighlight: 'Special Partner Discount applied via referral code QF8AKAY94S6L',
    promoCode: 'QF8AKAY94S6L',
    ctaText: 'Activate Hostinger Discount (Code: QF8AKAY94S6L)',
    url: 'https://hostinger.fr/?REFERRALCODE=QF8AKAY94S6L',
    iconType: 'server'
  },
  {
    id: 'safetywing',
    category: 'insurance',
    badge: 'Official Schengen Visa Compliant (Coverage > €30,000)',
    name: 'SafetyWing Nomad Insurance',
    tagline: 'Global medical and travel insurance built specifically for remote workers and nomads.',
    description: 'Meets and exceeds all European Schengen visa and digital nomad immigration requirements with instant visa letter generation for border control.',
    keyBenefits: [
      '€30,000+ medical coverage satisfying Regulation (EC) No 810/2009',
      'Continuous monthly auto-pay with no end-date required',
      'Covers travel delays, lost luggage, and home-country visits'
    ],
    nomadFit: 'Essential for Schengen border checks and long-term remote residency visas.',
    dealHighlight: 'Starts at ~$45 / 4 weeks with worldwide coverage',
    ctaText: 'Get Schengen Compliant Letter',
    url: 'https://safetywing.com/nomad-insurance',
    iconType: 'shield'
  },
  {
    id: 'wise',
    category: 'banking',
    badge: 'Multi-Currency Nomad Standard',
    name: 'Wise Multi-Currency Account',
    tagline: 'Hold 40+ currencies, spend abroad with zero markups, and receive payments like a local.',
    description: 'Avoid punishing foreign transaction fees and banking lockouts while traveling through Europe, the Americas, and Southeast Asia.',
    keyBenefits: [
      'Real mid-market exchange rate without hidden bank spreads',
      'Local bank account details in USD, EUR, GBP, AUD, SGD & more',
      'Physical & virtual debit cards compatible with Apple/Google Pay'
    ],
    nomadFit: 'Save hundreds of dollars on international transfers and ATM withdrawals.',
    dealHighlight: 'Zero monthly account maintenance fees',
    ctaText: 'Open Free Multi-Currency Account',
    url: 'https://wise.com',
    iconType: 'creditCard'
  },
  {
    id: 'nordvpn',
    category: 'vpn',
    badge: 'Tax Audit & Public Wi-Fi Security',
    name: 'NordVPN Nomad Edition',
    tagline: 'High-speed encryption, obfuscated servers, and dedicated IPs for remote work security.',
    description: 'Safeguard your banking logins and remote client credentials on shared coworking and airport public Wi-Fi networks in over 110 countries.',
    keyBenefits: [
      'Military-grade encryption and threat protection against public snooping',
      'Dedicated static IP options for secure company database access',
      'Maintains consistent home-country connections without IP leaks'
    ],
    nomadFit: 'Prevents bank account security freezes when logging in from new countries.',
    dealHighlight: 'Special Nomad Discount: Up to 70% off + 3 extra months',
    ctaText: 'Claim Secure VPN Protection',
    url: 'https://nordvpn.com',
    iconType: 'lock'
  }
];
