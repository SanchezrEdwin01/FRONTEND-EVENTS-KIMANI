import React from 'react';
import { EventTagProps } from './types';
import { getEventClassName } from './utils';
import './styles.scss';

const EventTag: React.FC<EventTagProps> = ({ eventType, className = '' }) => {
  const baseClassName = `event-tag ${getEventClassName(eventType)}`;
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <div className={finalClassName} data-testid="event-tag">
      {eventType}
    </div>
  );
};

export default EventTag;
