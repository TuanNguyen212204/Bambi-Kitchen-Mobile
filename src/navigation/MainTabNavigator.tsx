import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import HomeScreen from '@features/home/screens/HomeScreen';
import AdminNavigator from '@features/admin/AdminNavigator';
import ProfileScreen from '@features/profile/screens/ProfileScreen';
import CartScreen from '@/features/cart/screens/CartScreen';
import OrderHistoryScreen from '@/features/order/screens/OrderHisotryScreen';
import DashboardScreen from '@/features/dashboard/screen/DashboardScreen';
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
  const cartItems = useAppSelector((s) => s.cart.items);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
            name="Dashboard"
            component={DashboardScreen}
            options={{
              title: 'Bảng điều khiển',
              tabBarLabel: 'Bảng điều khiển',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="grid" size={size} color={color} />
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
              tabBarIcon: ({ color, size }) => (
                <View style={{ position: 'relative' }}>
                  <Ionicons name="cart" size={size} color={color} />
                  {cartItemsCount > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: '#ff3b30',
                        borderRadius: 10,
                        minWidth: 18,
                        height: 18,
                        paddingHorizontal: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#ffffff',
                      }}
                    >
                      <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '700' }}>
                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                      </Text>
                    </View>
                  )}
                </View>
              ),
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
