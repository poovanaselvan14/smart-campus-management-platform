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
        'bg-white dark:bg-nex-surface border border-gray-200 dark:border-nex-border rounded-2xl p-5 transition-all duration-200 hover:border-gray-300 dark:hover:border-nex-borderHover',
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
        <span className="text-xs font-semibold text-gray-500 dark:text-nex-muted uppercase tracking-wider">{label}</span>
        {icon && <div className="p-2 bg-gray-100 dark:bg-nex-elevated text-gray-700 dark:text-gray-300 rounded-xl">{icon}</div>}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</div>
        {(change || meta) && (
          <div className="flex items-center gap-2 mt-1">
            {change && (
              <span className={`text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {change}
              </span>
            )}
            {meta && <span className="text-[11px] text-gray-400 dark:text-nex-muted">{meta}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
