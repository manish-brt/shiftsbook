import colors from '@/constants/colors';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: () => null,
        tabBarIconStyle: { display: "none" },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
          // backgroundColor:'red',
          marginVertical: 10,
          // marginBottom: 6,
        },
        tabBarStyle: {
          alignItems: 'center',
          backgroundColor: colors.background,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'My shifts',
          // tabBarIcon: ({ color }) => null,
        }}
      />
      <Tabs.Screen
        name="available-shifts"
        options={{
          title: 'Avaliable Shifts',
          // tabBarIcon: ({ color }) => null,
        }}
      />
    </Tabs>
  );
}
