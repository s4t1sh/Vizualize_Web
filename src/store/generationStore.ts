import { create } from 'zustand';
import type { SpaceType, Texture } from '../types';
import { ALL_SPACES } from '../constants/spaces';

interface GenerationDraftState {
  /** Step 1: the surface chosen from the sample library. */
  selectedTexture: Texture | null;
  /** Step 2: the scenes to generate with that surface — always all six. */
  selectedSpaces: SpaceType[];
  /** Step 3: optional description of the style the user wants. */
  prompt: string;
  setSelectedTexture: (texture: Texture | null) => void;
  setPrompt: (prompt: string) => void;
  resetDraft: () => void;
}

export const useGenerationStore = create<GenerationDraftState>((set) => ({
  selectedTexture: null,
  selectedSpaces: ALL_SPACES,
  prompt: '',
  setSelectedTexture: (selectedTexture) => set({ selectedTexture }),
  setPrompt: (prompt) => set({ prompt }),
  resetDraft: () => set({ selectedTexture: null, selectedSpaces: ALL_SPACES, prompt: '' }),
}));
