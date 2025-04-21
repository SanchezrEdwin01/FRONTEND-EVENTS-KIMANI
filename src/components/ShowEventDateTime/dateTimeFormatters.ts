const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

export const formatEventDate = (date: Date): string => {
  const dayName = DAYS[date.getDay()];
  const monthName = MONTHS[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  return `${dayName}, ${monthName} ${dayOfMonth}, ${year}`;
};

export const formatEventTime = (time: Date): string => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // convert 0 to 12
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
}; 