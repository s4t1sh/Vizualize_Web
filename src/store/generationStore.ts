import { create } from 'zustand';
import type { SelectedImage } from '../types';

interface GenerationDraftState {
  textureImage: SelectedImage | null;
  roomImage: SelectedImage | null;
  prompt: string;
  setTextureImage: (image: SelectedImage | null) => void;
  setRoomImage: (image: SelectedImage | null) => void;
  setPrompt: (prompt: string) => void;
  resetDraft: () => void;
}

/** Frees the browser memory used by an image preview. */
function release(image: SelectedImage | null) {
  if (image) URL.revokeObjectURL(image.previewUrl);
}

export const useGenerationStore = create<GenerationDraftState>((set, get) => ({
  textureImage: null,
  roomImage: null,
  prompt: '',
  setTextureImage: (textureImage) => {
    release(get().textureImage);
    set({ textureImage });
  },
  setRoomImage: (roomImage) => {
    release(get().roomImage);
    set({ roomImage });
  },
  setPrompt: (prompt) => set({ prompt }),
  resetDraft: () => {
    release(get().textureImage);
    release(get().roomImage);
    set({ textureImage: null, roomImage: null, prompt: '' });
  },
}));
