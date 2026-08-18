import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  FileText,
  Calendar,
  Briefcase,
  AlertCircle,
  ArrowRight,
  QrCode,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  Activity,
  Award,
} from 'lucide-react';
import { Card, StatCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../api/client';
import { AttendanceSummary, Assignment, Event, Placement } from '../types';
import { useAuth } from '../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'submitted'>('all');
  const [qrModalPass, setQrModalPass] = useState<{ title: string; code: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, assRes, evtRes, plcRes] = await Promise.all([
          api.get('/attendance/my'),
          api.get('/assignments'),
          api.get('/events'),
          api.get('/placements'),
        ]);
        setAttendance(attRes.data.data);
        setAssignments(assRes.data.data || []);
        setEvents(evtRes.data.data || []);
        setPlacements(plcRes.data.data || []);
      } catch (err) {
        console.error('Failed loading student dashboard data', err);
      }
    };
    fetchData();
  }, []);

  const overallPct = attendance?.overallPercentage ?? 86.4;
  const isHealthy = overallPct >= 80;

  const filteredAssignments = assignments.filter((a) => {
    const isSub = a.submissions && a.submissions.length > 0;
    if (filterTab === 'pending') return !isSub;
    if (filterTab === 'submitted') return isSub;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Good morning, {user?.name || 'Poovana'} 👋
        </h1>
        <p className="text-xs text-gray-500 dark:text-nex-muted mt-1">
          Here's your intelligent campus overview for today.
        </p>
      </div>

      {/* Primary Visual Hierarchy Row: Attendance Health & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Health Card */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-nex-muted uppercase tracking-wider">Attendance Health</span>
            <Badge variant={isHealthy ? 'success' : 'danger'}>
              {isHealthy ? 'On Track' : 'Needs Attention'}
            </Badge>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{overallPct}%</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +2.4% this month
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 bg-gray-100 dark:bg-nex-elevated rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, overallPct)}%` }}
              />
            </div>
            {attendance?.targetAdvice && (
              <p className="text-xs text-gray-500 dark:text-nex-muted pt-1">{attendance.targetAdvice}</p>
            )}
          </div>

          {/* Course Breakdown Mini Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100 dark:border-nex-border">
            {attendance?.courseBreakdown?.slice(0, 3).map((c, i) => (
              <div key={i} className="p-2.5 bg-gray-50 dark:bg-nex-elevated rounded-xl space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-gray-900 dark:text-white">{c.code}</span>
                  <span className={c.percentage >= 80 ? 'text-emerald-500' : 'text-rose-500'}>{c.percentage}%</span>
                </div>
                <div className="w-full h-1 bg-gray-200 dark:bg-nex-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.percentage >= 80 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, c.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Schedule Card */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-500 dark:text-nex-muted uppercase tracking-wider">Today's Schedule</span>
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-brand-600 dark:text-brand-400">Next Lecture • 10:30 AM</span>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Data Structures & Algorithms</h4>
              <p className="text-xs text-gray-500 dark:text-nex-muted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Room C204 • Prof. Sarah Jenkins
              </p>
            </div>
          </div>

          <Link to="/attendance">
            <Button size="sm" variant="outline" className="w-full" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              View Full Timetable
            </Button>
          </Link>
        </Card>
      </div>

      {/* Secondary Grid: Assignments Task Management & Event Pass Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments Task Board */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Assignments Task Board
            </h3>
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-nex-elevated rounded-xl text-xs">
              {(['all', 'pending', 'submitted'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTab(t)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all ${
                    filterTab === t
                      ? 'bg-white dark:bg-nex-surface text-brand-500 shadow-subtle'
                      : 'text-gray-500 dark:text-nex-muted hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredAssignments.slice(0, 4).map((a) => {
              const isSub = a.submissions && a.submissions.length > 0;
              return (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl border border-gray-200/80 dark:border-nex-border bg-gray-50/50 dark:bg-nex-elevated/50 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">{a.title}</h4>
                      <Badge variant={isSub ? 'success' : 'warning'} size="sm">
                        {isSub ? 'Submitted' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-400">Course: {a.course?.code || 'CS101'}</p>
                  </div>

                  <Link to="/assignments">
                    <Button size="sm" variant={isSub ? 'secondary' : 'primary'}>
                      {isSub ? 'Review' : 'Submit'}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Event Pass Showcase & Quick Pass Button */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-500" /> Issued Event Passes
            </h3>
            <Link to="/events" className="text-xs text-brand-500 font-bold hover:underline">
              Browse Events
            </Link>
          </div>

          <div className="space-y-3">
            {events.filter((e) => e.isRegistered).length > 0 ? (
              events
                .filter((e) => e.isRegistered)
                .slice(0, 2)
                .map((e) => (
                  <div key={e.id} className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{e.title}</h4>
                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 block">
                      Pass: {e.registration?.qrPassCode}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      icon={<QrCode className="w-3.5 h-3.5" />}
                      onClick={() => setQrModalPass({ title: e.title, code: e.registration?.qrPassCode || 'TICKET-DEMO-1234' })}
                    >
                      Show QR Entry Pass
                    </Button>
                  </div>
                ))
            ) : (
              <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 dark:bg-nex-elevated rounded-xl">
                No active tickets. Register for campus hackathons to obtain QR passes!
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* QR Ticket Modal */}
      <Modal isOpen={!!qrModalPass} onClose={() => setQrModalPass(null)} title="Official Entry Pass">
        {qrModalPass && (
          <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{qrModalPass.title}</h4>
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
              <QRCodeSVG value={qrModalPass.code} size={180} level="H" />
            </div>
            <span className="font-mono text-xs text-brand-500 font-bold bg-brand-500/10 px-3 py-1 rounded-full">
              {qrModalPass.code}
            </span>
            <p className="text-[11px] text-gray-400">Show this QR ticket code at venue entry for ticket scanner verification.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
