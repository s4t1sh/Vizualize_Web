import { create } from 'zustand';
import type { User } from '../types';
import { ApiError, configureApi } from '../services/api';
import { tokenStorage } from '../services/tokenStorage';
import { getCurrentUser } from '../services/authService';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  /** On page load: if a saved token exists, check it with the server. */
  restoreSession: () => Promise<void>;
  completeSignIn: (token: string, user: User) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,
  token: null,

  restoreSession: async () => {
    const token = tokenStorage.get();
    if (!token) {
      set({ status: 'signedOut', user: null, token: null });
      return;
    }

    set({ token });
    try {
      const user = await getCurrentUser();
      set({ status: 'signedIn', user, token });
    } catch (error) {
      // Only forget the saved token if the server said it is invalid;
      // if the server was unreachable, keep it to try again on the next visit.
      if (error instanceof ApiError && error.status === 401) tokenStorage.clear();
      set({ status: 'signedOut', user: null, token: null });
    }
  },

  completeSignIn: (token, user) => {
    tokenStorage.set(token);
    set({ status: 'signedIn', user, token });
  },

  signOut: () => {
    tokenStorage.clear();
    set({ status: 'signedOut', user: null, token: null });
  },
}));

configureApi({
  getToken: () => useAuthStore.getState().token,
  onUnauthorized: () => useAuthStore.getState().signOut(),
});
