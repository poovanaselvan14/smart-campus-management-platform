import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Calendar,
  Briefcase,
  Users,
  Bell,
  Plus,
  ShieldCheck,
  ArrowRight,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Take Attendance Session', icon: <Plus className="w-4 h-4 text-amber-500" />, action: () => { navigate('/attendance'); onClose(); }, roles: ['FACULTY', 'ADMIN'] },
    { label: 'Create New Assignment', icon: <Plus className="w-4 h-4 text-indigo-500" />, action: () => { navigate('/assignments'); onClose(); }, roles: ['FACULTY', 'ADMIN'] },
    { label: 'Create Campus Event', icon: <Plus className="w-4 h-4 text-purple-500" />, action: () => { navigate('/events'); onClose(); }, roles: ['COORDINATOR', 'ADMIN'] },
    { label: 'Submit Solution / Repo', icon: <FileText className="w-4 h-4 text-emerald-500" />, action: () => { navigate('/assignments'); onClose(); }, roles: ['STUDENT'] },
  ];

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 text-brand-500" /> },
    { label: 'Attendance', path: '/attendance', icon: <CalendarCheck className="w-4 h-4 text-emerald-500" /> },
    { label: 'Assignments', path: '/assignments', icon: <FileText className="w-4 h-4 text-indigo-500" /> },
    { label: 'Events & QR Tickets', path: '/events', icon: <Calendar className="w-4 h-4 text-purple-500" /> },
    { label: 'Placement Drives', path: '/placements', icon: <Briefcase className="w-4 h-4 text-amber-500" /> },
    { label: 'Campus Clubs', path: '/clubs', icon: <Users className="w-4 h-4 text-sky-500" /> },
    { label: 'Announcements', path: '/announcements', icon: <Bell className="w-4 h-4 text-rose-500" /> },
  ];

  const filteredActions = quickActions.filter(a => a.roles.includes(user?.role || 'STUDENT') && a.label.toLowerCase().includes(query.toLowerCase()));
  const filteredNav = navigationItems.filter(n => n.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-xl bg-white dark:bg-nex-surface border border-gray-200 dark:border-nex-border rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header Input */}
          <div className="flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-nex-border">
            <Search className="w-4 h-4 text-gray-400 dark:text-nex-muted mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or jump to... (Esc to close)"
              className="w-full text-xs font-medium bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
            <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-2 space-y-3">
            {/* Quick Actions */}
            {filteredActions.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-nex-muted">
                  Quick Actions
                </span>
                {filteredActions.map((act, i) => (
                  <button
                    key={i}
                    onClick={act.action}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-nex-elevated text-xs font-semibold text-gray-900 dark:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {act.icon}
                      <span>{act.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Navigation */}
            {filteredNav.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-nex-muted">
                  Navigation
                </span>
                {filteredNav.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { navigate(item.path); onClose(); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-nex-elevated text-xs font-semibold text-gray-900 dark:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">Jump →</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
