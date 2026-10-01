import React, { useMemo } from 'react';
import { Trip } from '../../types';
import { countDaysInclusive } from '../../utils/schengenCalculator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface CountryStayDistributionChartProps {
  trips: Trip[];
}

interface CountryDurationData {
  country: string;
  days: number;
  isSchengen: boolean;
  tripCount: number;
  percentage: number;
}

export const CountryStayDistributionChart: React.FC<CountryStayDistributionChartProps> = ({
  trips
}) => {
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    const countryMap = new Map<string, { days: number; isSchengen: boolean; tripCount: number }>();
    let totalAllDays = 0;

    trips.forEach(trip => {
      const days = countDaysInclusive(trip.startDate, trip.endDate);
      totalAllDays += days;
      const current = countryMap.get(trip.country) || {
        days: 0,
        isSchengen: trip.isSchengen,
        tripCount: 0
      };
      countryMap.set(trip.country, {
        days: current.days + days,
        isSchengen: trip.isSchengen,
        tripCount: current.tripCount + 1
      });
    });

    const list: CountryDurationData[] = Array.from(countryMap.entries()).map(([country, info]) => ({
      country,
      days: info.days,
      isSchengen: info.isSchengen,
      tripCount: info.tripCount,
      percentage: totalAllDays > 0 ? Math.round((info.days / totalAllDays) * 100) : 0
    }));

    return list.sort((a, b) => b.days - a.days);
  }, [trips]);

  if (chartData.length === 0) {
    return null;
  }

  const totalTrackedDays = chartData.reduce((acc, c) => acc + c.days, 0);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">
              {t('chart_heading')}
            </h4>
            <p className="text-[11px] text-slate-400">
              {t('chart_desc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
            <span className="text-slate-300 text-[11px]">{t('schengen_badge')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-300 text-[11px]">{t('non_schengen_badge')}</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono text-[11px] text-slate-300">
            {t('chart_total', { days: totalTrackedDays })}
          </div>
        </div>
      </div>

      {/* Chart Canvas with explicit min-height and debounce */}
      <div className="w-full h-64 min-h-[256px]" style={{ minHeight: '256px' }}>
        <ResponsiveContainer width="100%" height={256} debounce={50}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -10, bottom: 25 }}
            barSize={30}
          >
            <XAxis
              dataKey="country"
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              unit="d"
            />
            <Tooltip
              cursor={{ fill: 'rgba(51, 65, 85, 0.25)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CountryDurationData;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1 z-50">
                      <div className="flex items-center justify-between gap-4 font-bold text-white">
                        <span>{data.country}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            data.isSchengen
                              ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {data.isSchengen ? t('schengen_badge') : t('non_schengen_badge')}
                        </span>
                      </div>
                      <div className="text-slate-300 font-mono pt-1">
                        {t('chart_days_logged')} <strong className="text-white">{data.days} {data.days === 1 ? t('unit_day') : t('unit_days')}</strong> ({data.percentage}%)
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {t('chart_visits')} {data.tripCount} {data.tripCount === 1 ? t('unit_day') : t('unit_days')}
                      </div>
                      <div className="text-[10px] text-slate-500 pt-0.5">
                        {data.days >= 183
                          ? t('chart_tax_alert')
                          : t('chart_tax_remaining', { days: 183 - data.days })}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="days" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.country}`}
                  fill={entry.isSchengen ? '#6366f1' : '#10b981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
        {chartData.slice(0, 6).map((item) => (
          <div
            key={item.country}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 truncate">
              <span className="truncate">{item.country}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  item.isSchengen ? 'bg-indigo-400' : 'bg-emerald-400'
                }`}
              />
            </div>
            <div className="flex items-baseline justify-between mt-1 text-xs">
              <span className="font-mono font-bold text-white">{item.days}d</span>
              <span className="text-[10px] text-slate-500 font-mono">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
