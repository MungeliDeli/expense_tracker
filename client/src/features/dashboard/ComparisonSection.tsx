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
        const positive = snap.net >= 0;

        return (
          <MotionCard key={period.key} delay={0.1 + index * 0.06} hover>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{period.label}</p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="font-semibold text-success">{formatCurrency(snap.income)}</span>
              <ArrowRight size={14} className="shrink-0 text-muted" />
              <span className="font-semibold text-danger">{formatCurrency(snap.expenses)}</span>
              <ArrowRight size={14} className="shrink-0 text-muted" />
              <span className="font-semibold text-primary">{formatCurrency(snap.saved)}</span>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-3 h-2 origin-left overflow-hidden rounded-full bg-muted"
            >
              <div className="flex h-full">
                {snap.income > 0 && (
                  <div
                    className="h-full bg-success transition-all duration-500"
                    style={{ width: `${Math.min((snap.expenses / snap.income) * 100, 100)}%` }}
                  />
                )}
              </div>
            </motion.div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted">
                Spend {formatPercent(snap.spendingRatio)}
              </span>
              <span className={`font-semibold ${positive ? 'text-success' : 'text-danger'}`}>
                {positive ? '+' : ''}{formatCurrency(snap.net)}
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
