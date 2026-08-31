'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchFromApi } from '@/lib/api';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'role_learner' | 'role_trainer' | 'role_sysadmin';
  role_name: string;
  designation: string;
  department: string;
  cadre: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  demoLogin: (roleKey: 'learner' | 'trainer' | 'admin' | 'learner_jso') => Promise<void>;
  logout: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr_sso_01',
  full_name: 'Arjun Sharma, ISS',
  email: 'arjun.sharma@mospi.gov.in',
  role: 'role_learner',
  role_name: 'Learner',
  designation: 'Senior Statistical Officer (SSO)',
  department: 'National Accounts Division (NAD)',
  cadre: 'Indian Statistical Service (Grade IV)',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  token: null,
  loading: false,
  login: async () => false,
  demoLogin: async () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [token, setToken] = useState<string | null>('demo_mock_jwt_token_2026');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('saksham_token');
    const savedUser = localStorage.getItem('saksham_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      const data = await fetchFromApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass })
      });
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('saksham_token', data.token);
        localStorage.setItem('saksham_user', JSON.stringify(data.user));
        setLoading(false);
        return true;
      }
    } catch (e) {
      console.warn('Backend login fallback used:', e);
      // Fallback demo login
      demoLogin('learner');
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const demoLogin = async (roleKey: 'learner' | 'trainer' | 'admin' | 'learner_jso') => {
    setLoading(true);
    try {
      const data = await fetchFromApi('/api/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ role: roleKey })
      });
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('saksham_token', data.token);
        localStorage.setItem('saksham_user', JSON.stringify(data.user));
      }
    } catch (e) {
      // Local demo switch fallback
      let newUser: User = DEFAULT_USER;
      if (roleKey === 'trainer') {
        newUser = {
          id: 'usr_trainer_01',
          full_name: 'Dr. Radhika Sen',
          email: 'radhika.sen@nssta.gov.in',
          role: 'role_trainer',
          role_name: 'Trainer/Admin',
          designation: 'Deputy Director & Senior Faculty',
          department: 'National Statistical Systems Training Academy (NSSTA)',
          cadre: 'Indian Statistical Service (Senior Time Scale)',
          avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
        };
      } else if (roleKey === 'admin') {
        newUser = {
          id: 'usr_admin_01',
          full_name: 'Rajesh K. Verma, ISS',
          email: 'rajesh.verma@mospi.gov.in',
          role: 'role_sysadmin',
          role_name: 'System_Admin',
          designation: 'Deputy Director General (DDG)',
          department: 'Coordination & Administration Division, MoSPI',
          cadre: 'Indian Statistical Service (Higher Administrative Grade)',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        };
      } else if (roleKey === 'learner_jso') {
        newUser = {
          id: 'usr_jso_02',
          full_name: 'Priya Deshmukh',
          email: 'priya.deshmukh@mospi.gov.in',
          role: 'role_learner',
          role_name: 'Learner',
          designation: 'Junior Statistical Officer (JSO)',
          department: 'Survey Design and Research Division (SDRD)',
          cadre: 'Subordinate Statistical Service (SSS)',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        };
      }
      setUser(newUser);
      setToken('mock_demo_token');
      localStorage.setItem('saksham_user', JSON.stringify(newUser));
      localStorage.setItem('saksham_token', 'mock_demo_token');
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('saksham_token');
    localStorage.removeItem('saksham_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
