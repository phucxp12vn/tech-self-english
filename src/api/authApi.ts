import api from './api';

export const checkAuth = async () => {
  const { data } = await api.get<boolean>(`/auth/check`, {
    withCredentials: true,
  });
  return data;
};

export const login = async (username: string, password: string) => {
  const { data } = await api.post<boolean>('/auth/login', { username, password });

  return data;
};
