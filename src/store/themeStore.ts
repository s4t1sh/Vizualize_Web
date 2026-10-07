import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'vizualizer_theme';

function readSavedMode(): ThemeMode {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyMode(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#0C0A09' : '#F7F5F2');
  try {
    window.localStorage.setItem(THEME_KEY, mode);
  } catch {
    // ignore
  }
}

interface ThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
}

// Luxury light mode is the default (as in the spec); the choice is remembered on this browser.
const initialMode = readSavedMode();
applyMode(initialMode);

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: initialMode,
  toggleMode: () => {
    const next: ThemeMode = get().mode === 'light' ? 'dark' : 'light';
    applyMode(next);
    set({ mode: next });
  },
}));
