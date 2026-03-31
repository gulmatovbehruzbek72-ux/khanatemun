'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { data, t, language } = useAdmin();
  const currentYear = new Date().getFullYear();

  const labels = {
    en: { links: 'Quick Links', contact: 'Contact Us' },
    uz: { links: 'Tezkor havolalar', contact: 'Aloqa' }
  };
  const l = labels[language];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.brand}>
          <div className={styles.logoContainer}>
            <Image 
              src="/logo.jpg" 
              alt="Khanate MUN Logo" 
              width={40} 
              height={40} 
              className={styles.logo}
            />
            <span className={styles.siteName}>Khanate MUN</span>
          </div>
          <p className={styles.description}>{t(data.footer.description)}</p>
        </div>

        <div className={styles.links}>
          <h4>{l.links}</h4>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/committees">Committees</Link></li>
            <li><Link href="/team">Team</Link></li>
            <li><Link href="/registration">Register</Link></li>
          </ul>
        </div>

        <div className={styles.contact}>
          <h4>{l.contact}</h4>
          <p>Email: {data.footer.email}</p>
          <p>Location: {t(data.footer.location)}</p>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {currentYear} Khanate MUN. {t(data.footer.copyright)}</p>
        </div>
      </div>
    </footer>
  );
}
