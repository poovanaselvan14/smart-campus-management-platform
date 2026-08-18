import React from 'react';
import { clsx } from 'clsx';

interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex space-x-1 p-1.5 bg-gray-100 dark:bg-dark-hover rounded-xl border border-gray-200/50 dark:border-dark-border/50">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200',
              isActive
                ? 'bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
