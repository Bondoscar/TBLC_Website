// Reusable image preview using the same Drive-resolution logic as the backend.
// Useful in the admin form so the user sees what their pasted Drive URL renders as.
import React from 'react';

// Mirror of backend drive_utils.extract_drive_id
const DRIVE_HOSTS = ['drive.google.com', 'docs.google.com', 'lh3.googleusercontent.com'];
const PATTERNS = [
  /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
  /\/d\/([a-zA-Z0-9_-]{10,})/,
  /[?&]id=([a-zA-Z0-9_-]{10,})/,
];

const isDrive = (url) => !!url && DRIVE_HOSTS.some((h) => url.includes(h));
const extractId = (url) => {
  if (!url) return null;
  const s = url.trim();
  if (/^[a-zA-Z0-9_-]{20,}$/.test(s)) return s;
  for (const p of PATTERNS) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return null;
};

export const resolveDriveImage = (url, size = 2000) => {
  if (!url) return '';
  if (!isDrive(url) && !/^[a-zA-Z0-9_-]{20,}$/.test(url.trim())) return url;
  const id = extractId(url);
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
};

export const resolveDriveFile = (url) => {
  if (!url) return '';
  if (!isDrive(url) && !/^[a-zA-Z0-9_-]{20,}$/.test(url.trim())) return url;
  const id = extractId(url);
  if (!id) return url;
  return `https://drive.google.com/uc?export=download&id=${id}`;
};

const ImagePreview = ({ url, alt = 'preview', className = '' }) => {
  const src = resolveDriveImage(url);
  if (!src) {
    return (
      <div className={`bg-blue-900/40 border border-white/10 flex items-center justify-center text-white/40 text-xs ${className}`}>
        no image
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover bg-blue-900/40 border border-white/10 ${className}`}
      onError={(e) => {
        e.currentTarget.style.opacity = 0.3;
      }}
    />
  );
};

export default ImagePreview;
