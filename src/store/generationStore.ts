import { create } from 'zustand';
import type { SpaceType, Texture } from '../types';
import { ALL_SPACES } from '../constants/spaces';

interface GenerationDraftState {
  /** Step 1: the surface chosen from the sample library. */
  selectedTexture: Texture | null;
  /** Step 2: the scenes to create with that surface — all six are chosen at the start. */
  selectedSpaces: SpaceType[];
  /** Step 3: optional description of the style the user wants. */
  prompt: string;
  setSelectedTexture: (texture: Texture | null) => void;
  /** Ticks or unticks one space. */
  toggleSpace: (space: SpaceType) => void;
  /** Ticks all six, or unticks all of them. */
  setAllSpaces: (all: boolean) => void;
  setPrompt: (prompt: string) => void;
  resetDraft: () => void;
}

export const useGenerationStore = create<GenerationDraftState>((set, get) => ({
  selectedTexture: null,
  selectedSpaces: ALL_SPACES,
  prompt: '',
  setSelectedTexture: (selectedTexture) => set({ selectedTexture }),
  toggleSpace: (space) => {
    const current = get().selectedSpaces;
    const next = current.includes(space) ? current.filter((s) => s !== space) : [...current, space];
    // Keep the usual order (Living Room first … Feature Wall last).
    set({ selectedSpaces: ALL_SPACES.filter((s) => next.includes(s)) });
  },
  setAllSpaces: (all) => set({ selectedSpaces: all ? ALL_SPACES : [] }),
  setPrompt: (prompt) => set({ prompt }),
  resetDraft: () => set({ selectedTexture: null, selectedSpaces: ALL_SPACES, prompt: '' }),
}));
