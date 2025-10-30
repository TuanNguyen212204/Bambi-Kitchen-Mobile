import React, { useEffect, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import { RootStackParamList } from '@types/navigation';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '@features/auth/screens';
import DashboardScreen from '@features/admin/screens/DashboardScreen';
import { useAppDispatch, useAppSelector } from '@store/store';
import { loadSessionThunk } from '@store/thunks/authThunks';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(loadSessionThunk());
  }, [dispatch]);

  const initial = useMemo(() => {
    if (!token) return 'Login' as keyof RootStackParamList;
    if (user?.role === 'ADMIN') return 'Dashboard' as any;
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
        </>
      ) : user?.role === 'ADMIN' ? (
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

