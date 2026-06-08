import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface PageHeaderProps {
  title: string;
  description: string;
  onAdd: () => void;
  addLabel: string;
  accent?: 'primary' | 'success' | 'danger';
}

const accentStyles = {
  primary: 'bg-primary hover:opacity-90',
  success: 'bg-[rgb(var(--success))] hover:opacity-90',
  danger: 'bg-[rgb(var(--danger))] hover:opacity-90',
};

export const PageHeader = ({
  title,
  description,
  onAdd,
  addLabel,
  accent = 'primary',
}: PageHeaderProps) => (
  <div className="flex items-start justify-between gap-4">
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 }}
    >
      <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      <p className="text-sm text-muted mt-1">{description}</p>
    </motion.div>

    <motion.button
      type="button"
      onClick={onAdd}
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity sm:px-4',
        accentStyles[accent]
      )}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label={addLabel}
    >
      <Plus size={18} />
      <span className="hidden sm:inline">{addLabel}</span>
    </motion.button>
  </div>
);
