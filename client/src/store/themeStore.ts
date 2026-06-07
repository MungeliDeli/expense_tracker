import { create } from 'zustand';
import { THEMES, DEFAULT_THEME_ID, getThemeById } from '../lib/themes';
import { applyThemeTokens, animateThemeTransition } from '../lib/themeUtils';

const STORAGE_KEY = 'theme-engine';

interface ThemeEngineState {
  activeThemeId: string;
  autoRotate: boolean;
  rotationInterval: number;
  isTransitioning: boolean;
  rotationTimer: ReturnType<typeof setInterval> | null;

  init: () => void;
  selectTheme: (id: string) => Promise<void>;
  nextTheme: () => Promise<void>;
  setAutoRotate: (enabled: boolean) => void;
  setRotationInterval: (ms: number) => void;
  enableAutoMode: () => void;
  startRotation: () => void;
  stopRotation: () => void;
}

interface PersistedSettings {
  activeThemeId: string;
  autoRotate: boolean;
  rotationInterval: number;
}

const loadSettings = (): PersistedSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* use defaults */ }
  return {
    activeThemeId: DEFAULT_THEME_ID,
    autoRotate: true,
    rotationInterval: 60_000,
  };
};

const saveSettings = (state: Pick<ThemeEngineState, 'activeThemeId' | 'autoRotate' | 'rotationInterval'>) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      activeThemeId: state.activeThemeId,
      autoRotate: state.autoRotate,
      rotationInterval: state.rotationInterval,
    })
  );
};

export const useThemeStore = create<ThemeEngineState>((set, get) => ({
  activeThemeId: DEFAULT_THEME_ID,
  autoRotate: true,
  rotationInterval: 60_000,
  isTransitioning: false,
  rotationTimer: null,

  init: () => {
    const settings = loadSettings();
    const theme = getThemeById(settings.activeThemeId);
    applyThemeTokens(theme.tokens, theme.id);
    set({
      activeThemeId: theme.id,
      autoRotate: settings.autoRotate,
      rotationInterval: settings.rotationInterval,
    });
    if (settings.autoRotate) get().startRotation();
  },

  selectTheme: async (id: string) => {
    const { isTransitioning, stopRotation } = get();
    if (isTransitioning || id === get().activeThemeId) return;

    stopRotation();
    const theme = getThemeById(id);
    set({ isTransitioning: true, activeThemeId: id, autoRotate: false });
    saveSettings({ ...get(), activeThemeId: id, autoRotate: false });

    await animateThemeTransition(theme.tokens, theme.id);
    set({ isTransitioning: false });
  },

  nextTheme: async () => {
    const { activeThemeId, isTransitioning } = get();
    if (isTransitioning) return;

    const currentIndex = THEMES.findIndex((t) => t.id === activeThemeId);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const next = THEMES[nextIndex];

    set({ isTransitioning: true, activeThemeId: next.id });
    saveSettings(get());

    await animateThemeTransition(next.tokens, next.id);
    set({ isTransitioning: false });
  },

  setAutoRotate: (enabled: boolean) => {
    set({ autoRotate: enabled });
    saveSettings(get());
    if (enabled) get().startRotation();
    else get().stopRotation();
  },

  setRotationInterval: (ms: number) => {
    const clamped = Math.max(15_000, Math.min(300_000, ms));
    set({ rotationInterval: clamped });
    saveSettings(get());
    if (get().autoRotate) {
      get().stopRotation();
      get().startRotation();
    }
  },

  enableAutoMode: () => {
    get().setAutoRotate(true);
  },

  startRotation: () => {
    const { rotationTimer, rotationInterval } = get();
    if (rotationTimer) clearInterval(rotationTimer);
    const timer = setInterval(() => get().nextTheme(), rotationInterval);
    set({ rotationTimer: timer });
  },

  stopRotation: () => {
    const { rotationTimer } = get();
    if (rotationTimer) clearInterval(rotationTimer);
    set({ rotationTimer: null });
  },
}));
