import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = <FolderOpen className="w-10 h-10 text-brand-500/80" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-dark-hover/30 border border-dashed border-gray-300 dark:border-dark-border rounded-2xl">
      <div className="p-3 bg-brand-500/10 rounded-2xl mb-4">{icon}</div>
      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-4">{description}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
};
