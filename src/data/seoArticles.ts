export interface SEOArticle {
  id: string;
  slug: string;
  category: 'schengen' | 'tax-residency' | 'us-spt' | 'digital-nomad-visas';
  categoryLabel: string;
  title: string;
  subtitle: string;
  metaDescription: string;
  readingTime: string;
  updatedDate: string;
  author: string;
  schemaType: 'HowTo' | 'FAQPage' | 'Article';
  tableOfContents: { id: string; label: string }[];
  summaryPoints: string[];
  contentHtml: string;
  faqs: { question: string; answer: string }[];
  actionPrompt: {
    heading: string;
    subtext: string;
    presetAction?: string;
  };
}

export const SEO_ARTICLES: SEOArticle[] = [
  {
    id: 'schengen-90-180-rule-guide',
    slug: 'schengen-90-180-rule-explained',
    category: 'schengen',
    categoryLabel: 'Schengen Visa Compliance',
    title: 'How the Schengen 90/180 Rule Actually Works (2026 Calculator Guide)',
    subtitle: 'Everything you need to know about rolling 180-day windows, non-Schengen reset tactics, entry/exit math, and avoiding 3-year European re-entry bans.',
    metaDescription: 'Learn how to accurately calculate the Schengen 90/180 rolling rule in 2026. Understand entry & exit count formulas, calendar resets, and avoid border overstay penalties.',
    readingTime: '6 min read',
    updatedDate: 'October 2026',
    author: 'International Mobility & Immigration Research Desk',
    schemaType: 'HowTo',
    tableOfContents: [
      { id: 'what-is-the-rule', label: '1. What Is the 90/180 Rule?' },
      { id: 'common-misconception', label: '2. The Big Misconception (Fixed vs. Rolling)' },
      { id: 'how-to-calculate', label: '3. Step-by-Step Calculation Formula' },
      { id: 'non-schengen-havens', label: '4. Resetting Your Days in European Non-Schengen Havens' },
      { id: 'etias-eels-update', label: '5. What Changes with EES & ETIAS in 2026' },
      { id: 'faq-section', label: '6. Frequently Asked Questions' }
    ],
    summaryPoints: [
      'The 90/180 rule is NOT a calendar reset (it does not reset on January 1st or every 6 months).',
      'On ANY given day of your stay, look back exactly 180 days: your total days physically spent in Schengen cannot exceed 90.',
      'Both entry day and exit day count as full days spent inside the Schengen zone, regardless of arrival or departure hour.',
      'Cyprus, Ireland, the UK, Montenegro, Albania, and Serbia are outside the Schengen area and do NOT consume your 90 days.'
    ],
    contentHtml: `
      <section id="what-is-the-rule" class="space-y-4">
        <h3 class="text-xl font-bold text-white">1. What Is the 90/180 Rule?</h3>
        <p class="text-slate-300 leading-relaxed">
          Under Regulation (EU) 2016/399 (Schengen Borders Code), citizens from visa-exempt countries (including the United States, Canada, the United Kingdom, Australia, New Zealand, Japan, and Singapore) may enter and travel across the Schengen Area without a prior tourist visa for a maximum of <strong>90 days within any 180-day period</strong>.
        </p>
        <p class="text-slate-300 leading-relaxed">
          The 29 Schengen member states operate with removed internal borders. Once you step into France, Germany, Spain, Italy, Portugal, or Greece, there are no regular passport control checks when crossing borders between member states. However, an exit passport control stamp or digital biometric gate scan tracks the exact duration of your stay.
        </p>
      </section>

      <section id="common-misconception" class="space-y-4">
        <h3 class="text-xl font-bold text-white">2. The Big Misconception: Fixed vs. Rolling Window</h3>
        <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
          <strong>⚠️ The Fatal Mistake:</strong> Many nomads believe that if they stay 90 days from January to March, leave for 1 week, and return in April, their "90 days reset". <em>This is completely false.</em>
        </div>
        <p class="text-slate-300 leading-relaxed">
          The 180-day window is <strong>strictly backward-looking and rolling</strong>. On each individual day of your prospective stay, imagine standing at the border gate. The border guard looks backward over the preceding 180 calendar days. If the count equals 90, you must exit that day. If it is 91, you have formally committed an immigration overstay.
        </p>
      </section>

      <section id="how-to-calculate" class="space-y-4">
        <h3 class="text-xl font-bold text-white">3. Step-by-Step Calculation Formula</h3>
        <p class="text-slate-300 leading-relaxed">
          To verify compliance on any target departure date <em>D</em>:
        </p>
        <ol class="list-decimal pl-6 space-y-2 text-slate-300">
          <li>Define the retrospective evaluation window: <code>[D - 179 days, D]</code> (exactly 180 days total).</li>
          <li>Mark every date in that window where you spent any portion of time in any of the 29 Schengen member countries.</li>
          <li>Sum the total number of flagged dates.</li>
          <li>If <code>Days Counted &le; 90</code>: You are fully compliant.</li>
          <li>If <code>Days Counted &gt; 90</code>: You have exceeded the limit by <code>Days Counted - 90</code> days.</li>
        </ol>
      </section>

      <section id="non-schengen-havens" class="space-y-4">
        <h3 class="text-xl font-bold text-white">4. Resetting Your Days in European Non-Schengen Havens</h3>
        <p class="text-slate-300 leading-relaxed">
          When your 90 days are almost spent, you don't need to fly across an ocean. You can spend 90 consecutive days in nearby non-Schengen European nations, allowing your earlier Schengen days to "roll off" the 180-day calculation window:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div class="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span class="text-indigo-400 font-semibold block text-sm">Albania</span>
            <span class="text-xs text-slate-400">US passport holders can stay up to 365 days visa-free! EU/UK passport holders get 90 days.</span>
          </div>
          <div class="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span class="text-indigo-400 font-semibold block text-sm">Montenegro & Serbia</span>
            <span class="text-xs text-slate-400">Allow 90 days of visa-free tourist stays completely distinct from Schengen counts.</span>
          </div>
          <div class="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span class="text-indigo-400 font-semibold block text-sm">United Kingdom & Ireland</span>
            <span class="text-xs text-slate-400">UK grants 6 months (180 days) visa-free to US/EU/Canadian tourists. Ireland operates its own 90-day visa waiver.</span>
          </div>
          <div class="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span class="text-indigo-400 font-semibold block text-sm">Cyprus</span>
            <span class="text-xs text-slate-400">EU member state, but not yet Schengen. Operates its own autonomous 90/180 allowance.</span>
          </div>
        </div>
      </section>

      <section id="etias-eels-update" class="space-y-4">
        <h3 class="text-xl font-bold text-white">5. What Changes with EES & ETIAS in 2026</h3>
        <p class="text-slate-300 leading-relaxed">
          The European Union has activated the <strong>Entry/Exit System (EES)</strong>, replacing manual physical passport stamps with biometric automated facial/fingerprint scans at external border checkpoints.
        </p>
        <p class="text-slate-300 leading-relaxed">
          In previous years, travelers sometimes got away with 1-day discrepancies due to smeared ink stamps. With EES and ETIAS, <strong>the border gates calculate rolling overstays electronically to the exact second</strong>. Automated turnstiles will refuse exit gates and generate instant biometric flags if an overstay occurs.
        </p>
      </section>
    `,
    faqs: [
      {
        question: 'Do my arrival day and departure day count towards the 90 days?',
        answer: 'Yes. Under EU border guidelines, any day in which you spend even a few minutes inside the Schengen territory is counted as a full day of presence.'
      },
      {
        question: 'Does travel between France and Spain reset or pause my Schengen days?',
        answer: 'No. France and Spain are both Schengen members. Crossing internal borders has zero effect on your 90-day counter.'
      },
      {
        question: 'What are the penalties for overstaying Schengen?',
        answer: 'Penalties range from administrative fines (€500 to €2,000+) to formal deportation and an SIS (Schengen Information System) re-entry ban for 1 to 5 years across all 29 European countries.'
      }
    ],
    actionPrompt: {
      heading: 'Simulate Your Schengen Itinerary Now',
      subtext: 'Load our interactive calculator to see your rolling count and simulate planned trips.',
      presetAction: 'schengen'
    }
  },
  {
    id: 'us-substantial-presence-test-guide',
    slug: 'us-substantial-presence-test-spt-explained',
    category: 'us-spt',
    categoryLabel: 'US Tax Compliance',
    title: 'The US Substantial Presence Test (SPT) Explained for Non-Citizens & Snowbirds',
    subtitle: 'How visiting the United States can accidentally classify you as a US Resident Alien for tax purposes, subjecting your global income to IRS taxation.',
    metaDescription: 'Complete guide to the IRS Substantial Presence Test (SPT) formula. Calculate your 31-day, 183-day weighted formula, Closer Connection exceptions (Form 8840), and avoid US worldwide tax traps.',
    readingTime: '7 min read',
    updatedDate: 'October 2026',
    author: 'Cross-Border Tax & Expat Accounting Research',
    schemaType: 'HowTo',
    tableOfContents: [
      { id: 'spt-overview', label: '1. What Is the Substantial Presence Test?' },
      { id: 'the-math-formula', label: '2. The 3-Year Weighted Formula' },
      { id: 'safe-magic-number', label: '3. The Magic "120-Day" Annual Safe Buffer' },
      { id: 'closer-connection', label: '4. Form 8840: Closer Connection Exception' },
      { id: 'exempt-individuals', label: '5. Exempt Days (F-1, J-1, Crew, Medical)' },
      { id: 'faq-section', label: '6. Frequently Asked Questions' }
    ],
    summaryPoints: [
      'Non-US citizens who spend significant time in the US risk being classified as "Resident Aliens" for tax purposes.',
      'The formula is: Current Year Days + (1/3 × Prior Year Days) + (1/6 × Year Before Prior Days) ≥ 183.',
      'If you stay in the US for 120 days or fewer every year consistently, you will NEVER trigger the Substantial Presence Test.',
      'Triggering SPT means the IRS may tax your global worldwide income, investments, and foreign companies.'
    ],
    contentHtml: `
      <section id="spt-overview" class="space-y-4">
        <h3 class="text-xl font-bold text-white">1. What Is the Substantial Presence Test?</h3>
        <p class="text-slate-300 leading-relaxed">
          The United States operates one of the most comprehensive tax systems in the world. Under <strong>Internal Revenue Code (IRC) Section 7701(b)</strong>, if an individual is neither a US citizen nor a green card holder, they are still considered a <strong>"Resident Alien" for federal income tax purposes</strong> if they meet the Substantial Presence Test for the calendar year.
        </p>
        <p class="text-slate-300 leading-relaxed">
          Being classified as a US resident alien means the IRS has statutory authority to demand federal income tax and reporting (including FBAR and FATCA) on your <em>entire worldwide income</em>, regardless of where that income was earned.
        </p>
      </section>

      <section id="the-math-formula" class="space-y-4">
        <h3 class="text-xl font-bold text-white">2. The 3-Year Weighted Formula</h3>
        <p class="text-slate-300 leading-relaxed">
          To satisfy the Substantial Presence Test for the current calendar year (Year 1), you must meet two tests:
        </p>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <p class="text-sm text-slate-200">
            <strong>Condition 1:</strong> You were physically present in the United States for at least <strong>31 days</strong> during the current calendar year.
          </p>
          <p class="text-sm text-slate-200">
            <strong>Condition 2:</strong> The sum of your weighted days over the 3-year rolling period equals or exceeds <strong>183 days</strong>:
          </p>
          <div class="p-3 rounded-lg bg-slate-950 font-mono text-sm text-indigo-300 border border-indigo-900/50">
            Total Weighted Days = [Current Year Days] + (1/3 × [Prior Year Days]) + (1/6 × [Year - 2 Days])
          </div>
        </div>
      </section>

      <section id="safe-magic-number" class="space-y-4">
        <h3 class="text-xl font-bold text-white">3. The Magic "120-Day" Annual Safe Buffer</h3>
        <p class="text-slate-300 leading-relaxed">
          If you travel regularly to the US (e.g. Canadian snowbirds, UK consultants, or remote tech founders), what is the maximum number of days you can spend every year without ever triggering SPT?
        </p>
        <p class="text-slate-300 leading-relaxed">
          The mathematical threshold is <strong>120 days per year</strong>:
        </p>
        <div class="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 font-mono text-xs text-emerald-300">
          120 + (1/3 × 120 = 40) + (1/6 × 120 = 20) = 180 weighted days (&lt; 183 limit). Compliant every year!
        </div>
      </section>

      <section id="closer-connection" class="space-y-4">
        <h3 class="text-xl font-bold text-white">4. Form 8840: Closer Connection Exception</h3>
        <p class="text-slate-300 leading-relaxed">
          Even if your calculated weighted sum reaches or exceeds 183 days, you can avoid US resident alien tax status if you meet the <strong>Closer Connection Exception</strong> by filing <strong>IRS Form 8840</strong>, provided that:
        </p>
        <ul class="list-disc pl-6 space-y-1.5 text-slate-300 text-sm">
          <li>You were present in the US for fewer than 183 days in the current calendar year.</li>
          <li>You maintain a tax home in a foreign country during the entire year.</li>
          <li>You have a closer social, financial, and personal connection to that foreign country than to the US.</li>
        </ul>
      </section>
    `,
    faqs: [
      {
        question: 'Does a layover at a US airport count as a day of presence for SPT?',
        answer: 'Generally, transit through the US between two foreign points for less than 24 hours does not count as a day of presence, provided you do not conduct business or stay overnight outside the transit lounge.'
      },
      {
        question: 'What if I am on an F-1 student or J-1 visa?',
        answer: 'F-1 students are generally exempt individuals for their first 5 calendar years in the US. Their presence days during those 5 years do not count toward the Substantial Presence Test.'
      },
      {
        question: 'Does meeting SPT grant me the right to work in the US?',
        answer: 'No! The Substantial Presence Test is purely for tax classification under the IRS. It does not grant immigration status, work authorization, or a green card.'
      }
    ],
    actionPrompt: {
      heading: 'Calculate Your US SPT Status',
      subtext: 'Input your 2026, 2025, and 2024 US presence to compute your exact IRS weighted days.',
      presetAction: 'us-spt'
    }
  },
  {
    id: '183-day-tax-residency-rule-guide',
    slug: '183-day-tax-residency-rule-worldwide',
    category: 'tax-residency',
    categoryLabel: 'Global Tax Residency',
    title: 'The 183-Day Tax Residency Rule: How to Avoid Double Taxation Worldwide',
    subtitle: 'The international legal benchmark that turns tourists into tax residents. Understand calendar vs. rolling thresholds, tie-breaker treaties, and nomad traps.',
    metaDescription: 'Demystifying the 183-day tax residency rule for digital nomads. Learn the difference between calendar year vs rolling 12-month clocks, center of vital interests, and dual tax treaty rules.',
    readingTime: '8 min read',
    updatedDate: 'October 2026',
    author: 'International Tax Law Policy Group',
    schemaType: 'Article',
    tableOfContents: [
      { id: 'rule-basics', label: '1. What Is the 183-Day Rule?' },
      { id: 'calendar-vs-rolling', label: '2. Calendar Year vs. Rolling 365 Days' },
      { id: 'center-of-interests', label: '3. Beyond Days: Center of Vital Interests' },
      { id: 'country-differences', label: '4. Country-Specific Pitfalls (UK, Spain, Cyprus, Georgia)' },
      { id: 'tax-treaties', label: '5. OECD Model Tax Treaty Tie-Breaker Rules' },
      { id: 'faq-section', label: '6. Frequently Asked Questions' }
    ],
    summaryPoints: [
      'In most OECD countries, spending 183 days or more inside the national borders triggers automatic tax residency on your worldwide income.',
      'Some countries (like Spain, France, and Japan) measure by calendar year (Jan 1 – Dec 31), while others (like Australia or the UK) use tax years or rolling 12-month periods.',
      'You can become a tax resident in under 183 days if your primary home, spouse, or economic center is in that country.',
      'Tracking your day count precisely is your #1 evidentiary defense during a tax authority audit.'
    ],
    contentHtml: `
      <section id="rule-basics" class="space-y-4">
        <h3 class="text-xl font-bold text-white">1. What Is the 183-Day Rule?</h3>
        <p class="text-slate-300 leading-relaxed">
          The 183-day rule is the most universally adopted physical presence standard in global tax law. Because an ordinary calendar year has 365 days, 183 days represents <strong>more than half the year (50% + 1 day)</strong>.
        </p>
        <p class="text-slate-300 leading-relaxed">
          If you spend 183 days or more within a nation's territory, almost every tax administration presumes you have established fiscal residence. As a result, you are subjected to unlimited taxation on your global income (salary, dividends, capital gains, and business revenue).
        </p>
      </section>

      <section id="calendar-vs-rolling" class="space-y-4">
        <h3 class="text-xl font-bold text-white">2. Calendar Year vs. Rolling 365 Days</h3>
        <p class="text-slate-300 leading-relaxed">
          Do not assume every country counts from January 1 to December 31! Jurisdictions use different measurement windows:
        </p>
        <div class="space-y-3">
          <div class="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span class="text-emerald-400 font-semibold text-sm">Calendar Year (Jan 1 – Dec 31):</span>
            <p class="text-xs text-slate-300 mt-1">Germany, Spain, Portugal, Italy, Japan, Mexico, Thailand.</p>
          </div>
          <div class="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span class="text-amber-400 font-semibold text-sm">Rolling 12-Month Window (Any consecutive 365 days):</span>
            <p class="text-xs text-slate-300 mt-1">Colombia, Georgia, Costa Rica, Malaysia (certain circumstances).</p>
          </div>
          <div class="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span class="text-indigo-400 font-semibold text-sm">Fiscal / Tax Year Offsets:</span>
            <p class="text-xs text-slate-300 mt-1">United Kingdom (April 6 – April 5), Australia (July 1 – June 30).</p>
          </div>
        </div>
      </section>

      <section id="center-of-interests" class="space-y-4">
        <h3 class="text-xl font-bold text-white">3. Beyond Days: Center of Vital Interests</h3>
        <p class="text-slate-300 leading-relaxed">
          <strong>Crucial warning:</strong> Staying under 183 days does NOT automatically guarantee you are safe from local taxation. If you spend only 100 days in Spain or France, but your spouse and minor children reside there, or your primary bank account and business operations are situated there, the tax authorities will deem you a fiscal resident under the <em>"center of vital economic and personal interests"</em> clause.
        </p>
      </section>
    `,
    faqs: [
      {
        question: 'If I spend 100 days in Spain and 100 days in Italy, do I pay taxes in either?',
        answer: 'Under physical day tests alone, you do not reach 183 days in either country. However, you must prove where your actual tax residency lies. If you have severed ties everywhere, you may face complex audits or exit tax complications in your original home country.'
      },
      {
        question: 'Can digital nomad visas protect me from the 183-day tax rule?',
        answer: 'Some do, some do not. For instance, Greece offers a 50% tax reduction on its digital nomad visa; Thailand has introduced exemptions under the DTV for foreign-source income; Spain offers the Beckham Law special tax regime (flat 24%). Always check the specific visa decree.'
      }
    ],
    actionPrompt: {
      heading: 'Check Your Worldwide Tax Clocks',
      subtext: 'Monitor your physical presence days country-by-country against the 183-day threshold in real time.',
      presetAction: 'tax-residency'
    }
  },
  {
    id: 'digital-nomad-visas-americas-apac-guide',
    slug: 'digital-nomad-visas-americas-asia-pacific-guide',
    category: 'digital-nomad-visas',
    categoryLabel: 'Nomad Visas & Border Runs',
    title: 'Digital Nomad Visa Guide: Americas & Asia-Pacific Rules (2026 Edition)',
    subtitle: 'From Thailand’s Destination Thailand Visa (DTV) to Mexico FMM rules, Japan’s 6-month nomad visa, and Colombia stay caps.',
    metaDescription: 'Complete 2026 guide for digital nomad visas and tourist stay rules across Southeast Asia and the Americas. Stay limits, border run policies, and income prerequisites.',
    readingTime: '9 min read',
    updatedDate: 'October 2026',
    author: 'Global Mobility Special Projects',
    schemaType: 'HowTo',
    tableOfContents: [
      { id: 'thailand-dtv', label: '1. Thailand: 60-Day Exemption & 5-Year DTV' },
      { id: 'japan-nomad-visa', label: '2. Japan: 6-Month Digital Nomad Visa' },
      { id: 'indonesia-bali', label: '3. Indonesia / Bali: B211A & Remote Worker E33G' },
      { id: 'mexico-fmm', label: '4. Mexico: 180-Day FMM & Temporal Residency' },
      { id: 'colombia-limits', label: '5. Colombia: 90+90 Day Tourist Cap vs. Nomad Visa' },
      { id: 'faq-section', label: '6. Frequently Asked Questions' }
    ],
    summaryPoints: [
      'Thailand has expanded visa-exempt stays to 60 days (extendable by 30 days) and launched the revolutionary 5-year multiple-entry DTV (Destination Thailand Visa).',
      'Japan offers a 6-month nomad visa for remote workers earning ≥ ¥10,000,000 (~$65k USD), with bilateral tax treaty protections.',
      'Mexico border officers now strictly inspect itineraries and do NOT automatically grant 180 days on arrival.',
      'Colombia allows a strict maximum of 180 calendar days per calendar year for tourists across all visits combined.'
    ],
    contentHtml: `
      <section id="thailand-dtv" class="space-y-4">
        <h3 class="text-xl font-bold text-white">1. Thailand: 60-Day Exemption & 5-Year DTV</h3>
        <p class="text-slate-300 leading-relaxed">
          Thailand has dramatically updated its immigration policies:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-slate-300 text-sm">
          <li><strong>Visa Exemption (60 Days):</strong> Passport holders from 93 countries receive 60 days upon entry, extendable once for 30 days at local immigration offices for 1,900 THB.</li>
          <li><strong>Destination Thailand Visa (DTV):</strong> Valid for 5 years, multiple entries. Allows stays of up to 180 days per entry, extendable once for another 180 days per visit. Prerequisite: proof of at least 500,000 THB (~$14,000 USD) in funds.</li>
        </ul>
      </section>

      <section id="japan-nomad-visa" class="space-y-4">
        <h3 class="text-xl font-bold text-white">2. Japan: 6-Month Digital Nomad Visa</h3>
        <p class="text-slate-300 leading-relaxed">
          Japan's Digital Nomad Visa permits remote workers and freelancers from 49 eligible countries to reside and work remotely in Japan for up to <strong>6 consecutive months</strong>.
        </p>
        <p class="text-slate-300 leading-relaxed text-sm">
          Requirements include annual income exceeding 10 million JPY (~$65,000 USD) and private medical insurance with coverage of at least 10 million JPY. Spouses and children may accompany the visa holder.
        </p>
      </section>

      <section id="mexico-fmm" class="space-y-4">
        <h3 class="text-xl font-bold text-white">3. Mexico: FMM Enforcement & Permanent Reductions</h3>
        <p class="text-slate-300 leading-relaxed">
          In past years, INM (Instituto Nacional de Migración) routinely granted 180 days to anyone landing in Cancún or Mexico City. Today, <strong>officers strictly cross-examine your return ticket and hotel bookings</strong>, often granting only 14, 30, or 60 days. Always check your passport stamp immediately at the immigration booth.
        </p>
      </section>
    `,
    faqs: [
      {
        question: 'Can I do a border run to reset my days in Colombia?',
        answer: 'No! Colombia caps all tourist stays at a maximum of 180 calendar days within a single calendar year (Jan 1 to Dec 31). Once you reach 180 days, you cannot re-enter as a tourist until the next calendar year begins.'
      },
      {
        question: 'Do I pay taxes in Thailand on the DTV?',
        answer: 'Income earned from overseas employers or clients while residing in Thailand under the DTV is generally not subject to Thai personal income tax, provided conditions set under Thai Revenue Department emergency orders are respected.'
      }
    ],
    actionPrompt: {
      heading: 'Check Your Americas & APAC Stays',
      subtext: 'Verify your visit counts against specific national stay limits and visa criteria.',
      presetAction: 'americas-apac'
    }
  }
];
