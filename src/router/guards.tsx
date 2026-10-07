import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../store/authStore';

/** Only for signed-in users; others are sent to Login (and brought back afterwards). */
export function RequireAuth() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();
  if (status !== 'signedIn') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

/** Login/Register: signed-in users go straight to where they were heading (or Home). */
export function RedirectIfSignedIn() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  if (status === 'signedIn') return <Navigate to={from && from !== '/login' ? from : '/'} replace />;
  return <Outlet />;
}
