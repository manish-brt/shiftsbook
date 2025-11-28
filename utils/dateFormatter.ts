import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

export const formatTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'HH:mm');
};

export const formatTimeRange = (start: number, end: number): string => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';

  return format(date, 'MMMM d');
};

export const getDateKey = (timestamp: number): string => {
  return format(new Date(timestamp), 'yyyy-MM-dd');
};

export const calculateDuration = (start: number, end: number): string => {
  const ms = end - start;

  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export const getDurationMinutes = (start: number, end: number) => {
  return Math.floor((end - start) / (1000 * 60));
};