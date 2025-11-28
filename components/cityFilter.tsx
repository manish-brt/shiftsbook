import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';

interface CityFilterProps {
  allCities: Array<string>
  selectedCity: string;
  onSelectCity: (city: string) => void;
  counts?: { [key: string]: number };
}

const CityFilter: React.FC<CityFilterProps> = ({
  allCities, 
  selectedCity, 
  onSelectCity,
  counts = {}
}) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {allCities.map(city => {
          const isSelected = selectedCity === city;
          const count = counts[city] || 0;
          
          return (
            <TouchableOpacity
              key={city}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectCity(city)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {city} {count > 0 && `(${count})`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.white,
  },
});

export default CityFilter;