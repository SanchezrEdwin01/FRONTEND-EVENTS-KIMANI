import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  startTime?: Date;
  isStartTime?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  className = '',
  startTime,
  isStartTime
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const timeOptions = [];

  timeOptions.push('12:00 AM');
  timeOptions.push('12:30 AM');

  for (let hour = 1; hour <= 11; hour++) {
    timeOptions.push(`${hour}:00 AM`);
    timeOptions.push(`${hour}:30 AM`);
  }

  timeOptions.push('12:00 PM');
  timeOptions.push('12:30 PM');

  for (let hour = 1; hour <= 11; hour++) {
    timeOptions.push(`${hour}:00 PM`);
    timeOptions.push(`${hour}:30 PM`);
  }

  const currentHour = value.getHours();
  const currentMinutes = value.getMinutes();
  const currentPeriod = currentHour >= 12 ? 'PM' : 'AM';
  const displayHour = currentHour % 12 || 12;
  const displayMinutes = currentMinutes < 30 ? '00' : '30';
  const currentTime = `${displayHour}:${displayMinutes} ${currentPeriod}`;

  useEffect(() => {
    setSelectedTime(currentTime);
  }, [currentTime]);

  const isSameDay =
    (startTime &&
      value.getDate() === startTime.getDate() &&
      value.getMonth() === startTime.getMonth() &&
      value.getFullYear() === startTime.getFullYear()) ||
    false;

  const calculateTimeDifference = (timeString: string): string => {
    if (!startTime) return '';

    const [time, period] = timeString.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minutes = parseInt(minuteStr);

    const optionDate = new Date(startTime);
    let optionHour = hour;

    if (period === 'PM' && hour !== 12) {
      optionHour += 12;
    } else if (period === 'AM' && hour === 12) {
      optionHour = 0;
    }

    optionDate.setHours(optionHour);
    optionDate.setMinutes(minutes);

    if (!isSameDay) return '';

    const diffMs = optionDate.getTime() - startTime.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    if (diffMinutes < 0) return '';

    const roundedMinutes = Math.round(diffMinutes / 30) * 30;

    if (roundedMinutes === 0) return '';
    if (roundedMinutes === 30) return '30m';
    if (roundedMinutes === 60) return '1h';

    const hours = Math.floor(roundedMinutes / 60);
    const remainingMinutes = roundedMinutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h 30m`;
  };

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

  const handleTimeSelect = (timeString: string) => {
    setSelectedTime(timeString);

    const [time, period] = timeString.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minutes = parseInt(minuteStr);

    const newDate = new Date(value);
    let newHour = hour;

    if (period === 'PM' && hour !== 12) {
      newHour += 12;
    } else if (period === 'AM' && hour === 12) {
      newHour = 0;
    }

    newDate.setHours(newHour);

    const roundedMinutes = minutes < 30 ? 0 : 30;
    newDate.setMinutes(roundedMinutes);

    newDate.setSeconds(0);

    onChange(newDate);
    setIsOpen(false);
  };

  return (
    <div
      className={`${styles.timePickerContainer} ${className}`}
      ref={dropdownRef}
    >
      <div className={styles.timeDisplay} onClick={() => setIsOpen(!isOpen)}>
        {currentTime}
      </div>

      {isOpen && (
        <div
          className={`${styles.dropdown} ${isStartTime ? styles.startTime : ''}`}
          ref={dropdownContainerRef}
        >
          {timeOptions.map((time, index) => {
            const timeDiff = calculateTimeDifference(time);
            const isSelected = time === selectedTime;

            return (
              <div
                key={index}
                ref={isSelected ? selectedOptionRef : null}
                className={`${styles.timeOption} ${isSelected && isSameDay ? styles.selected : ''} ${
                  isStartTime ? styles.startTime : ''
                }`}
                onClick={() => handleTimeSelect(time)}
              >
                <span>{time}</span>
                {timeDiff && isSameDay && (
                  <span className={styles.timeDiff}>{timeDiff}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimePicker;
