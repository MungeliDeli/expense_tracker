import { useState, useEffect } from 'react';
import {
  Search, Filter, Trash2, ArrowUpDown, Receipt,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { expensesApi } from '../../lib/api';
import { CATEGORIES } from '../../lib/constants';
import { formatCurrency, formatDate } from '../../lib/format';
import { useExpenses } from '../../hooks/useExpenses';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { TablePagination } from '../../components/ui/TablePagination';
import type { Expense } from '../../types';

interface ExpenseTableProps {
  refreshKey: number;
  onMutate: () => void;
}

export const ExpenseTable = ({ refreshKey, onMutate }: ExpenseTableProps) => {
  const { expenses, pagination, filters, isLoading, error, updateFilters, refetch } = useExpenses();
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (refreshKey > 0) refetch();
  }, [refreshKey, refetch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await expensesApi.delete(deleteTarget._id);
      addToast('Expense deleted', 'success');
      setDeleteTarget(null);
      refetch();
      onMutate();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (filters.sortBy === field) {
      updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      updateFilters({ sortBy: field, sortOrder: 'desc' });
    }
  };

  return (
    <motion.section
      id="expense-records"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt size={20} className="text-primary" />
            <div>
              <h3 className="text-base font-semibold text-foreground sm:text-lg">All Expenses</h3>
              <p className="text-xs text-muted mt-0.5">Search, filter, and browse your full expense history</p>
            </div>
          </div>
          {pagination && (
            <span className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted">
              {pagination.total} total
            </span>
          )}
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={16} className="absolute left-3 top-[38px] text-muted" />
            <Input
              label="Search"
              placeholder="Search expenses..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-9"
            />
          </div>

          <Select
            label="Category"
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
            options={[
              { value: 'all', label: 'All Categories' },
              ...CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
          />

          <Input
            label="From"
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilters({ startDate: e.target.value })}
          />

          <Input
            label="To"
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilters({ endDate: e.target.value })}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[rgb(var(--danger))] bg-[rgb(var(--danger))]/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-medium text-muted">
                  <button type="button" onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-foreground">
                    Date <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Description</th>
                <th className="px-4 py-3 text-right font-medium text-muted">
                  <button type="button" onClick={() => toggleSort('amount')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                    Amount <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted w-16" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={5}><TableRowSkeleton /></td></tr>
                  ))
                : expenses.length === 0
                ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState icon={Filter} title="No expenses found" description="Try adjusting your filters or add a new expense." />
                    </td>
                  </tr>
                )
                : expenses.map((expense) => (
                  <tr key={expense._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-foreground">{formatDate(expense.date)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-xs truncate">{expense.description}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(expense)}
                        className="rounded-lg p-1.5 text-muted hover:text-danger hover:bg-[rgb(var(--danger))]/10 transition-colors"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} />)
            : expenses.length === 0
            ? <EmptyState icon={Filter} title="No expenses found" description="Try adjusting your filters or add a new expense." />
            : expenses.map((expense) => (
              <div key={expense._id} className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{formatDate(expense.date)}</span>
                  <span className="inline-flex rounded-lg bg-muted px-2 py-0.5 text-xs font-medium">
                    {expense.category}
                  </span>
                </div>
                <p className="text-sm text-foreground">{expense.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-bold text-foreground">{formatCurrency(expense.amount)}</span>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(expense)}
                    className="rounded-lg p-2 text-muted hover:text-danger hover:bg-[rgb(var(--danger))]/10 transition-colors"
                    aria-label="Delete expense"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {pagination && (
          <TablePagination
            pagination={pagination}
            onPageChange={(page) => updateFilters({ page })}
            onLimitChange={(limit) => updateFilters({ limit, page: 1 })}
          />
        )}

        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Expense"
        >
          <p className="text-sm text-muted mb-5">
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">{deleteTarget?.description}</span>{' '}
            ({deleteTarget && formatCurrency(deleteTarget.amount)})? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </Modal>
      </Card>
    </motion.section>
  );
};
