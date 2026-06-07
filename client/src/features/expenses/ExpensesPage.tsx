import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseTable } from './ExpenseTable';

export const ExpensesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMutate = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">Expenses</h2>
        <p className="text-sm text-muted mt-1">Add and manage your daily expenses</p>
      </div>

      <ExpenseForm onSuccess={handleMutate} />
      <ExpenseTable refreshKey={refreshKey} onMutate={handleMutate} />
    </motion.div>
  );
};
