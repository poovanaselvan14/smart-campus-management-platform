import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { FacultyDashboard } from './FacultyDashboard';
import { CoordinatorDashboard } from './CoordinatorDashboard';
import { AdminDashboard } from './AdminDashboard';

export const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'FACULTY':
      return <FacultyDashboard />;
    case 'COORDINATOR':
      return <CoordinatorDashboard />;
    case 'STUDENT':
    default:
      return <StudentDashboard />;
  }
};
