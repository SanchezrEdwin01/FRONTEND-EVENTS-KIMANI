import React from 'react';
import styles from './index.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: number | string;
  lineHeight?: string;
  borderRadius?: string;
  padding?: string;
  width?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  backgroundColor = '#EAEEDD',
  textColor = '#222222',
  fontSize = '14px',
  fontWeight = 600,
  lineHeight = '20px',
  borderRadius = '8px',
  padding = '7px 0',
  width = '100%',
  variant = 'solid',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  style,
  ...props
}) => {
  const buttonStyles = {
    backgroundColor: variant === 'solid' ? backgroundColor : 'transparent',
    color: variant === 'ghost' ? backgroundColor : textColor,
    fontSize,
    fontWeight,
    lineHeight,
    borderRadius,
    padding,
    width,
    border: variant === 'outline' ? `1px solid ${backgroundColor}` : 'none',
    opacity: disabled ? 0.6 : 1,
    ...style
  };

  return (
    <button
      className={`${styles.button} ${styles[size]} ${styles[variant]} ${className}`}
      style={buttonStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner} />
          {children || <span>Loading...</span>}
        </div>
      ) : (
        <div className={styles.contentWrapper}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};

export default Button;
