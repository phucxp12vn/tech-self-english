import { useEffect, useState } from 'react';

import { checkAuth } from '@/api/authApi';

interface AuthStatus {
  isLoggedIn: boolean;
  loading: boolean;
}

const useAuthStatus = (): AuthStatus => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const loggedIn = await checkAuth();

        setIsLoggedIn(loggedIn);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return { isLoggedIn, loading };
};

export default useAuthStatus;
