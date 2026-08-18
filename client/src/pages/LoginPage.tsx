import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-dark-bg">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-500 text-white rounded-2xl shadow-lg">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-500">
              CampusSync
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Access your role-based campus dashboard</p>
        </div>

        <Card className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
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

          <div className="pt-2 border-t border-gray-100 dark:border-dark-border text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Instant Demo Personas (1-Click Login):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('student@demo.com')}
                className="p-2 bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 rounded-xl hover:bg-brand-500/20 font-bold transition-all text-left"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('faculty@demo.com')}
                className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 font-bold transition-all text-left"
              >
                👨‍🏫 Faculty
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('coordinator@demo.com')}
                className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 font-bold transition-all text-left"
              >
                🎪 Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@demo.com')}
                className="p-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 font-bold transition-all text-left"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-500 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};
