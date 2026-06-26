import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MotionCard } from '../../components/ui/MotionCard';
import { Skeleton } from '../../components/ui/Skeleton';
import type { DashboardStats } from '../../types';
import { formatCurrency, formatPercent } from '../../lib/format';

interface ComparisonSectionProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

const periods = [
  { key: 'today' as const, label: 'Today' },
  { key: 'week' as const, label: 'This Week' },
  { key: 'month' as const, label: 'This Month' },
  { key: 'allTime' as const, label: 'All Time' },
];

export const ComparisonSection = memo(({ stats, isLoading }: ComparisonSectionProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MotionCard key={i} delay={0}>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-4 h-8 w-full" />
            <Skeleton className="mt-3 h-4 w-3/4" />
          </MotionCard>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {periods.map((period, index) => {
        const snap = stats[period.key];
        const positive = snap.remaining >= 0;

        return (
          <MotionCard key={period.key} delay={0.1 + index * 0.06} hover>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{period.label}</p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Income</span>
                <span className="font-semibold text-success">{formatCurrency(snap.income)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Day-to-Day</span>
                <span className="font-semibold text-danger">{formatCurrency(snap.dayToDayExpenses)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Planned</span>
                <span className="font-semibold text-warning">{formatCurrency(snap.plannedExpenses)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Saved</span>
                <span className="font-semibold text-primary">{formatCurrency(snap.saved)}</span>
              </div>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-3 h-2 origin-left overflow-hidden rounded-full bg-muted"
            >
              {snap.income > 0 && (
                <div className="flex h-full">
                  <div
                    className="h-full bg-danger"
                    style={{ width: `${(snap.dayToDayExpenses / snap.income) * 100}%` }}
                  />
                  <div
                    className="h-full bg-warning"
                    style={{ width: `${(snap.plannedExpenses / snap.income) * 100}%` }}
                  />
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(snap.saved / snap.income) * 100}%` }}
                  />
                </div>
              )}
            </motion.div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted">
                Spend {formatPercent(snap.spendingRatio)}
              </span>
              <span className={`flex items-center gap-1 font-semibold ${positive ? 'text-success' : 'text-danger'}`}>
                <ArrowRight size={12} className="text-muted" />
                {formatCurrency(snap.remaining)}
              </span>
            </div>

            <div
              className={`mt-2 inline-flex rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                snap.isHealthy
                  ? 'bg-[rgba(var(--success),0.15)] text-success'
                  : 'bg-[rgba(var(--danger),0.15)] text-danger'
              }`}
            >
              {snap.isHealthy ? 'On track' : 'Over cap'}
            </div>
          </MotionCard>
        );
      })}
    </div>
  );
});

ComparisonSection.displayName = 'ComparisonSection';
