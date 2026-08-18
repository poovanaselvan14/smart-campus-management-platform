import React, { useEffect, useState } from 'react';
import { CalendarCheck, AlertCircle, CheckCircle2, XCircle, Search, UserCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { api } from '../api/client';
import { AttendanceSummary } from '../types';
import { useAuth } from '../context/AuthContext';

interface RosterStudent {
  id: string;
  rollNumber: string;
  name: string;
  isPresent: boolean;
}

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const isFacultyOrAdmin = ['FACULTY', 'ADMIN'].includes(user?.role || '');

  // Student state
  const [data, setData] = useState<AttendanceSummary | null>(null);

  // Faculty state
  const [sessionTitle, setSessionTitle] = useState('Data Structures & Algorithms');
  const [searchRoster, setSearchRoster] = useState('');
  const [roster, setRoster] = useState<RosterStudent[]>([
    { id: 'stu-1', rollNumber: '24AD001', name: 'Arun Kumar', isPresent: true },
    { id: 'stu-2', rollNumber: '24AD002', name: 'Priya S', isPresent: true },
    { id: 'stu-3', rollNumber: '24AD003', name: 'Rahul M', isPresent: false },
    { id: 'stu-4', rollNumber: '24AD004', name: 'Karthik R', isPresent: true },
    { id: 'stu-5', rollNumber: '24AD005', name: 'Ethan Morgan', isPresent: true },
    { id: 'stu-6', rollNumber: '24AD006', name: 'Ananya Sharma', isPresent: true },
  ]);

  useEffect(() => {
    if (!isFacultyOrAdmin) {
      api.get('/attendance/my').then((res) => setData(res.data.data)).catch(console.error);
    }
  }, [isFacultyOrAdmin]);

  const toggleStudent = (id: string) => {
    setRoster((prev) => prev.map((s) => (s.id === id ? { ...s, isPresent: !s.isPresent } : s)));
  };

  const markAllPresent = () => {
    setRoster((prev) => prev.map((s) => ({ ...s, isPresent: true })));
  };

  const submitFacultyAttendance = async () => {
    try {
      const records = roster.map((s) => ({ studentId: s.id, status: s.isPresent ? 'PRESENT' : 'ABSENT' }));
      await api.post('/attendance/session', {
        courseId: 'demo-course-id',
        title: sessionTitle,
        date: new Date().toISOString().split('T')[0],
        startTime: '10:30 AM',
        endTime: '11:30 AM',
        records,
      });
      alert('Attendance records saved cleanly and warnings dispatched!');
    } catch (err) {
      alert('Failed saving attendance session.');
    }
  };

  const presentCount = roster.filter((s) => s.isPresent).length;
  const absentCount = roster.filter((s) => !s.isPresent).length;
  const filteredRoster = roster.filter(
    (s) => s.name.toLowerCase().includes(searchRoster.toLowerCase()) || s.rollNumber.toLowerCase().includes(searchRoster.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-brand-500" /> Attendance Management
        </h1>
        <p className="text-xs text-gray-500 dark:text-nex-muted mt-1">
          {isFacultyOrAdmin ? 'Mark student attendance session roster' : 'View your subject breakdown and attendance health status'}
        </p>
      </div>

      {isFacultyOrAdmin ? (
        /* Faculty Roster Attendance Taking Interface */
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-nex-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Class Session</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Data Structures & Algorithms (CS101)</h3>
                <p className="text-xs text-gray-500 dark:text-nex-muted">III Year • Section A • Aug 12, 2026</p>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 block font-bold">Present</span>
                  <span className="text-base font-extrabold text-emerald-500">{presentCount}</span>
                </div>
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 block font-bold">Absent</span>
                  <span className="text-base font-extrabold text-rose-500">{absentCount}</span>
                </div>
                <div className="p-2.5 bg-gray-100 dark:bg-nex-elevated rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 block font-bold">Total</span>
                  <span className="text-base font-extrabold text-gray-900 dark:text-white">{roster.length}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Input
                placeholder="Search roster by student name or roll number..."
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="max-w-md"
              />
              <Button variant="outline" size="sm" onClick={markAllPresent} icon={<UserCheck className="w-3.5 h-3.5" />}>
                Mark All Present
              </Button>
            </div>

            {/* Interactive Roster Checkboxes */}
            <div className="divide-y divide-gray-100 dark:divide-nex-border border border-gray-200 dark:border-nex-border rounded-xl">
              {filteredRoster.map((student) => (
                <div
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    student.isPresent ? 'hover:bg-gray-50 dark:hover:bg-nex-elevated/50' : 'bg-rose-500/5 hover:bg-rose-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={student.isPresent}
                      onChange={() => toggleStudent(student.id)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-gray-400 w-20">{student.rollNumber}</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{student.name}</span>
                  </div>

                  <Badge variant={student.isPresent ? 'success' : 'danger'}>
                    {student.isPresent ? 'Present' : 'Absent'}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={submitFacultyAttendance} icon={<CheckCircle2 className="w-4 h-4" />}>
                Submit Attendance Roster
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* Student Attendance Health View */
        <div className="space-y-6">
          {data?.targetAdvice && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-600 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Attendance Health Advisor:</span>
                <p className="mt-0.5">{data.targetAdvice}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.courseBreakdown?.map((c, i) => (
              <Card key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={c.percentage >= 80 ? 'success' : 'danger'}>{c.code}</Badge>
                  <span className="text-xs text-gray-400 font-bold">{c.present} / {c.total} Sessions</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{c.courseName}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Percentage</span>
                    <span className={c.percentage >= 80 ? 'text-emerald-500' : 'text-rose-500'}>{c.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-nex-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.percentage >= 80 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(100, c.percentage)}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Attendance Session History</h3>
            <Table headers={['Course Code', 'Session Topic', 'Faculty', 'Date', 'Status']}>
              {data?.history?.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-nex-elevated/50">
                  <td className="px-5 py-3.5 font-bold text-brand-500">{record.session?.course?.code}</td>
                  <td className="px-5 py-3.5 font-medium">{record.session?.title}</td>
                  <td className="px-5 py-3.5 text-gray-500">{record.session?.faculty?.name}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{record.session?.date}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={record.status === 'PRESENT' ? 'success' : record.status === 'ABSENT' ? 'danger' : 'warning'}>
                      {record.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
};
