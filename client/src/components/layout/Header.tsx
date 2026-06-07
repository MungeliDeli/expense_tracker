import { LogOut, Wallet } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { ThemeSettings } from '../ThemeSettings';
import { Button } from '../ui/Button';

export const Header = () => {
  const logout = useAuthStore((s) => s.logout);
  const addToast = useToastStore((s) => s.addToast);

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Logged out successfully', 'success');
    } catch {
      addToast('Logout failed', 'error');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(var(--border),0.4)] glass backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Wallet size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground sm:text-lg">Expense Tracker</h1>
            <p className="text-xs text-muted hidden sm:block">Personal finance dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSettings />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:inline-flex">
            <LogOut size={16} />
            Logout
          </Button>
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:text-foreground hover:bg-muted transition-colors sm:hidden"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
