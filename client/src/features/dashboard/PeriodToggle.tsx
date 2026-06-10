import { memo } from 'react';
import { cn } from '../../lib/cn';

export type DashboardPeriod = 'today' | 'week' | 'month' | 'allTime';

interface PeriodToggleProps {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
}

const options: { value: DashboardPeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'allTime', label: 'All Time' },
];

export const PeriodToggle = memo(({ value, onChange }: PeriodToggleProps) => (
  <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={cn(
          'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm',
          value === opt.value
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted hover:text-foreground',
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
));

PeriodToggle.displayName = 'PeriodToggle';
