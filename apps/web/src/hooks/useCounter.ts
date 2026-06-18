'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthContext } from '@lucidea/auth';

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useCounter = () => {
  const { token } = useAuthContext();
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCounter = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/counter');
      setValue(response.data.value);
    } catch (err: unknown) {
      console.error('Error fetching counter', err);
      const errorResponse = err as ApiErrorResponse;
      setError(
        errorResponse.response?.data?.message ||
          'Failed to fetch counter value',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const add = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const response = await axios.post('/api/counter/add');
      setValue(response.data.value);
    } catch (err: unknown) {
      console.error('Error adding to counter', err);
      const errorResponse = err as ApiErrorResponse;
      setError(
        errorResponse.response?.data?.message ||
          'Failed to increment counter value',
      );
    }
  }, [token]);

  const minus = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const response = await axios.post('/api/counter/minus');
      setValue(response.data.value);
    } catch (err: unknown) {
      console.error('Error subtracting from counter', err);
      const errorResponse = err as ApiErrorResponse;
      setError(
        errorResponse.response?.data?.message ||
          'Failed to decrement counter value',
      );
    }
  }, [token]);

  return {
    value,
    fetchCounter,
    add,
    minus,
    loading,
    error,
  };
};
