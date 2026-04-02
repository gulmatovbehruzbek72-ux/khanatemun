'use client';

import { useAdmin } from '@/context/AdminContext';
import styles from './About.module.css';

export default function AboutPage() {
  const { data, t } = useAdmin();
  const page = data.pages.about;

  return (
    <main style={{ backgroundColor: page.backgroundColor, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${page.heroImage})` }}
      >
        <div className="container">
          <h1 className={styles.heroTitle}>{t(page.heroTitle)}</h1>
          <p className={styles.heroSubtitle}>{t(page.heroSubtitle)}</p>
        </div>
      </section>

      <div className="container" style={{ padding: '80px 20px' }}>
        {page.sections.map(sec => (
          <section key={sec.id} className={styles.section}>
            <h2 style={{ color: data.theme.primaryColor }}>{t(sec.title)}</h2>
            <div className={styles.sectionText}>
              {t(sec.content).split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
