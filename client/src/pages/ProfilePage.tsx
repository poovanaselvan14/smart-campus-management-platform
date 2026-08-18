import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, Award, FileText, Globe, Edit, CheckCircle, Save } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [resumeUrl, setResumeUrl] = useState(user?.profile?.resumeUrl || '');
  const [rollNumber, setRollNumber] = useState(user?.profile?.rollNumber || '');

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await api.patch('/users/me', {
        name,
        phone,
        bio,
        resumeUrl,
        rollNumber,
      });
      alert('Profile updated and saved to PostgreSQL/SQLite database successfully!');
      setIsEditing(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed saving profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <Card className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-glow shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || 'PS'}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{user?.name}</h1>
              <Badge variant="brand">{user?.role}</Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-nex-muted">Artificial Intelligence & Data Science</p>
            <p className="text-xs font-mono text-gray-400">Student ID: {user?.profile?.rollNumber || '2024-CSE-042'}</p>
          </div>

          <Button
            size="sm"
            variant={isEditing ? 'secondary' : 'outline'}
            icon={isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'personal', label: 'Personal Information' },
          { id: 'academic', label: 'Academic Record' },
          { id: 'skills', label: 'Skills & Resume' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'personal' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Personal Information</h3>
            {isEditing && (
              <Button size="sm" isLoading={isSaving} onClick={handleSaveProfile} icon={<Save className="w-3.5 h-3.5" />}>
                Save Changes to DB
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
            <Input
              label="Email Address"
              value={user?.email}
              disabled
              helperText="Primary database identifier (locked)"
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
            />
            <Input
              label="Student Roll / Employee ID"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              disabled={!isEditing}
            />
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-nex-muted mb-1">
                Bio & Career Summary
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-nex-elevated border border-gray-200 dark:border-nex-border text-gray-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'academic' && (
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Academic Performance Record</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-nex-elevated rounded-xl space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Current Cumulative GPA</span>
              <div className="text-2xl font-extrabold text-brand-500">{user?.profile?.gpa || 3.82} / 4.00</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-nex-elevated rounded-xl space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Semester / Year</span>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">Semester 4 (Year III)</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-nex-elevated rounded-xl space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Academic Standing</span>
              <div className="text-2xl font-extrabold text-emerald-500">Honors Scholar</div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'skills' && (
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Skills & Active Resume Link</h3>
          <div className="space-y-3">
            <Input
              label="Resume PDF URL"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              disabled={!isEditing}
              placeholder="https://example.com/resumes/my_resume.pdf"
            />
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-block pt-1">
                <Button variant="outline" size="sm" icon={<FileText className="w-3.5 h-3.5" />}>
                  Open Resume Document
                </Button>
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
