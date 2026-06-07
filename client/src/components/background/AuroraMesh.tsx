import { motion } from 'framer-motion';

export const AuroraMesh = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Rotating conic aurora */}
    <motion.div
      className="absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2"
      style={{
        background: `conic-gradient(
          from 0deg,
          rgba(var(--blob-1), 0.55) 0deg,
          rgba(var(--accent), 0.45) 72deg,
          rgba(var(--blob-2), 0.5) 144deg,
          rgba(var(--blob-3), 0.55) 216deg,
          rgba(var(--glow-color), 0.4) 288deg,
          rgba(var(--blob-1), 0.55) 360deg
        )`,
        filter: 'blur(90px)',
      }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
    />

    {/* Counter-rotating secondary aurora */}
    <motion.div
      className="absolute left-[30%] top-[20%] h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2"
      style={{
        background: `radial-gradient(circle,
          rgba(var(--accent), 0.5) 0%,
          rgba(var(--primary), 0.35) 35%,
          transparent 65%
        )`,
        filter: 'blur(60px)',
      }}
      animate={{
        x: [0, 80, -40, 60, 0],
        y: [0, -60, 40, -30, 0],
        scale: [1, 1.2, 0.9, 1.15, 1],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    />

    <motion.div
      className="absolute right-[10%] bottom-[10%] h-[70vmax] w-[70vmax]"
      style={{
        background: `radial-gradient(circle,
          rgba(var(--blob-3), 0.45) 0%,
          rgba(var(--blob-2), 0.3) 40%,
          transparent 70%
        )`,
        filter: 'blur(70px)',
      }}
      animate={{
        x: [0, -70, 30, -50, 0],
        y: [0, 50, -40, 30, 0],
        scale: [1, 0.85, 1.25, 0.95, 1],
      }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);
