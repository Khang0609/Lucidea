'use client';

import React, { useEffect, use } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

interface AuthPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export function AuthPage({ searchParams }: AuthPageProps) {
  const params = use(searchParams);
  const view = (params.view as string) || 'login';
  const isSignUp = view === 'signup';
  
  const { token, loading, user } = useAuthContext();
  const router = useRouter();

  // If already logged in as a registered standard account, automatically redirect to dashboard/home page.
  // Anonymous guest sessions are allowed to access /auth to register and migrate their progress.
  useEffect(() => {
    if (!loading && token && user && !user.isAnonymous) {
      router.push('/');
    }
  }, [token, loading, user, router]);

  // Paw SVG path to build the background decorations
  const PawDecoration = ({ className = '' }: { className?: string }) => (
    <svg
      viewBox="0 0 469 412"
      className={`absolute w-12 h-12 pointer-events-none ${className}`}
    >
      <path d="M116.472 193.533C128.379 230.533 117.642 260.45 90.9718 269.033C64.3016 277.616 32.9717 260.533 21.4718 214.533C11.9718 168.533 23.9718 137.227 49.9718 133.033C80.9718 128.033 108.266 168.033 116.472 193.533Z" />
      <path d="M440.07 224.888C426.205 261.199 399.109 277.817 372.935 267.823C346.761 257.829 333.013 224.899 352.827 181.822C374.201 139.996 403.151 123.085 426.056 136.084C453.366 151.582 449.626 199.862 440.07 224.888Z" />
      <path d="M214.341 88.533C218.341 129.533 197.496 159.872 167.341 161.033C137.185 162.194 104.606 139.374 108.842 83.0329C113.841 16.5331 139.747 9.03313 159.341 9.03313C192.341 9.03313 211.658 61.0304 214.341 88.533Z" />
      <path d="M356.16 101.497C349.865 142.208 325.472 162.533 296.972 162.533C264.986 162.533 237.972 118.533 257.16 61.4413C272.222 16.6262 299.179 5.58133 318.16 10.4413C350.129 8.6267 360.382 74.1887 356.16 101.497Z" />
      <path d="M109.972 301.033C84.3717 333.433 95.6384 369.2 104.472 383.033C120.872 415.833 160.972 413.366 178.972 408.033C184.972 406.533 201.172 402.433 217.972 398.033C234.772 393.633 268.972 402.866 283.972 408.033C296.305 412.2 326.572 416.033 348.972 398.033C371.372 380.033 370.972 343.2 367.972 327.033C363.305 314.366 355.972 297.283 334.972 281.533C320.972 271.033 322.472 276.033 289.972 225.533C281.965 213.092 269.972 181.533 233.972 177.533C207.943 174.641 181.472 200.533 172.472 230.533C168.1 238.611 164.472 244.033 158.472 253.533C147.827 268.836 118.721 289.96 109.972 301.033Z" />
    </svg>
  );

