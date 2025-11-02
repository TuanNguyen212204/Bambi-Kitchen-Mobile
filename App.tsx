import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Linking, AppState } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { handlePaymentDeepLink } from './src/utils/paymentDeepLinkHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_PAYMENT_KEY = 'pending_payment_url';

export default function App() {
  const navigationRef = useRef<any>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Handle deep link khi app đã mở
    const handleDeepLink = (url: string) => {
      console.log('[DEEP_LINK] Received URL:', url);
      handlePaymentDeepLink(url, navigationRef.current);
    };

    // Lắng nghe deep link khi app đang chạy
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Kiểm tra deep link khi app khởi động
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Lắng nghe khi app quay lại từ background
    // Khi user quay lại từ browser sau khi thanh toán, check order status
    const handleAppStateChange = (nextAppState: string) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('[APP] App has come to the foreground');
        // Kiểm tra xem có pending payment URL không
        AsyncStorage.getItem(PENDING_PAYMENT_KEY).then((storedUrl) => {
          if (storedUrl) {
            console.log('[APP] Found pending payment URL, processing...');
            handlePaymentDeepLink(storedUrl, navigationRef.current);
            AsyncStorage.removeItem(PENDING_PAYMENT_KEY);
          }
        });
      }
      appState.current = nextAppState;
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      linkingSubscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

