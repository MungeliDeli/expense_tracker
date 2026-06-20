import { memo } from 'react';
import { format, subMonths } from 'date-fns';
import { Calendar } from 'lucide-react';
import { cn } from '../../lib/cn';

interface MonthSelectorProps {
  value: string;
  onChange: (yearMonth: string) => void;
}

const buildOptions = () => {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(now, i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy'),
    };
  });
};

export const MonthSelector = memo(({ value, onChange }: MonthSelectorProps) => {
  const options = buildOptions();

  return (
    <div className="flex items-center gap-2">
      <Calendar size={16} className="text-muted shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary),0.4)]',
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

MonthSelector.displayName = 'MonthSelector';
