import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface DateTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dates: { start: Date; end: Date }) => void;
  initialDates: {
    start: Date;
    end: Date;
  };
  selectedDatePicker: 'start' | 'end';
}

const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialDates,
  selectedDatePicker
}) => {
  const [currentDate, setCurrentDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  const scrollRefs = {
    date: useRef<HTMLDivElement>(null),
    hour: useRef<HTMLDivElement>(null),
    minute: useRef<HTMLDivElement>(null),
    ampm: useRef<HTMLDivElement>(null)
  };

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  );
  const ampm = ['AM', 'PM'];

  const generateDateArray = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const scrollTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const handleStartScroll = (
    e: React.UIEvent<HTMLDivElement>,
    type: string
  ) => {
    const target = e.currentTarget;
    const scrollPos = target.scrollTop;
    const itemHeight = 40;

    if (scrollTimeouts.current[type]) {
      clearTimeout(scrollTimeouts.current[type]);
    }

    const selectedIndex = Math.round((scrollPos - 80) / itemHeight);

    scrollTimeouts.current[type] = setTimeout(() => {
      const targetScroll = selectedIndex * itemHeight + 80;
      target.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      const newDate = new Date(currentDate);

      switch (type) {
        case 'date':
          const dateOptions = generateDateArray();
          if (selectedIndex >= 0 && selectedIndex < dateOptions.length) {
            newDate.setDate(dateOptions[selectedIndex].getDate());
            newDate.setMonth(dateOptions[selectedIndex].getMonth());
          }
          break;
        case 'hour':
          let hour = selectedIndex + 1;
          const isCurrentPM = newDate.getHours() >= 12;
          if (isCurrentPM) {
            hour = hour === 12 ? 12 : hour + 12;
          } else {
            hour = hour === 12 ? 0 : hour;
          }
          newDate.setHours(hour);
          break;
        case 'minute':
          newDate.setMinutes(selectedIndex);
          break;
        case 'ampm':
          const selectedPM = selectedIndex === 1;
          const hours = newDate.getHours();
          if (selectedPM && hours < 12) {
            newDate.setHours(hours + 12);
          } else if (!selectedPM && hours >= 12) {
            newDate.setHours(hours - 12);
          }
          break;
      }

      setCurrentDate(new Date(newDate));
    }, 150);
  };

  const handleEndScroll = (e: React.UIEvent<HTMLDivElement>, type: string) => {
    const target = e.currentTarget;
    const scrollPos = target.scrollTop;
    const itemHeight = 40;

    if (scrollTimeouts.current[type]) {
      clearTimeout(scrollTimeouts.current[type]);
    }

    const selectedIndex = Math.round((scrollPos - 80) / itemHeight);

    scrollTimeouts.current[type] = setTimeout(() => {
      const targetScroll = selectedIndex * itemHeight + 80;
      target.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      const newDate = new Date(endDate);

      switch (type) {
        case 'date':
          const dateOptions = generateDateArray();
          if (selectedIndex >= 0 && selectedIndex < dateOptions.length) {
            newDate.setDate(dateOptions[selectedIndex].getDate());
            newDate.setMonth(dateOptions[selectedIndex].getMonth());
          }
          break;
        case 'hour':
          let hour = selectedIndex + 1;
          const isCurrentPM = newDate.getHours() >= 12;
          if (isCurrentPM) {
            hour = hour === 12 ? 12 : hour + 12;
          } else {
            hour = hour === 12 ? 0 : hour;
          }
          newDate.setHours(hour);
          break;
        case 'minute':
          newDate.setMinutes(selectedIndex);
          break;
        case 'ampm':
          const selectedPM = selectedIndex === 1;
          const hours = newDate.getHours();
          if (selectedPM && hours < 12) {
            newDate.setHours(hours + 12);
          } else if (!selectedPM && hours >= 12) {
            newDate.setHours(hours - 12);
          }
          break;
      }

      setEndDate(new Date(newDate));
    }, 150);
  };

  const toggleDateSelection = () => {
    setIsSelectingEnd(!isSelectingEnd);
  };

  const handleDone = () => {
    onSelect({
      start: currentDate,
      end: endDate
    });
    onClose();
  };

  useEffect(() => {
    setIsSelectingEnd(selectedDatePicker == 'end');
  }, [selectedDatePicker]);

  useEffect(() => {
    if (isOpen) {
      Object.entries(scrollRefs).forEach(([type, ref]) => {
        const element = ref.current;
        if (!element) return;

        const date = isSelectingEnd ? endDate : currentDate;
        let scrollIndex = 0;

        switch (type) {
          case 'date':
            const dates = generateDateArray();
            scrollIndex = dates.findIndex(
              d =>
                d.getDate() === date.getDate() &&
                d.getMonth() === date.getMonth()
            );
            break;
          case 'hour':
            scrollIndex = (date.getHours() % 12 || 12) - 1;
            break;
          case 'minute':
            scrollIndex = date.getMinutes();
            break;
          case 'ampm':
            scrollIndex = date.getHours() >= 12 ? 1 : 0;
            break;
        }

        const targetScroll = scrollIndex * 40 + 80;
        element.scrollTo({
          top: targetScroll,
          behavior: 'instant'
        });
      });
    }
  }, [isOpen, isSelectingEnd, currentDate, endDate]);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      if (currentDate < now) {
        setCurrentDate(now);
      }
      if (endDate < now) {
        setEndDate(now);
      }
    }
  }, [isOpen]);

  const renderTimeColumn = (type: 'date' | 'hour' | 'minute') => {
    return (
      <div
        className={styles.scrollContainer}
        ref={scrollRefs[type]}
        onScroll={e =>
          isSelectingEnd ? handleEndScroll(e, type) : handleStartScroll(e, type)
        }
      >
        {type === 'date' &&
          generateDateArray().map((date, index) => (
            <div
              key={index}
              className={`${styles.option} ${
                date.getDate() ===
                  (isSelectingEnd ? endDate : currentDate).getDate() &&
                date.getMonth() ===
                  (isSelectingEnd ? endDate : currentDate).getMonth()
                  ? styles.selected
                  : ''
              }`}
            >
              {`${months[date.getMonth()]} ${date.getDate()}`}
            </div>
          ))}
        {type === 'hour' &&
          hours.map(hour => {
            const hourValue = isSelectingEnd
              ? endDate.getHours()
              : currentDate.getHours();
            const displayHour = hourValue % 12 || 12;
            return (
              <div
                key={hour}
                className={`${styles.option} ${parseInt(hour) === displayHour ? styles.selected : ''}`}
              >
                {hour}
              </div>
            );
          })}
        {type === 'minute' &&
          minutes.map((minute, index) => (
            <div
              key={index}
              className={`${styles.option} ${
                (isSelectingEnd ? endDate : currentDate).getMinutes() === index
                  ? styles.selected
                  : ''
              }`}
            >
              {minute}
            </div>
          ))}
      </div>
    );
  };

  const renderAmPmOptions = () => {
    const date = isSelectingEnd ? endDate : currentDate;
    const isPM = date.getHours() >= 12;

    return (
      <div
        className={styles.scrollContainer}
        ref={scrollRefs.ampm}
        onScroll={e =>
          isSelectingEnd
            ? handleEndScroll(e, 'ampm')
            : handleStartScroll(e, 'ampm')
        }
      >
        <div className={`${styles.option} ${!isPM ? styles.selected : ''}`}>
          AM
        </div>
        <div className={`${styles.option} ${isPM ? styles.selected : ''}`}>
          PM
        </div>
        <div className={styles.option}></div>
        <div className={styles.option}></div>
        <div className={styles.option}></div>
        <div className={styles.option}></div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.picker}>
          <div className={styles.dateToggle}>
            <button
              className={`${styles.toggleButton} ${!isSelectingEnd ? styles.active : ''}`}
              onClick={() => setIsSelectingEnd(false)}
            >
              Start Time
            </button>
            <button
              className={`${styles.toggleButton} ${isSelectingEnd ? styles.active : ''}`}
              onClick={() => setIsSelectingEnd(true)}
            >
              End Time
            </button>
          </div>

          <div className={styles.pickerColumns}>
            <div className={styles.pickerColumn}>
              {renderTimeColumn('date')}
            </div>

            <div className={styles.pickerColumn}>
              {renderTimeColumn('hour')}
            </div>

            <div className={styles.pickerColumn}>
              {renderTimeColumn('minute')}
            </div>

            <div className={`${styles.pickerColumn} ${styles.ampmColumn}`}>
              {renderAmPmOptions()}
            </div>
          </div>

          <button className={styles.doneButton} onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimePickerModal;
