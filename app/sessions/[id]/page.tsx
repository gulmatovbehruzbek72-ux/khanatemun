'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import styles from '../Sessions.module.css';

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, t } = useAdmin();
  
  const session = (data.pastSessions || []).find(s => s.id === id);

  if (!session) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h1>Session Not Found</h1>
        <button onClick={() => router.push('/sessions')} style={{ marginTop: '20px', color: 'blue' }}>Back to Sessions</button>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      {/* Detail Hero */}
      <section 
        className={styles.hero} 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${session.cardImage || data.pages.sessions.heroImage})`,
          height: '50vh'
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: '4rem' }}>{t(session.title)}</h1>
        </div>
      </section>

      <div className="container" style={{ padding: '60px 0' }}>
        <button onClick={() => router.push('/sessions')} style={{ marginBottom: '30px', fontWeight: 'bold' }}>← Back to Sessions</button>
        
        <div style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: data.theme.primaryColor }}>About this Session</h2>
          <div style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>
            {t(session.fullDescription)}
          </div>
        </div>

        {session.galleryImages && session.galleryImages.length > 0 && (
          <div style={{ marginTop: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Session Gallery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {session.galleryImages.map((img, i) => (
                <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', height: '200px' }}>
                  <img src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
