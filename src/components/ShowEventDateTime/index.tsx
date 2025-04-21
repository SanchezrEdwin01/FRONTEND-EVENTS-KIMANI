import * as React from 'react';
import { formatEventDate, formatEventTime } from './dateTimeFormatters';
import { isValidDate } from './validators';
import './styles.scss';
import { formatDate } from '../../utils/utils';
interface EventDateProps {
  date: Date;
}

interface EventTimeRangeProps {
  startTime: Date;
  endTime: Date;
}

interface EventDateTimeProps extends EventTimeRangeProps {
  onInvalidDate?: (error: string) => void;
}

const EventDate: React.FC<EventDateProps> = ({ date }) => {
  if (!isValidDate(date)) {
    return <div className="event-date event-date--invalid">Invalid date</div>;
  }

  return <div className="event-date">{formatDate(date, true)}</div>;
};

const EventTimeRange: React.FC<EventTimeRangeProps> = ({
  startTime,
  endTime
}) => {
  if (!isValidDate(startTime) || !isValidDate(endTime)) {
    return (
      <div className="event-time event-time--invalid">Invalid time range</div>
    );
  }

  return (
    <div className="event-time">
      {`${formatEventTime(startTime)} - ${formatEventTime(endTime)}`}
    </div>
  );
};

const ShowEventDateTime: React.FC<EventDateTimeProps> = ({
  startTime,
  endTime,
  onInvalidDate
}) => {
  React.useEffect(() => {
    if (!isValidDate(startTime) || !isValidDate(endTime)) {
      onInvalidDate?.('Invalid date provided');
    }
  }, [startTime, endTime, onInvalidDate]);

  return (
    <div className="mt-1 justify-start text-white text-lg font-normal font-['Hanken_Grotesk']">
      <EventDate date={startTime} />
      <EventTimeRange startTime={startTime} endTime={endTime} />
    </div>
  );
};

export default ShowEventDateTime;
