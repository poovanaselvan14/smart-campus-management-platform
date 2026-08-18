import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User as UserIcon, Phone, UserCheck } from 'lucide-react';
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
      setError(err.response?.data?.message || 'Registration failed.');
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
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Join your campus digital management portal</p>
        </div>

        <Card className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Full Name"
              placeholder="Ethan Morgan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<UserIcon className="w-4 h-4" />}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="ethan@campus.edu"
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

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
