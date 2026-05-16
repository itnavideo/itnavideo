'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdminLoggedIn: boolean;
  loading: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin')
      .then((response) => response.json())
      .then((data) => setIsAdminLoggedIn(Boolean(data.authenticated)))
      .catch((error) => {
        console.error('Admin session check failed:', error);
        setIsAdminLoggedIn(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (u: string, p: string) => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p }),
    });

    if (response.ok) {
      setIsAdminLoggedIn(true);
      return true;
    }

    return false;
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch((error) => {
      console.error('Admin logout failed:', error);
    });
    setIsAdminLoggedIn(false);
    window.location.href = '/admin/login';
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
