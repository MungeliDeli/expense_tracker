import { memo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Receipt, ShoppingBag, PiggyBank, CircleDollarSign } from 'lucide-react';
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
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
        : 'Total income',
    },
    {
      label: 'Day-to-Day',
      value: monthFocus.dayToDayExpenses,
      icon: Receipt,
      colorVar: '--danger',
      sub: 'Regular spending',
    },
    {
      label: 'Planned',
      value: monthFocus.plannedExpenses,
      icon: ShoppingBag,
      colorVar: '--warning',
      sub: 'Large purchases',
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
      label: 'Remaining',
      value: monthFocus.remaining,
      icon: CircleDollarSign,
      colorVar: '--accent',
      sub: `Pot balance: ${formatCurrency(savingsBalance)}`,
    },
  ];

  const income = monthFocus.income;
  const segments = income > 0
    ? [
        { key: 'dayToDay', amount: monthFocus.dayToDayExpenses, color: 'bg-danger' },
        { key: 'planned', amount: monthFocus.plannedExpenses, color: 'bg-warning' },
        { key: 'saved', amount: monthFocus.saved, color: 'bg-primary' },
        { key: 'remaining', amount: Math.max(monthFocus.remaining, 0), color: 'bg-accent' },
      ]
    : [];

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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
                className={`mt-1 block text-xl font-bold sm:text-2xl ${
                  card.label === 'Remaining' && card.value < 0 ? 'text-danger' : 'text-foreground'
                }`}
              />
              <p className="mt-1 text-[11px] text-muted">{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {income > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 card-shadow">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Income Breakdown</p>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-muted">
            {segments.map((seg) => (
              <div
                key={seg.key}
                className={`h-full ${seg.color} transition-all duration-500`}
                style={{ width: `${(seg.amount / income) * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-danger" />
              Day-to-Day {formatCurrency(monthFocus.dayToDayExpenses)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-warning" />
              Planned {formatCurrency(monthFocus.plannedExpenses)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Saved {formatCurrency(monthFocus.saved)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Remaining {formatCurrency(monthFocus.remaining)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

MonthFocusHero.displayName = 'MonthFocusHero';
