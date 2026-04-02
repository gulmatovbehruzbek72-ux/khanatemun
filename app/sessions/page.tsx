'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import styles from './Sessions.module.css';

export default function SessionsPage() {
  const { data, t } = useAdmin();
  const page = data.pages.sessions;
  const sessions = data.pastSessions || [];

  return (
    <main style={{ backgroundColor: page.backgroundColor, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section 
        className={styles.hero} 
        aria-label="Sessions Page Hero"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${page.heroImage})`
        }}
      >
        <div className="container">
          <h1 className={styles.heroTitle}>{t(page.heroTitle)}</h1>
          <p className={styles.heroSubtitle}>{t(page.heroSubtitle)}</p>
        </div>
      </section>

      {/* Sessions Grid */}
      <div className="container" style={{ padding: '80px 0' }}>
        {sessions.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t({ en: 'No sessions added yet.', uz: 'Sessiyalar hali qo\'shilmagan.' })}</p>
        ) : (
          <div className={styles.sessionsGrid}>
            {sessions.map(session => (
              <Link href={`/sessions/${session.id}`} key={session.id} className={styles.sessionCardLink}>
                <div className={styles.sessionCard}>
                  {session.cardImage && (
                    <div className={styles.cardImage} style={{ backgroundImage: `url(${session.cardImage})` }}></div>
                  )}
                  <div className={styles.cardContent}>
                    <h3>{t(session.title)}</h3>
                    <p>{t(session.shortDescription)}</p>
                    <span className={styles.readMore}>View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Dynamic Page Sections */}
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
