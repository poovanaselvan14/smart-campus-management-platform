import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-nex-muted">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3.5 text-gray-400 dark:text-nex-muted pointer-events-none">{icon}</div>}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'w-full px-3.5 py-2 text-xs rounded-xl transition-all duration-150 outline-none',
              'bg-white dark:bg-nex-elevated border text-gray-900 dark:text-white',
              'placeholder:text-gray-400 dark:placeholder:text-gray-600',
              error
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-gray-200 dark:border-nex-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
              icon && 'pl-9.5',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-rose-500">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-gray-500 dark:text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
