import { useCallback, useEffect, useState } from 'react';
import type { Texture } from '../types';
import { ApiError } from '../services/api';

function messageOf(err: unknown) {
  return err instanceof ApiError ? err.message : 'Unable to load the texture library.';
}

/** Loads a list of textures with loading / error / retry states. */
export function useTextures(load: () => Promise<Texture[]>) {
  const [textures, setTextures] = useState<Texture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // First load when the page opens (ignored if the page is closed before it finishes).
  useEffect(() => {
    let active = true;
    load()
      .then((list) => active && setTextures(list))
      .catch((err: unknown) => active && setError(messageOf(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [load]);

  /** "Try Again" after an error. */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTextures(await load());
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setLoading(false);
    }
  }, [load]);

  return { textures, setTextures, loading, error, refresh };
}
