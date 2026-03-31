'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import CountdownTimer from '@/components/CountdownTimer';
import Schedule from '@/components/Schedule';
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

        <section className="container" style={{ padding: '40px 0' }}>
          {page.sections.map(sec => (
            <div key={sec.id} className={styles.contentSection}>
              <h2 className={styles.sectionTitle} style={{ color: data.theme.primaryColor }}>{t(sec.title)}</h2>
              <div className={styles.sectionText}>
                {t(sec.content).split('\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          ))}
        </section>

        <section className="container">
          <Schedule />
        </section>
      </div>
    </main>
  );
}
