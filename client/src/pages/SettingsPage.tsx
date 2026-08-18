import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Sun, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('account');
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-brand-500" /> Platform Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-nex-muted mt-1">
          Configure your personal account preferences, security settings, and notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Sidebar */}
        <Card className="p-3 space-y-1 md:col-span-1">
          {[
            { id: 'account', label: 'Account & Profile', icon: <User className="w-4 h-4" /> },
            { id: 'security', label: 'Security & Password', icon: <Lock className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notification Preferences', icon: <Bell className="w-4 h-4" /> },
            { id: 'appearance', label: 'Appearance & Theme', icon: <Sun className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSection === item.id
                  ? 'bg-brand-600/10 text-brand-500 border border-brand-500/20 font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-nex-elevated'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </Card>

        {/* Settings Form Body */}
        <Card className="p-6 md:col-span-3 space-y-6">
          {activeSection === 'account' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Account Details</h3>
              <Input label="Display Name" defaultValue="Poovana Selvan" />
              <Input label="Email Address" defaultValue="student@demo.com" disabled />
              <Button size="sm">Save Changes</Button>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Change Password</h3>
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
              <Button size="sm">Update Security Password</Button>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Appearance & Theme</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-nex-elevated rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Dark Mode</h4>
                  <p className="text-[11px] text-gray-400">Toggle dark slate workspace palette (#0B0D10)</p>
                </div>
                <Button size="sm" variant="outline" onClick={toggleTheme}>
                  {isDark ? 'Switch to Light' : 'Switch to Dark'}
                </Button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notification Inboxes</h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                  <span>Receive email alerts for assignment deadlines</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                  <span>Receive attendance warnings when below 80%</span>
                </label>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
