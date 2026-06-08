import { CalendarDays, CalendarRange, TrendingUp, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionCard } from '../../components/ui/MotionCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { IncomeStats } from '../../types';

interface IncomeSummaryCardsProps {
  stats: IncomeStats | null;
  isLoading: boolean;
}

const cards = [
  { key: 'week' as const, label: 'This Week', icon: CalendarDays, colorVar: '--success' },
  { key: 'month' as const, label: 'This Month', icon: CalendarRange, colorVar: '--accent' },
  { key: 'allTime' as const, label: 'All Time', icon: TrendingUp, colorVar: '--glow-color' },
  { key: 'today' as const, label: 'Today', icon: Coins, colorVar: '--primary-light' },
];

export const IncomeSummaryCards = ({ stats, isLoading }: IncomeSummaryCardsProps) => {
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
        const value = stats?.[card.key] ?? 0;
        const color = `rgb(var(${card.colorVar}))`;

        return (
          <MotionCard key={card.key} delay={index * 0.1}>
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 80% 20%, rgba(var(${card.colorVar}), 0.12), transparent 60%)`,
              }}
            />
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `rgba(var(${card.colorVar}), 0.18)` }}
              whileHover={{ scale: 1.12, rotate: 8 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Icon size={20} style={{ color }} />
            </motion.div>
            <p className="mt-3 text-xs font-medium text-muted sm:text-sm">{card.label}</p>
            <AnimatedCounter
              value={value}
              className="mt-1 block text-lg font-bold text-success sm:text-2xl"
            />
          </MotionCard>
        );
      })}
    </div>
  );
};
