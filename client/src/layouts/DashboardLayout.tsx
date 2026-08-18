import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  TrendingUp,
  CalendarCheck,
  FileText,
  BookOpen,
  Calendar,
  Users,
  Briefcase,
  Bell,
  Search,
  Settings as SettingsIcon,
  User as UserIcon,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Command,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CommandPalette } from '../components/ui/CommandPalette';
import { NotificationDrawer } from '../components/NotificationDrawer';
import { AIAssistantWidget } from '../components/AIAssistantWidget';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = user?.role || 'STUDENT';

  // Categorized Sidebar Sections
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'] },
        { label: 'Analytics Console', path: '/admin/logs', icon: <TrendingUp className="w-4 h-4" />, roles: ['ADMIN'] },
      ],
    },
    {
      title: 'ACADEMICS',
      items: [
        { label: 'Attendance', path: '/attendance', icon: <CalendarCheck className="w-4 h-4" />, roles: ['STUDENT', 'FACULTY', 'ADMIN'] },
        { label: 'Assignments', path: '/assignments', icon: <FileText className="w-4 h-4" />, roles: ['STUDENT', 'FACULTY', 'ADMIN'] },
      ],
    },
    {
      title: 'CAMPUS',
      items: [
        { label: 'Events & Passes', path: '/events', icon: <Calendar className="w-4 h-4" />, roles: ['STUDENT', 'COORDINATOR', 'ADMIN'] },
        { label: 'Campus Clubs', path: '/clubs', icon: <Users className="w-4 h-4" />, roles: ['STUDENT', 'COORDINATOR', 'ADMIN'] },
        { label: 'Placements', path: '/placements', icon: <Briefcase className="w-4 h-4" />, roles: ['STUDENT', 'COORDINATOR', 'ADMIN'] },
      ],
    },
    {
      title: 'COMMUNICATION',
      items: [
        { label: 'Announcements', path: '/announcements', icon: <Bell className="w-4 h-4" />, roles: ['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'] },
        { label: 'User Directory', path: '/admin/users', icon: <ShieldCheck className="w-4 h-4" />, roles: ['ADMIN'] },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Settings', path: '/settings', icon: <SettingsIcon className="w-4 h-4" />, roles: ['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'] },
        { label: 'Profile', path: '/profile', icon: <UserIcon className="w-4 h-4" />, roles: ['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'] },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/dashboard') return 'Dashboard';
    if (p === '/attendance') return 'Attendance';
    if (p === '/assignments') return 'Assignments';
    if (p === '/events') return 'Events & Passes';
    if (p === '/placements') return 'Placements';
    if (p === '/clubs') return 'Campus Clubs';
    if (p === '/announcements') return 'Announcements';
    if (p === '/admin/users') return 'User Directory';
    if (p === '/admin/logs') return 'Activity Audit Logs';
    if (p === '/settings') return 'Settings';
    if (p === '/profile') return 'Profile';
    return 'NEXCAMPUS';
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-nex-bg text-gray-900 dark:text-gray-100 transition-colors duration-150">
      {/* Desktop Fixed Linear-Style Sidebar */}
      <aside
        className={`hidden md:flex flex-col sticky top-0 h-screen bg-white dark:bg-nex-surface border-r border-gray-200 dark:border-nex-border transition-all duration-200 z-30 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-nex-border shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              N
            </div>
            {!collapsed && (
              <span className="font-extrabold text-sm tracking-tight text-gray-900 dark:text-white">
                NEXCAMPUS
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-nex-elevated transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
          {navSections.map((sec, idx) => {
            const allowedItems = sec.items.filter((item) => item.roles.includes(userRole));
            if (allowedItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {!collapsed && (
                  <h5 className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-nex-muted">
                    {sec.title}
                  </h5>
                )}
                {allowedItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-600/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-bold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-nex-elevated hover:text-gray-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <div className="shrink-0">{item.icon}</div>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        {/* User Avatar Card at Bottom */}
        <div className="p-3 border-t border-gray-100 dark:border-nex-border shrink-0">
          <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-nex-elevated rounded-xl border border-gray-200/60 dark:border-nex-border">
            <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'EX'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.name}</h4>
                <span className="text-[10px] text-brand-500 font-bold uppercase block">{userRole}</span>
              </div>
            )}
            {!collapsed && (
              <button onClick={handleLogout} title="Sign Out" className="p-1 text-gray-400 hover:text-rose-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 h-14 bg-white/80 dark:bg-nex-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-nex-border px-4 sm:px-6 flex items-center justify-between">
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-nex-muted">
            <span className="text-gray-900 dark:text-white font-bold">{getPageTitle()}</span>
          </div>

          {/* Center Search / Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 w-48 sm:w-64 bg-gray-100 dark:bg-nex-elevated text-gray-400 dark:text-nex-muted rounded-xl text-xs border border-gray-200 dark:border-nex-border hover:border-brand-500 transition-all text-left"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Search students, events, assignments...</span>
            <kbd className="hidden sm:inline-block ml-auto text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-nex-border rounded font-mono text-gray-500">Ctrl+K</kbd>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-nex-elevated transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-nex-elevated transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <Link
              to="/profile"
              className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ml-1"
            >
              {user?.name?.slice(0, 2).toUpperCase() || 'EX'}
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-nex-surface/95 backdrop-blur-lg border-t border-gray-200 dark:border-nex-border px-2 py-2 flex justify-around">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-semibold ${isActive ? 'text-brand-500' : 'text-gray-400'}`}>
          <LayoutDashboard className="w-4 h-4" /> Home
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-semibold ${isActive ? 'text-brand-500' : 'text-gray-400'}`}>
          <CalendarCheck className="w-4 h-4" /> Attendance
        </NavLink>
        <NavLink to="/assignments" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-semibold ${isActive ? 'text-brand-500' : 'text-gray-400'}`}>
          <FileText className="w-4 h-4" /> Assignments
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-semibold ${isActive ? 'text-brand-500' : 'text-gray-400'}`}>
          <Calendar className="w-4 h-4" /> Events
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-semibold ${isActive ? 'text-brand-500' : 'text-gray-400'}`}>
          <UserIcon className="w-4 h-4" /> Profile
        </NavLink>
      </div>

      {/* Command Palette & Overlay Modals */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      <AIAssistantWidget />
    </div>
  );
};
