import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  FileText,
  Users,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { api } from '../api/client';
import { Assignment, Course } from '../types';
import { useAuth } from '../context/AuthContext';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [createAssModalOpen, setCreateAssModalOpen] = useState(false);

  // Form states
  const [sessionData, setSessionData] = useState({
    courseId: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:30 AM',
    endTime: '11:00 AM',
  });

  const [assData, setAssData] = useState({
    courseId: '',
    title: '',
    description: '',
    deadline: '',
    maxMarks: '100',
  });

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const [cRes, aRes] = await Promise.all([
          api.get('/courses'),
          api.get('/assignments'),
        ]);
        const allCourses = cRes.data.data || [];
        setCourses(allCourses);
        if (allCourses.length > 0) {
          setSessionData((prev) => ({ ...prev, courseId: allCourses[0].id }));
          setAssData((prev) => ({ ...prev, courseId: allCourses[0].id }));
        }
        setAssignments(aRes.data.data || []);
      } catch (err) {
        console.error('Failed loading faculty dashboard', err);
      }
    };
    fetchFacultyData();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/attendance/session', {
        ...sessionData,
        records: [
          { studentId: 'demo-student-id-1', status: 'PRESENT' },
          { studentId: 'demo-student-id-2', status: 'PRESENT' },
        ],
      });
      alert('Attendance session launched and notifications dispatched!');
      setSessionModalOpen(false);
    } catch (err: any) {
      alert('Failed launching attendance session.');
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/assignments', assData);
      alert('Assignment published cleanly to enrolled students!');
      setCreateAssModalOpen(false);
      const aRes = await api.get('/assignments');
      setAssignments(aRes.data.data || []);
    } catch (err: any) {
      alert('Failed creating assignment.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Faculty Welcome Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-glow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-200">Faculty Portal</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome, {user?.name}! 👨‍🏫</h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
              Associate Professor • Computer Science & Engineering • ID #{user?.profile?.employeeId || 'FAC-2024-08'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setSessionModalOpen(true)}
              className="bg-white text-amber-800 hover:bg-amber-50 border-none shadow-lg text-xs font-bold"
              icon={<Plus className="w-4 h-4" />}
            >
              Take Attendance Session
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Assigned Courses</span>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><CalendarCheck className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{courses.length || 2}</div>
          <p className="text-[10px] text-gray-400">Active undergraduate classes</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Active Assignments</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl"><FileText className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{assignments.length}</div>
          <p className="text-[10px] text-gray-400">Homework & projects active</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Students</span>
            <div className="p-2 bg-sky-500/10 text-sky-500 rounded-xl"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">128</div>
          <p className="text-[10px] text-gray-400">Enrolled across CS101 & CS202</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Low Attendance Alerts</span>
            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl"><AlertTriangle className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-rose-500">2</div>
          <p className="text-[10px] text-gray-400">Students below 75% threshold</p>
        </Card>
      </div>

      {/* Main Grid: Active Courses & Grading Portal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assigned Courses list */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-amber-500" /> Assigned Course Offerings
            </h3>
            <Button size="sm" onClick={() => setSessionModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
              New Session
            </Button>
          </div>

          <div className="space-y-3">
            {courses.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-gray-200/80 dark:border-dark-border/80 bg-gray-50/50 dark:bg-dark-bg/50 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">{c.code}</Badge>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{c.name}</h4>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{c.credits} Credits • Computer Science & Engineering</p>
                </div>
                <Link to="/attendance">
                  <Button size="sm" variant="outline">Attendance</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Assignments Stack & Creator */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Published Assignments
            </h3>
            <Button size="sm" onClick={() => setCreateAssModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
              Create Assignment
            </Button>
          </div>

          <div className="space-y-3">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl border border-gray-200/80 dark:border-dark-border/80 bg-gray-50/50 dark:bg-dark-bg/50 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{a.title}</h4>
                  <p className="text-[10px] text-gray-400">Due: {new Date(a.deadline).toLocaleDateString()} • Max Marks: {a.maxMarks}</p>
                </div>
                <Link to="/assignments">
                  <Button size="sm" variant="secondary">Review Submissions</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Take Attendance Modal */}
      <Modal isOpen={sessionModalOpen} onClose={() => setSessionModalOpen(false)} title="Launch Attendance Session">
        <form onSubmit={handleCreateSession} className="space-y-4">
          <Select
            label="Course"
            value={sessionData.courseId}
            onChange={(e) => setSessionData({ ...sessionData, courseId: e.target.value })}
            options={courses.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` }))}
          />
          <Input
            label="Session Topic"
            placeholder="Binary Trees & Graphs Lecture"
            value={sessionData.title}
            onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              value={sessionData.startTime}
              onChange={(e) => setSessionData({ ...sessionData, startTime: e.target.value })}
            />
            <Input
              label="End Time"
              value={sessionData.endTime}
              onChange={(e) => setSessionData({ ...sessionData, endTime: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">Create Session & Save Roster</Button>
        </form>
      </Modal>

      {/* Create Assignment Modal */}
      <Modal isOpen={createAssModalOpen} onClose={() => setCreateAssModalOpen(false)} title="Publish New Assignment">
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Select
            label="Course"
            value={assData.courseId}
            onChange={(e) => setAssData({ ...assData, courseId: e.target.value })}
            options={courses.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` }))}
          />
          <Input
            label="Assignment Title"
            placeholder="Graph Traversal & Dijkstra Algorithm"
            value={assData.title}
            onChange={(e) => setAssData({ ...assData, title: e.target.value })}
            required
          />
          <Input
            label="Description / Requirements"
            placeholder="Implement BFS, DFS and Dijkstra..."
            value={assData.description}
            onChange={(e) => setAssData({ ...assData, description: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Deadline Date"
              type="datetime-local"
              value={assData.deadline}
              onChange={(e) => setAssData({ ...assData, deadline: e.target.value })}
              required
            />
            <Input
              label="Max Marks"
              type="number"
              value={assData.maxMarks}
              onChange={(e) => setAssData({ ...assData, maxMarks: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">Publish Assignment</Button>
        </form>
      </Modal>
    </div>
  );
};
