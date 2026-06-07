import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToastStore } from '../store/toastStore';
import type { ToastType } from '../types';

const icons: Record<ToastType, typeof Info> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-primary',
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className="toast-enter flex items-center gap-3 rounded-xl border border-border bg-card card-shadow px-4 py-3"
          >
            <Icon size={18} className={colors[toast.type]} />
            <p className="flex-1 text-sm text-foreground">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
