import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Wifi, 
  Lock, 
  Receipt, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Info,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { AFFILIATE_PARTNERS, AffiliatePartner } from '../../data/affiliates';

interface NomadToolkitProps {
  contextualCategory?: 'insurance' | 'banking' | 'esim' | 'vpn' | 'all';
}

export const NomadToolkit: React.FC<NomadToolkitProps> = ({ contextualCategory = 'all' }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'insurance' | 'banking' | 'esim' | 'vpn'>(
    contextualCategory === 'all' ? 'all' : contextualCategory
  );

  const getPartnerIcon = (type: string) => {
    switch (type) {
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'creditCard':
        return <CreditCard className="w-5 h-5 text-indigo-400" />;
      case 'wifi':
        return <Wifi className="w-5 h-5 text-sky-400" />;
      case 'lock':
        return <Lock className="w-5 h-5 text-amber-400" />;
      default:
        return <Receipt className="w-5 h-5 text-purple-400" />;
    }
  };

  const filteredPartners = selectedFilter === 'all' 
    ? AFFILIATE_PARTNERS 
    : AFFILIATE_PARTNERS.filter(p => p.category === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Header section with transparent ethical disclosure */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                Curated Nomad Toolkit
              </span>
              <span className="text-xs text-slate-400">Zero banner ads · Vetted travel essentials</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Essential Tools for Border Compliance &amp; Global Mobility
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every service below has been verified to meet European Schengen immigration requirements, international border control criteria, and cross-border fiscal needs.
            </p>
          </div>

          {/* Ethics Note */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 max-w-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Transparent Disclosure</span>
            </div>
            <p>
              When you purchase through these links, you receive exclusive nomad discounts and support the free maintenance of NomadTax &amp; Visa at zero extra cost to you.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-slate-800/60 mt-5">
          <span className="text-xs font-medium text-slate-400 mr-2">Filter by Need:</span>
          {[
            { id: 'all', label: 'All Essentials' },
            { id: 'insurance', label: 'Schengen Insurance' },
            { id: 'banking', label: 'Multi-Currency Banking' },
            { id: 'esim', label: 'Global eSIM Data' },
            { id: 'vpn', label: 'Wi-Fi & Privacy VPN' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPartners.map(partner => (
          <div
            key={partner.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getPartnerIcon(partner.iconType)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                      {partner.name}
                    </h4>
                    <span className="text-xs text-indigo-400 font-medium">
                      {partner.dealHighlight}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded text-right max-w-[170px] leading-tight">
                  {partner.badge}
                </span>
              </div>

              {/* Tagline & Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {partner.description}
              </p>

              {/* Key Benefits */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Why Digital Nomads Rely On This:
                </span>
                <ul className="space-y-1.5">
                  {partner.keyBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Verified Compliance
              </span>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
              >
                <span>{partner.ctaText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Contextual Mini Banners for embedded placement inside calculator cards
 */
export const SchengenInsuranceCallout: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-900/60 border border-indigo-700/60 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Schengen Border Requirement</span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.2 rounded">
              Regulation (EC) No 810/2009
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            EU border officers require proof of &ge;€30,000 emergency medical insurance for non-EU travelers. 
            <strong> SafetyWing Nomad Insurance</strong> issues an instant official visa letter.
          </p>
        </div>
      </div>

      <a
        href="https://safetywing.com/nomad-insurance"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
      >
        <span>Get Visa Letter (~$45)</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};

export const GlobalBankingCallout: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-900/40 border border-emerald-700/60 flex items-center justify-center shrink-0">
          <CreditCard className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <span className="text-xs font-bold text-white">Avoid Foreign Bank Fees &amp; FX Markups</span>
          <p className="text-xs text-slate-300 mt-0.5">
            Traveling across multiple currencies? <strong>Wise</strong> gives you real mid-market exchange rates with local account numbers in EUR, USD, and GBP.
          </p>
        </div>
      </div>

      <a
        href="https://wise.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
      >
        <span>Open Free Wise Account</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
