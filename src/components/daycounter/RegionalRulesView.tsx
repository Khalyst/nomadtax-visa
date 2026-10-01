import React, { useState } from 'react';
import { RegionalStaySummary, Region } from '../../types/regional';
import { GLOBAL_VISA_TAX_RULES } from '../../utils/regionalRules';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Globe2, 
  ExternalLink,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface RegionalRulesViewProps {
  summaries: RegionalStaySummary[];
  activeRegion: Region;
  onRegionChange: (region: Region) => void;
  referenceDate: string;
}

export const RegionalRulesView: React.FC<RegionalRulesViewProps> = ({
  summaries,
  activeRegion,
  onRegionChange,
  referenceDate
}) => {
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const regionTabs: { key: Region; label: string; icon: string; count: number }[] = [
    { 
      key: 'americas', 
      label: 'The Americas', 
      icon: '🌎', 
      count: GLOBAL_VISA_TAX_RULES.filter(r => r.region === 'americas').length 
    },
    { 
      key: 'asia_pacific', 
      label: 'Asia-Pacific (APAC)', 
      icon: '🌏', 
      count: GLOBAL_VISA_TAX_RULES.filter(r => r.region === 'asia_pacific').length 
    },
    { 
      key: 'europe', 
      label: 'Europe (Non-Schengen & UK)', 
      icon: '🌍', 
      count: GLOBAL_VISA_TAX_RULES.filter(r => r.region === 'europe').length 
    },
    { 
      key: 'middle_east_africa', 
      label: 'Middle East & Hubs', 
      icon: '🏜️', 
      count: GLOBAL_VISA_TAX_RULES.filter(r => r.region === 'middle_east_africa').length 
    }
  ];

  const getTaxRiskBadge = (summary: RegionalStaySummary) => {
    switch (summary.taxRiskLevel) {
      case 'triggered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
            <AlertOctagon className="w-3.5 h-3.5" />
            Tax Res. Triggered ({summary.daysCounted}/{summary.taxThresholdDays}d)
          </span>
        );
      case 'danger':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            High Tax Risk ({summary.daysCounted}/{summary.taxThresholdDays}d)
          </span>
        );
      case 'caution':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-yellow-950/70 text-yellow-300 border border-yellow-800/80">
            <Clock className="w-3.5 h-3.5" />
            Approaching ({summary.daysCounted}/{summary.taxThresholdDays}d)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            Safe ({summary.daysCounted}/{summary.taxThresholdDays}d)
          </span>
        );
    }
  };

  const getStayLimitBadge = (summary: RegionalStaySummary) => {
    if (summary.isStayOverstay) {
      return (
        <span className="text-[11px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded">
          Overstay +{summary.daysCounted - summary.stayLimitDays}d
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
        {summary.remainingStayDays} days left of {summary.stayLimitDays}d limit
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Region Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {regionTabs.map(tab => {
          const isActive = activeRegion === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onRegionChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Overview Banner for Selected Region */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Globe2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-slate-300">
            Monitoring active stays and regional immigration/tax thresholds based on your itinerary as of{' '}
            <strong className="text-white font-mono">{referenceDate}</strong>.
          </p>
        </div>
        <div className="text-[11px] text-slate-400 shrink-0">
          Showing <strong className="text-indigo-300">{summaries.length}</strong> country profiles
        </div>
      </div>

      {/* Grid of Regional Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaries.map(summary => {
          const fullRule = GLOBAL_VISA_TAX_RULES.find(r => r.countryCode === summary.countryCode);
          const isExpanded = expandedCountry === summary.countryCode;
          const stayPercentage = Math.min(100, Math.round((summary.daysCounted / summary.stayLimitDays) * 100));

          return (
            <div
              key={summary.countryCode}
              className={`rounded-xl border transition-all duration-200 bg-slate-900/90 ${
                summary.daysCounted > 0
                  ? 'border-indigo-800/80 shadow-md shadow-indigo-950/40'
                  : 'border-slate-800/70 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{summary.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">
                          {summary.country}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {summary.countryCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {fullRule?.visaType || 'Standard Entry'}
                      </p>
                    </div>
                  </div>
                  <div>{getTaxRiskBadge(summary)}</div>
                </div>

                {/* Stay Progress */}
                <div className="bg-slate-950/70 rounded-lg p-3 border border-slate-800/80 mb-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Standard Stay Allowance ({summary.windowType.replace('_', ' ')})
                    </span>
                    {getStayLimitBadge(summary)}
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        summary.isStayOverstay
                          ? 'bg-rose-500'
                          : stayPercentage >= 80
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${stayPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{summary.daysCounted} days logged</span>
                    <span>Max {summary.stayLimitDays} days</span>
                  </div>
                </div>

                {/* Border Run Caution */}
                {fullRule?.borderRunCaution && (
                  <div className="flex items-start gap-2 bg-amber-950/30 border border-amber-900/40 rounded-lg p-2.5 text-xs text-amber-200/90 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      {fullRule.borderRunCaution}
                    </p>
                  </div>
                )}

                {/* Digital Nomad Visa Banner if available */}
                {fullRule?.digitalNomadVisaAvailable && (
                  <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-900/50 rounded-lg p-2.5 text-xs text-emerald-200 mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-[11px]">
                        Nomad Visa: {fullRule.digitalNomadVisaName || 'Available'}
                      </span>
                    </div>
                    <button
                      onClick={() => setExpandedCountry(isExpanded ? null : summary.countryCode)}
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5"
                    >
                      {isExpanded ? 'Less' : 'Details'}
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                )}

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800/80 text-xs space-y-2 text-slate-300 bg-slate-950/40 p-3 rounded-lg mt-2">
                    <div>
                      <strong className="text-white">Tax Residency Rule:</strong>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{summary.ruleNotes}</p>
                    </div>
                    {fullRule?.digitalNomadVisaDetails && (
                      <div>
                        <strong className="text-emerald-300">Nomad Visa Requirements:</strong>
                        <p className="text-slate-400 mt-0.5 leading-relaxed">{fullRule.digitalNomadVisaDetails}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
