'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { Input, Button, PawCheckbox } from '@lucidea/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loginFormSchema = z.object({
  identity: z.string().min(1, 'Email address or username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export const LoginForm: React.FC = () => {
  const { login, loginAnonymous, loading } = useAuth();
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastGuestUsername, setLastGuestUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('lucidea_last_guest_username');
    if (saved) {
      setLastGuestUsername(saved);
    }
  }, []);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identity: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    const result = await login(data.identity, data.password);
    if (result.success) {
      router.push('/');
    } else {
      setApiError(result.error || 'Login failed');
    }
  };

  const handleGuestLogin = async () => {
    setApiError(null);
    const result = await loginAnonymous();
    if (result.success) {
      router.push('/');
    } else {
      setApiError(result.error || 'Guest session creation failed');
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-center animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold text-[#2F2718] tracking-tight">
          Welcome Back
        </h2>
      </div>

      {/* Guest Login Trigger */}
      <button
        type="button"
        onClick={handleGuestLogin}
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl border border-[#C49A1B] bg-white text-[#C49A1B] font-semibold flex items-center justify-center gap-2 hover:bg-[#C49A1B]/5 active:scale-[0.98] transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
        {lastGuestUsername ? `Resume Guest Session (${lastGuestUsername})` : 'Continue as Guest'}
      </button>

      {/* Separator */}
      <div className="relative flex items-center justify-center my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E2D9C2]"></div>
        </div>
        <span className="relative px-3 bg-white text-[10px] font-bold text-[#C2B79E] uppercase tracking-widest">
          or login with email
        </span>
      </div>

      {/* Login Credentials Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {apiError && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 text-left">
            {apiError}
          </div>
        )}

        <Input
          label="Email Address"
          placeholder="Email Address"
          type="text"
          error={errors.identity?.message}
          disabled={loading}
          {...registerField('identity')}
        />

        <Input
          label="Password"
          placeholder="Password"
          type="password"
          error={errors.password?.message}
          disabled={loading}
          {...registerField('password')}
        />

        {/* Options Row */}
        <div className="flex items-center justify-between gap-4 py-1">
          <PawCheckbox
            checked={keepLoggedIn}
            onChange={setKeepLoggedIn}
            label="Keep me logged in"
          />
          <Link
            href="#"
            className="text-xs font-semibold text-[#C49A1B] hover:text-[#B38A14] transition-colors leading-tight"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Action */}
        <Button type="submit" loading={loading} className="mt-2">
          Log In
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Button>
      </form>

      {/* Switch Form Footer */}
      <p className="text-sm text-[#8B7A5C] font-medium mt-2">
        Don&apos;t have an account?{' '}
        <Link
          href="?view=signup"
          className="font-bold text-[#C49A1B] hover:text-[#B38A14] transition-colors underline decoration-2 underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};
