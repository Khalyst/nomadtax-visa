import React from 'react';
import { USSubstantialPresenceResult } from '../../types/regional';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface USSubstantialPresenceCardProps {
  result: USSubstantialPresenceResult;
  currentYear: number;
}

export const USSubstantialPresenceCard: React.FC<USSubstantialPresenceCardProps> = ({
  result,
  currentYear
}) => {
  const { t } = useLanguage();

  const getStatusBadge = () => {
    if (result.isSubstantialPresenceMet) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>SPT Triggered (US Tax Resident)</span>
        </div>
      );
    }
    if (result.weightedScore >= 150 || result.currentYearDays >= 90) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>High Risk (Approaching 183 Weighted)</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Non-Resident Compliant</span>
      </div>
    );
  };

  const progressPct = Math.min(100, Math.round((result.weightedScore / 183) * 100));

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20 ${
        result.isSubstantialPresenceMet ? 'bg-rose-500' : result.weightedScore >= 150 ? 'bg-amber-500' : 'bg-indigo-500'
      }`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🇺🇸</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                USA Substantial Presence Test (IRS SPT)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Tax Year {currentYear}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              3-year weighted presence formula used by the IRS to determine US tax residency for non-citizens
            </p>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>{currentYear} (Full weight)</span>
            <span className="text-indigo-400 font-mono">×1.0</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {result.currentYearDays} <span className="text-xs font-normal text-slate-500">days</span>
          </div>
          <div className="text-[10px] mt-1 text-slate-500">
            {result.is31DayMet ? '✓ ≥ 31-day minimum met' : '○ Under 31-day threshold'}
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>{currentYear - 1} (1/3 weight)</span>
            <span className="text-indigo-400 font-mono">×0.33</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {result.priorYear1Days} <span className="text-xs font-normal text-slate-500">days</span>
          </div>
          <div className="text-[10px] mt-1 text-slate-500">
            +{(result.priorYear1Days / 3).toFixed(1)} weighted
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>{currentYear - 2} (1/6 weight)</span>
            <span className="text-indigo-400 font-mono">×0.16</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {result.priorYear2Days} <span className="text-xs font-normal text-slate-500">days</span>
          </div>
          <div className="text-[10px] mt-1 text-slate-500">
            +{(result.priorYear2Days / 6).toFixed(1)} weighted
          </div>
        </div>

        <div className="bg-indigo-950/30 border border-indigo-800/60 rounded-xl p-3.5">
          <div className="text-[11px] font-medium text-indigo-300 mb-1 flex items-center justify-between">
            <span>Total Weighted Score</span>
            <span className="text-xs font-mono text-indigo-400">/ 183.0</span>
          </div>
          <div className="text-2xl font-bold text-indigo-200 font-mono">
            {result.weightedScore}
          </div>
          <div className="text-[10px] mt-1 text-indigo-400">
            {result.isSubstantialPresenceMet
              ? 'Exceeded 183 weighted days!'
              : `${Math.max(0, (183 - result.weightedScore)).toFixed(1)} buffer left`}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 mb-5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-400">IRS SPT Threshold Utilization</span>
          <span className={result.weightedScore >= 183 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
            {result.weightedScore} / 183 weighted days ({progressPct}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              result.isSubstantialPresenceMet
                ? 'bg-rose-500'
                : result.weightedScore >= 150
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Explanatory Callout & Advice */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-300 space-y-2">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              How the IRS Formula Works:
            </p>
            <p className="text-slate-400 leading-relaxed">
              You meet the test if you are in the US for at least <strong className="text-white">31 days</strong> during {currentYear}, AND the weighted sum of days over 3 years is <strong className="text-white">≥ 183 days</strong>:
              <span className="block mt-1 font-mono text-indigo-300 text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-800">
                Formula: (Days in {currentYear}) + (1/3 × Days in {currentYear - 1}) + (1/6 × Days in {currentYear - 2}) ≥ 183
              </span>
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-400">
          <div>
            <strong className="text-slate-200">Safe Cap for {currentYear}:</strong>{' '}
            To stay 100% clear of the SPT, you should limit your total US physical stay in {currentYear} to{' '}
            <span className="text-emerald-400 font-bold">{result.daysToAvoidTrigger} days</span>.
          </div>
          <div className="text-[11px] text-amber-400/90 italic">
            * ESTA note: Trips to Mexico, Canada or Caribbean do not reset your 90-day ESTA clock.
          </div>
        </div>
      </div>
    </div>
  );
};
