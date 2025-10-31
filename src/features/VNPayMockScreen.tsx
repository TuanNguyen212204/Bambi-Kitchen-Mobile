import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/store/store';
import { saveOrderThunk } from '@/store/thunks/orderThunks';
import { clearCart } from '../store/slices/cartSlice.js';
import { Order, OrderItem } from '@/types/api';

export default function VNPayMockScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { amount, orderInfo, cartItems, totalCalories } = route.params as {
    amount: number;
    orderInfo: string;
    cartItems: OrderItem[];
    totalCalories: number;
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleResult = async (success: boolean) => {
    if (success) {
      const order: Omit<Order, 'id'> = {
        items: cartItems,
        totalPrice: amount,
        totalCalories,
        paymentMethod: 'VNPAY',
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      try {
        await dispatch(saveOrderThunk(order)).unwrap();
        dispatch(clearCart());
        navigation.replace('PaymentResult', { success: true, message: 'Đặt hàng thành công!' });
      } catch {
        Alert.alert('Lỗi', 'Đặt hàng thất bại. Vui lòng thử lại.');
      }
    } else {
      navigation.replace('PaymentResult', {
        success: false,
        message: 'Thanh toán thất bại. Vui lòng thử lại.',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang chuyển hướng đến VNPay...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>VNPay</Text>
        <Text style={styles.amount}>Số tiền: {amount.toLocaleString('vi-VN')}đ</Text>
        <Text style={styles.info}>Nội dung: {orderInfo}</Text>
      </View>

      <TouchableOpacity onPress={() => handleResult(true)} style={styles.successButton}>
        <Text style={styles.buttonText}>Thanh toán thành công (Mock)</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleResult(false)} style={styles.failButton}>
        <Text style={styles.buttonText}>Thanh toán thất bại (Mock)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  amount: { fontSize: 18, fontWeight: '600' },
  info: { fontSize: 14, color: '#666', marginTop: 8 },
  successButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  failButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
