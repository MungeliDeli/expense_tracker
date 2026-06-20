import { useState, useEffect } from 'react';
import { Search, Filter, Trash2, ArrowUpDown, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';
import { savingsApi } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/format';
import { useSavings } from '../../hooks/useSavings';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { TablePagination } from '../../components/ui/TablePagination';
import type { SavingsEntry } from '../../types';

interface SavingsTableProps {
  refreshKey: number;
  onMutate: () => void;
}

export const SavingsTable = ({ refreshKey, onMutate }: SavingsTableProps) => {
  const { savings, pagination, filters, isLoading, error, updateFilters, refetch } = useSavings();
  const [deleteTarget, setDeleteTarget] = useState<SavingsEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (refreshKey > 0) refetch();
  }, [refreshKey, refetch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await savingsApi.delete(deleteTarget._id);
      addToast('Savings entry deleted', 'success');
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PiggyBank size={20} className="text-primary" />
            <div>
              <h3 className="text-base font-semibold text-foreground sm:text-lg">Savings Records</h3>
              <p className="text-xs text-muted mt-0.5">All deposits and withdrawals</p>
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
              placeholder="Search savings..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-9"
            />
          </div>

          <Select
            label="Type"
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value })}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'deposit', label: 'Deposits' },
              { value: 'withdrawal', label: 'Withdrawals' },
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
                <th className="px-4 py-3 text-left font-medium text-muted">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Description</th>
                <th className="px-4 py-3 text-right font-medium text-muted">
                  <button type="button" onClick={() => toggleSort('amount')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                    Amount <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={5}><TableRowSkeleton /></td></tr>
                  ))
                : savings.length === 0
                ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState icon={Filter} title="No savings found" description="Add a deposit to start building your savings." />
                    </td>
                  </tr>
                )
                : savings.map((entry) => (
                  <tr key={entry._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-foreground">{formatDate(entry.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${
                        entry.type === 'deposit'
                          ? 'bg-[rgba(var(--success),0.12)] text-success'
                          : 'bg-[rgba(var(--danger),0.12)] text-danger'
                      }`}>
                        {entry.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-xs truncate">{entry.description}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${
                      entry.type === 'deposit' ? 'text-success' : 'text-danger'
                    }`}>
                      {entry.type === 'withdrawal' ? '−' : '+'}{formatCurrency(entry.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(entry)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted hover:text-danger hover:bg-[rgb(var(--danger))]/10 transition-colors"
                        aria-label="Delete entry"
                      >
                        <Trash2 size={14} />
                        Delete
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
            : savings.length === 0
            ? <EmptyState icon={Filter} title="No savings found" description="Add a deposit to start building your savings." />
            : savings.map((entry) => (
              <div key={entry._id} className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{formatDate(entry.date)}</span>
                  <span className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-medium ${
                    entry.type === 'deposit'
                      ? 'bg-[rgba(var(--success),0.12)] text-success'
                      : 'bg-[rgba(var(--danger),0.12)] text-danger'
                  }`}>
                    {entry.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </span>
                </div>
                <p className="text-sm text-foreground">{entry.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className={`text-base font-bold ${entry.type === 'deposit' ? 'text-success' : 'text-danger'}`}>
                    {entry.type === 'withdrawal' ? '−' : '+'}{formatCurrency(entry.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(entry)}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted hover:text-danger hover:bg-[rgb(var(--danger))]/10 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
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

        <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Entry">
          <p className="text-sm text-muted mb-5">
            Delete <span className="font-medium text-foreground">{deleteTarget?.description}</span>{' '}
            ({deleteTarget && formatCurrency(deleteTarget.amount)})?
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
