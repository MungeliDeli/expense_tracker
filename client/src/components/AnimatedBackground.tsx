import { motion } from 'framer-motion';
import { AuroraMesh } from './background/AuroraMesh';
import { ParticleCanvas } from './background/ParticleCanvas';
import { FloatingShapes } from './background/FloatingShapes';
import { WaveLayer } from './background/WaveLayer';

export const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
    {/* Deep base gradient — never flat */}
    <div
      className="absolute inset-0"
      style={{
        background: `
          linear-gradient(145deg,
            rgb(var(--background)) 0%,
            rgb(var(--background-secondary)) 40%,
            rgb(var(--background)) 100%
          )
        `,
      }}
    />

    {/* Aurora mesh — primary color drama */}
    <AuroraMesh />

    {/* Large morphing glow orbs */}
    <motion.div
      className="absolute -top-48 -left-48 h-[36rem] w-[36rem] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(var(--blob-1), 0.55) 0%, rgba(var(--blob-1), 0.2) 40%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      animate={{
        x: [0, 80, 30, 100, 0],
        y: [0, 50, 100, 30, 0],
        scale: [1, 1.2, 0.9, 1.15, 1],
      }}
      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute top-[15%] -right-40 h-[32rem] w-[32rem] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(var(--blob-2), 0.5) 0%, rgba(var(--accent), 0.25) 45%, transparent 70%)',
        filter: 'blur(50px)',
      }}
      animate={{
        x: [0, -60, -20, -80, 0],
        y: [0, 70, -40, 50, 0],
        scale: [1, 0.85, 1.2, 0.95, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute -bottom-40 left-[20%] h-[28rem] w-[28rem] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(var(--blob-3), 0.5) 0%, rgba(var(--glow-color), 0.2) 50%, transparent 75%)',
        filter: 'blur(45px)',
      }}
      animate={{
        x: [0, 50, -35, 70, 0],
        y: [0, -50, 35, -25, 0],
        scale: [1, 1.1, 0.88, 1.15, 1],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Particle network with mouse interaction */}
    <ParticleCanvas />

    {/* Geometric shapes + finance icons */}
    <FloatingShapes />

    {/* Glass depth panels */}
    <motion.div
      className="absolute top-[18%] right-[15%] h-40 w-40 rounded-3xl"
      style={{
        background: 'rgba(var(--glass), 0.12)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(var(--glow-color), 0.2)',
        boxShadow: '0 0 60px rgba(var(--glow-color), 0.15)',
      }}
      animate={{ rotate: [0, 6, -4, 0], y: [0, -20, 10, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-[35%] left-[8%] h-28 w-28 rounded-2xl"
      style={{
        background: 'rgba(var(--glass), 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(var(--accent), 0.25)',
        boxShadow: '0 0 40px rgba(var(--accent), 0.12)',
      }}
      animate={{ rotate: [0, -10, 5, 0], x: [0, 15, -10, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Animated waves */}
    <WaveLayer />

    {/* Dot grid — visible depth */}
    <motion.div
      className="absolute inset-0"
      animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      style={{
        opacity: 0.07,
        backgroundImage: 'radial-gradient(rgba(var(--glow-color), 0.8) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />

    {/* Moving light beams */}
    <motion.div
      className="absolute top-0 left-0 h-full w-1/3"
      style={{
        background: 'linear-gradient(105deg, transparent 40%, rgba(var(--glow-color), 0.06) 50%, transparent 60%)',
      }}
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
    />

    {/* Top spotlight */}
    <motion.div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48"
      style={{
        background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(var(--glow-color), 0.25) 0%, transparent 70%)',
      }}
      animate={{ opacity: [0.4, 0.7, 0.5, 0.65, 0.4] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Vignette for depth */}
    <div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(var(--background), 0.5) 100%)',
      }}
    />
  </div>
);