  // If validation is loading, show loading screen
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF6E8] select-none">
        <svg
          className="animate-spin h-10 w-10 text-[#C49A1B] mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-sm font-semibold text-[#8B7A5C] tracking-wide animate-pulse">
          Đang xác thực...
        </span>
      </div>
    );
  }

  // If token exists and belongs to a registered standard user, we render blank and redirect inside useEffect
  if (token && user && !user.isAnonymous) {
    return null;
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#FAF6E8] p-4 sm:p-6 md:p-8 font-sans antialiased select-none">
      {/* Outer Card Container */}
      <div className="bg-white shadow-2xl rounded-[28px] max-w-4xl w-full overflow-hidden flex flex-col md:flex-row min-h-[580px] border border-[#EFE9D9]/40 relative">
        {/* LEFT PANEL: Form inputs with dynamic transition */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col bg-white relative overflow-hidden justify-between">
          {/* Subtle Grey Background Paw Prints */}
          <PawDecoration className="fill-gray-300 opacity-[0.03] top-6 right-16 scale-90 rotate-[15deg]" />
          <PawDecoration className="fill-gray-300 opacity-[0.03] top-1/2 right-4 scale-75 rotate-[45deg]" />
          <PawDecoration className="fill-gray-300 opacity-[0.03] bottom-20 left-6 scale-95 rotate-[-25deg]" />
          <PawDecoration className="fill-gray-300 opacity-[0.03] bottom-6 right-24 scale-[0.6] rotate-[80deg]" />

          {/* Logo Header */}
          <div className="flex items-center gap-2.5 text-[#C49A1B] text-xl font-bold tracking-tight select-none z-10">
            <svg viewBox="0 0 469 412" className="w-5 h-5 fill-current">
              <path d="M116.472 193.533C128.379 230.533 117.642 260.45 90.9718 269.033C64.3016 277.616 32.9717 260.533 21.4718 214.533C11.9718 168.533 23.9718 137.227 49.9718 133.033C80.9718 128.033 108.266 168.033 116.472 193.533Z" />
              <path d="M440.07 224.888C426.205 261.199 399.109 277.817 372.935 267.823C346.761 257.829 333.013 224.899 352.827 181.822C374.201 139.996 403.151 123.085 426.056 136.084C453.366 151.582 449.626 199.862 440.07 224.888Z" />
              <path d="M214.341 88.533C218.341 129.533 197.496 159.872 167.341 161.033C137.185 162.194 104.606 139.374 108.842 83.0329C113.841 16.5331 139.747 9.03313 159.341 9.03313C192.341 9.03313 211.658 61.0304 214.341 88.533Z" />
              <path d="M356.16 101.497C349.865 142.208 325.472 162.533 296.972 162.533C264.986 162.533 237.972 118.533 257.16 61.4413C272.222 16.6262 299.179 5.58133 318.16 10.4413C350.129 8.6267 360.382 74.1887 356.16 101.497Z" />
              <path d="M109.972 301.033C84.3717 333.433 95.6384 369.2 104.472 383.033C120.872 415.833 160.972 413.366 178.972 408.033C184.972 406.533 201.172 402.433 217.972 398.033C234.772 393.633 268.972 402.866 283.972 408.033C296.305 412.2 326.572 416.033 348.972 398.033C371.372 380.033 370.972 343.2 367.972 327.033C363.305 314.366 355.972 297.283 334.972 281.533C320.972 271.033 322.472 276.033 289.972 225.533C281.965 213.092 269.972 181.533 233.972 177.533C207.943 174.641 181.472 200.533 172.472 230.533C168.1 238.611 164.472 244.033 158.472 253.533C147.827 268.836 118.721 289.96 109.972 301.033Z" />
            </svg>
            <span>Lucidea</span>
          </div>

          {/* Conditional Forms Layout */}
          <div className="flex-1 flex flex-col justify-center py-6 z-10">
            {isSignUp ? <SignUpForm /> : <LoginForm />}
          </div>
        </div>

        {/* RIGHT PANEL: Static yellow background with corporate cat mascot */}
        <div className="w-full md:w-1/2 bg-[#FEE180] p-8 sm:p-10 md:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px] md:min-h-full select-none">
          {/* Scattered Faint Gold Paw Prints */}
          <PawDecoration className="fill-[#ac8719] opacity-[0.08] top-12 left-12 scale-110 rotate-[10deg]" />
          <PawDecoration className="fill-[#ac8719] opacity-[0.08] top-6 right-20 scale-75 rotate-[35deg]" />
          <PawDecoration className="fill-[#ac8719] opacity-[0.08] top-1/2 left-4 scale-90 rotate-[-15deg]" />
          <PawDecoration className="fill-[#ac8719] opacity-[0.08] top-1/3 right-6 scale-95 rotate-[50deg]" />
          <PawDecoration className="fill-[#ac8719] opacity-[0.08] bottom-16 right-16 scale-110 rotate-[20deg]" />
          <PawDecoration className="fill-[#ac8719] opacity-[0.08] bottom-28 left-16 scale-75 rotate-[-45deg]" />
          <PawDecoration className="fill-[#ac8719] opacity-[0.08] bottom-6 right-1/2 scale-[0.6] rotate-[95deg]" />

          {/* mascot illustration */}
          <img
            src="/working_cat.png"
            alt="Lucidea mascot cat in suit holding briefcase"
            className="w-[170px] sm:w-[190px] md:w-[230px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)] select-none z-10 animate-pulse-slow"
          />
        </div>
      </div>
    </main>
  );
}
