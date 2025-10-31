import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export type ContextMenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type Props = {
  open: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
};

const MENU_Z = 9999;

export default function ContextMenu({ open, x, y, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onGlobalClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', onGlobalClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onGlobalClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  const safeX = Math.min(x, Math.max(8, vw - 220));
  const safeY = Math.min(y, Math.max(8, vh - 140));

  return createPortal(
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: MENU_Z,
        pointerEvents: 'none',
      }}
    >
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
      />
      <div
        ref={ref}
        role="menu"
        style={{
          position: 'absolute',
          left: safeX,
          top: safeY,
          minWidth: 200,
          background: '#111',
          color: '#fff',
          borderRadius: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
          padding: 6,
          pointerEvents: 'auto',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {items.map((it, i) => (
          <button
            key={i}
            role="menuitem"
            onClick={() => {
              it.onClick();
              onClose();
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              color: it.danger ? 'var(--error, #ff6b6b)' : '#fff',
              padding: '10px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'transparent';
            }}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}
