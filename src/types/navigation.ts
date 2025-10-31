import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Cart: NavigatorScreenParams<CartStackParamList>;
  Orders: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

export type CartStackParamList = {
  CartScreen: undefined;
  Checkout: undefined;
  VNPayMock: {
    amount: number;
    orderInfo: string;
    cartItems: any[];
    totalCalories: number;
  };
  PaymentResult: {
    success: boolean;
    message: string;
  };
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTP: { email: string };
  ResetPassword: { email: string; otp: string };
  Dashboard?: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

