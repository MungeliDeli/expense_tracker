import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { formatCurrency } from '../../lib/format';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export const AnimatedCounter = ({ value, className }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const controls = animate(prevValue.current, value, {
      duration: 1.4,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => {
        node.textContent = formatCurrency(v);
      },
    });

    prevValue.current = value;
    return controls.stop;
  }, [value]);

  return <span ref={ref} className={className}>{formatCurrency(0)}</span>;
};
