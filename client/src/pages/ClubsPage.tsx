import React, { useEffect, useState } from 'react';
import { Users, UserPlus, UserCheck, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../api/client';
import { Club } from '../types';
import { useAuth } from '../context/AuthContext';

export const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);

  const fetchClubs = async () => {
    try {
      const res = await api.get('/clubs');
      setClubs(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleToggleMembership = async (clubId: string) => {
    try {
      const res = await api.post(`/clubs/${clubId}/toggle`);
      alert(res.data.message);
      fetchClubs();
    } catch (err) {
      alert('Failed toggling club membership.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-sky-500" /> Campus Clubs & Student Societies
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Browse technological, cultural, and robotics student societies. Join clubs to participate in extra-curricular activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((c) => (
          <Card key={c.id} className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="brand">{c.category}</Badge>
                <span className="text-xs text-gray-400">{c.memberCount || 12} Members</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{c.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{c.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
              {user?.role === 'STUDENT' && (
                <Button
                  className="w-full"
                  variant={c.isJoined ? 'secondary' : 'primary'}
                  onClick={() => handleToggleMembership(c.id)}
                  icon={c.isJoined ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                >
                  {c.isJoined ? 'Member (Click to Leave)' : 'Join Campus Club'}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
