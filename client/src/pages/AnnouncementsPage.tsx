import React, { useEffect, useState } from 'react';
import { Bell, Plus, AlertTriangle, Shield, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { api } from '../api/client';
import { Announcement } from '../types';
import { useAuth } from '../context/AuthContext';

export const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audienceRole: 'ALL',
    priority: 'MEDIUM',
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/announcements', formData);
      alert('Announcement broadcasted cleanly!');
      setCreateModal(false);
      fetchAnnouncements();
    } catch (err) {
      alert('Failed broadcasting announcement.');
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'URGENT': return <Badge variant="danger">URGENT</Badge>;
      case 'HIGH': return <Badge variant="warning">HIGH</Badge>;
      case 'MEDIUM': return <Badge variant="brand">MEDIUM</Badge>;
      default: return <Badge variant="neutral">LOW</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-500" /> Campus Announcements & Notice Board
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Official broadcasts filtered by target audience and priority alerts.
          </p>
        </div>
        {['FACULTY', 'COORDINATOR', 'ADMIN'].includes(user?.role || '') && (
          <Button onClick={() => setCreateModal(true)} icon={<Plus className="w-4 h-4" />}>
            Publish Notice
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getPriorityBadge(a.priority)}
                <Badge variant="info">Target: {a.audienceRole}</Badge>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {new Date(a.createdAt).toLocaleString()}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">{a.title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{a.content}</p>
            <div className="pt-2 border-t border-gray-100 dark:border-dark-border text-[10px] text-gray-400">
              Published by: {a.createdBy?.name || 'Campus Administrator'} ({a.createdBy?.role || 'ADMIN'})
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Publish Official Notice">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            placeholder="Mid-Term Examination Schedule Released"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Notice Content"
            placeholder="Detailed broadcast content..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Audience Target"
              value={formData.audienceRole}
              onChange={(e) => setFormData({ ...formData, audienceRole: e.target.value })}
              options={[
                { value: 'ALL', label: 'All Users' },
                { value: 'STUDENT', label: 'Students Only' },
                { value: 'FACULTY', label: 'Faculty Only' },
                { value: 'COORDINATOR', label: 'Coordinators Only' },
              ]}
            />
            <Select
              label="Priority Level"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
            />
          </div>
          <Button type="submit" className="w-full">Broadcast Announcement</Button>
        </form>
      </Modal>
    </div>
  );
};
