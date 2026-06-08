import { LogOut, Menu } from 'lucide-react';
import { AppLogo, APP_NAME } from '../AppLogo';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { ThemeSettings } from '../ThemeSettings';
import { Button } from '../ui/Button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
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
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:text-foreground hover:bg-muted transition-colors lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 lg:hidden">
            <AppLogo size="sm" />
            <h1 className="text-base font-bold text-foreground">{APP_NAME}</h1>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-muted">Welcome back</p>
            <p className="text-xs text-muted/80">Manage your finances</p>
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
