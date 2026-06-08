import { useState } from 'react';
import { Palette, RotateCcw, Sparkles, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { THEMES } from '../lib/themes';
import { rgbToCss } from '../lib/themeUtils';
import { cn } from '../lib/cn';

const INTERVAL_OPTIONS = [
  { label: '30s', value: 30_000 },
  { label: '60s', value: 60_000 },
  { label: '90s', value: 90_000 },
  { label: '2min', value: 120_000 },
  { label: '5min', value: 300_000 },
];

export const ThemeSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    activeThemeId,
    autoRotate,
    rotationInterval,
    isTransitioning,
    selectTheme,
    setAutoRotate,
    setRotationInterval,
    enableAutoMode,
  } = useThemeStore();

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Theme settings"
      >
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))`,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <Palette size={18} className="relative z-10" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg rounded-2xl border border-border bg-card card-shadow-lg overflow-hidden sm:inset-x-auto sm:right-6 sm:left-auto sm:top-20 sm:w-96"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" />
                  <h2 className="font-semibold text-foreground">Theme Engine</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-muted hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Auto rotation toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto Rotation</p>
                    <p className="text-xs text-muted">Cycle themes automatically</p>
                  </div>
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={cn(
                      'relative h-7 w-12 rounded-full transition-colors duration-300',
                      autoRotate ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <motion.div
                      className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
                      animate={{ left: autoRotate ? '22px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Rotation speed */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Rotation Speed</p>
                  <div className="flex flex-wrap gap-2">
                    {INTERVAL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setRotationInterval(opt.value)}
                        className={cn(
                          'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300',
                          rotationInterval === opt.value
                            ? 'bg-primary text-white'
                            : 'bg-muted text-muted hover:text-foreground'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Return to auto */}
                {!autoRotate && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onClick={enableAutoMode}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted py-2.5 text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
                  >
                    <RotateCcw size={16} />
                    Return to Auto Mode
                  </motion.button>
                )}

                {/* Theme grid */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Themes ({THEMES.length})
                    {isTransitioning && (
                      <span className="ml-2 text-xs text-muted animate-pulse">Transitioning...</span>
                    )}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {THEMES.map((theme) => {
                      const isActive = theme.id === activeThemeId;
                      return (
                        <motion.button
                          key={theme.id}
                          onClick={() => selectTheme(theme.id)}
                          disabled={isTransitioning}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            'relative flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all duration-300',
                            isActive
                              ? 'border-[rgb(var(--primary))] ring-2 ring-[rgb(var(--primary))]/30'
                              : 'border-border hover:border-[rgb(var(--primary))]/50'
                          )}
                        >
                          <div className="flex gap-0.5">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ background: `rgb(${rgbToCss(theme.tokens.primary)})` }}
                            />
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ background: `rgb(${rgbToCss(theme.tokens.accent)})` }}
                            />
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ background: `rgb(${rgbToCss(theme.tokens.background)})` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-foreground leading-tight text-center">
                            {theme.name}
                          </span>
                          {isActive && (
                            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                              <Check size={10} />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
