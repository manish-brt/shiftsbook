export interface Shift {
  id: string;
  booked: boolean;
  area: string;
  startTime: number;
  endTime: number;
}

export interface GroupedShifts {
  [date: string]: Shift[];
}

export interface ShiftCardProps {
  shift: Shift;
  onBook?: (id: string) => void;
  onCancel?: (id: string) => void;
  disabled?: boolean;
  loading?: boolean;
  overlapping?: boolean;
  booked?: boolean;
  showInfoRow?: boolean;
}