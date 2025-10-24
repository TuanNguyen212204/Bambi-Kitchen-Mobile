import { NavigatorScreenParams } from '@react-navigation/native';

// Main Tab Navigator Types
export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

// Root Stack Navigator Types
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  // Thêm các màn hình khác ở đây
  // Login: undefined;
  // Details: { id: string };
};

// Navigation Props Types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

