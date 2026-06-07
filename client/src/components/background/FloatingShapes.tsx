import { motion } from 'framer-motion';
import { Coins, TrendingUp, Wallet, PiggyBank, CreditCard, CircleDollarSign, BarChart2, Landmark } from 'lucide-react';

const shapes = [
  { type: 'circle', size: 160, top: '6%', left: '3%', delay: 0 },
  { type: 'ring', size: 120, top: '65%', left: '5%', delay: 1 },
  { type: 'triangle', size: 90, top: '20%', right: '5%', delay: 0.5 },
  { type: 'hexagon', size: 80, top: '50%', right: '8%', delay: 1.5 },
  { type: 'circle', size: 70, top: '82%', right: '20%', delay: 2 },
  { type: 'ring', size: 140, top: '35%', left: '35%', delay: 0.8 },
  { type: 'diamond', size: 60, top: '75%', left: '25%', delay: 1.2 },
  { type: 'hexagon', size: 55, top: '10%', left: '55%', delay: 2.5 },
] as const;

const financeIcons = [
  { Icon: Wallet, top: '10%', left: '72%', size: 36, delay: 0 },
  { Icon: Coins, top: '60%', left: '88%', size: 32, delay: 1.2 },
  { Icon: TrendingUp, top: '28%', left: '12%', size: 30, delay: 0.6 },
  { Icon: PiggyBank, top: '75%', left: '50%', size: 34, delay: 1.8 },
  { Icon: CreditCard, top: '42%', left: '92%', size: 28, delay: 2.2 },
  { Icon: CircleDollarSign, top: '15%', left: '42%', size: 30, delay: 0.3 },
  { Icon: BarChart2, top: '88%', left: '70%', size: 28, delay: 1.5 },
  { Icon: Landmark, top: '48%', left: '3%', size: 32, delay: 2.8 },
];

const ShapeElement = ({ type, size }: { type: string; size: number }) => {
  const style = { width: size, height: size };

  if (type === 'circle') {
    return (
      <div
        className="rounded-full"
        style={{
          ...style,
          background: 'radial-gradient(circle at 35% 35%, rgba(var(--glow-color),0.35) 0%, rgba(var(--primary),0.12) 50%, transparent 75%)',
          border: '1px solid rgba(var(--glow-color), 0.35)',
          boxShadow: '0 0 60px rgba(var(--glow-color), 0.3), inset 0 0 30px rgba(var(--accent), 0.1)',
        }}
      />
    );
  }

  if (type === 'ring') {
    return (
      <div
        className="rounded-full"
        style={{
          ...style,
          border: '2px solid rgba(var(--accent), 0.45)',
          boxShadow: '0 0 50px rgba(var(--accent), 0.25), inset 0 0 25px rgba(var(--accent), 0.15)',
        }}
      />
    );
  }

  if (type === 'triangle') {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid rgba(var(--primary), 0.25)`,
          filter: 'drop-shadow(0 0 20px rgba(var(--glow-color), 0.4))',
        }}
      />
    );
  }

  if (type === 'diamond') {
    return (
      <div
        style={{
          ...style,
          background: 'rgba(var(--accent), 0.15)',
          transform: 'rotate(45deg)',
          border: '1px solid rgba(var(--accent), 0.4)',
          boxShadow: '0 0 40px rgba(var(--accent), 0.2)',
        }}
      />
    );
  }

  return (
    <div
      style={{
        ...style,
        background: 'rgba(var(--primary), 0.18)',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        border: '1px solid rgba(var(--accent), 0.35)',
        boxShadow: '0 0 35px rgba(var(--glow-color), 0.2)',
      }}
    />
  );
};

export const FloatingShapes = () => (
  <>
    {shapes.map((shape, i) => (
      <motion.div
        key={i}
        className="absolute pointer-events-none"
        style={{
          top: shape.top,
          left: 'left' in shape ? shape.left : undefined,
          right: 'right' in shape ? shape.right : undefined,
        }}
        animate={{
          y: [0, -35, 15, -25, 0],
          x: [0, 20, -15, 12, 0],
          rotate: [0, 120, 240, 360],
          scale: [1, 1.12, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 14 + i * 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: shape.delay,
        }}
      >
        <ShapeElement type={shape.type} size={shape.size} />
      </motion.div>
    ))}

    {financeIcons.map(({ Icon, top, left, size, delay }, i) => (
      <motion.div
        key={`icon-${i}`}
        className="absolute pointer-events-none"
        style={{
          top,
          left,
          color: 'rgba(var(--particle-color), 0.35)',
          filter: 'drop-shadow(0 0 8px rgba(var(--glow-color), 0.4))',
        }}
        animate={{
          y: [0, -25, 8, -18, 0],
          rotate: [0, 8, -6, 4, 0],
          opacity: [0.25, 0.45, 0.3, 0.4, 0.25],
        }}
        transition={{
          duration: 12 + i,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
      >
        <Icon size={size} strokeWidth={1.5} />
      </motion.div>
    ))}
  </>
);
