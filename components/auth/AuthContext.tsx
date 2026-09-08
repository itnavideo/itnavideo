"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type AppUser = {
  uid: string;
  id: string;
  email: string | null;
  displayName: string | null;
};

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
      if (error) console.error('Supabase session check failed:', error);
      setUser(toAppUser(data.session?.user || null));
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAppUser(session?.user || null));
      setLoading(false);
    });

    const timeout = window.setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error);
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
  const displayName =
    getString(metadata.full_name) ||
    getString(metadata.name) ||
    getString(metadata.display_name) ||
    user.email?.split('@')[0] ||
    null;

  return {
    uid: user.id,
    id: user.id,
    email: user.email || null,
    displayName,
  };
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}
