import { useState } from 'react';
import type { FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { incomeApi } from '../../lib/api';
import { INCOME_SOURCES } from '../../lib/constants';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import type { IncomeSource, IncomeFormData } from '../../types';

interface IncomeFormProps {
  onSuccess: () => void;
  onClose?: () => void;
  inModal?: boolean;
}

const initialForm: IncomeFormData = {
  amount: '',
  source: '',
  description: '',
  date: format(new Date(), 'yyyy-MM-dd'),
};

export const IncomeForm = ({ onSuccess, onClose, inModal = false }: IncomeFormProps) => {
  const [form, setForm] = useState<IncomeFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<IncomeFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const validate = (): boolean => {
    const newErrors: Partial<IncomeFormData> = {};
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (!form.source) newErrors.source = 'Select a source' as IncomeFormData['source'];
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
      await incomeApi.create({
        amount: parseFloat(form.amount),
        source: form.source as IncomeSource,
        description: form.description.trim(),
        date: form.date,
      });
      addToast('Income added successfully', 'success');
      setForm({ ...initialForm, date: format(new Date(), 'yyyy-MM-dd') });
      setErrors({});
      onSuccess();
      onClose?.();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to add income', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: keyof IncomeFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const formContent = (
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
        label="Source"
        value={form.source}
        onChange={(e) => update('source', e.target.value)}
        error={errors.source}
        options={[
          { value: '', label: 'Select source' },
          ...INCOME_SOURCES.map((s) => ({ value: s, label: s })),
        ]}
      />

      <Input
        label="Description"
        placeholder="Where did this income come from?"
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
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto bg-[rgb(var(--success))] hover:opacity-90">
          <PlusCircle size={18} />
          Add Income
        </Button>
      </div>
    </form>
  );

  if (inModal) return formContent;

  return (
    <Card className="animate-fade-up">
      <div className="mb-5 flex items-center gap-2">
        <PlusCircle size={20} className="text-success" />
        <h3 className="text-base font-semibold text-foreground sm:text-lg">Add Income</h3>
      </div>
      {formContent}
    </Card>
  );
};
