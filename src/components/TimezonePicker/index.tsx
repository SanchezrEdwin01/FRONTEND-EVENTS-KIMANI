import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { timezoneOptions } from '../../containers/new-event/newEventHelper';

interface TimezonePickerProps {
  value: string;
  onChange: (timezone: string) => void;
  className?: string;
}

const TimezonePicker: React.FC<TimezonePickerProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const currentTimezone = timezoneOptions.find(option => {
    const timezoneId = value.includes('|') ? value.split('|')[0] : value;
    return option.value === timezoneId;
  });
  const displayTimezone = currentTimezone
    ? currentTimezone.label
    : value || 'Select timezone';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && selectedOptionRef.current && dropdownContainerRef.current) {
      setTimeout(() => {
        const container = dropdownContainerRef.current;
        const selectedOption = selectedOptionRef.current;

        if (container && selectedOption) {
          const containerHeight = container.clientHeight;
          const optionTop = selectedOption.offsetTop;
          const optionHeight = selectedOption.clientHeight;

          const scrollPosition =
            optionTop - containerHeight / 2 + optionHeight / 2;

          container.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  }, [isOpen]);

  const handleTimezoneSelect = (timezoneValue: string) => {
    const selectedOption = timezoneOptions.find(
      option => option.value === timezoneValue
    );

    let utcOffset = '';
    if (selectedOption) {
      const match = selectedOption.label.match(/\(UTC([+-]\d{2}:\d{2})\)/);
      if (match) {
        utcOffset = match[1];
      }
    }

    const combinedValue = `${timezoneValue}|${utcOffset}`;

    onChange(combinedValue);

    setIsOpen(false);
  };

  return (
    <div
      className={`${styles.timezonePickerContainer} ${className}`}
      ref={dropdownRef}
      style={{ width: '100%', maxWidth: '100%' }}
    >
      <div
        className={styles.timezoneDisplay}
        onClick={() => setIsOpen(!isOpen)}
        title={displayTimezone}
        style={{ width: '100%', maxWidth: '100%' }}
      >
        {displayTimezone}
      </div>

      {isOpen && (
        <div className={styles.dropdown} ref={dropdownContainerRef}>
          {timezoneOptions.map((option, index) => {
            const timezoneId = value.includes('|')
              ? value.split('|')[0]
              : value;
            const isSelected = option.value === timezoneId;

            return (
              <div
                key={index}
                ref={isSelected ? selectedOptionRef : null}
                className={`${styles.timezoneOption} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleTimezoneSelect(option.value)}
                title={option.label}
              >
                <span title={option.label}>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimezonePicker;
