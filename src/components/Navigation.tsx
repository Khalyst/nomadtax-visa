import React, { useState } from 'react';
import { Compass, ShieldCheck, Download, PlaneTakeoff, Share2, Check, Copy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface NavigationProps {
  tripCount: number;
  onExportCSV: () => void;
  onShareLink?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  tripCount,
  onExportCSV,
  onShareLink
}) => {
  const { t } = useLanguage();

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                {t('app_title')}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
                {t('app_subtitle')}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t('app_tagline')}
            </p>
          </div>
        </div>

        {/* Quick Stat / Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium">{t('private_badge')}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-xs text-indigo-300 font-medium">
            <PlaneTakeoff className="w-3.5 h-3.5" />
            <span>{t('trips_tracked', { count: tripCount })}</span>
          </div>

          {/* Share Itinerary Link Button */}
          {onShareLink && (
            <button
              onClick={onShareLink}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/40 flex items-center gap-1.5 transition-colors"
              title={t('share_plan_title')}
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">{t('share_plan')}</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <LanguageSelector />

          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            title={t('export_audit')}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('export_audit')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
