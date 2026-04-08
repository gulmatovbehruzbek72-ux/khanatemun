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

export interface AdminData {
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

const defaultPage = (titleEn: string, titleUz: string): PageData => ({
  heroImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070',
  heroTitle: { en: titleEn, uz: titleUz },
  heroSubtitle: { en: 'Shaping the Diplomats of Tomorrow.', uz: 'Kelajak diplomatlarini shakllantirish.' },
  backgroundColor: '#ffffff',
  sections: []
});

export const getDefaultData = (): AdminData => ({
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
