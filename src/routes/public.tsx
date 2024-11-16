import AuthLayout from '@/layout/auth/AuthLayout';
import SignIn from '@/view/auth/signIn/SignIn';

export const publicRoutes = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/auth/sign-in',
        element: <SignIn />,
      },
    ],
  },
];
