import { useState } from 'react';
import type { FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { expensesApi } from '../../lib/api';
import { CATEGORIES } from '../../lib/constants';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import type { ExpenseCategory, ExpenseFormData } from '../../types';

interface ExpenseFormProps {
  onSuccess: () => void;
}

const initialForm: ExpenseFormData = {
  amount: '',
  category: '',
  description: '',
  date: format(new Date(), 'yyyy-MM-dd'),
};

export const ExpenseForm = ({ onSuccess }: ExpenseFormProps) => {
  const [form, setForm] = useState<ExpenseFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const validate = (): boolean => {
    const newErrors: Partial<ExpenseFormData> = {};
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (!form.category) newErrors.category = 'Select a category' as ExpenseFormData['category'];
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
        description: form.description.trim(),
        date: form.date,
      });
      addToast('Expense added successfully', 'success');
      setForm({ ...initialForm, date: format(new Date(), 'yyyy-MM-dd') });
      setErrors({});
      onSuccess();
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

  return (
    <Card className="animate-fade-up">
      <div className="mb-5 flex items-center gap-2">
        <PlusCircle size={20} className="text-primary" />
        <h3 className="text-base font-semibold text-foreground sm:text-lg">Add Expense</h3>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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

        <div className="flex items-end sm:col-span-2">
          <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
            <PlusCircle size={18} />
            Add Expense
          </Button>
        </div>
      </form>
    </Card>
  );
};
