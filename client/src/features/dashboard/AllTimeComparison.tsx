import { memo } from 'react';
import { MotionCard } from '../../components/ui/MotionCard';
import { Skeleton } from '../../components/ui/Skeleton';
import type { DashboardStats } from '../../types';
import { formatCurrency, formatPercent } from '../../lib/format';

interface AllTimeComparisonProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export const AllTimeComparison = memo(({ stats, isLoading }: AllTimeComparisonProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <MotionCard key={i} delay={0}>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-4 h-8 w-full" />
          </MotionCard>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const { allTime, savingsBalance } = stats;

  const items = [
    { label: 'Total Earned', value: allTime.income, color: 'text-success' },
    { label: 'Day-to-Day Spent', value: allTime.dayToDayExpenses, color: 'text-danger' },
    { label: 'Planned Spent', value: allTime.plannedExpenses, color: 'text-warning' },
    { label: 'Total Saved', value: allTime.saved, color: 'text-primary' },
    { label: 'Remaining', value: allTime.remaining, color: allTime.remaining >= 0 ? 'text-accent' : 'text-danger' },
    { label: 'Savings Balance', value: savingsBalance, color: 'text-accent' },
    { label: 'Savings Rate', value: formatPercent(allTime.savingsRate), color: 'text-foreground', isText: true },
  ];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground sm:text-base">All-Time Summary</h2>
        <p className="text-xs text-muted">Income split across day-to-day, planned purchases, and savings</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <MotionCard key={item.label} delay={0.05 + index * 0.04} hover>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{item.label}</p>
            <p className={`mt-2 text-lg font-bold sm:text-xl ${item.color}`}>
              {item.isText ? item.value : formatCurrency(item.value as number)}
            </p>
          </MotionCard>
        ))}
      </div>
    </div>
  );
});

AllTimeComparison.displayName = 'AllTimeComparison';
