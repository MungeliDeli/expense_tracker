import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export const DashboardPage = () => (
  <motion.div
    className="flex min-h-[50vh] flex-col items-center justify-center text-center"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
  >
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted">
      <LayoutDashboard size={28} />
    </div>
    <h2 className="mt-5 text-xl font-bold text-foreground sm:text-2xl">Dashboard</h2>
    <p className="mt-2 max-w-sm text-sm text-muted">
      Coming soon — we&apos;ll build your main overview here.
    </p>
  </motion.div>
);
