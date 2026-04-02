'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import styles from './Sessions.module.css';

export default function SessionsPage() {
  const { data, t } = useAdmin();
  const page = data.pages.sessions;

  return (
    <main style={{ backgroundColor: page.backgroundColor, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section 
        className={styles.hero} 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${page.heroImage})`
        }}
      >
        <div className="container">
          <h1 className={styles.heroTitle}>{t(page.heroTitle)}</h1>
          <p className={styles.heroSubtitle}>{t(page.heroSubtitle)}</p>
        </div>
      </section>

      {/* Content Area */}
      <div className="container" style={{ padding: '80px 0' }}>
        {page.sections.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t({ en: 'No sessions added yet.', uz: 'Sessiyalar hali qo\'shilmagan.' })}</p>
        ) : (
          page.sections.map(session => (
            <div key={session.id} className={styles.sessionCard}>
              <div className={styles.sessionHeader} style={{ background: data.theme.primaryColor }}>
                <h2>{t(session.title)}</h2>
              </div>
              <div className={styles.sessionContent}>
                <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
                  {t(session.content).split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <div className={styles.galleryPlaceholder}>
                  [Session Gallery Placeholder]
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
