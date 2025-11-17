// src/components/ProgressiveImage.tsx
import React, { useState, useRef, useEffect } from 'react';
import './ProgressiveImage.scss';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  placeholderSrc,
  onError,
  loading = 'lazy',
  decoding = 'async',
  fetchpriority = 'auto'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generar un placeholder blur si no se proporciona uno
  const getPlaceholder = () => {
    if (placeholderSrc) return placeholderSrc;
    
    // Crear un SVG placeholder minimalista
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#f0f0f0"/>
        <path d="M200 150L250 220 150 220Z" fill="#ddd"/>
        <text x="200" y="280" text-anchor="middle" fill="#ccc" font-family="Arial" font-size="14">Loading...</text>
      </svg>
    `)}`;
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    if (onError) {
      onError(e);
    }
  };

  // Precargar la imagen real
  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      // Cuando la imagen real se carga, actualizamos el estado
      if (imgRef.current) {
        imgRef.current.src = src;
      }
    };
    img.onerror = () => {
      setImageError(true);
    };
  }, [src]);

  const displaySrc = imageLoaded ? src : getPlaceholder();

  return (
    <div className={`progressive-image-container ${className}`}>
      <img
        ref={imgRef}
        src={displaySrc}
        alt={alt}
        className={`progressive-image ${
          imageLoaded ? 'progressive-image--loaded' : 'progressive-image--blur'
        } ${imageError ? 'progressive-image--error' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchpriority}
      />
      
      {!imageLoaded && !imageError && (
        <div className="progressive-image-skeleton">
          <div className="progressive-image-skeleton__shimmer" />
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;