'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import TeamGrid from '@/components/TeamGrid';
import styles from './TeamPage.module.css';

export default function TeamPage() {
  const { data, t } = useAdmin();
  const page = data.pages.team;

  return (
    <main style={{ backgroundColor: page.backgroundColor, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${page.heroImage})` }}
      >
        <div className="container">
          <h1 className={styles.heroTitle}>{t(page.heroTitle)}</h1>
          <p className={styles.heroSubtitle}>{t(page.heroSubtitle)}</p>
        </div>
      </section>

      <div className="container" style={{ padding: '80px 0' }}>
        <TeamGrid />
        
        {page.sections.map(sec => (
          <div key={sec.id} style={{ marginTop: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: data.theme.primaryColor }}>{t(sec.title)}</h2>
            <div style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#444' }}>
              {t(sec.content).split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
