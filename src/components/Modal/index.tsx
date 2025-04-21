import React from 'react';
import styles from './index.module.css';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  padding?: string;
  borderRadius?: string;
  backgroundOverlayColor?: string;
  verticalPosition?: 'top' | 'bottom' | 'middle' | 'center';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  width,
  maxWidth,
  height,
  padding,
  borderRadius,
  backgroundOverlayColor,
  verticalPosition
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      style={
        {
          '--modal-background-overlay-color':
            backgroundOverlayColor || 'rgba(0, 0, 0, 0.66)'
        } as React.CSSProperties
      }
      onClick={handleBackdropClick}
    >
      <div
        className={`${styles.modalContent} ${className}`}
        style={
          {
            '--modal-width': width || '90%',
            '--modal-max-width': maxWidth || '500px',
            '--modal-height': height || 'auto',
            '--modal-vertical-position-top':
              verticalPosition === 'top'
                ? 0
                : verticalPosition === 'middle' || verticalPosition === 'center'
                  ? '50%'
                  : verticalPosition === 'bottom'
                    ? 'auto'
                    : 'auto',
            '--modal-vertical-position-bottom':
              verticalPosition === 'bottom'
                ? 0
                : verticalPosition === 'middle' || verticalPosition === 'center'
                  ? '50%'
                  : verticalPosition === 'top'
                    ? 'auto'
                    : 'auto',
            '--modal-center-position-transform':
              verticalPosition === 'top'
                ? 'translate(-50%, 0)'
                : verticalPosition === 'bottom'
                  ? 'translate(-50%, 0)'
                  : 'translate(-50%, -50%)',
            '--modal-padding': padding || '0',
            '--modal-border-radius': borderRadius || '0'
          } as React.CSSProperties
        }
      >
        <div className={styles.modalHeader}>
          {title && <h2 className={styles.modalTitle}>{title}</h2>}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <XCircleIcon width={24} height={24} />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
