import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './styles.module.css';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
  isStartDate?: boolean;
  endDate?: Date;
  onEndDateChange?: (date: Date) => void;
  startDate?: Date;
  onStartDateChange?: (date: Date) => void;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Select date',
  isStartDate = false,
  endDate,
  onEndDateChange,
  startDate,
  onStartDateChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef<DatePicker>(null);

  
  const formatDate = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange(date);

      
      if (isStartDate && endDate && onEndDateChange) {
        
        if (date > endDate) {
          
          onEndDateChange(date);
        }
      }

      
      if (!isStartDate && startDate && onStartDateChange) {
        
        if (date < startDate) {
          
          onStartDateChange(date);
        }
      }

      setIsOpen(false);
    }
  };

  
  const toggleDatePicker = () => {
    setIsOpen(!isOpen);
    if (!isOpen && datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  
  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now);

    
    if (datePickerRef.current) {
      
      datePickerRef.current.setMonth(now.getMonth());
      
      datePickerRef.current.setYear(now.getFullYear());
    }

    
    handleDateChange(now);
  };

  
  const formatDayName = (dateStr: string) => {
    return dateStr.charAt(0);
  };

  
  const formatMonthHeader = (date: Date) => {
    const currentYear = new Date().getFullYear();
    const monthYear = date.toLocaleString('default', { month: 'long' });

    if (date.getFullYear() !== currentYear) {
      return `${monthYear} ${date.getFullYear()}`;
    }

    return monthYear;
  };

  return (
    <div className={`${styles.datePickerContainer} ${className}`}>
      <div className={styles.dateDisplay} onClick={toggleDatePicker}>
        {formatDate(value)}
      </div>

      {isOpen && (
        <div className={styles.datePickerWrapper}>
          <DatePicker
            ref={datePickerRef}
            selected={value}
            onChange={handleDateChange}
            inline={true}
            open={isOpen}
            minDate={today}
            onClickOutside={() => setIsOpen(false)}
            calendarClassName={styles.calendar}
            dayClassName={date =>
              date.getTime() === value.getTime()
                ? styles.selectedDay
                : undefined
            }
            monthClassName={() => styles.month}
            onMonthChange={setCurrentMonth}
            formatWeekDay={formatDayName}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled
            }) => (
              <div className={styles.customHeader}>
                <div className={styles.monthYear}>
                  {formatMonthHeader(date)}
                </div>
                <div className={styles.headerControls}>
                  <div className={styles.navButtons}>
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      type="button"
                      className={`${styles.navButton} ${styles.navButtonLeft}`}
                    >
                      <svg
                        xmlns="http:
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.75"
                          d="m6 3 5 5-5 5"
                        ></path>
                      </svg>
                    </button>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      type="button"
                      className={styles.navButton}
                    >
                      <svg
                        xmlns="http:
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.75"
                          d="m6 3 5 5-5 5"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
