import { Calendar, CalendarDays, CalendarRange, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionCard } from '../../components/ui/MotionCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { ExpenseStats } from '../../types';

interface SummaryCardsProps {
  stats: ExpenseStats | null;
  isLoading: boolean;
}

const cards = [
  { key: 'today' as const, label: 'Today', icon: Calendar, colorVar: '--primary' },
  { key: 'week' as const, label: 'This Week', icon: CalendarDays, colorVar: '--primary-light' },
  { key: 'month' as const, label: 'This Month', icon: CalendarRange, colorVar: '--accent' },
  { key: 'allTime' as const, label: 'All Time', icon: TrendingUp, colorVar: '--glow-color' },
];

export const SummaryCards = ({ stats, isLoading }: SummaryCardsProps) => {
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
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `rgba(var(${card.colorVar}), 0.15)` }}
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <Icon size={20} style={{ color }} />
            </motion.div>
            <p className="mt-3 text-xs font-medium text-muted sm:text-sm">{card.label}</p>
            <AnimatedCounter
              value={value}
              className="mt-1 block text-lg font-bold text-foreground sm:text-2xl"
            />
          </MotionCard>
        );
      })}
    </div>
  );
};
