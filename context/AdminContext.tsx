'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Translatable = {
  en: string;
  uz: string;
};

export interface PageSection {
  id: string;
  title: Translatable;
  content: Translatable;
  image?: string;
}

export interface PageData {
  heroImage: string;
  heroTitle: Translatable;
  heroSubtitle: Translatable;
  backgroundColor: string;
  sections: PageSection[];
}

export interface Committee {
  id: string;
  name: Translatable;
  shortDescription: Translatable;
  fullDescription: Translatable;
  chairs: Translatable;
  cardImage: string;
  galleryImages: string[];
}

export interface PastSession {
  id: string;
  title: Translatable;
  shortDescription: Translatable;
  fullDescription: Translatable;
  cardImage: string;
  galleryImages: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: Translatable;
  personality: Translatable;
  image?: string;
}

export interface ScheduleEntry {
  id: string;
  time: string;
  activity: Translatable;
}

export interface SchedulePart {
  id: string;
  title: Translatable;
  entries: ScheduleEntry[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  committee: string;
  experience: string;
  timestamp: string;
}

interface AdminData {
  password: string;
  pages: {
    home: PageData;
    about: PageData;
    committees: PageData;
    sessions: PageData;
    contact: PageData;
    team: PageData;
    registration: PageData;
  };
  footer: {
    description: Translatable;
    email: string;
    location: Translatable;
    copyright: Translatable;
  };
  committees: Committee[];
  pastSessions: PastSession[];
  schedules: SchedulePart[];
  team: TeamMember[];
  registrations: Registration[];
  contactSubmissions: ContactSubmission[];
  countdown: {
    targetDate: string;
    text: Translatable;
    isActive: boolean;
    color: string;
    backgroundType: 'color' | 'image';
    backgroundValue: string;
  };
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
}

interface AdminContextType {
  data: AdminData;
  language: 'en' | 'uz';
  setLanguage: (lang: 'en' | 'uz') => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updateData: (newData: Partial<AdminData>) => void;
  addRegistration: (reg: Omit<Registration, 'id' | 'timestamp'>) => void;
  addContactSubmission: (msg: Omit<ContactSubmission, 'id' | 'timestamp'>) => void;
  t: (key: string | Translatable | undefined | null) => string;
}

const defaultPage = (titleEn: string, titleUz: string): PageData => ({
  heroImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070',
  heroTitle: { en: titleEn, uz: titleUz },
  heroSubtitle: { en: 'Shaping the Diplomats of Tomorrow.', uz: 'Kelajak diplomatlarini shakllantirish.' },
  backgroundColor: '#ffffff',
  sections: []
});

const getDefaultData = (): AdminData => ({
  password: 'admin',
  pages: {
    home: defaultPage('Welcome to Khanate MUN', 'Xonlik MUNga xush kelibsiz'),
    about: defaultPage('About Us', 'Biz haqimizda'),
    committees: defaultPage('Committees', 'Qo\'mitalar'),
    sessions: defaultPage('Previous Sessions', 'Oldingi sessiyalar'),
    contact: defaultPage('Contact Us', 'Biz bilan bog\'lanish'),
    team: defaultPage('Our Team', 'Bizning jamoa'),
    registration: defaultPage('Registration', 'Ro\'yxatdan o\'tish')
  },
  footer: {
    description: { en: 'Empowering youth through diplomacy and leadership.', uz: 'Yoshlarni diplomatiya va yetakchilik orqali kuchaytirish.' },
    email: 'info@khanatemun.com',
    location: { en: 'Tashkent, Uzbekistan', uz: 'Toshkent, O\'zbekiston' },
    copyright: { en: 'All rights reserved.', uz: 'Barcha huquqlar himoyalangan.' }
  },
  committees: [],
  schedules: [],
  team: [],
  pastSessions: [],
  registrations: [],
  contactSubmissions: [],
  countdown: {
    targetDate: '2026-06-15T09:00:00',
    text: { en: 'Khanate MUN 2026 Starts In:', uz: 'Xonlik MUN 2026 boshlanishiga:' },
    isActive: true,
    color: '#ffffff',
    backgroundType: 'color',
    backgroundValue: '#003366'
  },
  theme: {
    primaryColor: '#003366',
    fontFamily: 'sans-serif'
  }
});

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AdminData>(getDefaultData());
  const [language, setLanguage] = useState<'en' | 'uz'>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('khanate_admin_data_v15');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const defaults = getDefaultData();
        
        // Deep merge to ensure all pages and structures exist
        const merged: AdminData = {
          ...defaults,
          ...parsed,
          pages: {
            ...defaults.pages,
            ...(parsed.pages || {})
          },
          footer: {
            ...defaults.footer,
            ...(parsed.footer || {})
          },
          countdown: {
            ...defaults.countdown,
            ...(parsed.countdown || {})
          },
          theme: {
            ...defaults.theme,
            ...(parsed.theme || {})
          }
        };

        Promise.resolve().then(() => {
          setData(merged);
        });
      } catch (e) {
        console.error('Failed to parse admin data', e);
      }
    }
    const sessionAuth = sessionStorage.getItem('khanate_admin_auth');
    Promise.resolve().then(() => {
      if (sessionAuth === 'true') setIsAuthenticated(true);
      setIsInitialized(true);
    });
  }, []);

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

  const updateData = (newData: Partial<AdminData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem('khanate_admin_data_v15', JSON.stringify(updated));
  };

  const addRegistration = (reg: Omit<Registration, 'id' | 'timestamp'>) => {
    const newReg: Registration = { ...reg, id: Date.now().toString(), timestamp: new Date().toISOString() };
    updateData({ registrations: [...data.registrations, newReg] });
  };

  const addContactSubmission = (msg: Omit<ContactSubmission, 'id' | 'timestamp'>) => {
    const newMsg: ContactSubmission = { ...msg, id: Date.now().toString(), timestamp: new Date().toISOString() };
    updateData({ contactSubmissions: [...data.contactSubmissions, newMsg] });
  };

  const t = (key: string | Translatable | undefined | null): string => {
    const fallbacks = { en: "Waiting for it", uz: "Kutilmoqda" };
    if (!key) return fallbacks[language];
    if (typeof key === 'string') return key.trim() === '' ? fallbacks[language] : key;
    if (typeof key === 'object' && ('en' in key || 'uz' in key)) {
      const val = key[language] || key.en;
      if (val && typeof val === 'string' && val.trim() !== '') return val;
      return fallbacks[language];
    }
    return fallbacks[language];
  };

  if (!isInitialized) return null;

  return (
    <AdminContext.Provider value={{ data, language, setLanguage, isAuthenticated, login, logout, updateData, addRegistration, addContactSubmission, t }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
