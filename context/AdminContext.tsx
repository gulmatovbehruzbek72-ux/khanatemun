'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminData, Translatable, Registration, ContactSubmission, getDefaultData } from '@/types/admin';

// Re-export types for convenience
export type { Translatable, PageSection, PageData, Committee, PastSession, TeamMember, ScheduleEntry, SchedulePart, ContactSubmission, Registration, AdminData } from '@/types/admin';

interface AdminContextType {
  data: AdminData;
  language: 'en' | 'uz';
  setLanguage: (lang: 'en' | 'uz') => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updateData: (newData: Partial<AdminData>) => Promise<void>;
  addRegistration: (reg: Omit<Registration, 'id' | 'timestamp'>) => Promise<void>;
  addContactSubmission: (msg: Omit<ContactSubmission, 'id' | 'timestamp'>) => Promise<void>;
  t: (key: string | Translatable | undefined | null) => string;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AdminData>(getDefaultData());
  const [language, setLanguage] = useState<'en' | 'uz'>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin-data');
      if (res.ok) {
        const remoteData = await res.json();
        setData(remoteData);
      }
    } catch (e) {
      console.error('Failed to sync with server:', e);
    }
  }, []);

  // Initial load and polling
  useEffect(() => {
    refreshData().then(() => {
      setIsInitialized(true);
    });

    const sessionAuth = sessionStorage.getItem('khanate_admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);

    // Poll for changes every 30 seconds for all users
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const login = (password: string) => {
    if (password === data.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('khanate_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('khanate_admin_auth');
  };

  const updateData = async (newData: Partial<AdminData>) => {
    const updated = { ...data, ...newData };
    
    // Optimistic update
    setData(updated);

    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': data.password 
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        console.error('Failed to save to server');
        // Optionally revert on failure, but for simple CMS we can just wait for next poll
        refreshData(); 
      }
    } catch (e) {
      console.error('Network error during sync:', e);
    }
  };

  const addRegistration = async (reg: Omit<Registration, 'id' | 'timestamp'>) => {
    const newReg: Registration = { ...reg, id: Date.now().toString(), timestamp: new Date().toISOString() };
    await updateData({ registrations: [...data.registrations, newReg] });
  };

  const addContactSubmission = async (msg: Omit<ContactSubmission, 'id' | 'timestamp'>) => {
    const newMsg: ContactSubmission = { ...msg, id: Date.now().toString(), timestamp: new Date().toISOString() };
    await updateData({ contactSubmissions: [...data.contactSubmissions, newMsg] });
  };

  const t = (key: string | Translatable | undefined | null): string => {
    const fallbacks = { en: "Waiting for it", uz: "Kutilmoqda" };
    if (!key) return fallbacks[language];
    if (typeof key === 'string') return key.trim() === '' ? fallbacks[language] : key;
    if (typeof key === 'object' && ('en' in key || 'uz' in key)) {
      const val = (key as any)[language] || (key as any).en;
      if (val && typeof val === 'string' && val.trim() !== '') return val;
      return fallbacks[language];
    }
    return fallbacks[language];
  };

  if (!isInitialized) return null;

  return (
    <AdminContext.Provider value={{ data, language, setLanguage, isAuthenticated, login, logout, updateData, addRegistration, addContactSubmission, t, refreshData }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
