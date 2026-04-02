'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import styles from './CountdownTimer.module.css';

export default function CountdownTimer() {
  const { data, t, language } = useAdmin();
  const { countdown } = data;
  
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => setIsMounted(true));
    if (!countdown.isActive) return;

    const timer = setInterval(() => {
      const target = new Date(countdown.targetDate).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.targetDate, countdown.isActive]);

  if (!isMounted || !countdown.isActive || !timeLeft) return null;

  const wrapperStyle: React.CSSProperties = {
    color: countdown.color,
    background: countdown.backgroundType === 'color' ? countdown.backgroundValue : `url(${countdown.backgroundValue})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const labels = {
    en: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
    uz: { days: 'Kun', hours: 'Soat', minutes: 'Daqiqa', seconds: 'Soniya' }
  };
  const l = labels[language];

  return (
    <div className={styles.wrapper} style={wrapperStyle}>
      <h3 className={styles.text}>{t(countdown.text)}</h3>
      <div className={styles.timer}>
        <div className={styles.unit}>
          <span className={styles.number}>{timeLeft.days}</span>
          <span className={styles.label}>{l.days}</span>
        </div>
        <div className={styles.unit}>
          <span className={styles.number}>{timeLeft.hours}</span>
          <span className={styles.label}>{l.hours}</span>
        </div>
        <div className={styles.unit}>
          <span className={styles.number}>{timeLeft.minutes}</span>
          <span className={styles.label}>{l.minutes}</span>
        </div>
        <div className={styles.unit}>
          <span className={styles.number}>{timeLeft.seconds}</span>
          <span className={styles.label}>{l.seconds}</span>
        </div>
      </div>
    </div>
  );
}
