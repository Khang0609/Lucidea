'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { CreateAccountInput } from '@lucidea/types';

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useAuth = () => {
  const { login: contextLogin, logout: contextLogout, user, token } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (identity: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { identity, password });
      const { token: newToken, account } = response.data;
      contextLogin(newToken, account);
      return { success: true };
    } catch (err: unknown) {
      const errorResponse = err as ApiErrorResponse;
      const errMsg = errorResponse.response?.data?.message || 'Login failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const loginAnonymous = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if we have a saved guest token in localStorage to resume session
      const savedGuestToken = localStorage.getItem('lucidea_last_guest_token');
      if (savedGuestToken) {
        try {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedGuestToken}` },
          });
          if (response.data && response.data.user && response.data.user.isAnonymous) {
            contextLogin(savedGuestToken, response.data.user);
            localStorage.setItem('lucidea_last_guest_username', response.data.user.username);
            return { success: true };
          }
        } catch (err) {
          console.log('Saved guest token is invalid or expired, creating new guest session.', err);
          localStorage.removeItem('lucidea_last_guest_token');
          localStorage.removeItem('lucidea_last_guest_username');
        }
      }

      const response = await axios.post('/api/auth/anonymous');
      const { token: newToken, account } = response.data;
      contextLogin(newToken, account);
      localStorage.setItem('lucidea_last_guest_token', newToken);
      localStorage.setItem('lucidea_last_guest_username', account.username);
      return { success: true };
    } catch (err: unknown) {
      const errorResponse = err as ApiErrorResponse;
      const errMsg = errorResponse.response?.data?.message || 'Guest session creation failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (input: CreateAccountInput & { migrateAnonData?: boolean }) => {
    setLoading(true);
    setError(null);

    // If currently logged in as a guest, pass the guest token in authorization header
    const headers: Record<string, string> = {};
    if (user?.isAnonymous && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await axios.post('/api/auth/register', input, { headers });
      const { token: newToken, account } = response.data;
      contextLogin(newToken, account);
      
      // Remove the guest token and username from storage since it has been migrated and deleted
      localStorage.removeItem('lucidea_last_guest_token');
      localStorage.removeItem('lucidea_last_guest_username');
      
      return { success: true };
    } catch (err: unknown) {
      const errorResponse = err as ApiErrorResponse;
      const errMsg = errorResponse.response?.data?.message || 'Registration failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    contextLogout();
  };

  return {
    login,
    loginAnonymous,
    register,
    logout,
    error,
    loading,
    user,
    token,
  };
};
