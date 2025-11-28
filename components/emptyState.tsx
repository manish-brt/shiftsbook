import colors from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  icon = '📅' 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default EmptyState;