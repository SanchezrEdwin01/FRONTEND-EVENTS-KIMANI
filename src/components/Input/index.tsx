import React from 'react';
import styles from './index.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  type?: 'text' | 'password' | 'email' | 'textarea';
  error?: string;
  wrapperClassName?: string;
  className?: string;
  rows?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  error,
  className = '',
  wrapperClassName = '',
  style,
  rows = 4,
  disabled = false,
  value,
  defaultValue,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = `
    ${styles.input} 
    ${error ? styles.error : ''} 
    ${className}
    ${disabled ? styles.disabled : ''}
  `;

  return (
    <div className={`${styles.fieldContainer} ${wrapperClassName}`} style={style}>
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          {type === 'textarea' ? (
            <textarea
              id={inputId}
              className={inputClasses}
              rows={rows}
              disabled={disabled}
              value={value}
              defaultValue={defaultValue}
              placeholder={label}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={inputId}
              type={type}
              className={inputClasses}
              disabled={disabled}
              value={value}
              defaultValue={defaultValue}
              placeholder={label}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          <label className={styles.visuallyHidden} htmlFor={inputId}>
            {label}
          </label>
        </div>
        {error && (
          <span className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;