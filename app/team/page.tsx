'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import TeamGrid from '@/components/TeamGrid';
import PageSectionRenderer from '@/components/PageSectionRenderer';
import styles from './TeamPage.module.css';

export default function TeamPage() {
  const { data, t } = useAdmin();
  const page = data.pages.team;

  return (
    <main style={{ backgroundColor: page.backgroundColor, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section 
        className={styles.hero} 
        aria-label="Organizing Team Hero"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${page.heroImage})` }}
      >
        <div className="container">
          <h1 className={styles.heroTitle}>{t(page.heroTitle)}</h1>
          <p className={styles.heroSubtitle}>{t(page.heroSubtitle)}</p>
        </div>
      </section>

      <div className="container" style={{ padding: '80px 0' }}>
        <TeamGrid />
      </div>

      <PageSectionRenderer sections={page.sections} />
    </main>
  );
}
