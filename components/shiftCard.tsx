import colors from '@/constants/colors';
import { ShiftCardProps } from '@/models/shift';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { calculateDuration, formatTimeRange } from '../utils/dateFormatter';
import AnimatedSpinner from './animatedSpinner';

const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  onBook,
  onCancel,
  disabled = false,
  loading = false,
  overlapping = false,
  booked = false,
  showInfoRow = false
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (disabled || overlapping) {
      Animated.timing(fadeAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [disabled, overlapping, fadeAnim, booked]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled || overlapping || loading) return;

    if (shift.booked && onCancel) {
      onCancel(shift.id);
    } else if (!shift.booked && onBook) {
      onBook(shift.id);
    }
  };

  const timeRange = formatTimeRange(shift.startTime, shift.endTime);
  const duration = calculateDuration(shift.startTime, shift.endTime);
  const isBooked = shift.booked;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          <Text style={styles.timeText}>{timeRange}</Text>
          {showInfoRow && <View style={styles.infoRow}>
            <Text style={styles.areaText}>{shift.area}</Text>
            <Text style={styles.durationText}>• {duration}</Text>
          </View>}
        </View>

        <View style={styles.statusTextContainer}>
          {!booked && overlapping && (
            <Text style={styles.overlappingText}>Overlapping</Text>
          )}
          {isBooked && (
            // <View style={styles.bookedBadge}>
            <Text style={styles.bookedBadgeText}>Booked</Text>
            // </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            isBooked && styles.cancelButton,
            (disabled || overlapping) && styles.disabledButton,
          ]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
          disabled={disabled || overlapping || loading}
        >
          {loading ? (
            // <></>
            <AnimatedSpinner isRed={isBooked} />
          ) : (
            <Text
              style={[
                styles.actionText,
                isBooked && styles.cancelText,
                (disabled || overlapping) && styles.disabledText,
              ]}
            >
              {isBooked ? 'Cancel' : 'Book'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  timeText: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  areaText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusTextContainer: {
    marginHorizontal: 12
  },
  overlappingText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    fontWeight: '600',
  },
  actionButton: {
    // backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.success,
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 24,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.error,
    color: colors.error
  },
  disabledButton: {
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.border,
  },
  actionText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelText: {
    color: colors.error,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  bookedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bookedBadgeText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    // textTransform: 'uppercase',
  },
});

export default ShiftCard;