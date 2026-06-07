import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface MotionCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  delay?: number;
  children: ReactNode;
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, hover = true, delay = 0, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={
        hover
          ? {
              y: -6,
              boxShadow: 'var(--shadow-lg)',
              transition: { duration: 0.25 },
            }
          : undefined
      }
      className={cn(
        'rounded-2xl border border-[rgba(var(--border),0.5)] card-shadow p-5',
        'bg-[rgba(var(--card),0.72)] backdrop-blur-xl',
        'transition-colors duration-500',
        className
      )}
      {...(props as object)}
    >
      {children}
    </motion.div>
  )
);

MotionCard.displayName = 'MotionCard';
