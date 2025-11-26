// src/hooks/useProgressiveImage.ts
import { useState, useEffect } from 'react';

interface UseProgressiveImageProps {
  src: string;
  lowResSrc?: string;
  enableBlurEffect?: boolean;
}

export const useProgressiveImage = ({
  src,
  lowResSrc,
  enableBlurEffect = true
}: UseProgressiveImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || src);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlurred, setIsBlurred] = useState(enableBlurEffect);

  useEffect(() => {
    if (!src) return;

    // Si ya estamos mostrando la imagen final, no hacer nada
    if (currentSrc === src) return;

    setIsLoading(true);
    
    const img = new Image();
    
    img.onload = () => {
      // Pequeño delay para asegurar que la imagen está completamente cargada
      setTimeout(() => {
        setCurrentSrc(src);
        setIsLoading(false);
        
        // Remover el blur después de un breve momento
        if (enableBlurEffect) {
          setTimeout(() => setIsBlurred(false), 150);
        }
      }, 100);
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setIsBlurred(false);
      console.error('Error loading image:', src);
    };
    
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, currentSrc, enableBlurEffect]);

  return {
    src: currentSrc,
    isLoading,
    isBlurred,
    isLowRes: currentSrc !== src
  };
};