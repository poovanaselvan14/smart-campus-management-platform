import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'md', className }) => {
  const base = 'inline-flex items-center font-bold rounded-lg tracking-wide shrink-0';

  const variants = {
    success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30',
    info: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30',
    brand: 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30',
    neutral: 'bg-slate-100 text-slate-800 dark:bg-nex-elevated dark:text-slate-200 border border-slate-200 dark:border-nex-border',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return <span className={clsx(base, variants[variant], sizes[size], className)}>{children}</span>;
};
