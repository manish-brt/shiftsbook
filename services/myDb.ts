import { Shift } from '@/models/shift';
import { type SQLiteDatabase } from 'expo-sqlite';

export async function initDb(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS shifts (
      id TEXT PRIMARY KEY NOT NULL,
      booked INTEGER,
      area TEXT,
      startTime INTEGER,
      endTime INTEGER
    );
  `);
}

export async function getLocalShifts(db: SQLiteDatabase): Promise<Shift[]> {
  const result = await db.getAllAsync<Shift>('SELECT * FROM shifts;');
  return result.map(row => ({
    ...row,
    booked: !!row.booked,
  }));
}

export async function getBookedShifts(db: SQLiteDatabase): Promise<Shift[]> {
  const result = await db.getAllAsync<Shift>('SELECT * FROM shifts WHERE booked = 1;');
  return result.map(row => ({
    ...row,
    booked: !!row.booked,
  }));
}

export async function addShift(db: SQLiteDatabase, shift: Shift): Promise<void> {
  await db.runAsync(
    'INSERT OR REPLACE INTO shifts (id, booked, area, startTime, endTime) VALUES (?, ?, ?, ?, ?);',
    shift.id,
    shift.booked ? 1 : 0,
    shift.area,
    shift.startTime,
    shift.endTime
  );
}

export async function insertAllShifts(db: SQLiteDatabase, shifts: Shift[]): Promise<void> {
  if (!shifts.length) return;
  for (const shift of shifts) {
    await db.runAsync(
      'INSERT OR REPLACE INTO shifts (id, booked, area, startTime, endTime) VALUES (?, ?, ?, ?, ?);',
      shift.id,
      shift.booked ? 1 : 0,
      shift.area,
      shift.startTime,
      shift.endTime
    );
  }
}

export async function bookShiftLocally(db: SQLiteDatabase, shiftId: string): Promise<Shift> {
  const shifts = await getLocalShifts(db);
  const shift = shifts.find(s => s.id === shiftId);

  if (!shift) throw new Error('Shift not found');
  if (shift.booked) throw new Error('Shift already booked');
  if (Date.now() >= shift.endTime) throw new Error('Shift is already finished');
  if (Date.now() > shift.startTime) throw new Error('Shift has already started');

  const overlappingShiftExists = shifts
    .filter(s => s.booked)
    .some(s => s.startTime < shift.endTime && s.endTime > shift.startTime);

  if (overlappingShiftExists) throw new Error('Cannot book an overlapping shift');

  await db.runAsync('UPDATE shifts SET booked = 1 WHERE id = ?;', shiftId);

  // Return updated shift
  const updated = await db.getFirstAsync<Shift>('SELECT * FROM shifts WHERE id = ?;', shiftId);
  
  if (
    !updated ||
    typeof updated.id !== 'string' ||
    typeof updated.area !== 'string' ||
    typeof updated.startTime !== 'number' ||
    typeof updated.endTime !== 'number'
  ) {
    throw new Error('Updated shift is missing required fields');
  }
  return { ...updated, booked: !!updated.booked };
}

export async function cancleShiftLocally(db: SQLiteDatabase, shiftId: string): Promise<Shift> {
  const shifts = await getLocalShifts(db);
  const shift = shifts.find(s => s.id === shiftId);

  if (!shift) throw new Error('Shift not found');
  if (!shift.booked) throw new Error('Shift not booked');

  await db.runAsync('UPDATE shifts SET booked = 0 WHERE id = ?;', shiftId);

  // Return updated shift
  const updated = await db.getFirstAsync<Shift>('SELECT * FROM shifts WHERE id = ?;', shiftId);
  
  if (
    !updated ||
    typeof updated.id !== 'string' ||
    typeof updated.area !== 'string' ||
    typeof updated.startTime !== 'number' ||
    typeof updated.endTime !== 'number'
  ) {
    throw new Error('Updated shift is missing required fields');
  }
  return { ...updated, booked: !!updated.booked };
}