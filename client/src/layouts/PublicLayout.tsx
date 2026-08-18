import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GraduationCap, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-nex-bg text-slate-900 dark:text-nex-text transition-colors duration-200">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-nex-surface/95 backdrop-blur-md border-b border-slate-200 dark:border-nex-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 text-white rounded-xl flex items-center justify-center font-extrabold text-base shadow-sm">
              N
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              NEXCAMPUS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-extrabold text-slate-700 dark:text-slate-200">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
            <a href="#roles" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Role Benefits</a>
            <a href="#quick-demo" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Demo Login</a>
            <a href="#faq" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-nex-border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-nex-elevated transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-xs font-extrabold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-sm flex items-center gap-2 transition-all"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-nex-elevated border border-slate-300 dark:border-nex-border rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-extrabold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-nex-surface border-t border-slate-200 dark:border-nex-border py-10 text-xs text-slate-600 dark:text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 text-white rounded-md flex items-center justify-center font-bold text-xs">
              N
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">NEXCAMPUS SaaS</span>
            <span>© 2026 The Operating System for Your Campus</span>
          </div>
          <div className="flex gap-6 font-semibold">
            <a href="/api/docs" target="_blank" rel="noreferrer" className="hover:text-brand-500 transition-colors">Swagger API Docs</a>
            <a href="#features" className="hover:text-brand-500 transition-colors">Platform Specs</a>
            <a href="#roles" className="hover:text-brand-500 transition-colors">RBAC Matrix</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
