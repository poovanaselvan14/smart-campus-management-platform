import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { api } from '../api/client';
import { ActivityLog } from '../types';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/logs');
      setLogs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" /> Platform Audit & Activity Logs
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Complete immutable audit trail of sensitive administrative actions, user RBAC modifications, and platform operations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} isLoading={loading} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Stream
        </Button>
      </div>

      <Card className="p-6">
        <Table headers={['Timestamp', 'Action Type', 'User Account', 'Resource Target', 'Client IP', 'Metadata']}>
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-dark-hover/50">
              <td className="px-6 py-4 text-xs font-mono text-gray-400">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <Badge variant="brand">{log.action}</Badge>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                {log.user?.name || 'System / Anonymous'} <span className="text-[10px] text-gray-400">({log.user?.role || 'SYSTEM'})</span>
              </td>
              <td className="px-6 py-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                {log.resource} {log.resourceId ? `#${log.resourceId.slice(0, 8)}` : ''}
              </td>
              <td className="px-6 py-4 font-mono text-xs text-gray-400">
                {log.ipAddress || '127.0.0.1'}
              </td>
              <td className="px-6 py-4 text-[10px] font-mono text-gray-500 max-w-xs truncate">
                {log.metadata || '-'}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};
