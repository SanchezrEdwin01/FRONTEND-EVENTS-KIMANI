const getEventClassName = (eventType: string): string => {
  return eventType.toLowerCase().replace(/\s+/g, '-');
};

export { getEventClassName }; 