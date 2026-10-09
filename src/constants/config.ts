/**
 * Where the website finds the Vizualizer server.
 * It is read ONLY from the .env file in the Vizualizer_Web folder:
 *   VITE_API_URL=http://localhost:5000/api/v1
 * After changing .env, stop and start the website again (npm run dev).
 */
const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? '';

export const API_URL = fromEnv.replace(/\/+$/, '');

/** Shown on screen when the address is missing, so it is clear what to fix. */
export const API_URL_MISSING_MESSAGE =
  'The server address is not set. Add VITE_API_URL to the .env file in the Vizualizer_Web folder, then restart the website.';
