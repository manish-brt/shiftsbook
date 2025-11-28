import { bookShiftLocally, cancleShiftLocally, getLocalShifts, insertAllShifts } from '@/services/myDb';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Shift } from '../models/shift';
import { shiftsApi } from '../services/api';

// For development/testing,
const MOCK_DATA: Shift[] = [
  // {
  //   "id": "b4d2ab44-9b3f-4010-a90a-b7c31fa0eea9",
  //   "booked": false,
  //   "area": "Helsinki",
  //   "startTime": 1764224100000,
  //   "endTime": 1764231300000
  // },
  // {
  //   "id": "515477fb-afa2-4280-af31-5d62b0c4bb76",
  //   "booked": false,
  //   "area": "Turku",
  //   "startTime": 1764238500000,
  //   "endTime": 1764243900000
  // },
  // {
  //   "id": "214879a6-0b05-4c45-afe3-b62a6bae8045",
  //   "booked": false,
  //   "area": "Helsinki",
  //   "startTime": 1764220500000,
  //   "endTime": 1764227700000
  // },
  // {
  //   "id": "ca228bb8-e0c3-45e6-a259-b72ca4af8a2e",
  //   "booked": false,
  //   "area": "Helsinki",
  //   "startTime": 1764216900000,
  //   "endTime": 1764234900000
  // },
  // {
  //   "id": "e8ffb0da-5ab9-47e2-981b-6de2350edf07",
  //   "booked": false,
  //   "area": "Turku",
  //   "startTime": 1764245700000,
  //   "endTime": 1764252900000
  // },
  // {
  //   "id": "2ac1bda9-9ee7-4eba-878f-405b4bd59bd2",
  //   "booked": false,
  //   "area": "Tampere",
  //   "startTime": 1764213300000,
  //   "endTime": 1764224100000
  // },
  // {
  //   "id": "bad5d1c0-f039-4387-ac3a-83e4208b05ef",
  //   "booked": false,
  //   "area": "Tampere",
  //   "startTime": 1764231300000,
  //   "endTime": 1764240300000
  // },
  // {
  //   "id": "cd0f709b-2dbd-4a53-a2b5-f557efd162c8",
  //   "booked": false,
  //   "area": "Helsinki",
  //   "startTime": 1764310500000,
  //   "endTime": 1764317700000
  // },
  // {
  //   "id": "6debc7c4-2870-4d41-b3f5-9c50182d999f",
  //   "booked": false,
  //   "area": "Helsinki",
  //   "startTime": 1764317700000,
  //   "endTime": 1764326700000
  // },
  // {
  //   "id": "843d2347-333e-4e79-a06a-06bcee941faf",
  //   "booked": false,
  //   "area": "Turku",
  //   "startTime": 1764476100000,
  //   "endTime": 1764485100000
  // },
  // {
  //   "id": "f3f7fa0f-785b-4ea0-9b74-779b8042665c",
  //   "booked": false,
  //   "area": "Turku",
  //   "startTime": 1764485100000,
  //   "endTime": 1764494100000
  // },
  // {
  //   "id": "75b6f3e2-02bf-43f5-8240-235f50139c2f",
  //   "booked": false,
  //   "area": "Helsinki",
  //   "startTime": 1764490500000,
  //   "endTime": 1764499500000
  // },
  // {
  //   "id": "28b8d100-8a7a-4130-af67-a58824ca7882",
  //   "booked": false,
  //   "area": "Tampere",
  //   "startTime": 1764476100000,
  //   "endTime": 1764483300000
  // },
  // {
  //   "id": "f0be46d3-3586-4b3c-b2d7-ce685e7ed724",
  //   "booked": false,
  //   "area": "Tampere",
  //   "startTime": 1764483300000,
  //   "endTime": 1764490500000
  // },
  // {
  //   "id": "624f7fae-e582-4f88-8cf4-03d4e7b92d0d",
  //   "booked": false,
  //   "area": "Tampere",
  //   "startTime": 1764486900000,
  //   "endTime": 1764494100000
  // },
  // {
  //   "id": "f947d1fe-b93c-4302-9ac2-a6756a4831f0",
  //   "booked": false,
  //   "area": "Helsinki",
  //   "startTime": 1764591300000,
  //   "endTime": 1764602100000
  // },
  // {
  //   "id": "8013a391-eb41-4f6f-818e-a627d01043f1",
  //   "booked": false,
  //   "area": "Tampere",
  //   "startTime": 1764558900000,
  //   "endTime": 1764569700000
  // },
  // {
  //   "id": "1a4d06b7-94b5-48b6-91ee-f7590ba504bb",
  //   "booked": false,
  //   "area": "Tampere",
  //   "startTime": 1764569700000,
  //   "endTime": 1764582300000
  // },
];

export const useShifts = (useMockData = false) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const db = useSQLiteContext();

  const fetchShifts = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      setError(null);

      const localShifts = await getLocalShifts(db)
      setShifts(localShifts)

      // Use mock data or real API
      if (localShifts.length == 0) {
        const data = useMockData ? MOCK_DATA : await shiftsApi.getShifts();
        await insertAllShifts(db, data)

        const updatedShifts = await getLocalShifts(db);
        setShifts(updatedShifts);
      }


    } catch (err) {
      setError('Failed to load shifts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  const bookShift = useCallback(async (shiftId: string) => {
    try {
      setBookingId(shiftId);

      const updatedShift = await bookShiftLocally(db, shiftId);

      // if (useMockData) {
      //   // Mock booking
      //   await new Promise(resolve => setTimeout(resolve, 1000));

      // setShifts(prev =>
      //   prev.map(s => s.id === shiftId ? { ...s, booked: true } : s)
      // );

      // } else {
      //   const updatedShift = await shiftsApi.bookShift(shiftId);
      //   setShifts(prev =>
      //     prev.map(s => s.id === shiftId ? updatedShift : s)
      //   );
      // }

      const updatedShifts = await getLocalShifts(db);
      setShifts(updatedShifts);

    } catch (err) {
      setError('Failed to book shift');
      console.error(err);
    } finally {
      setBookingId(null);
    }
  }, [useMockData]);

  const cancelShift = useCallback(async (shiftId: string) => {
    try {
      setBookingId(shiftId);

      const updatedShift = await cancleShiftLocally(db, shiftId);

      // if (useMockData) {
      //   // Mock canceling
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      //   setShifts(prev =>
      //     prev.map(s => s.id === shiftId ? { ...s, booked: false } : s)
      //   );
      // } else {
      //   const updatedShift = await shiftsApi.cancelShift(shiftId);
      //   setShifts(prev =>
      //     prev.map(s => s.id === shiftId ? updatedShift : s)
      //   );
      // }

      const updatedShifts = await getLocalShifts(db);
      setShifts(updatedShifts);

    } catch (err) {
      setError('Failed to cancel shift');
      console.error(err);
    } finally {
      setBookingId(null);
    }
  }, [useMockData]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  return {
    shifts,
    loading,
    error,
    bookingId,
    bookShift,
    cancelShift,
    refetch: fetchShifts,
  };
};