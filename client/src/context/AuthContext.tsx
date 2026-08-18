import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerUser: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        if (token) {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        }
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, [token]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwtToken, user: loggedUser } = res.data.data;
    setToken(jwtToken);
    setUser(loggedUser);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    return loggedUser;
  };

  const registerUser = async (data: any): Promise<User> => {
    const res = await api.post('/auth/register', data);
    const { token: jwtToken, user: registeredUser } = res.data.data;
    setToken(jwtToken);
    setUser(registeredUser);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    return registeredUser;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const hasRole = (...roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, registerUser, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
