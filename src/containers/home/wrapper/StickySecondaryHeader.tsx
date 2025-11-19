import React, { useEffect, useRef, useState } from 'react';

interface StickySecondaryHeaderProps {
  children: React.ReactNode;
  className?: string;
  headerSelector?: string;
}

export function StickySecondaryHeader({
  children,
  className = '',
  headerSelector = '#main-header'
}: StickySecondaryHeaderProps) {
  const [topOffset, setTopOffset] = useState(0);
  const headerElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.querySelector(headerSelector) as HTMLElement | null;
    headerElRef.current = el;

    if (!el) return;

    const updateOffset = () => {
      const rect = el.getBoundingClientRect();
      const bottom = rect.bottom;

      if (bottom > 0) {
        setTopOffset(bottom);
      } else {
        setTopOffset(0);
      }
    };

    updateOffset();

    const onScroll = () => updateOffset();
    const onResize = () => updateOffset();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [headerSelector]);

  return (
    <div
      className={className}
      style={{
        position: 'sticky',
        top: `${topOffset}px`,
        zIndex: 900,
        marginTop: topOffset > 0 ? '0px' : '200px',
        background: '#191919',
        transition: 'top 0.15s linear'
      }}
    >
      {children}
    </div>
  );
}
