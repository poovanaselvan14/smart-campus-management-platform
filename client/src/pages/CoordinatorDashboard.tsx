import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  QrCode,
  Bell,
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { api } from '../api/client';
import { Event, Club } from '../types';
import { useAuth } from '../context/AuthContext';

export const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [qrInput, setQrInput] = useState('');
  const [qrResult, setQrResult] = useState<{ success: boolean; message: string } | null>(null);

  const [createEventModal, setCreateEventModal] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    venue: '',
    eventDate: '',
    registrationDeadline: '',
    capacity: '150',
    category: 'Hackathon',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eRes, cRes] = await Promise.all([
          api.get('/events'),
          api.get('/clubs'),
        ]);
        setEvents(eRes.data.data || []);
        setClubs(cRes.data.data || []);
      } catch (err) {
        console.error('Failed loading coordinator data', err);
      }
    };
    fetchData();
  }, []);

  const handleVerifyQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    try {
      const res = await api.post('/events/verify-qr', { qrPassCode: qrInput });
      setQrResult({ success: true, message: res.data.message });
    } catch (err: any) {
      setQrResult({ success: false, message: err.response?.data?.message || 'Invalid QR Ticket Pass.' });
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/events', eventData);
      alert('Campus event created and published!');
      setCreateEventModal(false);
      const eRes = await api.get('/events');
      setEvents(eRes.data.data || []);
    } catch (err: any) {
      alert('Failed creating event.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Coordinator Header */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-subtle border border-brand-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-xs font-extrabold uppercase tracking-wider text-brand-100">
              <Users className="w-3.5 h-3.5" /> Coordinator Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hello, {user?.name}!</h1>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl font-medium">
              Campus Activities, Club Societies & QR Entry Ticket Verification
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black/20 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/10 shrink-0">
            <div className="px-3 py-1 hidden sm:block border-r border-white/10 text-right">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-brand-200">System Mode</span>
              <span className="text-xs font-bold text-white">Live Scanner Active</span>
            </div>
            <Button
              onClick={() => setCreateEventModal(true)}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm text-xs font-extrabold transition-all active:scale-[0.98]"
              icon={<Plus className="w-4 h-4" />}
            >
              Create New Campus Event
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Events</span>
            <div className="p-2 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl"><Calendar className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{events.length}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Scheduled campus activities</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Campus Clubs</span>
            <div className="p-2 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{clubs.length}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered student societies</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Registrations</span>
            <div className="p-2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl"><QrCode className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">150+</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Issued QR entry passes</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Announcements</span>
            <div className="p-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl"><Bell className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">5</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Broadcasted notices</p>
        </Card>
      </div>

      {/* QR Code Ticket Scanner / Verification Simulator */}
      <Card className="p-6 space-y-4 border border-brand-500/20 bg-brand-500/5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-brand-500" /> Event Entry Ticket Scanner Validator
          </h3>
          <Badge variant="brand">Live Verification</Badge>
        </div>

        <form onSubmit={handleVerifyQR} className="flex gap-3 max-w-xl">
          <Input
            placeholder="Scan or enter QR Ticket Pass Code (e.g. TICKET-HACK-STU042)"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            className="text-xs"
          />
          <Button type="submit" className="shrink-0" icon={<Search className="w-4 h-4" />}>
            Validate Ticket
          </Button>
        </form>

        {qrResult && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
              qrResult.success
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
            }`}
          >
            {qrResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-rose-500" />}
            {qrResult.message}
          </div>
        )}
      </Card>

      {/* Events List & Clubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Managed Campus Events</h3>
            <Button size="sm" onClick={() => setCreateEventModal(true)}>+ New Event</Button>
          </div>
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="p-4 rounded-2xl border border-slate-200 dark:border-nex-border bg-slate-50 dark:bg-nex-elevated flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{e.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{e.venue} • Capacity: {e.capacity}</p>
                </div>
                <Link to="/events"><Button size="sm" variant="outline">Manage</Button></Link>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Student Clubs</h3>
            <Link to="/clubs"><Button size="sm" variant="outline">View Directory</Button></Link>
          </div>
          <div className="space-y-3">
            {clubs.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 dark:border-nex-border bg-slate-50 dark:bg-nex-elevated flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{c.category} • {c.memberCount || 12} Members</p>
                </div>
                <Badge variant="brand">{c.category}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Create Event Modal */}
      <Modal isOpen={createEventModal} onClose={() => setCreateEventModal(false)} title="Create New Campus Event">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Name"
            placeholder="DevFusion 2026 AI Hackathon"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            required
          />
          <Input
            label="Venue Location"
            placeholder="Innovation Auditorium"
            value={eventData.venue}
            onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
            required
          />
          <Input
            label="Description"
            placeholder="Premier 48-hour campus hackathon..."
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Event Date"
              type="datetime-local"
              value={eventData.eventDate}
              onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
              required
            />
            <Input
              label="Registration Deadline"
              type="datetime-local"
              value={eventData.registrationDeadline}
              onChange={(e) => setEventData({ ...eventData, registrationDeadline: e.target.value })}
              required
            />
          </div>
          <Input
            label="Capacity Seat Limit"
            type="number"
            value={eventData.capacity}
            onChange={(e) => setEventData({ ...eventData, capacity: e.target.value })}
          />
          <Button type="submit" className="w-full">Publish Campus Event</Button>
        </form>
      </Modal>
    </div>
  );
};
