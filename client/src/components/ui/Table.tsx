import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-nex-border shadow-subtle">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-100 dark:bg-nex-elevated text-xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-nex-border">
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-4 font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-nex-border bg-white dark:bg-nex-surface text-slate-800 dark:text-slate-200 font-semibold">
          {children}
        </tbody>
      </table>
    </div>
  );
};
