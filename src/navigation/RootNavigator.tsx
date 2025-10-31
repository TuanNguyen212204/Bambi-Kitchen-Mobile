import React, { useEffect, useMemo, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import MainTabNavigator from './MainTabNavigator';
import { RootStackParamList } from '@types/navigation';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen, OTPScreen, ResetPasswordScreen } from '@features/auth/screens';
import DashboardScreen from '@features/admin/screens/DashboardScreen';
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
    const isStaffRole = user.role === 'ADMIN' || user.role === 'STAFF';
    const targetRoute = isStaffRole ? 'Dashboard' : 'MainTabs';

    if (currentRoute !== targetRoute) {
      if (isStaffRole) {
        navigation.navigate('Dashboard');
      } else {
        navigation.navigate('MainTabs');
      }
    }
  }, [token, user?.role]);

  const initial = useMemo(() => {
    if (!token) return 'Login' as keyof RootStackParamList;
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') return 'Dashboard' as any;
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
      ) : (user?.role === 'ADMIN' || user?.role === 'STAFF') ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen as any} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;

