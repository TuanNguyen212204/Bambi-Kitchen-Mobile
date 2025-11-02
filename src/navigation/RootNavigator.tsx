import React, { useEffect, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import MainTabNavigator from './MainTabNavigator';
import { RootStackParamList } from '@/types/navigation';
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  OTPScreen,
  ResetPasswordScreen,
} from '@features/auth/screens';
import DishDetailScreen from '@features/home/screens/DishDetailScreen';
import EditProfileScreen from '@features/profile/screens/EditProfileScreen';
import ChangePasswordScreen from '@features/profile/screens/ChangePasswordScreen';
import FeedbackScreen from '@features/order/screens/FeedbackScreen';
import OrderDetailScreen from '@features/order/screens/OrderDetailScreen';
import FeaturedDishesScreen from '@features/home/screens/FeaturedDishesScreen';
import PaymentSuccessScreen from '@features/payment/screens/PaymentSuccessScreen';
import { useAppDispatch, useAppSelector } from '@store/store';
import { loadSessionThunk } from '@store/thunks/authThunks';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((s) => s.auth);
  const navigation = useNavigation<any>();

  useEffect(() => {
    dispatch(loadSessionThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!token || !user) return;

    const currentRoute = navigation.getState()?.routes[navigation.getState()?.index || 0]?.name;

    if (currentRoute !== 'MainTabs') {
      navigation.navigate('MainTabs');
    }
  }, [token, user?.role]);

  const initial = useMemo(() => {
    if (!token) return 'Login' as keyof RootStackParamList;
    return 'MainTabs' as keyof RootStackParamList;
  }, [token, user]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initial}
    >
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="DishDetail"
            component={DishDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerShown: true,
              title: 'Chỉnh sửa thông tin',
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{
              headerShown: true,
              title: 'Đổi mật khẩu',
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="Feedback"
            component={FeedbackScreen}
            options={{
              headerShown: true,
              title: 'Đánh giá đơn hàng',
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FeaturedDishes"
            component={FeaturedDishesScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PaymentSuccess"
            component={PaymentSuccessScreen}
            options={{
              headerShown: false,
              // Full screen để tương tự web success page
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
