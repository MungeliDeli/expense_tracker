import type { RGB, ThemeTokens } from './themes';

export const rgbToCss = ([r, g, b]: RGB): string => `${r} ${g} ${b}`;

const setThemeColorMeta = (rgb: RGB): void => {
  const content = `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', content);
};

const TOKEN_KEYS: (keyof ThemeTokens)[] = [
  'primary', 'primaryLight', 'primaryDark', 'background', 'backgroundSecondary',
  'foreground', 'card', 'cardForeground', 'accent', 'border', 'muted', 'mutedBg',
  'success', 'warning', 'danger', 'glowColor', 'particleColor',
  'blob1', 'blob2', 'blob3', 'glass',
];

const CSS_MAP: Record<keyof ThemeTokens, string> = {
  primary: '--primary',
  primaryLight: '--primary-light',
  primaryDark: '--primary-dark',
  background: '--background',
  backgroundSecondary: '--background-secondary',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  accent: '--accent',
  border: '--border',
  muted: '--muted',
  mutedBg: '--muted-bg',
  success: '--success',
  warning: '--warning',
  danger: '--danger',
  glowColor: '--glow-color',
  particleColor: '--particle-color',
  blob1: '--blob-1',
  blob2: '--blob-2',
  blob3: '--blob-3',
  glass: '--glass',
  glassOpacity: '--glass-opacity',
};

export const applyThemeTokens = (tokens: ThemeTokens, themeId?: string): void => {
  const root = document.documentElement;

  for (const key of TOKEN_KEYS) {
    const value = tokens[key];
    if (Array.isArray(value)) {
      root.style.setProperty(CSS_MAP[key], rgbToCss(value));
    }
  }

  root.style.setProperty('--glass-opacity', String(tokens.glassOpacity));
  root.style.setProperty(
    '--shadow',
    `0 4px 24px rgba(${rgbToCss(tokens.background)}, 0.4)`
  );
  root.style.setProperty(
    '--shadow-lg',
    `0 12px 40px rgba(${rgbToCss(tokens.glowColor)}, 0.25)`
  );

  setThemeColorMeta(tokens.background);

  if (themeId) {
    root.setAttribute('data-theme-id', themeId);
  }
};

export const readThemeTokensFromDOM = (): ThemeTokens => {
  const style = getComputedStyle(document.documentElement);
  const parse = (name: string): RGB => {
    const parts = style.getPropertyValue(name).trim().split(' ').map(Number);
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  };

  return {
    primary: parse('--primary'),
    primaryLight: parse('--primary-light'),
    primaryDark: parse('--primary-dark'),
    background: parse('--background'),
    backgroundSecondary: parse('--background-secondary'),
    foreground: parse('--foreground'),
    card: parse('--card'),
    cardForeground: parse('--card-foreground'),
    accent: parse('--accent'),
    border: parse('--border'),
    muted: parse('--muted'),
    mutedBg: parse('--muted-bg'),
    success: parse('--success'),
    warning: parse('--warning'),
    danger: parse('--danger'),
    glowColor: parse('--glow-color'),
    particleColor: parse('--particle-color'),
    blob1: parse('--blob-1'),
    blob2: parse('--blob-2'),
    blob3: parse('--blob-3'),
    glass: parse('--glass'),
    glassOpacity: parseFloat(style.getPropertyValue('--glass-opacity')) || 0.65,
  };
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const lerpRgb = (from: RGB, to: RGB, t: number): RGB => [
  Math.round(lerp(from[0], to[0], t)),
  Math.round(lerp(from[1], to[1], t)),
  Math.round(lerp(from[2], to[2], t)),
];

export const interpolateTokens = (from: ThemeTokens, to: ThemeTokens, t: number): ThemeTokens => ({
  primary: lerpRgb(from.primary, to.primary, t),
  primaryLight: lerpRgb(from.primaryLight, to.primaryLight, t),
  primaryDark: lerpRgb(from.primaryDark, to.primaryDark, t),
  background: lerpRgb(from.background, to.background, t),
  backgroundSecondary: lerpRgb(from.backgroundSecondary, to.backgroundSecondary, t),
  foreground: lerpRgb(from.foreground, to.foreground, t),
  card: lerpRgb(from.card, to.card, t),
  cardForeground: lerpRgb(from.cardForeground, to.cardForeground, t),
  accent: lerpRgb(from.accent, to.accent, t),
  border: lerpRgb(from.border, to.border, t),
  muted: lerpRgb(from.muted, to.muted, t),
  mutedBg: lerpRgb(from.mutedBg, to.mutedBg, t),
  success: lerpRgb(from.success, to.success, t),
  warning: lerpRgb(from.warning, to.warning, t),
  danger: lerpRgb(from.danger, to.danger, t),
  glowColor: lerpRgb(from.glowColor, to.glowColor, t),
  particleColor: lerpRgb(from.particleColor, to.particleColor, t),
  blob1: lerpRgb(from.blob1, to.blob1, t),
  blob2: lerpRgb(from.blob2, to.blob2, t),
  blob3: lerpRgb(from.blob3, to.blob3, t),
  glass: lerpRgb(from.glass, to.glass, t),
  glassOpacity: lerp(from.glassOpacity, to.glassOpacity, t),
});

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

let animationFrame: number | null = null;

export const animateThemeTransition = (
  to: ThemeTokens,
  themeId: string,
  duration = 1400
): Promise<void> =>
  new Promise((resolve) => {
    if (animationFrame) cancelAnimationFrame(animationFrame);

    const from = readThemeTokensFromDOM();
    const start = performance.now();

    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);

      applyThemeTokens(interpolateTokens(from, to, eased), themeId);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(frame);
      } else {
        animationFrame = null;
        resolve();
      }
    };

    animationFrame = requestAnimationFrame(frame);
  });
