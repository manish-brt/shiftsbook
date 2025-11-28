import { GroupedShifts, Shift } from '../models/shift';
import { getDateKey } from './dateFormatter';

export const groupShiftsByDate = (shifts: Shift[]): GroupedShifts => {
  return shifts.reduce((acc, shift) => {
    const dateKey = getDateKey(shift.startTime);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(shift);
    return acc;
  }, {} as GroupedShifts);
};

export const sortShiftsByDate = (groupedShifts: GroupedShifts): [string, Shift[]][] => {
  return Object.entries(groupedShifts).sort(([dateA], [dateB]) => 
    dateA.localeCompare(dateB)
  );
};

export const isShiftOverlapping = (shift: Shift, bookedShifts: Shift[]): boolean => {
  return bookedShifts.some(booked => 
    (shift.startTime < booked.endTime && shift.endTime > booked.startTime)
  );
};

export const isShiftStarted = (shift: Shift): boolean => {
  return shift.startTime < Date.now();
};

export const filterShiftsByCity = (shifts: Shift[], city: string): Shift[] => {
  if (city === 'All') return shifts;
  return shifts.filter(shift => shift.area === city);
};

export const countShiftsByCity = (shifts: Shift[], city: string): number => {
  return filterShiftsByCity(shifts, city).length;
};

export const getAllCities = (data: Shift[]) =>  [...new Set(data.map(item => item.area))];
