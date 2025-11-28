// app/(tabs)/my-shifts.tsx
import AnimatedSpinner from '@/components/animatedSpinner';
import EmptyState from '@/components/emptyState';
import ShiftCard from '@/components/shiftCard';
import colors from '@/constants/colors';
import { useShifts } from '@/hooks/useShifts';
import { formatDate, getDurationMinutes } from '@/utils/dateFormatter';
import {
  groupShiftsByDate,
  isShiftStarted,
  sortShiftsByDate,
} from '@/utils/shiftHelpers';
import { useFocusEffect } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyShiftsScreen() {
  const { shifts, loading, bookingId, cancelShift, refetch } = useShifts(false);
  const [refreshing, setRefreshing] = useState(false);

  const bookedShifts = useMemo(
    () => shifts.filter(s => s.booked),
    [shifts]
  );

  const groupedShifts = useMemo(
    () => groupShiftsByDate(bookedShifts),
    [bookedShifts]
  );

  const sortedGroups = useMemo(
    () => sortShiftsByDate(groupedShifts),
    [groupedShifts]
  );

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

  const formatHM = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  if (loading && !refreshing && shifts.length == 0) {
    return (
      <View style={styles.centerContainer}>
        <AnimatedSpinner isRed={true} />
        <Text style={styles.loadingText}>Loading your shifts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
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
              message="You don't have any booked shifts yet"
              icon="📅"
            />
          ) : (
            sortedGroups.map(([dateKey, dateShifts]) => {

              const totalMinutes = dateShifts.reduce(
                (sum, s) => sum + getDurationMinutes(s.startTime, s.endTime), 0
              );

              return (
                <View key={dateKey} style={styles.dateGroup}>
                  <View style={styles.dateHeaderContainer}>
                    <Text style={styles.dateHeader}>
                      {formatDate(dateShifts[0].startTime)}
                    </Text>
                    <Text style={styles.shiftCount}>
                      {dateShifts.length} {dateShifts.length === 1 ? 'shift' : 'shifts'}, {formatHM(totalMinutes)}
                    </Text>
                  </View>

                  {dateShifts.map(shift => {
                    const started = isShiftStarted(shift);

                    return (
                      <ShiftCard
                        key={shift.id}
                        shift={shift}
                        onCancel={cancelShift}
                        disabled={started}
                        loading={bookingId === shift.id}
                        showInfoRow={true}
                      />
                    );
                  })}
                </View>
              )
            })
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
  summaryCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  dateGroup: {
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginVertical: 14
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  shiftCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});