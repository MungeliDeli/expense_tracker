import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useIncomeStats } from '../../hooks/useIncomeStats';
import { IncomeSummaryCards } from './IncomeSummaryCards';
import { IncomeChartsSection } from './IncomeChartsSection';
import { IncomeForm } from './IncomeForm';
import { IncomeTable } from './IncomeTable';
import { PageHeader } from '../../components/layout/PageHeader';
import { Modal } from '../../components/ui/Modal';

export const IncomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const { stats, isLoading, error, refetch } = useIncomeStats();

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
        title="Income"
        description="Track earnings, view trends, and manage records"
        onAdd={() => setFormOpen(true)}
        addLabel="Add Income"
        accent="success"
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

      <IncomeSummaryCards stats={stats} isLoading={isLoading} />
      <IncomeChartsSection stats={stats} isLoading={isLoading} />
      <IncomeTable refreshKey={refreshKey} onMutate={handleMutate} />

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title="Add Income"
        className="max-w-lg"
      >
        <IncomeForm
          inModal
          onSuccess={handleMutate}
          onClose={() => setFormOpen(false)}
        />
      </Modal>
    </motion.div>
  );
};
