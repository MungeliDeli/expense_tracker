import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="relative mb-6 flex gap-2 rounded-2xl border border-[rgba(var(--border),0.5)] bg-[rgba(var(--card),0.65)] backdrop-blur-xl p-1.5 card-shadow">
      {links.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;
        return (
          <NavLink
            key={to}
            to={to}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-500 z-10',
              isActive ? 'text-white' : 'text-muted hover:text-foreground'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 rounded-xl bg-primary shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={18} className="relative z-10" />
            <span className="relative z-10">{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
