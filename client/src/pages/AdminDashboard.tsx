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
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-subtle border border-brand-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-xs font-extrabold uppercase tracking-wider text-brand-100">
              <ShieldCheck className="w-3.5 h-3.5" /> Administrative Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Platform Governance, {user?.name}!</h1>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl font-medium">
              System-wide metrics, user RBAC management, audit trails & campus analytics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black/20 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/10 shrink-0">
            <div className="px-3 py-1 hidden sm:block border-r border-white/10 text-right">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-brand-200">System RBAC</span>
              <span className="text-xs font-bold text-white">Full SuperAdmin Access</span>
            </div>
            <Link to="/admin/users">
              <Button
                className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm text-xs font-extrabold transition-all active:scale-[0.98]"
                icon={<UserPlus className="w-4 h-4" />}
              >
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
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Students</span>
            <div className="p-2 bg-brand-500/15 text-brand-600 dark:text-brand-400 rounded-xl"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics.totalStudents}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enrolled undergraduates</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Faculty Members</span>
            <div className="p-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics.totalFaculty}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Professors & instructors</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Departments</span>
            <div className="p-2 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl"><Building className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics.totalDepartments}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active academic faculties</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Attendance</span>
            <div className="p-2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics.averageAttendance}%</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Campus-wide health</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Placement Rate</span>
            <div className="p-2 bg-sky-500/15 text-sky-600 dark:text-sky-400 rounded-xl"><Briefcase className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics.placementRate}%</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Class of 2026 offers</p>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Trends Area Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Institution Attendance Trends</h3>
            <Badge variant="brand">Last 6 Months</Badge>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.attendanceTrends || [
                { month: 'Jan', attendance: 82 },
                { month: 'Feb', attendance: 85 },
                { month: 'Mar', attendance: 88 },
                { month: 'Apr', attendance: 84 },
                { month: 'May', attendance: 89 },
                { month: 'Jun', attendance: 86 },
              ]}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#12151E', borderRadius: '12px', border: '1px solid #272E3F', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#attGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Enrollment Bar Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Headcount</h3>
            <Badge variant="neutral">Active Enrolment</Badge>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.departmentDistribution || [
                { name: 'CSE', count: 520 },
                { name: 'ECE', count: 340 },
                { name: 'MECH', count: 260 },
                { name: 'CIVIL', count: 180 },
                { name: 'IT', count: 150 },
              ]}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#12151E', borderRadius: '12px', border: '1px solid #272E3F', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Audit Log Stream */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Live System Audit Trails</h3>
          </div>
          <Link to="/admin/logs">
            <Button size="sm" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>Full Security Console</Button>
          </Link>
        </div>

        <div className="space-y-3">
          {logs.slice(0, 5).map((l, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-nex-border bg-slate-50 dark:bg-nex-elevated flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400 font-mono text-[10px] font-bold">
                  {l.action || 'AUTH_LOGIN'}
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{l.user?.name || 'System Actor'}</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-2">performed {l.action} on {l.resource || 'portal'}</span>
                </div>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">
                {new Date(l.createdAt || Date.now()).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
