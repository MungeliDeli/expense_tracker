import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, onMouseMove, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white shadow-sm',
      secondary: 'bg-muted text-foreground border border-border',
      danger: 'bg-[rgb(var(--danger))] text-white',
      ghost: 'text-muted hover:text-foreground hover:bg-muted',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      onMouseMove?.(e);
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          'btn-glow inline-flex items-center justify-center gap-2 rounded-xl font-medium',
          'transition-colors duration-500',
          'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as object)}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading...
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
