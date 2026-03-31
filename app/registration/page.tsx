'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import styles from './Registration.module.css';

export default function RegistrationPage() {
  const { data, addRegistration, t, language } = useAdmin();
  const page = data.pages.registration;
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    committee: '',
    experience: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const labels = {
    en: {
      thanks: 'Thank You!',
      received: 'Your registration for Khanate MUN has been received. We will contact you soon.',
      another: 'Register Another',
      title: 'Delegate Registration',
      name: 'Full Name',
      email: 'Email Address',
      pref: 'Preferred Committee',
      select: 'Select a Committee',
      exp: 'MUN Experience (Briefly)',
      submit: 'Submit Application'
    },
    uz: {
      thanks: 'Rahmat!',
      received: 'Xonlik MUN uchun ro\'yxatdan o\'tganingiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.',
      another: 'Yana ro\'yxatdan o\'tish',
      title: 'Delegat ro\'yxatdan o\'tishi',
      name: 'To\'liq ism',
      email: 'Email manzili',
      pref: 'Tanlangan qo\'mita',
      select: 'Qo\'mitani tanlang',
      exp: 'MUN tajribasi (qisqacha)',
      submit: 'Arizani yuborish'
    }
  };

  const l = labels[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRegistration(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main style={{ backgroundColor: page.backgroundColor, minHeight: '100vh' }}>
        <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
          <h1 style={{ color: data.theme.primaryColor, fontSize: '3rem', marginBottom: '20px' }}>{l.thanks}</h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>{l.received}</p>
          <button onClick={() => setSubmitted(false)} className={styles.submitBtn} style={{ background: data.theme.primaryColor, maxWidth: '300px', margin: '0 auto' }}>
            {l.another}
          </button>
        </div>
      </main>
    );
  }

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
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle} style={{ color: data.theme.primaryColor }}>{l.title}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>{l.name}</label>
              <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className={styles.inputGroup}>
              <label>{l.email}</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className={styles.inputGroup}>
              <label>{l.pref}</label>
              <select required value={formData.committee} onChange={(e) => setFormData({...formData, committee: e.target.value})}>
                <option value="">{l.select}</option>
                {data.committees.map(c => <option key={c.id} value={t(c.name)}>{t(c.name)}</option>)}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>{l.exp}</label>
              <textarea rows={4} value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
            </div>
            <button type="submit" className={styles.submitBtn} style={{ background: data.theme.primaryColor }}>
              {l.submit}
            </button>
          </form>
        </div>

        {/* Extra Sections */}
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
