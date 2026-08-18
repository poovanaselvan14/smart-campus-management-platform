import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, UserCheck, Shield } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STUDENT',
    rollNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check form details.');
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
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Create your account</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Join the operating system for your campus</p>
        </div>

        <Card className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Full Name"
              placeholder="Alex Johnson"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<UserIcon className="w-4 h-4" />}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@campus.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              icon={<Lock className="w-4 h-4" />}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 555-0199"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={<Phone className="w-4 h-4" />}
            />
            <Select
              label="Requested Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              icon={<Shield className="w-4 h-4" />}
              options={[
                { value: 'STUDENT', label: 'Student' },
                { value: 'FACULTY', label: 'Faculty' },
                { value: 'COORDINATOR', label: 'Coordinator' },
              ]}
            />

            {formData.role === 'STUDENT' && (
              <Input
                label="Roll / Student ID"
                placeholder="2024-CSE-099"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              />
            )}

            <Button type="submit" className="w-full mt-2" isLoading={loading} icon={<UserCheck className="w-4 h-4" />}>
              Create Account
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
