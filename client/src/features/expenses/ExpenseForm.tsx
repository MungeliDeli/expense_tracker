import { useState } from 'react';
import type { FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { expensesApi } from '../../lib/api';
import { CATEGORIES, EXPENSE_TYPES } from '../../lib/constants';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import type { ExpenseCategory, ExpenseFormData, ExpenseType } from '../../types';

interface ExpenseFormProps {
  onSuccess: () => void;
  onClose?: () => void;
  inModal?: boolean;
}

const initialForm: ExpenseFormData = {
  amount: '',
  category: '',
  expenseType: 'day-to-day',
  description: '',
  date: format(new Date(), 'yyyy-MM-dd'),
};

export const ExpenseForm = ({ onSuccess, onClose, inModal = false }: ExpenseFormProps) => {
  const [form, setForm] = useState<ExpenseFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const validate = (): boolean => {
    const newErrors: Partial<ExpenseFormData> = {};
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (!form.category) newErrors.category = 'Select a category' as ExpenseFormData['category'];
    if (!form.expenseType) newErrors.expenseType = 'Select expense type' as ExpenseFormData['expenseType'];
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await expensesApi.create({
        amount: parseFloat(form.amount),
        category: form.category as ExpenseCategory,
        expenseType: form.expenseType as ExpenseType,
        description: form.description.trim(),
        date: form.date,
      });
      addToast('Expense added successfully', 'success');
      setForm({ ...initialForm, date: format(new Date(), 'yyyy-MM-dd') });
      setErrors({});
      onSuccess();
      onClose?.();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to add expense', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: keyof ExpenseFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Select
        label="Expense Type"
        value={form.expenseType}
        onChange={(e) => update('expenseType', e.target.value)}
        error={errors.expenseType}
        className="sm:col-span-2"
        options={[
          { value: '', label: 'Select type' },
          ...EXPENSE_TYPES.map((t) => ({ value: t.value, label: t.label })),
        ]}
      />

      {form.expenseType && (
        <p className="sm:col-span-2 -mt-2 text-xs text-muted">
          {EXPENSE_TYPES.find((t) => t.value === form.expenseType)?.description}
        </p>
      )}

      <Input
        label="Amount (ZMW)"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        value={form.amount}
        onChange={(e) => update('amount', e.target.value)}
        error={errors.amount}
      />

      <Select
        label="Category"
        value={form.category}
        onChange={(e) => update('category', e.target.value)}
        error={errors.category}
        options={[
          { value: '', label: 'Select category' },
          ...CATEGORIES.map((c) => ({ value: c, label: c })),
        ]}
      />

      <Input
        label="Description"
        placeholder="What was this expense for?"
        value={form.description}
        onChange={(e) => update('description', e.target.value)}
        error={errors.description}
        className="sm:col-span-2"
      />

      <Input
        label="Date"
        type="date"
        value={form.date}
        onChange={(e) => update('date', e.target.value)}
        error={errors.date}
      />

      <div className="flex items-end gap-3 sm:col-span-2">
        {inModal && onClose && (
          <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          <PlusCircle size={18} />
          Add Expense
        </Button>
      </div>
    </form>
  );

  if (inModal) return formContent;

  return (
    <Card className="animate-fade-up">
      <div className="mb-5 flex items-center gap-2">
        <PlusCircle size={20} className="text-primary" />
        <h3 className="text-base font-semibold text-foreground sm:text-lg">Add Expense</h3>
      </div>
      {formContent}
    </Card>
  );
};
