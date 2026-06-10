import { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, TrendingUp, TrendingDown } from 'lucide-react';
import type { PeriodSnapshot } from '../../types';
import { formatCurrency, formatPercent } from '../../lib/format';

interface FinancialHealthBannerProps {
  snapshot: PeriodSnapshot;
  periodLabel: string;
  spendingCapPercent: number;
}

export const FinancialHealthBanner = memo(({
  snapshot,
  periodLabel,
  spendingCapPercent,
}: FinancialHealthBannerProps) => {
  const capAmount = snapshot.income * (spendingCapPercent / 100);
  const isPositive = snapshot.net >= 0;
  const healthy = snapshot.isHealthy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 ${
        healthy
          ? 'border-[rgba(var(--success),0.35)] bg-[rgba(var(--success),0.08)]'
          : 'border-[rgba(var(--danger),0.35)] bg-[rgba(var(--danger),0.08)]'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
        style={{ background: healthy ? 'rgb(var(--success))' : 'rgb(var(--danger))' }}
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              healthy ? 'bg-[rgba(var(--success),0.2)]' : 'bg-[rgba(var(--danger),0.2)]'
            }`}
          >
            {healthy ? (
              <ShieldCheck size={24} className="text-success" />
            ) : (
              <ShieldAlert size={24} className="text-danger" />
            )}
          </motion.div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {periodLabel} · Financial Health
            </p>
            <h2 className={`mt-1 text-lg font-bold sm:text-xl ${healthy ? 'text-success' : 'text-danger'}`}>
              {healthy ? 'Spending on track' : 'Overspending alert'}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted">
              {snapshot.income > 0 ? (
                healthy ? (
                  <>
                    You&apos;re spending {formatPercent(snapshot.spendingRatio)} of earnings — under your{' '}
                    {spendingCapPercent}% cap. You&apos;re saving {formatPercent(snapshot.savingsRate)}.
                  </>
                ) : (
                  <>
                    You&apos;ve spent {formatPercent(snapshot.spendingRatio)} of earnings — above your{' '}
                    {spendingCapPercent}% cap ({formatCurrency(capAmount)} max). Cut back to stay on track.
                  </>
                )
              ) : (
                'Add income entries to track your spending ratio.'
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <div className="flex-1 rounded-xl border border-border bg-card/60 px-4 py-3 backdrop-blur-sm sm:min-w-[120px] sm:flex-none">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              {isPositive ? <TrendingUp size={14} className="text-success" /> : <TrendingDown size={14} className="text-danger" />}
              Net
            </div>
            <p className={`mt-1 text-lg font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(snapshot.net)}
            </p>
          </div>
          <div className="flex-1 rounded-xl border border-border bg-card/60 px-4 py-3 backdrop-blur-sm sm:min-w-[120px] sm:flex-none">
            <p className="text-xs text-muted">Spend ratio</p>
            <p className={`mt-1 text-lg font-bold ${healthy ? 'text-foreground' : 'text-danger'}`}>
              {formatPercent(snapshot.spendingRatio)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

FinancialHealthBanner.displayName = 'FinancialHealthBanner';
