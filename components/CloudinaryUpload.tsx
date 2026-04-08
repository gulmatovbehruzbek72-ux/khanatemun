'use client';

import React, { useState, useRef } from 'react';
import styles from './CloudinaryUpload.module.css';

interface CloudinaryUploadProps {
  onUploadSuccess?: (url: string) => void;
  label?: string;
}

const CLOUD_NAME = 'dpabzybqo';
const UPLOAD_PRESET = 'khanatemun';

interface UploadHistoryItem {
  url: string;
  timestamp: number;
}

export default function CloudinaryUpload({ onUploadSuccess, label }: CloudinaryUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<UploadHistoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setError(null);

    const newHistoryItems: UploadHistoryItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          const item = { url: data.secure_url, timestamp: Date.now() };
          newHistoryItems.unshift(item); // Newest first
          if (onUploadSuccess) onUploadSuccess(data.secure_url);
        }
      } catch (err: any) {
        console.error('Cloudinary upload error:', err);
        setError('Some files failed to upload.');
      }
    }

    setHistory(prev => [...newHistoryItems, ...prev]);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied!');
  };

  return (
    <div className={styles.uploadWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.mainAction}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          disabled={loading}
        />

        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Select & Upload Files (Multiple)'}
        </button>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.historyList}>
        <h3>Recently Uploaded</h3>
        {history.length === 0 ? (
          <p className={styles.emptyText}>No files uploaded in this session.</p>
        ) : (
          history.map((item, idx) => (
            <div key={item.timestamp + idx} className={styles.historyItem}>
              <img src={item.url} alt="Thumbnail" className={styles.thumbnail} />
              <div className={styles.itemInfo}>
                <span className={styles.urlText}>{item.url}</span>
                <button 
                  className={styles.copyBtn} 
                  onClick={() => copyToClipboard(item.url)}
                >
                  Copy URL
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
