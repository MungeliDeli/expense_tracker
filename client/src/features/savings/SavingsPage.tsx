import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSavingsStats } from '../../hooks/useSavingsStats';
import { SavingsSummaryCards } from './SavingsSummaryCards';
import { SavingsGoalCard } from './SavingsGoalCard';
import { SavingsHistorySection } from './SavingsHistorySection';
import { SavingsForm } from './SavingsForm';
import { SavingsTable } from './SavingsTable';
import { PageHeader } from '../../components/layout/PageHeader';
import { Modal } from '../../components/ui/Modal';

export const SavingsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const { stats, isLoading, error, refetch } = useSavingsStats();

  const handleMutate = useCallback(() => {
    setRefreshKey((k) => k + 1);
    refetch();
  }, [refetch]);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <PageHeader
        title="Savings"
        description="Track your savings balance, set monthly goals, and stay on track"
        onAdd={() => setFormOpen(true)}
        addLabel="Add Savings"
        accent="primary"
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-[rgb(var(--danger))] bg-[rgb(var(--danger))]/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </motion.div>
      )}

      <SavingsSummaryCards stats={stats} isLoading={isLoading} />
      <SavingsGoalCard stats={stats} onUpdate={handleMutate} />
      <SavingsHistorySection stats={stats} isLoading={isLoading} />
      <SavingsTable refreshKey={refreshKey} onMutate={handleMutate} />

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title="Add to Savings"
        className="max-w-lg"
      >
        <SavingsForm
          inModal
          onSuccess={handleMutate}
          onClose={() => setFormOpen(false)}
        />
      </Modal>
    </motion.div>
  );
};
