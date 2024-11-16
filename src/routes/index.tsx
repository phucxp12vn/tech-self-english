// import Cookies from 'js-cookie';
import { useRoutes, Navigate } from 'react-router-dom';

import useAuthStatus from '@/hook/useAuthStatus';
import MainLayout from '@/layout/admin/MainLayout';

import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuthStatus();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner/loading component
  }

  return isLoggedIn ? children : <Navigate to="/auth/sign-in" replace />;
};

export const AppRoutes = () => {
  const routes = [
    ...publicRoutes,
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: protectedRoutes,
    },
  ];

  const element = useRoutes([...routes]);

  return <>{element}</>;
};

export { menuRoutes } from './protected';
