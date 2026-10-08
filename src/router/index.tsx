import { createBrowserRouter } from 'react-router';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AppLayout } from '../components/layout/AppLayout';
import { RedirectIfSignedIn, RequireAuth } from './guards';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { HomePage } from '../pages/home/HomePage';
import { CreateIntroPage } from '../pages/create/CreateIntroPage';
import { TextureLibraryPage } from '../pages/create/TextureLibraryPage';
import { SpaceSelectPage } from '../pages/create/SpaceSelectPage';
import { PromptPage } from '../pages/create/PromptPage';
import { HistoryPage } from '../pages/history/HistoryPage';
import { ResultPage } from '../pages/visualizations/ResultPage';
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
          { path: '/create/surface', element: <TextureLibraryPage /> },
          { path: '/create/space', element: <SpaceSelectPage /> },
          { path: '/create/vision', element: <PromptPage /> },
          { path: '/history', element: <HistoryPage /> },
          { path: '/visualizations/:id', element: <ResultPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
