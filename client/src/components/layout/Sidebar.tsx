import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, PiggyBank, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLogo, APP_NAME } from '../AppLogo';
import { cn } from '../../lib/cn';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    accent: '--primary',
    description: 'Overview & analytics',
  },
  {
    to: '/expenses',
    label: 'Expenses',
    icon: Receipt,
    accent: '--danger',
    description: 'Track spending',
  },
  {
    to: '/income',
    label: 'Income',
    icon: Wallet,
    accent: '--success',
    description: 'Track earnings',
  },
  {
    to: '/savings',
    label: 'Savings',
    icon: PiggyBank,
    accent: '--primary',
    description: 'Save & grow',
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavItem = ({
  to,
  label,
  icon: Icon,
  accent,
  description,
  onNavigate,
}: (typeof navItems)[number] & { onNavigate?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink to={to} onClick={onNavigate} className="block">
      <motion.div
        className={cn(
          'group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors duration-300',
          isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
        )}
        whileHover={{ x: isActive ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
      >
        {isActive && (
          <>
            <motion.div
              layoutId="sidebar-active-bg"
              className="absolute inset-0 rounded-2xl border-2 bg-card"
              style={{ borderColor: `rgba(var(${accent}), 0.55)` }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
            <motion.div
              className="absolute left-0 top-1/2 h-9 w-1.5 -translate-y-1/2 rounded-r-full"
              style={{
                backgroundColor: `rgb(var(${accent}))`,
                boxShadow: `0 0 12px rgba(var(${accent}), 0.7)`,
              }}
              layoutId="sidebar-active-bar"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </>
        )}

        <div
          className={cn(
            'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300',
            isActive
              ? 'text-white'
              : 'bg-muted text-muted group-hover:text-foreground'
          )}
          style={
            isActive
              ? { backgroundColor: `rgb(var(${accent}))` }
              : undefined
          }
        >
          <Icon size={20} />
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <p className={cn('text-sm font-semibold leading-tight', isActive && 'text-foreground')}>
            {label}
          </p>
          <p className="text-[11px] leading-tight mt-0.5 text-muted">{description}</p>
        </div>

        {isActive && (
          <motion.div
            className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: `rgba(var(${accent}), 0.15)`,
              color: `rgb(var(${accent}))`,
            }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            ●
          </motion.div>
        )}
      </motion.div>
    </NavLink>
  );
};

const SidebarContent = ({
  onNavigate,
  showClose,
  onClose,
}: {
  onNavigate?: () => void;
  showClose?: boolean;
  onClose?: () => void;
}) => (
  <div className="flex h-full flex-col">
    <div className="relative mb-6 flex items-center justify-between gap-3 px-1">
      <div className="flex items-center gap-3 min-w-0">
        <AppLogo size="md" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{APP_NAME}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted">
            <Sparkles size={10} className="text-primary shrink-0" />
            Finance hub
          </p>
        </div>
      </div>
      {showClose && onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-muted hover:text-foreground hover:bg-[rgb(var(--border))] transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      )}
    </div>

    <nav className="flex-1 space-y-2 px-1">
      {navItems.map((item, i) => (
        <motion.div
          key={item.to}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 28 }}
        >
          <NavItem {...item} onNavigate={onNavigate} />
        </motion.div>
      ))}
    </nav>

    <div className="mt-auto px-1 pb-1">
      <div
        className="rounded-2xl border border-border bg-muted p-4"
      >
        <p className="text-xs font-medium text-foreground">Balance smarter</p>
        <p className="mt-1 text-[11px] text-muted">Track both sides of your money flow</p>
      </div>
    </div>
  </div>
);

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[260px] lg:flex-col">
        <div className="relative flex h-full flex-col border-r border-border bg-card px-4 py-6">
          <SidebarContent />
        </div>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-[rgba(var(--background),0.8)] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[70] flex w-[min(300px,85vw)] flex-col bg-card border-r border-border px-4 py-6 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent showClose onClose={onClose} onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
