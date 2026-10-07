/**
 * Where the website finds the Vizualizer server.
 * - If VITE_API_URL is set (in a .env file), that is used.
 * - Otherwise it uses the same computer that serves the website, on port 5000,
 *   e.g. http://localhost:5000/api/v1 — the same server the mobile app uses.
 */
function resolveApiUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  return `${window.location.protocol}//${window.location.hostname}:5000/api/v1`;
}

export const API_URL = resolveApiUrl();
