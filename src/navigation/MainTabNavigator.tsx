import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@features/home/screens/HomeScreen';
import AdminNavigator from '@features/admin/AdminNavigator';
import ProfileScreen from '@features/profile/screens/ProfileScreen';
// type import removed to avoid lint issue with alias
import { useAppSelector } from '@store/store';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === 'ADMIN' || role === 'STAFF';
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator as any}
          options={{
            title: 'Admin',
            tabBarLabel: 'Admin',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="speedometer" size={size} color={color} />
            ),
          }}
        />
      )}
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Tôi',
          tabBarLabel: 'Tôi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

