import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label.replace(/\s+/g, '-').toLowerCase();

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#8B7A5C] uppercase tracking-wider"
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl border border-[#E2D9C2] bg-[#FFFDFC] text-sm text-[#4A3E2A] placeholder-[#C2B79E] outline-none transition-all duration-200 focus:border-[#C49A1B] focus:bg-white focus:ring-4 focus:ring-[#C49A1B]/5 ${
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/5' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium text-red-500 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
