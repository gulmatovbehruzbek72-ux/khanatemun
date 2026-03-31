'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import styles from './Contact.module.css';

export default function ContactPage() {
  const { data, addContactSubmission, t, language } = useAdmin();
  const page = data.pages.contact;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const labels = {
    en: {
      getInTouch: 'Get in Touch',
      successTitle: 'Message Sent!',
      successText: 'Thank you for reaching out. We will get back to you shortly.',
      sendAnother: 'Send Another',
      namePlac: 'Your Name',
      emailPlac: 'Your Email',
      msgPlac: 'Your Message',
      submit: 'Send Message',
      email: 'Email',
      location: 'Location'
    },
    uz: {
      getInTouch: 'Biz bilan bog\'lanish',
      successTitle: 'Xabar yuborildi!',
      successText: 'Bog\'langaningiz uchun rahmat. Tez orada siz bilan bog\'lanamiz.',
      sendAnother: 'Yana xabar yuborish',
      namePlac: 'Ismingiz',
      emailPlac: 'Email manzilingiz',
      msgPlac: 'Xabaringiz',
      submit: 'Xabarni yuborish',
      email: 'Email',
      location: 'Manzil'
    }
  };

  const l = labels[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContactSubmission(formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main style={{ backgroundColor: page.backgroundColor, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className={styles.hero} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${page.heroImage})` }}>
        <div className="container">
          <h1 className={styles.heroTitle}>{t(page.heroTitle)}</h1>
          <p className={styles.heroSubtitle}>{t(page.heroSubtitle)}</p>
        </div>
      </section>

      <div className="container" style={{ padding: '80px 20px' }}>
        <div className={styles.grid}>
          <div className={styles.info}>
            <h2>{l.getInTouch}</h2>
            <p>{t(data.footer.description)}</p>
            <div className={styles.details}>
              <p><strong>{l.email}:</strong> {data.footer.email}</p>
              <p><strong>{l.location}:</strong> {t(data.footer.location)}</p>
            </div>
          </div>
          <div className={styles.formWrapper}>
            {submitted ? (
              <div className={styles.success}>
                <h3>{l.successTitle}</h3>
                <p>{l.successText}</p>
                <button onClick={() => setSubmitted(false)} className={styles.submitBtn} style={{ background: data.theme.primaryColor }}>{l.sendAnother}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" placeholder={l.namePlac} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="email" placeholder={l.emailPlac} required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <textarea placeholder={l.msgPlac} rows={5} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                <button type="submit" style={{ background: data.theme.primaryColor }}>{l.submit}</button>
              </form>
            )}
          </div>
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
