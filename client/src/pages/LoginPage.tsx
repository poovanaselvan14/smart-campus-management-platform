import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck, GraduationCap, UserCheck, Calendar } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setLoading(true);
    setError('');
    try {
      await login(demoEmail, 'Password123!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-nex-bg text-slate-900 dark:text-nex-text">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm">
              N
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              NEXCAMPUS
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Sign in to your account</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">The operating system for your campus</p>
        </div>

        <Card className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="student@demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" className="w-full" isLoading={loading} icon={<LogIn className="w-4 h-4" />}>
              Sign In
            </Button>
          </form>

          <div className="pt-3 border-t border-slate-200 dark:border-nex-border text-center space-y-3">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-500" /> Demo Account Authenticator:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('student@demo.com')}
                className="p-2.5 bg-slate-100 dark:bg-nex-elevated text-slate-900 dark:text-white border border-slate-300 dark:border-nex-border rounded-xl hover:border-brand-500 font-extrabold transition-all text-left flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-brand-500 shrink-0" /> Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('faculty@demo.com')}
                className="p-2.5 bg-slate-100 dark:bg-nex-elevated text-slate-900 dark:text-white border border-slate-300 dark:border-nex-border rounded-xl hover:border-amber-500 font-extrabold transition-all text-left flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-amber-500 shrink-0" /> Faculty
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('coordinator@demo.com')}
                className="p-2.5 bg-slate-100 dark:bg-nex-elevated text-slate-900 dark:text-white border border-slate-300 dark:border-nex-border rounded-xl hover:border-purple-500 font-extrabold transition-all text-left flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-purple-500 shrink-0" /> Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@demo.com')}
                className="p-2.5 bg-slate-100 dark:bg-nex-elevated text-slate-900 dark:text-white border border-slate-300 dark:border-nex-border rounded-xl hover:border-rose-500 font-extrabold transition-all text-left flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" /> Admin
              </button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};
