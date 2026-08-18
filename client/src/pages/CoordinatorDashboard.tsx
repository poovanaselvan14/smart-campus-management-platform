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
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-glow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-200">Coordinator Command Center</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Hello, {user?.name}! 🎪</h1>
            <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
              Campus Activities, Club Societies & QR Entry Ticket Verification
            </p>
          </div>
          <Button
            onClick={() => setCreateEventModal(true)}
            className="bg-white text-purple-800 hover:bg-purple-50 border-none shadow-lg text-xs font-bold"
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Campus Event
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Active Events</span>
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl"><Calendar className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{events.length}</div>
          <p className="text-[10px] text-gray-400">Scheduled campus activities</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Campus Clubs</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{clubs.length}</div>
          <p className="text-[10px] text-gray-400">Registered student societies</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Registrations</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><QrCode className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">150+</div>
          <p className="text-[10px] text-gray-400">Issued QR entry passes</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Announcements</span>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Bell className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">5</div>
          <p className="text-[10px] text-gray-400">Broadcasted notices</p>
        </Card>
      </div>

      {/* QR Code Ticket Scanner / Verification Simulator */}
      <Card className="p-6 space-y-4 border-2 border-purple-500/30 bg-purple-500/5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-500" /> Event Entry Ticket Scanner Validator
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
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
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
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Managed Campus Events</h3>
            <Button size="sm" onClick={() => setCreateEventModal(true)}>+ New Event</Button>
          </div>
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="p-4 rounded-2xl border border-gray-200 dark:border-dark-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{e.title}</h4>
                  <p className="text-[10px] text-gray-400">{e.venue} • Capacity: {e.capacity}</p>
                </div>
                <Link to="/events"><Button size="sm" variant="outline">Manage</Button></Link>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Active Student Clubs</h3>
            <Link to="/clubs"><Button size="sm" variant="outline">View Directory</Button></Link>
          </div>
          <div className="space-y-3">
            {clubs.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-gray-200 dark:border-dark-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{c.name}</h4>
                  <p className="text-[10px] text-gray-400">{c.category} • {c.memberCount || 12} Members</p>
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
