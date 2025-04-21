import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

interface CustomDropdownOption {
  value: string | number;
  label: string;
}

interface CustomDropdownProps {
  options: CustomDropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  name?: string;
  isDisabled?: boolean;
  error?: string;
  className?: string;
  wrapperClassName?: string;
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right' | 'top';
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select or type a value',
  name,
  isDisabled = false,
  error,
  className = '',
  wrapperClassName = '',
  label,
  description,
  labelPosition = 'top'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] =
    useState<CustomDropdownOption[]>(options);
  const [selectedOption, setSelectedOption] =
    useState<CustomDropdownOption | null>(
      options.find(option => option.value === value) || null
    );
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [inputValue, options]);

  useEffect(() => {
    if (typeof value === 'string') {
      const option = options.find(option => option.value === value);
      if (option) {
        setSelectedOption(option);
        setInputValue(option.label);
      } else {
        setSelectedOption(null);
        setInputValue(value);
      }
    } else {
      const option = options.find(option => option.value === value);
      setSelectedOption(option || null);
      if (option) {
        setInputValue(option.label);
      } else {
        setInputValue('');
      }
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);

    const exactMatch = options.find(
      option => option.label.toLowerCase() === newValue.toLowerCase()
    );

    if (exactMatch) {
      setSelectedOption(exactMatch);
      onChange(exactMatch.value);
    } else {
      setSelectedOption(null);
      onChange(newValue);
    }
  };

  const handleOptionClick = (option: CustomDropdownOption) => {
    setSelectedOption(option);
    setInputValue(option.label);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue && !selectedOption) {
      onChange(inputValue);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const wrapperClasses = `
    ${styles.dropdownWrapper}
    ${styles[`label-${labelPosition}`]}
    ${wrapperClassName}
    ${isDisabled ? styles.disabled : ''}
    ${error ? styles.error : ''}
  `;

  const labelContent = label && (
    <div className={styles.labelContent}>
      <span className={styles.labelText}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
    </div>
  );

  return (
    <div className={wrapperClasses} ref={containerRef}>
      {labelContent}
      <div className={styles.dropdownContainer}>
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            className={`${styles.input} ${className}`}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled}
            name={name}
          />
          <button
            className={styles.dropdownButton}
            onClick={() => setIsOpen(!isOpen)}
            disabled={isDisabled}
            type="button"
          >
            <svg
              height="20"
              width="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
              fill="currentColor"
            >
              <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className={styles.dropdown}>
            {filteredOptions.length > 0 &&
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`${styles.option} ${selectedOption?.value === option.value ? styles.selected : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default CustomDropdown;
