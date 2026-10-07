import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './router';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

export default function App() {
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  // Reading the theme store applies the saved light/dark mode on first load.
  useThemeStore((state) => state.mode);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--color-accent)' }}>
        <span className="spinner" aria-label="Loading" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
