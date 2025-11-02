import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CheckCircle, XCircle } from 'lucide-react-native';

export default function PaymentResultScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { success, message } = route.params;

    return (
      <View style={styles.container}>
        {success ? (
          <CheckCircle size={80} />
        ) : (
          <XCircle size={80} />
        )}
        <Text style={[styles.title, success ? styles.successText : styles.failText]}>
          {success ? 'Thành công!' : 'Thất bại!'}
        </Text>
        <Text style={styles.message}>{message}</Text>

        {success && (
          <TouchableOpacity
            onPress={() => {
              // Navigate to Orders tab trong MainTabs
              navigation.getParent()?.navigate('MainTabs', { screen: 'Orders' });
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}>Xem lịch sử đơn hàng</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            navigation.getParent()?.navigate('MainTabs', { screen: 'Home' });
          }}
          style={styles.secondaryButton}
        >
          <Text style={styles.buttonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 16 },
  successText: { color: '#28a745' },
  failText: { color: '#dc3545' },
  message: { fontSize: 16, textAlign: 'center', marginTop: 12, color: '#666' },
  primaryButton: {
    marginTop: 32,
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: '#6c757d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

