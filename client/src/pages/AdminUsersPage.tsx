import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Shield, Trash2, Search, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { api } from '../api/client';
import { User, Role } from '../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: 'Password123!',
    name: '',
    role: 'STUDENT',
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/users?search=${encodeURIComponent(search)}`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      alert('User role updated & audit log recorded!');
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Role change failed.');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user from the platform?')) return;
    try {
      await api.delete(`/users/${userId}`);
      alert('User removed from platform.');
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      alert('User created successfully!');
      setCreateModal(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Creation failed.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-500" /> Admin User Management Directory
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage user accounts, assign RBAC permissions, update roles, and govern platform access.
          </p>
        </div>
        <Button onClick={() => setCreateModal(true)} icon={<UserPlus className="w-4 h-4" />}>
          Add User Account
        </Button>
      </div>

      <Card className="p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter users by name or email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent outline-none text-gray-900 dark:text-white"
        />
      </Card>

      <Card className="p-6">
        <Table headers={['User Name', 'Email Address', 'Role', 'Status', 'Actions']}>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-dark-hover/50">
              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{u.name}</td>
              <td className="px-6 py-4 text-gray-500">{u.email}</td>
              <td className="px-6 py-4">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-dark-hover border border-gray-300 dark:border-dark-border rounded-lg outline-none cursor-pointer"
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="FACULTY">FACULTY</option>
                  <option value="COORDINATOR">COORDINATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <Badge variant="success">ACTIVE</Badge>
              </td>
              <td className="px-6 py-4">
                <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)} icon={<Trash2 className="w-3.5 h-3.5" />}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create User Account">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Dr. Samuel Carter"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="samuel@campus.edu"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <Select
            label="Assigned Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            options={[
              { value: 'STUDENT', label: 'Student' },
              { value: 'FACULTY', label: 'Faculty' },
              { value: 'COORDINATOR', label: 'Coordinator' },
              { value: 'ADMIN', label: 'Administrator' },
            ]}
          />
          <Button type="submit" className="w-full">Create Account & Audit Log</Button>
        </form>
      </Modal>
    </div>
  );
};
