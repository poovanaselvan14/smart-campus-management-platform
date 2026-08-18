import React from 'react';
import { clsx } from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className, id, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full px-4 py-2.5 text-sm rounded-xl transition-all duration-200 outline-none appearance-none',
          'bg-white dark:bg-dark-bg border text-gray-900 dark:text-white cursor-pointer',
          error
            ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
            : 'border-gray-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-dark-card text-gray-900 dark:text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
};
