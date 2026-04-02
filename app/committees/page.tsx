'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import styles from './Committees.module.css';

export default function CommitteesPage() {
  const { data, t } = useAdmin();
  const page = data.pages.committees;

  return (
    <main style={{ backgroundColor: page.backgroundColor, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section 
        className={styles.hero} 
        aria-label="Committees Page Hero"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${page.heroImage})`
        }}
      >
        <div className="container">
          <h1 className={styles.heroTitle}>{t(page.heroTitle)}</h1>
          <p className={styles.heroSubtitle}>{t(page.heroSubtitle)}</p>
        </div>
      </section>

      {/* Committees Grid */}
      <div className="container" style={{ padding: '80px 0' }}>
        <div className={styles.grid}>
          {data.committees.map((committee) => {
            const translatedName = t(committee.name);
            
            return (
              <Link href={`/committees/${committee.id}`} key={committee.id} className={styles.cardLink}>
                <div className={styles.card}>
                  <div className={styles.cardFront}>
                    <div className={styles.imagePlaceholder} style={committee.cardImage ? { backgroundImage: `url(${committee.cardImage})`, backgroundSize: 'cover' } : {}}>
                      {!committee.cardImage && translatedName.split(' ').map(w => w[0]).join('').toUpperCase()}
                    </div>
                    <div className={styles.cardContent}>
                      <h3>{translatedName}</h3>
                      <p className={styles.chairs}>{t(committee.chairs)}</p>
                      <p className={styles.shortDesc}>{t(committee.shortDescription)}</p>
                      <span className={styles.learnMore}>Learn More →</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Dynamic Sections from Admin */}
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
