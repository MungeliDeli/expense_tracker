import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Check, Pencil } from 'lucide-react';
import { savingsApi } from '../../lib/api';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../lib/format';
import type { SavingsStats } from '../../types';

interface SavingsGoalCardProps {
  stats: SavingsStats | null;
  onUpdate: () => void;
}

export const SavingsGoalCard = ({ stats, onUpdate }: SavingsGoalCardProps) => {
  const [editing, setEditing] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const goal = stats?.monthlyGoal ?? 0;
  const saved = stats?.month ?? 0;
  const isMet = stats?.isGoalMet ?? false;

  const startEdit = () => {
    setGoalInput(goal > 0 ? String(goal) : '');
    setEditing(true);
  };

  const handleSave = async () => {
    const value = parseFloat(goalInput);
    if (isNaN(value) || value < 0) {
      addToast('Enter a valid goal amount', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await savingsApi.updateGoal(value);
      addToast('Monthly savings goal updated', 'success');
      setEditing(false);
      onUpdate();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to update goal', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 sm:p-6 ${
        isMet
          ? 'border-[rgba(var(--success),0.35)] bg-[rgba(var(--success),0.08)]'
          : 'border-[rgba(var(--primary),0.35)] bg-[rgba(var(--primary),0.08)]'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isMet ? 'bg-[rgba(var(--success),0.2)]' : 'bg-[rgba(var(--primary),0.2)]'
            }`}
          >
            {isMet ? (
              <Check size={24} className="text-success" />
            ) : (
              <Target size={24} className="text-primary" />
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Monthly Savings Goal
            </p>
            <h2 className={`mt-1 text-lg font-bold sm:text-xl ${isMet ? 'text-success' : 'text-primary'}`}>
              {goal > 0
                ? isMet
                  ? 'Goal reached this month!'
                  : `${formatCurrency(saved)} of ${formatCurrency(goal)} saved`
                : 'Set your monthly savings target'}
            </h2>
            {goal > 0 && !isMet && (
              <p className="mt-1 text-sm text-muted">
                {formatCurrency(goal - saved)} more to hit your goal
              </p>
            )}
          </div>
        </div>

        {editing ? (
          <div className="flex items-end gap-2">
            <Input
              label="Goal (ZMW)"
              type="number"
              min="0"
              step="0.01"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-36"
            />
            <Button onClick={handleSave} isLoading={isLoading} className="shrink-0">
              Save
            </Button>
            <Button variant="secondary" onClick={() => setEditing(false)} className="shrink-0">
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={startEdit} className="shrink-0">
            <Pencil size={16} />
            {goal > 0 ? 'Edit Goal' : 'Set Goal'}
          </Button>
        )}
      </div>

      {goal > 0 && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(stats?.goalProgress ?? 0, 100)}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className={`h-full rounded-full ${isMet ? 'bg-success' : 'bg-primary'}`}
          />
        </div>
      )}
    </motion.div>
  );
};
