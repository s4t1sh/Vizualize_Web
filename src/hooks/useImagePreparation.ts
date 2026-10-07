import { useCallback, useState } from 'react';
import type { SelectedImage } from '../types';
import { ImageValidationError, prepareImage } from '../utils/imageProcessing';

/** Checks and compresses a chosen file, exposing a "busy" state and a friendly error. */
export function useImagePreparation(onReady: (image: SelectedImage) => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setBusy(true);
      try {
        onReady(await prepareImage(file));
      } catch (err) {
        setError(
          err instanceof ImageValidationError
            ? err.message
            : 'Unable to prepare this image. Please try another photo.',
        );
      } finally {
        setBusy(false);
      }
    },
    [onReady],
  );

  return { busy, error, handleFile, clearError: () => setError(null) };
}
