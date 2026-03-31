'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import styles from './Schedule.module.css';

export default function Schedule() {
  const { data, t, language } = useAdmin();

  const labels = {
    en: { title: 'Conference Schedule', time: 'Time', activity: 'Activity' },
    uz: { title: 'Konferensiya jadvali', time: 'Vaqt', activity: 'Faoliyat' }
  };
  const l = labels[language];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.mainTitle} style={{ color: data.theme.primaryColor }}>{l.title}</h2>
      
      {data.schedules.map((part) => (
        <div key={part.id} className={styles.partWrapper}>
          <h3 className={styles.partTitle} style={{ color: data.theme.primaryColor }}>{t(part.title)}</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '150px' }}>{l.time}</th>
                  <th>{l.activity}</th>
                </tr>
              </thead>
              <tbody>
                {part.entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className={styles.time}>{entry.time}</td>
                    <td className={styles.activity}>{t(entry.activity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
