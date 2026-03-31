'use client';

import React from 'react';
import { PageSection, useAdmin } from '@/context/AdminContext';
import styles from './PageSectionRenderer.module.css';

export default function PageSectionRenderer({ sections }: { sections: PageSection[] }) {
  const { t } = useAdmin();

  return (
    <div className={styles.wrapper}>
      {sections.map((section) => (
        <section 
          key={section.id} 
          className={styles.section}
        >
          <div className="container">
            <h2 className={styles.title}>{t(section.title)}</h2>
            <div className={styles.content}>
              {t(section.content).split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
