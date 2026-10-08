"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type AppUser = {
  uid: string;
  id: string;
  email: string | null;
  displayName: string | null;
  role?: string | null;
};

export const DEV_MOCK_USER: AppUser = {
  uid: 'dev-user-001',
  id: 'dev-user-001',
  email: 'dev@localhost',
  displayName: 'Dev Tester',
  role: 'admin',
};

function isLocalOrDevEnv(): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.endsWith('.local')
    );
  }
  return false;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data, error }) => {
      if (cancelled) return;
      if (error) console.warn('Supabase session check:', error.message);
      
      const realUser = toAppUser(data.session?.user || null);
      if (realUser) {
        setUser(realUser);
      } else if (isLocalOrDevEnv()) {
        const isExplicitLogout = typeof window !== 'undefined' && sessionStorage.getItem('dev_explicit_logout') === 'true';
        if (!isExplicitLogout) {
          setUser(DEV_MOCK_USER);
        }
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      const realUser = toAppUser(session?.user || null);
      if (realUser) {
        if (typeof window !== 'undefined') sessionStorage.removeItem('dev_explicit_logout');
        setUser(realUser);
      } else if (isLocalOrDevEnv()) {
        const isExplicitLogout = typeof window !== 'undefined' && sessionStorage.getItem('dev_explicit_logout') === 'true';
        if (!isExplicitLogout) {
          setUser(DEV_MOCK_USER);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const timeout = window.setTimeout(() => {
      if (isLocalOrDevEnv() && !user) {
        const isExplicitLogout = typeof window !== 'undefined' && sessionStorage.getItem('dev_explicit_logout') === 'true';
        if (!isExplicitLogout) setUser(DEV_MOCK_USER);
      }
      setLoading(false);
    }, 4000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setUser(null);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('dev_explicit_logout', 'true');
        localStorage.clear();
      }
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function toAppUser(user: SupabaseUser | null): AppUser | null {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  const rawName =
    getString(metadata.full_name) ||
    getString(metadata.name) ||
    getString(metadata.display_name) ||
    user.email?.split('@')[0] ||
    '';

  const displayName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : null;

  return {
    uid: user.id,
    id: user.id,
    email: user.email || null,
    displayName,
    role: getString(metadata.role) || 'user',
  };
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}
