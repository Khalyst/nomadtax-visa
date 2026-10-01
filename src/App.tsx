/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Navigation } from './components/Navigation';
import { DayCounterApp } from './components/daycounter/DayCounterApp';

function AppContent() {
  const [tripCount, setTripCount] = useState<number>(4);
  const { t } = useLanguage();

  const handleTripsChange = useCallback((count: number) => {
    setTripCount(prev => (prev !== count ? count : prev));
  }, []);

  const handleExportCSVFromHeader = () => {
    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) {
      exportBtn.click();
    }
  };

  const handleShareLinkFromHeader = () => {
    const shareBtn = document.getElementById('share-link-btn');
    if (shareBtn) {
      shareBtn.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navigation
        tripCount={tripCount}
        onExportCSV={handleExportCSVFromHeader}
        onShareLink={handleShareLinkFromHeader}
      />

      {/* Main Day-Counter & Tax Residency Tool Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <DayCounterApp onTripsChange={handleTripsChange} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {t('footer_text')}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>{t('schengen_standard')}</span>
            <span>·</span>
            <span>{t('tax_rules')}</span>
            <span>·</span>
            <span>{t('offline_ready')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
