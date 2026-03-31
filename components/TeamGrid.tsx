'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import styles from './TeamGrid.module.css';

export default function TeamGrid() {
  const { data, t, language } = useAdmin();

  const labels = {
    en: { personality: 'Personality' },
    uz: { personality: 'Xarakter' }
  };
  const l = labels[language];

  return (
    <div className={styles.grid}>
      {data.team.map((member) => (
        <div key={member.id} className={styles.card}>
          <div className={styles.imageWrapper}>
            <img src={member.image} alt={member.name} className={styles.image} />
          </div>
          <div className={styles.info}>
            <h3 className={styles.name}>{member.name}</h3>
            <p className={styles.role} style={{ color: data.theme.primaryColor }}>{t(member.role)}</p>
            <div className={styles.divider}></div>
            <p className={styles.personality}><strong>{l.personality}:</strong> {t(member.personality)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
