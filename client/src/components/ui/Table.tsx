import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-nex-border">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gray-50/80 dark:bg-nex-elevated/80 text-[11px] uppercase tracking-wider font-extrabold text-gray-500 dark:text-nex-muted border-b border-gray-200 dark:border-nex-border">
            {headers.map((h, i) => (
              <th key={i} className="px-5 py-3 font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-nex-border bg-white dark:bg-nex-surface text-gray-800 dark:text-gray-200 font-medium">
          {children}
        </tbody>
      </table>
    </div>
  );
};
