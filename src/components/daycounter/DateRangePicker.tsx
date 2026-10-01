import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, parseDate, countDaysInclusive } from '../../utils/schengenCalculator';
import { useLanguage } from '../../i18n/LanguageContext';

interface DateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  onChange: (startDate: string, endDate: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className = ''
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Month currently displayed in calendar view
  const initialDate = startDate ? parseDate(startDate) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getUTCMonth()); // 0-indexed

  // Selection step: null = ready for new start, or 'selecting_end'
  const [selectingStep, setSelectingStep] = useState<'idle' | 'selecting_end'>('idle');
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectingStep('idle');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Localized Month Names
  const monthNames = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(Date.UTC(2026, i, 15));
      return d.toLocaleDateString(language || 'en', { month: 'long' });
    });
  }, [language]);

  // Localized Day of Week Headers
  const weekDays = React.useMemo(() => {
    // 2026-06-01 was a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.UTC(2026, 5, 1 + i));
      return d.toLocaleDateString(language || 'en', { weekday: 'narrow' });
    });
  }, [language]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Helper for calendar grid
  const daysInMonth = (year: number, month: number) => {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  };

  const firstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday
    const day = new Date(Date.UTC(year, month, 1)).getUTCDay();
    return day === 0 ? 6 : day - 1; // convert to Monday = 0
  };

  const daysCount = daysInMonth(viewYear, viewMonth);
  const firstDayOffset = firstDayOfMonth(viewYear, viewMonth);

  const handleDayClick = (dateStr: string) => {
    if (selectingStep === 'idle') {
      // Picked new start date
      onChange(dateStr, dateStr);
      setSelectingStep('selecting_end');
    } else {
      // Picked end date
      if (dateStr < startDate) {
        // If clicked earlier than current start, make it new start
        onChange(dateStr, startDate);
      } else {
        onChange(startDate, dateStr);
      }
      setSelectingStep('idle');
      setIsOpen(false);
    }
  };

  // Quick preset helpers
  const handleQuickDuration = (days: number) => {
    const start = startDate || new Date().toISOString().slice(0, 10);
    const end = addDays(start, days - 1);
    onChange(start, end);
    setSelectingStep('idle');
  };

  const totalDays = startDate && endDate ? countDaysInclusive(startDate, endDate) : 0;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button Input */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-lg px-3 py-2 text-xs text-left text-slate-100 flex items-center justify-between transition-colors group focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <div className="flex items-center gap-2 truncate">
          <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
          {startDate && endDate ? (
            <span className="font-mono text-xs">
              <span className="text-white font-medium">{startDate}</span>
              <span className="text-slate-500 mx-1.5">&rarr;</span>
              <span className="text-white font-medium">{endDate}</span>
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800 text-[10px] text-indigo-300 font-sans font-semibold">
                {totalDays} {totalDays === 1 ? 'd' : 'd'}
              </span>
            </span>
          ) : (
            <span className="text-slate-400">Select dates...</span>
          )}
        </div>
        <span className="text-[10px] text-indigo-400 font-medium ml-2 opacity-80 group-hover:opacity-100 shrink-0">
          {isOpen ? '✕' : '📅'}
        </span>
      </button>

      {/* Dropdown Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 bg-slate-900 border border-indigo-500/40 rounded-xl shadow-2xl p-4 space-y-3">
          {/* Quick presets for long durations */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick:
            </span>
            <div className="flex items-center gap-1">
              {[
                { label: '1 Wk', days: 7 },
                { label: '2 Wks', days: 14 },
                { label: '1 Mo', days: 30 },
                { label: '2 Mos', days: 60 },
                { label: '90d', days: 90 }
              ].map(p => (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => handleQuickDuration(p.days)}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-white capitalize">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day of Week Headers (Mon - Sun) */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-500">
            {weekDays.map((wd, i) => (
              <span key={i} className="uppercase">{wd}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="h-7" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysCount }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;

              const isStart = dateStr === startDate;
              const isEnd = dateStr === endDate;
              const inRange =
                startDate &&
                endDate &&
                dateStr >= startDate &&
                dateStr <= endDate;

              const inHoverRange =
                selectingStep === 'selecting_end' &&
                startDate &&
                hoverDate &&
                ((dateStr >= startDate && dateStr <= hoverDate) ||
                  (dateStr <= startDate && dateStr >= hoverDate));

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleDayClick(dateStr)}
                  onMouseEnter={() => setHoverDate(dateStr)}
                  className={`h-7 w-full rounded text-xs font-mono flex items-center justify-center transition-all ${
                    isStart || isEnd
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : inRange || inHoverRange
                      ? 'bg-indigo-950 text-indigo-200 border-y border-indigo-800/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer instruction */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[11px] text-slate-400">
            <span>
              {selectingStep === 'selecting_end'
                ? 'Select end date'
                : 'Select start date'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSelectingStep('idle');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
