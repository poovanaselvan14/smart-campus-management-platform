import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GraduationCap, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-200">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-dark-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-500 text-white rounded-xl shadow-md shadow-brand-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-500 dark:from-brand-400 dark:to-purple-400">
              CampusSync
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-brand-500 transition-colors">Features</a>
            <a href="#roles" className="hover:text-brand-500 transition-colors">Role Benefits</a>
            <a href="#testimonials" className="hover:text-brand-500 transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-brand-500 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-500 shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all"
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

      <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border py-12 text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-gray-900 dark:text-white text-sm">CampusSync SaaS</span>
            <span>© 2026 Production Smart Campus Management Platform</span>
          </div>
          <div className="flex gap-6">
            <a href="/api/docs" target="_blank" rel="noreferrer" className="hover:text-brand-500 transition-colors">Swagger API Docs</a>
            <a href="#features" className="hover:text-brand-500 transition-colors">Platform Specs</a>
            <a href="#roles" className="hover:text-brand-500 transition-colors">RBAC Matrix</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
