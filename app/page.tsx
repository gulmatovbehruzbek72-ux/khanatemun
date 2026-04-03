'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import CountdownTimer from '@/components/CountdownTimer';
import Schedule from '@/components/Schedule';
import PageSectionRenderer from '@/components/PageSectionRenderer';
import styles from './page.module.css';

export default function Home() {
  const { data, t } = useAdmin();
  const page = data.pages.home;

  const labels = {
    en: { register: 'Register Now' },
    uz: { register: 'Ro\'yxatdan o\'tish' }
  };
  const { language } = useAdmin();
  const l = labels[language];

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section 
        className={styles.hero} 
        aria-label="Khanate MUN Homepage Hero"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${page.heroImage})`
        }}
      >
        <div className="container">
          <h1 className={styles.heroTitle}>{t(page.heroTitle)}</h1>
          <p className={styles.heroSubtitle}>{t(page.heroSubtitle)}</p>
          <button className={styles.ctaBtn} style={{ background: data.theme.primaryColor }}>
            {l.register}
          </button>
        </div>
      </section>

      {/* Content Area */}
      <div style={{ backgroundColor: page.backgroundColor, transition: 'background-color 0.3s ease' }}>
        <section className="container">
          <CountdownTimer />
        </section>

        <PageSectionRenderer sections={page.sections} />

        <section className="container">
          <Schedule />
        </section>
      </div>
    </main>
  );
}
