import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Trip, CountryTaxSummary, ForwardSimulationResult, SchengenDayStatus } from '../../types';
import { 
  SCHENGEN_COUNTRIES, 
  isCountrySchengen, 
  calculateSchengenStatusOnDate, 
  simulateForwardStay, 
  countDaysInclusive, 
  addDays, 
  formatDate,
  computeTimelineAroundDate 
} from '../../utils/schengenCalculator';
import { 
  calculateTaxResidencySummary, 
  SAMPLE_TRIP_PRESETS 
} from '../../utils/taxResidencyCalculator';
import { encodeItineraryToUrl, decodeItineraryFromUrl } from '../../utils/urlSharing';
import { DateRangePicker } from './DateRangePicker';
import { CountryStayDistributionChart } from './CountryStayDistributionChart';
import { ShareModal } from '../ShareModal';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Plane, 
  HelpCircle, 
  ShieldAlert, 
  Globe, 
  Clock, 
  Info,
  CalendarDays,
  FileSpreadsheet,
  Search,
  X,
  Share2,
  BookmarkCheck
} from 'lucide-react';

const STORAGE_KEY = 'utilitylab_user_trips';

interface DayCounterAppProps {
  onTripsChange?: (count: number) => void;
}

export const DayCounterApp: React.FC<DayCounterAppProps> = ({ onTripsChange }) => {
  const { t } = useLanguage();

  // Current reference date (defaults to today)
  const todayStr = '2026-09-30';
  const [referenceDate, setReferenceDate] = useState<string>(todayStr);
  const [isSharedView, setIsSharedView] = useState<boolean>(false);
  const [savedBannerMessage, setSavedBannerMessage] = useState<string | null>(null);

  // Trips state with localStorage persistence or URL share decoding
  const [trips, setTrips] = useState<Trip[]>(() => {
    // 1. First check if a shared plan is in the URL hash (#plan=...)
    const sharedData = decodeItineraryFromUrl();
    if (sharedData && sharedData.trips.length > 0) {
      if (sharedData.referenceDate) {
        // Will set via useEffect
      }
      return sharedData.trips;
    }

    // 2. Check localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return SAMPLE_TRIP_PRESETS[0].trips;
  });

  // Check URL on mount for referenceDate and shared status
  useEffect(() => {
    const sharedData = decodeItineraryFromUrl();
    if (sharedData) {
      setIsSharedView(true);
      if (sharedData.referenceDate) {
        setReferenceDate(sharedData.referenceDate);
      }
    }
  }, []);

  // Save to localStorage if not a read-only preview or if user modifies
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save trips to localStorage', e);
    }
  }, [trips]);

  const prevCountRef = useRef<number>(trips.length);
  useEffect(() => {
    if (onTripsChange && prevCountRef.current !== trips.length) {
      prevCountRef.current = trips.length;
      onTripsChange(trips.length);
    }
  }, [trips.length, onTripsChange]);

  // Form state for adding/editing trip
  const [isAddingTrip, setIsAddingTrip] = useState<boolean>(false);
  const [countryInput, setCountryInput] = useState<string>('France');
  const [isSchengenInput, setIsSchengenInput] = useState<boolean>(true);
  const [startDateInput, setStartDateInput] = useState<string>('2026-09-01');
  const [endDateInput, setEndDateInput] = useState<string>('2026-09-15');
  const [purposeInput, setPurposeInput] = useState<string>('');

  // Share Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const shareUrl = useMemo(() => encodeItineraryToUrl(trips, referenceDate), [trips, referenceDate]);

  // Forward planning simulator state
  const [forwardEntryDate, setForwardEntryDate] = useState<string>('2026-10-15');
  const [forwardStayDays, setForwardStayDays] = useState<number>(30);

  // Tax residency view mode
  const [taxMode, setTaxMode] = useState<'calendar_year' | 'rolling_365'>('calendar_year');

  // Search query state for Trip Itinerary Log
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-update isSchengen when country input changes
  const handleCountryChange = (cName: string) => {
    setCountryInput(cName);
    setIsSchengenInput(isCountrySchengen(cName));
  };

  // Calculations memoized
  const currentSchengenStatus = useMemo(
    () => calculateSchengenStatusOnDate(referenceDate, trips),
    [referenceDate, trips]
  );
  const forwardSimulation: ForwardSimulationResult = useMemo(
    () => simulateForwardStay(forwardEntryDate, forwardStayDays, trips),
    [forwardEntryDate, forwardStayDays, trips]
  );
  const taxSummaries: CountryTaxSummary[] = useMemo(
    () => calculateTaxResidencySummary(trips, {
      mode: taxMode,
      year: 2026,
      referenceDate
    }),
    [trips, taxMode, referenceDate]
  );
  const timelineDays = useMemo(
    () => computeTimelineAroundDate(referenceDate, trips, 20, 40),
    [referenceDate, trips]
  );

  // Filtered trips for Itinerary Log by country name
  const filteredTrips = useMemo(
    () => trips.filter(t =>
      t.country.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ),
    [trips, searchQuery]
  );

  // Add Trip Handler
  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDateInput || !endDateInput) return;

    const newTrip: Trip = {
      id: 'trip_' + Date.now(),
      country: countryInput,
      countryCode: SCHENGEN_COUNTRIES.find(c => c.name.toLowerCase() === countryInput.toLowerCase())?.code || 'XX',
      startDate: startDateInput,
      endDate: endDateInput,
      isSchengen: isSchengenInput,
      purpose: purposeInput.trim() || undefined
    };

    setTrips(prev => [...prev, newTrip].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    setIsAddingTrip(false);
    setPurposeInput('');
  };

  // Delete Trip Handler
  const handleDeleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  // Preset Switcher Handler
  const handleLoadPreset = (presetId: string) => {
    const preset = SAMPLE_TRIP_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setTrips(preset.trips);
      setIsSharedView(false);
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Clear All Handler
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all logged trips?')) {
      setTrips([]);
      setIsSharedView(false);
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Save Shared Itinerary to Local Storage permanently
  const handleSaveSharedToLocal = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
      setSavedBannerMessage(t('shared_plan_saved'));
      setTimeout(() => setSavedBannerMessage(null), 3500);
      setIsSharedView(false);
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {
      console.error(e);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Country', 'Country Code', 'Start Date', 'End Date', 'Days', 'Is Schengen', 'Purpose'];
    const rows = trips.map(t => [
      `"${t.country}"`,
      `"${t.countryCode}"`,
      `"${t.startDate}"`,
      `"${t.endDate}"`,
      countDaysInclusive(t.startDate, t.endDate),
      t.isSchengen ? 'YES' : 'NO',
      `"${t.purpose || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `visa_and_tax_residency_audit_${referenceDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        tripCount={trips.length}
      />

      {/* Shared Itinerary Active Banner */}
      {isSharedView && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-600/50 text-xs shadow-lg">
          <div className="flex items-center gap-2.5 text-indigo-200">
            <Share2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{t('shared_plan_banner', { count: trips.length })}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveSharedToLocal}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{t('save_shared_to_local')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {savedBannerMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedBannerMessage}</span>
        </div>
      )}

      {/* Top Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              Active Compliance Engine
            </span>
            <span className="text-xs text-slate-400">{t('private_badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            {t('app_title')} &amp; {t('schengen_heading')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {t('app_tagline')}
          </p>
        </div>

        {/* Quick Presets & Link Sharing */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 transition-colors"
            title={t('share_plan_title')}
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('share_plan')}</span>
          </button>

          <span className="text-xs text-slate-400 font-medium mr-1 ml-1">{t('presets_title')}:</span>
          {SAMPLE_TRIP_PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => handleLoadPreset(p.id)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title={p.description}
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
          <button
            onClick={handleClearAll}
            className="text-xs px-2 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Clear all trips"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Schengen 90/180 Status Gauge */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <h2 className="font-bold text-base text-white">{t('schengen_heading')}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('rolling_window', { start: addDays(referenceDate, -179), end: referenceDate })}
              </p>
            </div>

            {/* Reference Date Picker */}
            <div className="flex items-center gap-2">
              <label htmlFor="ref-date" className="text-xs text-slate-400 font-medium">
                {t('reference_date_label')}
              </label>
              <input
                id="ref-date"
                type="date"
                value={referenceDate}
                onChange={e => setReferenceDate(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Big Gauge Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Metric 1 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium mb-1">{t('days_used_label')}</div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-extrabold font-mono ${
                    currentSchengenStatus.isOverstay
                      ? 'text-rose-400'
                      : currentSchengenStatus.daysUsedInWindow >= 75
                      ? 'text-amber-400'
                      : 'text-white'
                  }`}
                >
                  {currentSchengenStatus.daysUsedInWindow}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ 90 {t('unit_days')}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full transition-all duration-500 ${
                    currentSchengenStatus.isOverstay
                      ? 'bg-rose-500'
                      : currentSchengenStatus.daysUsedInWindow >= 75
                      ? 'bg-amber-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (currentSchengenStatus.daysUsedInWindow / 90) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium mb-1">{t('days_remaining')}</div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-extrabold font-mono ${
                    currentSchengenStatus.daysRemaining === 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {currentSchengenStatus.daysRemaining}
                </span>
                <span className="text-sm font-semibold text-slate-500">{t('days_unit', { days: '' }).trim()}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {currentSchengenStatus.daysRemaining > 0
                  ? t('status_safe_desc', { days: currentSchengenStatus.daysRemaining })
                  : t('status_danger_desc', { days: currentSchengenStatus.daysUsedInWindow - 90 })}
              </p>
            </div>

            {/* Metric 3: Status Badge */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-center ${
                currentSchengenStatus.isOverstay
                  ? 'bg-rose-950/30 border-rose-800/80 text-rose-300'
                  : currentSchengenStatus.daysUsedInWindow >= 75
                  ? 'bg-amber-950/30 border-amber-800/80 text-amber-300'
                  : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {currentSchengenStatus.isOverstay ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <span>{t('status_danger')}</span>
                  </>
                ) : currentSchengenStatus.daysUsedInWindow >= 75 ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span>{t('status_warning')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{t('status_safe')}</span>
                  </>
                )}
              </div>
              <p className="text-xs mt-1 opacity-90">
                {currentSchengenStatus.isOverstay
                  ? t('status_danger_desc', { days: currentSchengenStatus.daysUsedInWindow - 90 })
                  : currentSchengenStatus.daysUsedInWindow >= 75
                  ? t('status_warning_desc', { days: 90 - currentSchengenStatus.daysUsedInWindow })
                  : t('status_safe_desc', { days: currentSchengenStatus.daysRemaining })}
              </p>
            </div>
          </div>

          {/* Window Explanation */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              {t('rolling_window', { start: addDays(referenceDate, -179), end: referenceDate })}. {t('ref_note')}
            </span>
          </div>
        </div>

        {/* Card 2: Forward Planning Simulator */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg">
          <div className="border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h2 className="font-bold text-base text-white">{t('simulator_heading')}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('simulator_desc')}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="forward-entry" className="text-xs text-slate-300 font-medium block mb-1">
                {t('entry_date')}
              </label>
              <input
                id="forward-entry"
                type="date"
                value={forwardEntryDate}
                onChange={e => setForwardEntryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
                <label htmlFor="forward-stay">{t('intended_stay')}</label>
                <span className="font-mono text-indigo-400">{t('days_unit', { days: forwardStayDays })}</span>
              </div>
              <input
                id="forward-stay"
                type="range"
                min="1"
                max="90"
                value={forwardStayDays}
                onChange={e => setForwardStayDays(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Simulation Result */}
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                forwardSimulation.canStayRequested
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {forwardSimulation.canStayRequested ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('sim_safe', { days: forwardStayDays })}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>{t('sim_limit', { max: forwardSimulation.maxConsecutiveDays })}</span>
                  </>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {forwardSimulation.canStayRequested ? (
                  t('sim_safe_exit', { date: forwardSimulation.exitDateIfMax })
                ) : (
                  t('sim_limit_desc', { 
                    date: forwardSimulation.exitDateIfMax, 
                    violation: forwardSimulation.firstViolationDate || '' 
                  })
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 183-Day Tax Residency Tracker Section */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-base text-white">{t('tax_heading')}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('tax_desc')}
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setTaxMode('calendar_year')}
              className={`px-3 py-1 rounded transition-colors ${
                taxMode === 'calendar_year' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('calendar_year')}
            </button>
            <button
              onClick={() => setTaxMode('rolling_365')}
              className={`px-3 py-1 rounded transition-colors ${
                taxMode === 'rolling_365' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('rolling_365')}
            </button>
          </div>
        </div>

        {taxSummaries.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            {t('no_countries_tracked')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taxSummaries.map(item => (
              <div
                key={item.country}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{item.country}</span>
                    {item.isSchengen && (
                      <span className="text-[10px] text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-1.5 py-0.2 rounded">
                        {t('schengen_badge')}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      item.taxRiskLevel === 'triggered'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                        : item.taxRiskLevel === 'danger'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                        : item.taxRiskLevel === 'caution'
                        ? 'bg-sky-950/60 text-sky-300 border border-sky-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.taxRiskLevel === 'triggered'
                      ? t('status_tax_resident')
                      : item.taxRiskLevel === 'danger'
                      ? t('status_tax_caution')
                      : item.taxRiskLevel === 'caution'
                      ? t('status_tax_moderate')
                      : t('status_tax_safe')}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{t('chart_days_logged')}</span>
                    <span className="font-mono text-slate-200 font-semibold">
                      {item.daysCounted} / {item.threshold} {t('unit_days')} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        item.taxRiskLevel === 'triggered'
                          ? 'bg-rose-500'
                          : item.taxRiskLevel === 'danger'
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>183 {t('unit_days')} limit</span>
                    <span>
                      {item.taxRiskLevel === 'triggered'
                        ? t('tax_warning_over')
                        : t('tax_remaining', { days: Math.max(0, item.threshold - item.daysCounted) })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Visual Timeline Strip (Past 20 days to Next 40 days) */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">{t('timeline_heading')}</h3>
          </div>
          <span className="text-xs text-slate-400">
            {t('center', { date: referenceDate })}
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-1 min-w-[700px]">
            {timelineDays.map((day: SchengenDayStatus) => {
              const isToday = day.date === referenceDate;
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                >
                  <div
                    className={`w-full h-8 rounded-sm transition-all ${
                      day.isOverstay
                        ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                        : day.inSchengen
                        ? 'bg-indigo-500 hover:bg-indigo-400'
                        : 'bg-slate-800 hover:bg-slate-700'
                    } ${isToday ? 'ring-2 ring-emerald-400' : ''}`}
                  />
                  <span className="text-[9px] font-mono text-slate-500">
                    {day.date.slice(8)}
                  </span>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-10 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                    <div className="bg-slate-950 border border-slate-700 text-slate-200 text-[10px] p-2 rounded shadow-xl whitespace-nowrap space-y-0.5">
                      <div className="font-bold text-white">{day.date}</div>
                      <div>Status: {day.inSchengen ? t('legend_in_schengen') : t('legend_outside')}</div>
                      <div>{t('days_used_label')}: {day.daysUsedInWindow}/90</div>
                      {day.isOverstay && <div className="text-rose-400 font-bold">{t('legend_violation')}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-indigo-500" />
            <span>{t('legend_in_schengen')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-800" />
            <span>{t('legend_outside')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500" />
            <span>{t('legend_violation')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border-2 border-emerald-400" />
            <span>{t('legend_ref_date')}</span>
          </div>
        </div>
      </section>

      {/* Trips Management Section */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t('itinerary_heading')}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium">
                {searchQuery.trim() 
                  ? t('itinerary_filtered_count', { filtered: filteredTrips.length, total: trips.length }) 
                  : t('itinerary_count', { count: trips.length })}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('itinerary_desc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Country Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('filter_country_placeholder')}
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                  title={t('clear_search')}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsAddingTrip(!isAddingTrip)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingTrip ? t('close_form') : t('add_new_trip')}</span>
            </button>

            {/* Share Link Button */}
            <button
              id="share-link-btn"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-medium border border-indigo-700/60 flex items-center gap-1.5 transition-colors"
              title={t('share_plan_title')}
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('share_plan')}</span>
            </button>

            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('export_csv')}</span>
            </button>
          </div>
        </div>

        {/* Add Trip Inline Drawer */}
        {isAddingTrip && (
          <form
            onSubmit={handleAddTrip}
            className="p-5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {t('add_new_trip')}
              </span>
              <span className="text-xs text-slate-400">{t('is_schengen_member')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">{t('country_label')}</label>
                <select
                  value={countryInput}
                  onChange={e => handleCountryChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <optgroup label="Schengen Countries">
                    {SCHENGEN_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Popular Non-Schengen">
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Albania">Albania</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Indonesia">Indonesia (Bali)</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Japan">Japan</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-300 font-medium">{t('start_end_date')}</label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {countDaysInclusive(startDateInput, endDateInput)} {t('unit_days')}
                  </span>
                </div>
                <DateRangePicker
                  startDate={startDateInput}
                  endDate={endDateInput}
                  onChange={(start, end) => {
                    setStartDateInput(start);
                    setEndDateInput(end);
                  }}
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">{t('purpose_label')}</label>
                <input
                  type="text"
                  placeholder={t('purpose_placeholder')}
                  value={purposeInput}
                  onChange={e => setPurposeInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isSchengenInput}
                  onChange={e => setIsSchengenInput(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>{t('is_schengen_member')}</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTrip(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm"
                >
                  {t('save_trip')}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Country Stay Duration Distribution Chart */}
        {trips.length > 0 && (
          <CountryStayDistributionChart
            trips={searchQuery.trim() ? filteredTrips : trips}
          />
        )}

        {/* Trips Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold">
                <th className="py-3 px-4">{t('table_country')}</th>
                <th className="py-3 px-4">{t('table_dates')}</th>
                <th className="py-3 px-4 text-center">{t('table_duration')}</th>
                <th className="py-3 px-4">{t('table_zone')}</th>
                <th className="py-3 px-4">{t('table_purpose')}</th>
                <th className="py-3 px-4 text-right">{t('table_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    {t('no_trips_logged')}
                  </td>
                </tr>
              ) : filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    <p>{t('no_matching_trips', { query: searchQuery })}</p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="mt-2 text-indigo-400 hover:text-indigo-300 font-medium text-xs underline"
                    >
                      {t('clear_filter')}
                    </button>
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip: Trip) => {
                  const days = countDaysInclusive(trip.startDate, trip.endDate);
                  return (
                    <tr key={trip.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {trip.country}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-xs">
                        {trip.startDate} &rarr; {trip.endDate}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-200">
                        {t('days_count', { days, unit: days === 1 ? t('unit_day') : t('unit_days') })}
                      </td>
                      <td className="py-3 px-4">
                        {trip.isSchengen ? (
                          <span className="text-[11px] font-medium text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 rounded">
                            {t('schengen_badge')}
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {t('non_schengen_badge')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs">
                        {trip.purpose || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title={t('delete_trip')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
