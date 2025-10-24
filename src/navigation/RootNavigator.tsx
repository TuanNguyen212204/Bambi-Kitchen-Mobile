import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import { RootStackParamList } from '@types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      {/* Thêm các màn hình khác ở đây (ví dụ: Login, Detail, Settings) */}
    </Stack.Navigator>
  );
};

export default RootNavigator;

