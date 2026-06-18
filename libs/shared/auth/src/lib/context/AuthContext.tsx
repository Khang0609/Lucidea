'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface UserSession {
  username: string;
  isAnonymous: boolean;
  email?: string;
}

interface AuthContextType {
  token: string | null;
  user: UserSession | null;
  loading: boolean;
  login: (token: string, user: UserSession) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('lucidea_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    setLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('lucidea_token');
    if (!storedToken) {
      logout();
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const response = await axios.get('/api/auth/me');
      if (response.data && response.data.user) {
        setToken(storedToken);
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to validate session token', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback((newToken: string, newUser: UserSession) => {
    localStorage.setItem('lucidea_token', newToken);
    setToken(newToken);
    setUser(newUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setLoading(false);
  }, []);

  // Initialize and load token
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
