
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User, UserRole } from '../types';
import * as api from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      api.getUserById(storedUserId)
        .then(userData => {
          setUser(userData || null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (role: UserRole) => {
    setLoading(true);
    const mockUserId = api.getUserIdByRole(role);
    const userData = await api.getUserById(mockUserId);
    if (userData) {
      setUser(userData);
      localStorage.setItem('userId', userData.id);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('userId');
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
