import { motion } from 'framer-motion';
import { useStats } from '../../hooks/useStats';
import { SummaryCards } from './SummaryCards';
import { ChartsSection } from './ChartsSection';

export const DashboardPage = () => {
  const { stats, isLoading, error } = useStats();

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">Dashboard</h2>
        <p className="text-sm text-muted mt-1">Overview of your spending habits</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-[rgb(var(--danger))] bg-[rgb(var(--danger))]/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </motion.div>
      )}

      <SummaryCards stats={stats} isLoading={isLoading} />
      <ChartsSection stats={stats} isLoading={isLoading} />
    </motion.div>
  );
};
