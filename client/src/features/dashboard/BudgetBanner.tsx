import { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import type { BudgetTracking } from '../../types';
import { formatCurrency, formatPercent } from '../../lib/format';
import { DAILY_BUDGET, WEEKLY_BUDGET, MONTHLY_BUDGET } from '../../lib/constants';

interface BudgetBannerProps {
  budget: BudgetTracking;
}

const periods = [
  { key: 'daily' as const, label: 'Today', limit: DAILY_BUDGET },
  { key: 'weekly' as const, label: 'This Week', limit: WEEKLY_BUDGET },
  { key: 'monthly' as const, label: 'This Month', limit: MONTHLY_BUDGET },
];

export const BudgetBanner = memo(({ budget }: BudgetBannerProps) => {
  const allOnTrack = budget.daily.isOnTrack && budget.weekly.isOnTrack && budget.monthly.isOnTrack;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-2xl border p-5 sm:p-6 ${
        allOnTrack
          ? 'border-[rgba(var(--success),0.35)] bg-[rgba(var(--success),0.08)]'
          : 'border-[rgba(var(--danger),0.35)] bg-[rgba(var(--danger),0.08)]'
      }`}
    >
      <div className="flex items-start gap-3 mb-5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            allOnTrack ? 'bg-[rgba(var(--success),0.2)]' : 'bg-[rgba(var(--danger),0.2)]'
          }`}
        >
          {allOnTrack ? (
            <ShieldCheck size={24} className="text-success" />
          ) : (
            <ShieldAlert size={24} className="text-danger" />
          )}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Day-to-Day Spending Budget
          </p>
          <h2 className={`mt-1 text-lg font-bold sm:text-xl ${allOnTrack ? 'text-success' : 'text-danger'}`}>
            {allOnTrack ? 'Within budget limits' : 'Over budget — slow down spending'}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Only day-to-day expenses count toward limits: {formatCurrency(DAILY_BUDGET)}/day · {formatCurrency(WEEKLY_BUDGET)}/week · {formatCurrency(MONTHLY_BUDGET)}/month
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {periods.map((period) => {
          const status = budget[period.key];
          return (
            <div
              key={period.key}
              className={`rounded-xl border p-4 ${
                status.isOnTrack
                  ? 'border-[rgba(var(--success),0.25)] bg-card/60'
                  : 'border-[rgba(var(--danger),0.25)] bg-card/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted">{period.label}</p>
                <span
                  className={`text-[10px] font-semibold uppercase ${
                    status.isOnTrack ? 'text-success' : 'text-danger'
                  }`}
                >
                  {status.isOnTrack ? 'OK' : 'Over'}
                </span>
              </div>
              <p className="mt-2 text-lg font-bold text-foreground">
                {formatCurrency(status.spent)}
                <span className="text-sm font-normal text-muted"> / {formatCurrency(period.limit)}</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    status.isOnTrack ? 'bg-success' : 'bg-danger'
                  }`}
                  style={{ width: `${Math.min(status.percentUsed, 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-muted">
                {status.isOnTrack
                  ? `${formatCurrency(status.remaining)} left (${formatPercent(100 - status.percentUsed)} remaining)`
                  : `${formatCurrency(status.spent - period.limit)} over limit`}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});

BudgetBanner.displayName = 'BudgetBanner';
