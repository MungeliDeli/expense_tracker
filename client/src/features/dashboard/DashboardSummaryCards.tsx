import { memo } from 'react';
import { Wallet, Receipt, PiggyBank, Percent } from 'lucide-react';
import { MotionCard } from '../../components/ui/MotionCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { PeriodSnapshot } from '../../types';
import { formatPercent } from '../../lib/format';

interface DashboardSummaryCardsProps {
  snapshot: PeriodSnapshot;
  isLoading: boolean;
}

const cards = [
  { key: 'income' as const, label: 'Income', icon: Wallet, colorVar: '--success' },
  { key: 'expenses' as const, label: 'Expenses', icon: Receipt, colorVar: '--danger' },
  { key: 'net' as const, label: 'Net Savings', icon: PiggyBank, colorVar: '--primary' },
  { key: 'savingsRate' as const, label: 'Savings Rate', icon: Percent, colorVar: '--accent', isPercent: true },
];

export const DashboardSummaryCards = memo(({ snapshot, isLoading }: DashboardSummaryCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const raw = snapshot[card.key];
        const color = `rgb(var(${card.colorVar}))`;

        return (
          <MotionCard key={card.key} delay={index * 0.08}>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `rgba(var(${card.colorVar}), 0.15)` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <p className="mt-3 text-xs font-medium text-muted sm:text-sm">{card.label}</p>
            {card.isPercent ? (
              <p className={`mt-1 text-lg font-bold sm:text-2xl ${raw >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatPercent(raw)}
              </p>
            ) : (
              <AnimatedCounter
                value={raw}
                className={`mt-1 block text-lg font-bold sm:text-2xl ${
                  card.key === 'net' ? (raw >= 0 ? 'text-success' : 'text-danger') : 'text-foreground'
                }`}
              />
            )}
          </MotionCard>
        );
      })}
    </div>
  );
});

DashboardSummaryCards.displayName = 'DashboardSummaryCards';
