import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'md', className }) => {
  const base = 'inline-flex items-center font-semibold rounded-md tracking-wide';

  const variants = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20',
    neutral: 'bg-gray-100 text-gray-700 dark:bg-nex-elevated dark:text-gray-300 border border-gray-200 dark:border-nex-border',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  };

  return <span className={clsx(base, variants[variant], sizes[size], className)}>{children}</span>;
};
