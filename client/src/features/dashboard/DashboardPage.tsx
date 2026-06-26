import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { LayoutDashboard } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { MonthFocusHero } from './MonthFocusHero';
import { BudgetBanner } from './BudgetBanner';
import { MonthSelector } from './MonthSelector';
import { AllTimeComparison } from './AllTimeComparison';
import { ComparisonSection } from './ComparisonSection';
import { Skeleton } from '../../components/ui/Skeleton';

const DashboardCharts = lazy(() =>
  import('./DashboardCharts').then((m) => ({ default: m.DashboardCharts })),
);

const ChartsFallback = () => (
  <div className="grid gap-6 lg:grid-cols-2">
    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="rounded-2xl border border-border p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
    ))}
  </div>
);

export const DashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const { stats, isLoading, error } = useDashboardStats(selectedMonth);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(var(--primary),0.15)]">
            <LayoutDashboard size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">Dashboard</h1>
            <p className="text-sm text-muted">Monthly income, spending & savings at a glance</p>
          </div>
        </div>
        <MonthSelector value={selectedMonth} onChange={setSelectedMonth} />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-[rgb(var(--danger))] bg-[rgb(var(--danger))]/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </motion.div>
      )}

      <MonthFocusHero
        monthFocus={stats?.monthFocus ?? {
          label: '',
          yearMonth: selectedMonth,
          income: 0,
          expenses: 0,
          dayToDayExpenses: 0,
          plannedExpenses: 0,
          saved: 0,
          remaining: 0,
          net: 0,
          savingsGoal: 0,
          isSavingsOnTrack: false,
          savingsGoalProgress: 0,
        }}
        previousMonth={stats?.previousMonth ?? {
          label: '',
          yearMonth: '',
          income: 0,
          expenses: 0,
          dayToDayExpenses: 0,
          plannedExpenses: 0,
          saved: 0,
          remaining: 0,
          net: 0,
          savingsGoal: 0,
          isSavingsOnTrack: false,
          savingsGoalProgress: 0,
        }}
        savingsBalance={stats?.savingsBalance ?? 0}
        isLoading={isLoading}
      />

      {!isLoading && stats?.budget && <BudgetBanner budget={stats.budget} />}

      <section>
        <h2 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
          Period Comparison
        </h2>
        <ComparisonSection stats={stats} isLoading={isLoading} />
      </section>

      <AllTimeComparison stats={stats} isLoading={isLoading} />

      <section>
        <h2 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
          Analytics
        </h2>
        <Suspense fallback={<ChartsFallback />}>
          <DashboardCharts stats={stats} isLoading={isLoading} />
        </Suspense>
      </section>
    </motion.div>
  );
};
