'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { Input, Button, PawCheckbox } from '@lucidea/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const signUpFormSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'),
    email: z.string().min(1, 'Email address is required').email('Invalid email address format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms and Privacy Policy',
    }),
    migrateAnonData: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpFormSchema>;

export const SignUpForm: React.FC = () => {
  const { register: authRegister, loading, user } = useAuth();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [migrateProgress, setMigrateProgress] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      migrateAnonData: true,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setApiError(null);
    const result = await authRegister({
      username: data.username,
      email: data.email,
      password: data.password,
      migrateAnonData: user?.isAnonymous ? migrateProgress : false,
    });
    if (result.success) {
      router.push('/');
    } else {
      setApiError(result.error || 'Registration failed');
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setAgreeTerms(checked);
    setValue('agreeToTerms', checked);
    trigger('agreeToTerms');
  };

  return (
    <div className="w-full flex flex-col gap-5 text-center animate-fade-in">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-3xl font-extrabold text-[#2F2718] tracking-tight">
          Create Account
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        {apiError && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 text-left">
            {apiError}
          </div>
        )}

        <Input
          label="Username"
          placeholder="Username"
          type="text"
          error={errors.username?.message}
          disabled={loading}
          {...registerField('username')}
        />

        <Input
          label="Email Address"
          placeholder="Email Address"
          type="email"
          error={errors.email?.message}
          disabled={loading}
          {...registerField('email')}
        />

        <Input
          label="Password"
          placeholder="Password"
          type="password"
          error={errors.password?.message}
          disabled={loading}
          {...registerField('password')}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          error={errors.confirmPassword?.message}
          disabled={loading}
          {...registerField('confirmPassword')}
        />

        {/* Options Row (Terms and Conditions) */}
        <div className="flex flex-col gap-2.5 py-1 text-left">
          <PawCheckbox
            checked={agreeTerms}
            onChange={handleTermsChange}
            label={
              <span>
                I agree to the{' '}
                <Link href="#" className="font-bold text-[#C49A1B] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="font-bold text-[#C49A1B] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            }
          />
          {errors.agreeToTerms && (
            <span className="text-xs font-medium text-red-500 ml-8 -mt-1.5">
              {errors.agreeToTerms.message}
            </span>
          )}

          {/* Conditional Guest Progress Migration */}
          {user?.isAnonymous && (
            <div className="mt-1 p-3 bg-[#FFFCEE] border border-[#FFE89F]/40 rounded-xl">
              <PawCheckbox
                checked={migrateProgress}
                onChange={setMigrateProgress}
                label={
                  <span className="text-[#6C5B3E] font-semibold">
                    Migrate my guest counter progress ({`user: ${user.username}`})
                  </span>
                }
              />
              <p className="text-[11px] text-[#A69577] mt-1 ml-8.5 font-medium leading-normal">
                If checked, your guest session counter value will carry over to your new account.
              </p>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <Button type="submit" loading={loading} className="mt-1">
          Sign Up
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
      <p className="text-sm text-[#8B7A5C] font-medium mt-1">
        Already have an account?{' '}
        <Link
          href="?view=login"
          className="font-bold text-[#C49A1B] hover:text-[#B38A14] transition-colors underline decoration-2 underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};
