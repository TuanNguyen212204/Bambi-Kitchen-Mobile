import { Platform, ToastAndroid, Alert } from 'react-native';

export const toast = {
  success(message: string) {
    if (Platform.OS === 'android') ToastAndroid.show(message, ToastAndroid.SHORT);
    else Alert.alert('Thành công', message);
  },
  error(message: string) {
    if (Platform.OS === 'android') ToastAndroid.show(message, ToastAndroid.LONG);
    else Alert.alert('Lỗi', message);
  },
  info(message: string) {
    if (Platform.OS === 'android') ToastAndroid.show(message, ToastAndroid.SHORT);
    else Alert.alert('Thông báo', message);
  },
};


