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
  error: string | null;
  setError: (err: string | null) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AdminData>(getDefaultData());
  const [language, setLanguage] = useState<'en' | 'uz'>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin-data');
      if (res.ok) {
        const remoteData = await res.json();
        setData(remoteData);
        setError(null);
      }
    } catch (e) {
      console.error('Failed to sync with server:', e);
    }
  }, []);

  // ... (useEffect remains same)

  const updateData = async (newData: Partial<AdminData>) => {
    const previousData = data;
    const updated = { ...data, ...newData };
    
    // Optimistic update
    setData(updated);
    setError(null);

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
        const errBody = await res.json();
        const errMsg = errBody.error || 'Failed to save to server';
        setError(errMsg);
        console.error('Save failed:', errMsg);
        // Revert on failure to keep local state in sync with server truth
        setData(previousData);
      }
    } catch (e) {
      setError('Network error. Check your connection.');
      setData(previousData);
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
    <AdminContext.Provider value={{ data, language, setLanguage, isAuthenticated, login, logout, updateData, addRegistration, addContactSubmission, t, refreshData, error, setError }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
