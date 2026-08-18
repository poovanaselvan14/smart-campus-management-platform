import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, X, FileText, Calendar, Briefcase, Info, AlertTriangle } from 'lucide-react';
import { api } from '../api/client';
import { Notification } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications || []);
    } catch (e) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const markRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ASSIGNMENT': return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'EVENT': return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'PLACEMENT': return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'ATTENDANCE': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default: return <Info className="w-4 h-4 text-brand-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-sm bg-white dark:bg-dark-card border-l border-gray-200 dark:border-dark-border shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markRead('all')}
                    title="Mark all read"
                    className="p-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Read All
                  </button>
                  <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markRead(n.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        n.read
                          ? 'bg-gray-50/50 dark:bg-dark-bg/40 border-gray-200/50 dark:border-dark-border/40 opacity-70'
                          : 'bg-white dark:bg-dark-hover border-brand-500/30 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-dark-bg mt-0.5">{getNotificationIcon(n.type)}</div>
                        <div className="flex-1">
                          <h5 className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-xs">No notifications in your inbox.</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
