import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Cart: NavigatorScreenParams<CartStackParamList>;
  Orders: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Admin: undefined;
};

export type CartStackParamList = {
  CartScreen: undefined;
  Checkout: undefined;
  VNPayMock: {
    amount: number;
    orderInfo: string;
    paymentUrl?: string;
    paymentMethod?: 'VNPAY' | 'MOMO';
    cartItems: any[];
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
  DishDetail: { dishId: number };
  EditProfile: undefined;
  ChangePassword: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
