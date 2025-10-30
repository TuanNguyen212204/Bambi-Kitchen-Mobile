import { NavigatorScreenParams } from '@react-navigation/native';

// Main Tab Navigator Types
export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

// Root Stack Navigator Types
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTP: { email: string };
  ResetPassword: { email: string; otp: string };
  Dashboard?: undefined;
};

// Navigation Props Types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

