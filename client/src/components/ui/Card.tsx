import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-nex-surface border border-slate-200 dark:border-nex-border rounded-2xl p-6 shadow-subtle transition-all duration-200 hover:border-slate-300 dark:hover:border-nex-borderHover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  meta?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, isPositive = true, icon, meta }) => {
  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
        {icon && <div className="p-2.5 bg-slate-100 dark:bg-nex-elevated text-slate-700 dark:text-slate-200 rounded-xl">{icon}</div>}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</div>
        {(change || meta) && (
          <div className="flex items-center gap-2 mt-1.5">
            {change && (
              <span className={`text-xs font-extrabold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {change}
              </span>
            )}
            {meta && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{meta}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
