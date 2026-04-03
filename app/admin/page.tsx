'use client';

import React, { useState } from 'react';
import { useAdmin, Translatable, PageData } from '@/context/AdminContext';
import ImageUpload from '@/components/ImageUpload';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import styles from './Admin.module.css';

const LanguageInput = ({ label, value, onChange, textarea = false }: { label: string, value: Translatable, onChange: (val: Translatable) => void, textarea?: boolean }) => (
  <div className={styles.langInputGroup}>
    <label>{label}</label>
    <div className={styles.langGrid}>
      <div className={styles.langField}>
        <span>EN</span>
        {textarea ? (
          <textarea value={value?.en || ''} onChange={e => onChange({ ...value, en: e.target.value })} placeholder="English text..." />
        ) : (
          <input type="text" value={value?.en || ''} onChange={e => onChange({ ...value, en: e.target.value })} placeholder="English text..." />
        )}
      </div>
      <div className={styles.langField}>
        <span>UZ</span>
        {textarea ? (
          <textarea value={value?.uz || ''} onChange={e => onChange({ ...value, uz: e.target.value })} placeholder="O'zbekcha matn..." />
        ) : (
          <input type="text" value={value?.uz || ''} onChange={e => onChange({ ...value, uz: e.target.value })} placeholder="O'zbekcha matn..." />
        )}
      </div>
    </div>
  </div>
);

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  const hexToRgb = (hex: string) => {
    if (!hex) return 'rgb(255, 255, 255)';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 'rgb(255, 255, 255)';
  };

  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <div className={styles.colorPickerWrapper}>
        <input type="color" value={value?.startsWith('#') ? value : '#ffffff'} onChange={(e) => onChange(e.target.value)} className={styles.colorInput} />
        <div className={styles.colorValues}>
          <div className={styles.valueRow}><span>HEX:</span><input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} /></div>
          <div className={styles.valueRow}><span>RGB:</span><input type="text" value={hexToRgb(value)} readOnly disabled /></div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { data, isAuthenticated, login, logout, updateData } = useAdmin();
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // New granular tabs
  type Tab = 'countdown' | 'home' | 'about' | 'sessions' | 'team' | 'committees' | 'schedules' | 'registrations' | 'messages' | 'footer' | 'settings';
  const [activeTab, setActiveTab] = useState<Tab>('countdown');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(passwordInput)) setLoginError(false);
    else setLoginError(true);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khanatemun_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (window.confirm("This will overwrite all current site content. Are you sure?")) {
          updateData(importedData);
          alert("Data imported successfully! The page will now refresh.");
          window.location.reload();
        }
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.adminTitle}>Admin Portal</h1>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input type="password" placeholder="Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className={styles.passwordField} />
            {loginError && <p className={styles.loginErrorText}>Incorrect Password</p>}
            <button type="submit" className={styles.loginSubmitBtn}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  // Helper to render a page editor
  const renderPageEditor = (pageKey: keyof typeof data.pages) => {
    const p = data.pages[pageKey];
    if (!p) return <div>Error: Page data for {pageKey} missing.</div>;

    const updatePage = (updates: Partial<PageData>) => {
      updateData({ pages: { ...data.pages, [pageKey]: { ...p, ...updates } } });
    };

    return (
      <div className={styles.adminSection}>
        <h3>Edit {pageKey.toUpperCase()} Page</h3>
        <LanguageInput label="Hero Title" value={p.heroTitle} onChange={heroTitle => updatePage({ heroTitle })} />
        <LanguageInput label="Hero Subtitle" value={p.heroSubtitle} onChange={heroSubtitle => updatePage({ heroSubtitle })} />
        <ImageUpload label="Hero Background Image" currentImage={p.heroImage} onUpload={heroImage => updatePage({ heroImage })} />
        <ColorPicker label="Page Background Color" value={p.backgroundColor} onChange={backgroundColor => updatePage({ backgroundColor })} />
        
        <hr style={{ margin: '40px 0' }} />
        <h4>Content Sections</h4>
        {(p.sections || []).map((sec, idx) => (
          <div key={sec.id} className={styles.sectionItem}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
              <div>
                <LanguageInput label={`Section ${idx + 1} Title`} value={sec.title} onChange={title => {
                  const sections = [...p.sections]; sections[idx] = { ...sec, title }; updatePage({ sections });
                }} />
                <LanguageInput label="Content" textarea value={sec.content} onChange={content => {
                  const sections = [...p.sections]; sections[idx] = { ...sec, content }; updatePage({ sections });
                }} />
              </div>
              <div>
                <ImageUpload label="Section Image (Optional)" currentImage={sec.image} onUpload={image => {
                  const sections = [...p.sections]; sections[idx] = { ...sec, image }; updatePage({ sections });
                }} />
                {sec.image && (
                  <button className={styles.deleteBtn} style={{ marginTop: '-10px', marginBottom: '10px' }} onClick={() => {
                    const sections = [...p.sections]; sections[idx] = { ...sec, image: undefined }; updatePage({ sections });
                  }}>Clear Image</button>
                )}
              </div>
            </div>
            <button className={styles.deleteBtn} onClick={() => {
              const sections = p.sections.filter(s => s.id !== sec.id); updatePage({ sections });
            }}>Remove Full Section</button>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => {
          const newSec = { id: Date.now().toString(), title: { en: 'New Section', uz: 'Yangi bo\'lim' }, content: { en: '', uz: '' } };
          updatePage({ sections: [...(p.sections || []), newSec] });
        }}>+ Add Section</button>
      </div>
    );
  };

  return (
    <div className={styles.adminPageWrapper}>
      <div className="container">
        <div className={styles.adminHeader}>
          <h2>Dashboard</h2>
          <button onClick={logout} className={styles.logoutBtn}>Logout</button>
        </div>

        <nav className={styles.adminTabsNav}>
          {['countdown', 'home', 'about', 'sessions', 'team', 'committees', 'schedules', 'registrations', 'messages', 'footer', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as Tab)} className={activeTab === tab ? styles.tabActive : styles.tabInactive}>
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className={styles.adminContentArea}>
          {activeTab === 'countdown' && (
            <div className={styles.adminSection}>
              <h3>Countdown</h3>
              <LanguageInput label="Text" value={data.countdown.text} onChange={text => updateData({ countdown: { ...data.countdown, text } })} />
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label>Target Date</label><input type="datetime-local" value={data.countdown.targetDate.slice(0, 16)} onChange={e => updateData({ countdown: { ...data.countdown, targetDate: e.target.value } })} /></div>
                <ColorPicker label="Text Color" value={data.countdown.color} onChange={color => updateData({ countdown: { ...data.countdown, color } })} />
              </div>
              <div className={styles.formGroup}>
                <label>Background Type</label>
                <select value={data.countdown.backgroundType} onChange={e => updateData({ countdown: { ...data.countdown, backgroundType: e.target.value as 'color' | 'image' } })}>
                  <option value="color">Color</option>
                  <option value="image">Image</option>
                </select>
              </div>
              {data.countdown.backgroundType === 'image' ? (
                <ImageUpload label="Background Image" currentImage={data.countdown.backgroundValue} onUpload={img => updateData({ countdown: { ...data.countdown, backgroundValue: img } })} />
              ) : (
                <ColorPicker label="Background Color" value={data.countdown.backgroundValue} onChange={val => updateData({ countdown: { ...data.countdown, backgroundValue: val } })} />
              )}
            </div>
          )}

          {/* Dedicated Page Editors */}
          {activeTab === 'home' && renderPageEditor('home')}
          {activeTab === 'about' && renderPageEditor('about')}
          {activeTab === 'sessions' && (
            <div className={styles.adminSection}>
              <div className={styles.headerRow}>
                <h3>Past Sessions</h3>
                <button className={styles.addBtn} onClick={() => updateData({ 
                  pastSessions: [...(data.pastSessions || []), { 
                    id: Date.now().toString(), 
                    title: { en: 'New Session', uz: 'Yangi sessiya' }, 
                    shortDescription: { en: '', uz: '' }, 
                    fullDescription: { en: '', uz: '' }, 
                    cardImage: '',
                    galleryImages: [] 
                  }] 
                })}>+ Add Session</button>
              </div>
              {(data.pastSessions || []).map((s, idx) => (
                <div key={s.id} className={styles.sectionItem}>
                  <LanguageInput label="Title" value={s.title} onChange={title => {
                    const sessions = [...data.pastSessions]; sessions[idx] = { ...s, title }; updateData({ pastSessions: sessions });
                  }} />
                  <LanguageInput label="Short Description" textarea value={s.shortDescription} onChange={shortDescription => {
                    const sessions = [...data.pastSessions]; sessions[idx] = { ...s, shortDescription }; updateData({ pastSessions: sessions });
                  }} />
                  <LanguageInput label="Full Description" textarea value={s.fullDescription} onChange={fullDescription => {
                    const sessions = [...data.pastSessions]; sessions[idx] = { ...s, fullDescription }; updateData({ pastSessions: sessions });
                  }} />
                  
                  <div className={styles.formGroup}>
                    <ImageUpload 
                      label="Card/Button Image (Shown on list page)" 
                      currentImage={s.cardImage} 
                      onUpload={cardImage => {
                        const sessions = [...data.pastSessions];
                        sessions[idx] = { ...s, cardImage };
                        updateData({ pastSessions: sessions });
                      }} 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Gallery Images (Shown on detail page)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginTop: '10px' }}>
                      {(s.galleryImages || []).map((img, imgIdx) => (
                        <div key={imgIdx} style={{ position: 'relative' }}>
                          <ImageUpload 
                            currentImage={img} 
                            onUpload={base64 => {
                              const galleryImages = [...s.galleryImages];
                              galleryImages[imgIdx] = base64;
                              const sessions = [...data.pastSessions];
                              sessions[idx] = { ...s, galleryImages };
                              updateData({ pastSessions: sessions });
                            }} 
                          />
                          <button 
                            className={styles.deleteBtn} 
                            style={{ position: 'absolute', top: '-5px', right: '-5px', padding: '2px 5px', fontSize: '10px' }}
                            onClick={() => {
                              const galleryImages = s.galleryImages.filter((_, i) => i !== imgIdx);
                              const sessions = [...data.pastSessions];
                              sessions[idx] = { ...s, galleryImages };
                              updateData({ pastSessions: sessions });
                            }}
                          >X</button>
                        </div>
                      ))}
                      <button 
                        className={styles.addBtn} 
                        style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => {
                          const galleryImages = [...(s.galleryImages || []), ''];
                          const sessions = [...data.pastSessions];
                          sessions[idx] = { ...s, galleryImages };
                          updateData({ pastSessions: sessions });
                        }}
                      >+ Add Gallery Image</button>
                    </div>
                  </div>
                  <button className={styles.deleteBtn} onClick={() => updateData({ pastSessions: data.pastSessions.filter(item => item.id !== s.id) })}>Delete Session</button>
                </div>
              ))}
              <hr style={{ margin: '40px 0' }} />
              {renderPageEditor('sessions')}
            </div>
          )}

          {activeTab === 'team' && (
            <div className={styles.adminSection}>
              <div className={styles.headerRow}><h3>Team Management</h3><button className={styles.addBtn} onClick={() => updateData({ team: [...data.team, { id: Date.now().toString(), name: '', role: { en: '', uz: '' }, personality: { en: '', uz: '' }, image: '' }] })}>+ Add Member</button></div>
              {data.team.map((m, idx) => (
                <div key={m.id} className={styles.sectionItem}>
                  <ImageUpload label="Photo" currentImage={m.image} onUpload={image => { const team = [...data.team]; team[idx] = { ...m, image }; updateData({ team }); }} />
                  <div className={styles.formGroup}><label>Full Name</label><input type="text" value={m.name} onChange={e => { const team = [...data.team]; team[idx] = { ...m, name: e.target.value }; updateData({ team }); }} /></div>
                  <LanguageInput label="Role" value={m.role} onChange={role => { const team = [...data.team]; team[idx] = { ...m, role }; updateData({ team }); }} />
                  <LanguageInput label="Personality" value={m.personality} onChange={personality => { const team = [...data.team]; team[idx] = { ...m, personality }; updateData({ team }); }} />
                  <button className={styles.deleteBtn} onClick={() => updateData({ team: data.team.filter(i => i.id !== m.id) })}>Delete</button>
                </div>
              ))}
              <hr style={{ margin: '40px 0' }} />
              {renderPageEditor('team')}
            </div>
          )}

          {activeTab === 'committees' && (
            <div className={styles.adminSection}>
              <div className={styles.headerRow}>
                <h3>Committees</h3>
                <button className={styles.addBtn} onClick={() => updateData({ 
                  committees: [...data.committees, { 
                    id: Date.now().toString(), 
                    name: { en: '', uz: '' }, 
                    chairs: { en: '', uz: '' }, 
                    shortDescription: { en: '', uz: '' }, 
                    fullDescription: { en: '', uz: '' }, 
                    cardImage: '',
                    galleryImages: [] 
                  }] 
                })}>+ Add Committee</button>
              </div>
              {data.committees.map((c, idx) => (
                <div key={c.id} className={styles.sectionItem}>
                  <LanguageInput label="Name" value={c.name} onChange={name => { const committees = [...data.committees]; committees[idx] = { ...c, name }; updateData({ committees }); }} />
                  <LanguageInput label="Chairs" value={c.chairs} onChange={chairs => { const committees = [...data.committees]; committees[idx] = { ...c, chairs }; updateData({ committees }); }} />
                  <LanguageInput label="Short Description" textarea value={c.shortDescription} onChange={shortDescription => { const committees = [...data.committees]; committees[idx] = { ...c, shortDescription }; updateData({ committees }); }} />
                  <LanguageInput label="Full Description" textarea value={c.fullDescription} onChange={fullDescription => { const committees = [...data.committees]; committees[idx] = { ...c, fullDescription }; updateData({ committees }); }} />
                  
                  <div className={styles.formGroup}>
                    <ImageUpload 
                      label="Card/Button Image (Shown on list page)" 
                      currentImage={c.cardImage} 
                      onUpload={cardImage => {
                        const committees = [...data.committees];
                        committees[idx] = { ...c, cardImage };
                        updateData({ committees });
                      }} 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Gallery Images (Shown on detail page)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginTop: '10px' }}>
                      {(c.galleryImages || []).map((img, imgIdx) => (
                        <div key={imgIdx} style={{ position: 'relative' }}>
                          <ImageUpload 
                            currentImage={img} 
                            onUpload={base64 => {
                              const galleryImages = [...c.galleryImages];
                              galleryImages[imgIdx] = base64;
                              const committees = [...data.committees];
                              committees[idx] = { ...c, galleryImages };
                              updateData({ committees });
                            }} 
                          />
                          <button 
                            className={styles.deleteBtn} 
                            style={{ position: 'absolute', top: '-5px', right: '-5px', padding: '2px 5px', fontSize: '10px' }}
                            onClick={() => {
                              const galleryImages = c.galleryImages.filter((_, i) => i !== imgIdx);
                              const committees = [...data.committees];
                              committees[idx] = { ...c, galleryImages };
                              updateData({ committees });
                            }}
                          >X</button>
                        </div>
                      ))}
                      <button 
                        className={styles.addBtn} 
                        style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => {
                          const galleryImages = [...(c.galleryImages || []), ''];
                          const committees = [...data.committees];
                          committees[idx] = { ...c, galleryImages };
                          updateData({ committees });
                        }}
                      >+ Add Gallery Image</button>
                    </div>
                  </div>
                  <button className={styles.deleteBtn} onClick={() => updateData({ committees: data.committees.filter(i => i.id !== c.id) })}>Delete Committee</button>
                </div>
              ))}
              <hr style={{ margin: '40px 0' }} />
              {renderPageEditor('committees')}
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className={styles.adminSection}>
              <div className={styles.headerRow}><h3>Schedules</h3><button className={styles.addBtn} onClick={() => updateData({ schedules: [...data.schedules, { id: Date.now().toString(), title: { en: 'Day 1', uz: '1-kun' }, entries: [] }] })}>+ Add Part</button></div>
              {data.schedules.map((part, pIdx) => (
                <div key={part.id} className={styles.sectionItem}>
                  <LanguageInput label="Part Title" value={part.title} onChange={title => { const schedules = [...data.schedules]; schedules[pIdx] = { ...part, title }; updateData({ schedules }); }} />
                  {(part.entries || []).map((entry, eIdx) => (
                    <div key={entry.id} style={{ background: '#f0f0f0', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
                      <div className={styles.formGroup}><label>Time</label><input type="text" value={entry.time} onChange={e => { const schedules = [...data.schedules]; const entries = [...part.entries]; entries[eIdx] = { ...entry, time: e.target.value }; schedules[pIdx] = { ...part, entries }; updateData({ schedules }); }} /></div>
                      <LanguageInput label="Activity" value={entry.activity} onChange={activity => { const schedules = [...data.schedules]; const entries = [...part.entries]; entries[eIdx] = { ...entry, activity }; schedules[pIdx] = { ...part, entries }; updateData({ schedules }); }} />
                      <button className={styles.deleteBtn} onClick={() => { const schedules = [...data.schedules]; const entries = part.entries.filter(e => e.id !== entry.id); schedules[pIdx] = { ...part, entries }; updateData({ schedules }); }}>Remove</button>
                    </div>
                  ))}
                  <button className={styles.addBtn} onClick={() => { const schedules = [...data.schedules]; const entries = [...(part.entries || []), { id: Date.now().toString(), time: '', activity: { en: '', uz: '' } }]; schedules[pIdx] = { ...part, entries }; updateData({ schedules }); }}>+ Add Entry</button>
                  <hr /><button className={styles.deleteBtn} onClick={() => updateData({ schedules: data.schedules.filter(s => s.id !== part.id) })}>Delete Part</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className={styles.adminSection}>
              <div className={styles.headerRow}><h3>Registrations</h3></div>
              <div className={styles.regTableWrapper}><table className={styles.table}><thead><tr><th>Name</th><th>Email</th><th>Committee</th></tr></thead><tbody>{data.registrations.map(r => (<tr key={r.id}><td>{r.fullName}</td><td>{r.email}</td><td>{r.committee}</td></tr>))}</tbody></table></div>
              <hr style={{ margin: '40px 0' }} />
              {renderPageEditor('registration')}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className={styles.adminSection}>
              <div className={styles.headerRow}><h3>Messages</h3></div>
              <div className={styles.regTableWrapper}><table className={styles.table}><thead><tr><th>Name</th><th>Email</th><th>Message</th></tr></thead><tbody>{data.contactSubmissions.map(m => (<tr key={m.id}><td>{m.name}</td><td>{m.email}</td><td>{m.message}</td></tr>))}</tbody></table></div>
              <hr style={{ margin: '40px 0' }} />
              {renderPageEditor('contact')}
            </div>
          )}

          {activeTab === 'footer' && (
            <div className={styles.adminSection}>
              <h3>Footer Details</h3>
              <LanguageInput label="Description" textarea value={data.footer.description} onChange={description => updateData({ footer: { ...data.footer, description } })} />
              <div className={styles.formGroup}><label>Email</label><input type="text" value={data.footer.email} onChange={e => updateData({ footer: { ...data.footer, email: e.target.value } })} /></div>
              <LanguageInput label="Location" value={data.footer.location} onChange={location => updateData({ footer: { ...data.footer, location } })} />
              <LanguageInput label="Copyright" value={data.footer.copyright} onChange={copyright => updateData({ footer: { ...data.footer, copyright } })} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.adminSection}>
              <h3>Security & Theme</h3>
              <div className={styles.formGroup}><label>Password</label><input type="text" value={data.password} onChange={e => updateData({ password: e.target.value })} /></div>
              <ColorPicker label="Brand Primary Color" value={data.theme.primaryColor} onChange={primaryColor => updateData({ theme: { ...data.theme, primaryColor } })} />
              
              <hr style={{ margin: '40px 0' }} />
              <h3>Media Library (Direct Cloudinary Upload)</h3>
              <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
                Use this tool to upload high-quality assets directly to Cloudinary. 
                You can copy the URL and paste it into any "Hero Background" or "Card Image" field above.
              </p>
              <CloudinaryUpload label="Quick Asset Upload" />

              <hr style={{ margin: '40px 0' }} />
              <h3>Backup & Restore</h3>
              <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
                Download your entire website content as a backup file, or restore it from a previous save.
              </p>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={handleExport} className={styles.addBtn} style={{ background: '#28a745' }}>
                  Download Backup (.json)
                </button>
                <label className={styles.addBtn} style={{ background: '#6c757d', cursor: 'pointer', display: 'inline-block' }}>
                  Restore from File
                  <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
