import { useState } from 'react';
import type { FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { savingsApi } from '../../lib/api';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import type { SavingsType, SavingsFormData } from '../../types';

interface SavingsFormProps {
  onSuccess: () => void;
  onClose?: () => void;
  inModal?: boolean;
}

const initialForm: SavingsFormData = {
  amount: '',
  type: 'deposit',
  description: '',
  date: format(new Date(), 'yyyy-MM-dd'),
};

export const SavingsForm = ({ onSuccess, onClose, inModal = false }: SavingsFormProps) => {
  const [form, setForm] = useState<SavingsFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<SavingsFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const validate = (): boolean => {
    const newErrors: Partial<SavingsFormData> = {};
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (!form.type) newErrors.type = 'Select a type' as SavingsFormData['type'];
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
      await savingsApi.create({
        amount: parseFloat(form.amount),
        type: form.type as SavingsType,
        description: form.description.trim(),
        date: form.date,
      });
      addToast(
        form.type === 'deposit' ? 'Savings deposit added' : 'Withdrawal recorded',
        'success',
      );
      setForm({ ...initialForm, date: format(new Date(), 'yyyy-MM-dd') });
      setErrors({});
      onSuccess();
      onClose?.();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save entry', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: keyof SavingsFormData, value: string) => {
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
        label="Type"
        value={form.type}
        onChange={(e) => update('type', e.target.value)}
        error={errors.type}
        options={[
          { value: 'deposit', label: 'Deposit (add to savings)' },
          { value: 'withdrawal', label: 'Withdrawal' },
        ]}
      />

      <Input
        label="Description"
        placeholder="What is this for?"
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
          {form.type === 'withdrawal' ? 'Record Withdrawal' : 'Add to Savings'}
        </Button>
      </div>
    </form>
  );

  if (inModal) return formContent;

  return (
    <Card className="animate-fade-up">
      <div className="mb-5 flex items-center gap-2">
        <PlusCircle size={20} className="text-primary" />
        <h3 className="text-base font-semibold text-foreground sm:text-lg">Add Savings</h3>
      </div>
      {formContent}
    </Card>
  );
};
