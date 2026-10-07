import { createBrowserRouter } from 'react-router';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AppLayout } from '../components/layout/AppLayout';
import { RedirectIfSignedIn, RequireAuth } from './guards';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { HomePage } from '../pages/home/HomePage';
import { CreateIntroPage } from '../pages/create/CreateIntroPage';
import { TextureUploadPage } from '../pages/create/TextureUploadPage';
import { RoomUploadPage } from '../pages/create/RoomUploadPage';
import { PromptPage } from '../pages/create/PromptPage';
import { HistoryPage } from '../pages/history/HistoryPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <RedirectIfSignedIn />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/create', element: <CreateIntroPage /> },
          { path: '/create/surface', element: <TextureUploadPage /> },
          { path: '/create/space', element: <RoomUploadPage /> },
          { path: '/create/vision', element: <PromptPage /> },
          { path: '/history', element: <HistoryPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
