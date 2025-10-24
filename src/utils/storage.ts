// import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utility functions cho local storage
 * Uncomment AsyncStorage import khi cài đặt package
 */

export const storage = {
  /**
   * Lưu data vào storage
   */
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      // await AsyncStorage.setItem(key, jsonValue);
      console.log('Storage: setItem', key);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  /**
   * Lấy data từ storage
   */
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      // const jsonValue = await AsyncStorage.getItem(key);
      // return jsonValue != null ? JSON.parse(jsonValue) : null;
      console.log('Storage: getItem', key);
      return null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  /**
   * Xóa item khỏi storage
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      // await AsyncStorage.removeItem(key);
      console.log('Storage: removeItem', key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },

  /**
   * Clear toàn bộ storage
   */
  clear: async (): Promise<void> => {
    try {
      // await AsyncStorage.clear();
      console.log('Storage: clear all');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

