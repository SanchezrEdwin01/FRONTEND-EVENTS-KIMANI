export const EVENT_TYPES = ['Kimani Event', 'Member Event', 'Other Event'] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface EventTagProps {
  eventType: EventType;
  className?: string;
} 