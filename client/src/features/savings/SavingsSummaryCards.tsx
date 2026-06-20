import { memo } from 'react';
import { PiggyBank, Target, TrendingUp, Wallet } from 'lucide-react';
import { MotionCard } from '../../components/ui/MotionCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { SavingsStats } from '../../types';
import { formatPercent } from '../../lib/format';

interface SavingsSummaryCardsProps {
  stats: SavingsStats | null;
  isLoading: boolean;
}

const cards = [
  { key: 'balance' as const, label: 'Total Balance', icon: PiggyBank, colorVar: '--primary' },
  { key: 'month' as const, label: 'Saved This Month', icon: TrendingUp, colorVar: '--success' },
  { key: 'monthlyGoal' as const, label: 'Monthly Goal', icon: Target, colorVar: '--accent' },
  { key: 'goalProgress' as const, label: 'Goal Progress', icon: Wallet, colorVar: '--glow-color', isPercent: true },
];

export const SavingsSummaryCards = memo(({ stats, isLoading }: SavingsSummaryCardsProps) => {
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
        const raw = stats?.[card.key] ?? 0;
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
              <p className={`mt-1 text-lg font-bold sm:text-2xl ${stats?.isGoalMet ? 'text-success' : 'text-foreground'}`}>
                {formatPercent(raw)}
              </p>
            ) : (
              <AnimatedCounter
                value={raw}
                className="mt-1 block text-lg font-bold text-foreground sm:text-2xl"
              />
            )}
          </MotionCard>
        );
      })}
    </div>
  );
});

SavingsSummaryCards.displayName = 'SavingsSummaryCards';
