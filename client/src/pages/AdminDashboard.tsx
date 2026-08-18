import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Activity,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [aRes, lRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/admin/logs'),
        ]);
        setAnalytics(aRes.data.data);
        setLogs(lRes.data.data || []);
      } catch (err) {
        console.error('Failed loading admin analytics', err);
      }
    };
    fetchAdminData();
  }, []);

  const metrics = analytics?.metrics || {
    totalStudents: 1450,
    totalFaculty: 85,
    totalDepartments: 6,
    averageAttendance: 86,
    placementRate: 74,
  };

  const charts = analytics?.charts || {};
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Admin Command Center Header */}
      <div className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-glow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-rose-200">Administrative Command Center</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Platform Governance, {user?.name}! 🛡️</h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
              System-wide metrics, user RBAC management, audit trails & campus analytics.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/users">
              <Button className="bg-white text-rose-700 hover:bg-rose-50 border-none shadow-lg text-xs font-bold" icon={<UserPlus className="w-4 h-4" />}>
                Manage User RBAC
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Students</span>
            <div className="p-2 bg-brand-500/10 text-brand-500 rounded-xl"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{metrics.totalStudents}</div>
          <p className="text-[10px] text-gray-400">Enrolled undergraduates</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Faculty Members</span>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{metrics.totalFaculty}</div>
          <p className="text-[10px] text-gray-400">Professors & instructors</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Departments</span>
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl"><Building className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{metrics.totalDepartments}</div>
          <p className="text-[10px] text-gray-400">Academic schools</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Avg Attendance</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-500">{metrics.averageAttendance}%</div>
          <p className="text-[10px] text-gray-400">Campus-wide average</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Placement Rate</span>
            <div className="p-2 bg-sky-500/10 text-sky-500 rounded-xl"><Briefcase className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-sky-500">{metrics.placementRate}%</div>
          <p className="text-[10px] text-gray-400">Placement success rate</p>
        </Card>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Trend Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Monthly Attendance Trends
            </h3>
            <Badge variant="success">Real-time DB Data</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.attendanceTrends || []}>
                <defs>
                  <linearGradient id="attendanceColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#131926', borderRadius: '12px', border: '1px solid #1f293d', color: '#fff' }} />
                <Area type="monotone" dataKey="percentage" stroke="#10b981" fillOpacity={1} fill="url(#attendanceColor)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department User Distribution Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-500" /> Department Enrollment Distribution
            </h3>
            <Badge variant="brand">Academic Schools</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.departmentData || []}>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#131926', borderRadius: '12px', border: '1px solid #1f293d', color: '#fff' }} />
                <Bar dataKey="users" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Audit Activity Trail Table Preview */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" /> Recent Administrative Audit Trail
          </h3>
          <Link to="/admin/logs" className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1">
            Full Audit Logs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-dark-border text-xs">
          {logs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="neutral">{log.action}</Badge>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{log.user?.name || 'System'}</span>
                  <span className="text-gray-400 ml-2">Resource: {log.resource}</span>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                {new Date(log.createdAt).toLocaleString()} • IP: {log.ipAddress || '127.0.0.1'}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
