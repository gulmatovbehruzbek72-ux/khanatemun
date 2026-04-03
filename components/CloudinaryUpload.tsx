'use client';

import React, { useState, useRef } from 'react';
import styles from './CloudinaryUpload.module.css';

interface CloudinaryUploadProps {
  onUploadSuccess?: (url: string) => void;
  label?: string;
}

const CLOUD_NAME = 'dpabzybqo';
const UPLOAD_PRESET = 'khanatemun';

export default function CloudinaryUpload({ onUploadSuccess, label }: CloudinaryUploadProps) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Basic file validation
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSize) {
      setError('File is too large (max 10MB)');
      return;
    }

    setLoading(true);
    setError(null);

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
        setPreviewUrl(data.secure_url);
        if (onUploadSuccess) {
          onUploadSuccess(data.secure_url);
        }
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setError(err.message || 'Something went wrong during upload');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
      alert('URL copied to clipboard!');
    }
  };

  return (
    <div className={styles.uploadWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.previewArea}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <span>Uploading to Cloudinary...</span>
          </div>
        )}
        
        {previewUrl ? (
          <img src={previewUrl} alt="Uploaded preview" className={styles.previewImage} />
        ) : (
          <div className={styles.placeholder}>
            {error ? <span style={{ color: '#d93025' }}>{error}</span> : 'No file uploaded yet. Click below to select.'}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        style={{ display: 'none' }}
        disabled={loading}
      />

      <button
        type="button"
        className={styles.uploadBtn}
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? 'Processing...' : previewUrl ? 'Change File' : 'Select & Upload File'}
      </button>

      {previewUrl && (
        <div className={styles.urlDisplay}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {previewUrl}
          </span>
          <button className={styles.copyBtn} onClick={copyToClipboard}>
            Copy URL
          </button>
        </div>
      )}
    </div>
  );
}
