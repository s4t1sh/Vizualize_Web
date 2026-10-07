// The login token (JWT) is kept in the browser's local storage so the user stays signed in.
// Note: anything running on this website could read it, which is why the site never
// inserts untrusted HTML. Phase 10 adds further hardening.
const TOKEN_KEY = 'vizualizer_access_token';

export const tokenStorage = {
  get(): string | null {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage unavailable (e.g. private mode): the user stays signed in for this tab only.
    }
  },
  clear(): void {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  },
};
