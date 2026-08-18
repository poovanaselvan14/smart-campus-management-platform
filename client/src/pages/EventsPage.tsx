import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, QrCode, Plus, CheckCircle2, ShieldCheck, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../api/client';
import { Event } from '../types';
import { useAuth } from '../context/AuthContext';

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const isCoordinatorOrAdmin = ['COORDINATOR', 'ADMIN'].includes(user?.role || '');

  const [events, setEvents] = useState<Event[]>([]);
  const [qrModalPass, setQrModalPass] = useState<{ title: string; code: string } | null>(null);

  // Coordinator QR Scanner Modal
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanCodeInput, setScanCodeInput] = useState('TICKET-HACK-STU042');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Coordinator Create Event Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [capacity, setCapacity] = useState('100');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.data || []);
    } catch (err) {
      console.error('Failed loading events', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    try {
      const res = await api.post(`/events/${eventId}/register`);
      alert(res.data.message || 'Registered! Ticket pass generated.');
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed.');
    }
  };

  const handleVerifyQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await api.post('/events/verify-qr', { qrPassCode: scanCodeInput });
      setScanResult(res.data);
      fetchEvents();
    } catch (err: any) {
      setScanResult({ success: false, message: err.response?.data?.message || 'Invalid or duplicate ticket code.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/events', {
        title,
        description,
        venue,
        eventDate: eventDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        capacity: Number(capacity),
        category: 'Hackathon',
      });
      alert('New campus event published!');
      setIsCreateOpen(false);
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed creating event.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-500" /> Campus Events & QR Pass Tickets
          </h1>
          <p className="text-xs text-gray-500 dark:text-nex-muted mt-1">
            Discover hackathons, guest lectures, workshops, and obtain entry passes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCoordinatorOrAdmin && (
            <>
              <Button variant="outline" icon={<QrCode className="w-4 h-4" />} onClick={() => setIsScannerOpen(true)}>
                Scan QR Ticket
              </Button>
              <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
                Create Event
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => {
          const registeredCount = (event as any).registeredCount || 0;
          const capacity = event.capacity || 100;
          const isFull = registeredCount >= capacity;
          const isReg = (event as any).isRegistered;
          const regData = (event as any).registration;

          return (
            <Card key={event.id} className="space-y-4 flex flex-col justify-between overflow-hidden">
              <div className="space-y-3">
                <div className="h-36 rounded-xl overflow-hidden relative">
                  <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                  <Badge variant="brand" className="absolute top-3 left-3 shadow-md">
                    {event.category || 'General'}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-nex-muted line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-nex-border">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {event.venue}
                    </span>
                    <span className="font-mono text-purple-400 font-bold">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-gray-500">Seat Capacity</span>
                      <span className={isFull ? 'text-rose-500' : 'text-emerald-500'}>
                        {registeredCount} / {capacity} {isFull ? '(FULL)' : 'Registered'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-nex-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-brand-500'}`}
                        style={{ width: `${Math.min(100, (registeredCount / capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {isReg ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    icon={<QrCode className="w-3.5 h-3.5 text-purple-500" />}
                    onClick={() => setQrModalPass({ title: event.title, code: regData?.qrPassCode || 'TICKET-HACK-STU042' })}
                  >
                    View QR Entry Ticket
                  </Button>
                ) : isFull ? (
                  <Button size="sm" disabled className="w-full bg-gray-300 text-gray-600">
                    Event Full
                  </Button>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => handleRegister(event.id)}>
                    Register for Event Pass
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* QR Ticket Display Modal */}
      <Modal isOpen={!!qrModalPass} onClose={() => setQrModalPass(null)} title="Official Entry Ticket Pass">
        {qrModalPass && (
          <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{qrModalPass.title}</h4>
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
              <QRCodeSVG value={qrModalPass.code} size={180} level="H" />
            </div>
            <span className="font-mono text-xs text-brand-500 font-bold bg-brand-500/10 px-3 py-1 rounded-full">
              {qrModalPass.code}
            </span>
            <p className="text-[11px] text-gray-400">Scan at entrance for venue entry validation.</p>
          </div>
        )}
      </Modal>

      {/* Coordinator QR Scanner Validator Modal */}
      <Modal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} title="Venue Ticket Scanner Validator">
        <form onSubmit={handleVerifyQR} className="space-y-4">
          <Input
            label="Ticket QR Code Value"
            value={scanCodeInput}
            onChange={(e) => setScanCodeInput(e.target.value)}
            placeholder="TICKET-HACK-STU042"
            icon={<Search className="w-4 h-4" />}
            required
          />

          <Button type="submit" className="w-full" isLoading={isVerifying} icon={<ShieldCheck className="w-4 h-4" />}>
            Validate Ticket Code
          </Button>

          {scanResult && (
            <div className={`p-4 rounded-xl text-xs font-bold ${scanResult.success ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
              {scanResult.message}
            </div>
          )}
        </form>
      </Modal>

      {/* Create Event Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Campus Event">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Seat Capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
            <Input label="Event Date" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-nex-elevated border border-gray-200 dark:border-nex-border text-gray-900 dark:text-white outline-none focus:border-brand-500"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit">Publish Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
