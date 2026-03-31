'use client';

import React, { useRef } from 'react';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  onUpload: (base64: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({ onUpload, currentImage, label }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB for localStorage stability)
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Please upload an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpload(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.uploadWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.previewArea}>
        {currentImage ? (
          <img src={currentImage} alt="Preview" className={styles.previewImage} />
        ) : (
          <div className={styles.placeholder}>No Image Selected</div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />
      <button 
        type="button" 
        className={styles.uploadBtn} 
        onClick={() => fileInputRef.current?.click()}
      >
        {currentImage ? 'Change Image' : 'Upload Image'}
      </button>
    </div>
  );
}
