'use client';

import React from 'react';
import { PageSection, useAdmin } from '@/context/AdminContext';
import styles from './PageSectionRenderer.module.css';

export default function PageSectionRenderer({ sections }: { sections: PageSection[] }) {
  const { t, data } = useAdmin();

  if (!sections || sections.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      {sections.map((section) => (
        <section 
          key={section.id} 
          className={styles.section}
        >
          <div className="container">
            <h2 className={styles.title} style={{ color: data.theme.primaryColor }}>{t(section.title)}</h2>
            
            <div className={styles.contentWrapper}>
              <div className={styles.textContent}>
                {t(section.content).split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              {section.image && (
                <div className={styles.imageWrapper}>
                  <img src={section.image} alt={t(section.title)} className={styles.image} />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
