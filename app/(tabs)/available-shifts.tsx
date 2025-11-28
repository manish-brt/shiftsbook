// app/(tabs)/available.tsx
import AnimatedSpinner from '@/components/animatedSpinner';
import CityFilter from '@/components/cityFilter';
import EmptyState from '@/components/emptyState';
import ShiftCard from '@/components/shiftCard';
import colors from '@/constants/colors';
import { useShifts } from '@/hooks/useShifts';
// import { City } from '@/models/shift';
import { formatDate } from '@/utils/dateFormatter';
import {
  countShiftsByCity,
  filterShiftsByCity,
  getAllCities,
  groupShiftsByDate,
  isShiftOverlapping,
  isShiftStarted,
  sortShiftsByDate
} from '@/utils/shiftHelpers';
import { useFocusEffect } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function AvailableShiftsScreen() {
  const { shifts, loading, bookingId, bookShift, refetch } = useShifts(false);
  const [selectedCity, setSelectedCity] = useState<string>('Helsinki');
  const [refreshing, setRefreshing] = useState(false);

  const bookedShifts = useMemo(
    () => shifts.filter(s => s.booked),
    [shifts]
  );

  const availableShifts = useMemo(() => {
    const now = Date.now();
    // return shifts.filter(s => !s.booked && s.startTime >= now);
    return shifts;
  }, [shifts]);

  const filteredShifts = useMemo(
    () => filterShiftsByCity(availableShifts, selectedCity),
    [availableShifts, selectedCity]
  );

  const groupedShifts = useMemo(
    () => groupShiftsByDate(filteredShifts),
    [filteredShifts]
  );

  const sortedGroups = useMemo(
    () => sortShiftsByDate(groupedShifts),
    [groupedShifts]
  );

  const allCities = useMemo(
    () => getAllCities(shifts),
    [shifts]
  )

  const cityCounts = useMemo(() => {
    return allCities.reduce((acc, city) => {
      acc[city] = countShiftsByCity(availableShifts, city);
      return acc;
    }, {});
  }, [availableShifts, allCities]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const t = setTimeout(() => refetch(true), 150);
      return () => clearTimeout(t);
    }, [])
  );


  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <AnimatedSpinner />
        <Text style={styles.loadingText}>Loading shifts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CityFilter
          allCities={allCities}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          counts={cityCounts}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {sortedGroups.length === 0 ? (
            <EmptyState
              message={`No available shifts in ${selectedCity}`}
              icon="📭"
            />
          ) : (
            sortedGroups.map(([dateKey, dateShifts]) => (
              <View key={dateKey} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>
                  {formatDate(dateShifts[0].startTime)}
                </Text>

                {dateShifts.map(shift => {
                  const overlapping = isShiftOverlapping(shift, bookedShifts);
                  const booked = bookedShifts.findIndex(bshift => shift.id == bshift.id) != -1
                  const started = isShiftStarted(shift);

                  return (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onBook={bookShift}
                      disabled={started || overlapping || booked}
                      loading={bookingId === shift.id}
                      overlapping={overlapping}
                      booked={booked}
                    />
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  dateGroup: {
    // marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 16,
    marginVertical: 12,
  },
});