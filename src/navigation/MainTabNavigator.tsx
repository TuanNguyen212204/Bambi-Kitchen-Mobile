import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@features/home/screens/HomeScreen';
import AdminNavigator from '@features/admin/AdminNavigator';
import ProfileScreen from '@features/profile/screens/ProfileScreen';
import CartScreen from '@/features/cart/screens/CartScreen';
import OrderHistoryScreen from '@/features/order/screens/OrderHisotryScreen';
import { MainTabParamList, CartStackParamList } from '@/types/navigation';

import CheckoutScreen from '@/features/CheckoutScreen';
import VNPayMockScreen from '@/features/VNPayMockScreen';
import PaymentResultScreen from '@/features/PaymentResultScreen';

const Stack = createNativeStackNavigator<CartStackParamList>();

const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CartScreen" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="VNPayMock" component={VNPayMockScreen} />
    <Stack.Screen name="PaymentResult" component={PaymentResultScreen} />
  </Stack.Navigator>
);
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
      {isAdmin ? (
        <>
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
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Tôi',
              tabBarLabel: 'Tôi',
              tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Trang chủ',
              tabBarLabel: 'Trang chủ',
              tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
            }}
          />
          <Tab.Screen
            name="Cart"
            component={CartStack}
            options={{
              title: 'Giỏ hàng',
              tabBarLabel: 'Giỏ hàng',
              tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
            }}
          />
          <Tab.Screen
            name="Orders"
            component={OrderHistoryScreen}
            options={{
              title: 'Đơn hàng',
              tabBarLabel: 'Đơn hàng',
              tabBarIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} />,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Tôi',
              tabBarLabel: 'Tôi',
              tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
