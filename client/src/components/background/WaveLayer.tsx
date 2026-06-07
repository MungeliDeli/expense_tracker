import { motion } from 'framer-motion';

export const WaveLayer = () => (
  <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
    <motion.svg
      viewBox="0 0 1440 320"
      className="absolute bottom-0 w-[200%]"
      preserveAspectRatio="none"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <path
        fill="rgba(var(--primary), 0.18)"
        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </motion.svg>
    <motion.svg
      viewBox="0 0 1440 320"
      className="absolute bottom-0 w-[200%]"
      preserveAspectRatio="none"
      animate={{ x: ['-50%', '0%'] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <path
        fill="rgba(var(--accent), 0.14)"
        d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </motion.svg>
    <motion.svg
      viewBox="0 0 1440 320"
      className="absolute bottom-0 w-[200%]"
      preserveAspectRatio="none"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <path
        fill="rgba(var(--glow-color), 0.1)"
        d="M0,288L60,272C120,256,240,224,360,213.3C480,203,600,213,720,229.3C840,245,960,267,1080,261.3C1200,256,1320,224,1380,208L1440,192L1440,320L0,320Z"
      />
    </motion.svg>
  </div>
);
