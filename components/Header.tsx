'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import styles from './Header.module.css';

export default function Header() {
  const { language, setLanguage } = useAdmin();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const labels = {
    en: {
      home: 'Home',
      about: 'About',
      committees: 'Committees',
      team: 'Organising Team',
      sessions: 'Sessions',
      register: 'Registration',
      contact: 'Contact Us',
      admin: 'Admin'
    },
    uz: {
      home: 'Bosh sahifa',
      about: 'Biz haqimizda',
      committees: 'Qo\'mitalar',
      team: 'Jamoa',
      sessions: 'Sessiyalar',
      register: 'Ro\'yxatdan o\'tish',
      contact: 'Bog\'lanish',
      admin: 'Admin'
    }
  };

  const l = labels[language];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <Link href="/" className={styles.logoContainer}>
          <Image src="/logo.jpg" alt="Logo" width={50} height={50} className={styles.logo} />
          <span className={styles.siteName}>Khanate MUN</span>
        </Link>
        
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <ul>
            <li><Link href="/" onClick={() => setIsMenuOpen(false)}>{l.home}</Link></li>
            <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>{l.about}</Link></li>
            <li><Link href="/committees" onClick={() => setIsMenuOpen(false)}>{l.committees}</Link></li>
            <li><Link href="/team" onClick={() => setIsMenuOpen(false)}>{l.team}</Link></li>
            <li><Link href="/sessions" onClick={() => setIsMenuOpen(false)}>{l.sessions}</Link></li>
            <li><Link href="/registration" onClick={() => setIsMenuOpen(false)}>{l.register}</Link></li>
            <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>{l.contact}</Link></li>
            <li><Link href="/admin" className={styles.adminLink} onClick={() => setIsMenuOpen(false)}>{l.admin}</Link></li>
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <div className={styles.langSwitcher}>
            <button onClick={() => setLanguage('en')} className={language === 'en' ? styles.activeLang : ''}>EN</button>
            <span>|</span>
            <button onClick={() => setLanguage('uz')} className={language === 'uz' ? styles.activeLang : ''}>UZ</button>
          </div>

          <button className={styles.mobileToggle} onClick={toggleMenu}>
            <div className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></div>
          </button>
        </div>
      </div>
    </header>
  );
}
