import { memo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Receipt, PiggyBank, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { MonthFocus } from '../../types';
import { formatCurrency } from '../../lib/format';

interface MonthFocusHeroProps {
  monthFocus: MonthFocus;
  previousMonth: MonthFocus;
  savingsBalance: number;
  isLoading: boolean;
}

export const MonthFocusHero = memo(({
  monthFocus,
  previousMonth,
  savingsBalance,
  isLoading,
}: MonthFocusHeroProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Earned',
      value: monthFocus.income,
      icon: Wallet,
      colorVar: '--success',
      sub: previousMonth.income > 0
        ? `vs ${formatCurrency(previousMonth.income)} last month`
        : 'This month',
    },
    {
      label: 'Spent',
      value: monthFocus.expenses,
      icon: Receipt,
      colorVar: '--danger',
      sub: previousMonth.expenses > 0
        ? `vs ${formatCurrency(previousMonth.expenses)} last month`
        : 'Day-to-day spending',
    },
    {
      label: 'Saved',
      value: monthFocus.saved,
      icon: PiggyBank,
      colorVar: '--primary',
      sub: monthFocus.savingsGoal > 0
        ? monthFocus.isSavingsOnTrack ? 'Goal met!' : `Goal: ${formatCurrency(monthFocus.savingsGoal)}`
        : 'Deposited this month',
    },
    {
      label: 'Balance',
      value: savingsBalance,
      icon: TrendingUp,
      colorVar: '--accent',
      sub: 'Total savings pot',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Monthly Overview</p>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">{monthFocus.label}</h2>
        </div>
        {monthFocus.savingsGoal > 0 && (
          <span
            className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              monthFocus.isSavingsOnTrack
                ? 'bg-[rgba(var(--success),0.15)] text-success'
                : 'bg-[rgba(var(--warning),0.15)] text-warning'
            }`}
          >
            Savings {monthFocus.isSavingsOnTrack ? 'on track' : 'below goal'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 card-shadow"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `rgba(var(${card.colorVar}), 0.15)` }}
              >
                <Icon size={20} style={{ color: `rgb(var(${card.colorVar}))` }} />
              </div>
              <p className="mt-3 text-xs font-medium text-muted sm:text-sm">{card.label}</p>
              <AnimatedCounter
                value={card.value}
                className="mt-1 block text-xl font-bold text-foreground sm:text-2xl"
              />
              <p className="mt-1 text-[11px] text-muted">{card.sub}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

MonthFocusHero.displayName = 'MonthFocusHero';
